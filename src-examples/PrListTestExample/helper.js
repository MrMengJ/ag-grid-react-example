import { cloneDeep, findIndex, forEach, filter, map, mapValues } from "lodash";

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

  console.log("result", result);
  return result;
};

export const getRowData = (rowData) => {
  return map(rowData, (item) => {
    const { data, ...others } = item;
    const otherCells = mapValues(data, (item) => {
      const { value } = item;
      return value ? value : "---";
    });
    return { ...others, ...otherCells };
  });
};
