import {
  cloneDeep,
  findIndex,
  forEach,
  filter,
  map,
  mapValues,
  find,
} from "lodash";

import { PR_FUNCTIONS } from "./constants";

const getRootHeaders = (flatArr) => {
  return filter(flatArr, (item) => item.parentId === "0");
};

export const getColumns = (flatArr) => {
  let result;
  const rootHeaders = getRootHeaders(flatArr);
  result = cloneDeep(rootHeaders);

  const existChild = (data, flatArr) => {
    return findIndex(flatArr, (item) => item.parentId === data.id) > -1;
  };

  const getChildren = (data, flatArr) => {
    return filter(flatArr, (item) => item.parentId === data.id);
  };

  const attachChildren = (data, flatArr) => {
    if (existChild(data, flatArr)) {
      data.children = getChildren(data, flatArr);
      // data.marryChildren = false;
      forEach(data.children, (item) => {
        attachChildren(item, flatArr);
      });
    }
  };

  forEach(result, (item) => {
    attachChildren(item, flatArr);
  });

  return result;
};

export const getRowData = (rowData) => {
  return map(rowData, (item) => {
    const { data, ...others } = item;
    const otherCells = mapValues(data, (item) => {
      const { value } = item;
      return value ? value : "---";
    });
    const rootAncestor = getRootAncestor(rowData, item);
    const prFunction = rootAncestor
      ? findChildPrFunctionById(rootAncestor.parentId)
      : findChildPrFunctionById(item.parentId);
    return { ...others, ...otherCells, prFunction };
  });
};

export const getChildPrFunctions = (allPrFunctions) => {
  return filter(allPrFunctions, (item) => {
    const { parentId } = item;
    return parentId !== "0";
  });
};

const findPrFunctionById = (prFunctions, id) => {
  return find(prFunctions, (item) => {
    return item.id === id;
  });
};

const findChildPrFunctionById = (id) => {
  const childPrFunctions = getChildPrFunctions(PR_FUNCTIONS);
  return findPrFunctionById(childPrFunctions, id);
};

const isRootPr = (item) => {
  return item.parentType === "FUNCTION";
};

const getRootAncestor = (allData, self) => {
  const selfIsRootPr = isRootPr(self);
  if (selfIsRootPr) {
    return;
  }
  const selfParent = find(allData, (item) => {
    return item.id === self.parentId;
  });
  if (isRootPr(selfParent)) {
    return selfParent;
  } else {
    return getRootAncestor(allData, selfParent);
  }
};
