import React, { Component } from "react";
import styled from "styled-components";
import { includes, map, sortBy, isEmpty, get } from "lodash";
import { AgGridReact } from "@ag-grid-community/react";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { AllModules } from "@ag-grid-enterprise/all-modules";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

import {
  AG_GRID_LOCALE_ZH,
  FLAT_COLUMNS,
  ROW_DATA,
} from "./constants";
import { getColumns, getRowData } from "./helper";
import PrFunctionGroupCellRender from "../GroupTestExample/PrFunctionGroupCellRender";

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
`;

const prFunctionCol = {
  parentId: "0",
  id: "prFunction",
  field: "prFunction",
  colId: "prFunction",
  name: "所属职能",
};

class MixExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: this.transformColumns([prFunctionCol, ...FLAT_COLUMNS]),
      rowData: getRowData(ROW_DATA),
    };
  }

  handleGridReady(params) {
    // console.log("params", params);
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    // console.log("getColumnState", this.columnApi.getColumnState());

    // addEventListener
    // const numberColumn = this.columnApi.getColumn("number");
    // numberColumn.addEventListener("widthChanged", (event) => {
    //   console.log("addEventListener event", event);
    // });
    // numberColumn.removeEventListener("widthChanged", (event) => {
    //   console.log("removeEventListener event", event);
    // });

    // this.gridApi.sizeColumnsToFit();
  }

  handleColWidthChanged = () => {};

  transformColumns = (columns) => {
    const getFlex = (name, id) => {
      if (name === "编号") {
        return 2;
      } else if (name === "工作事项") {
        return 1;
      } else {
        return 3;
      }
    };

    const getColId = (name, id) => {
      if (name === "编号") {
        return "number";
      } else if (name === "工作事项") {
        return "name";
      } else {
        return id;
      }
    };

    const getWidth = (width) => {
      return width >= 100 ? width : 100;
    };

    const getPinned = (name) => {
      const leftPinnedNames = ["组织", "编号", "工作事项"];
      if (includes(leftPinnedNames, name)) {
        return "left";
      }
    };

    const getMovable = (name) => {
      const movableNames = ["组织", "编号", "工作事项"];
      return includes(movableNames, name);
    };

    const getLockPosition = (name) => {
      const lockPositionNames = ["各部门"];
      return includes(lockPositionNames, name);
    };

    const getRowGroup = (id) => {
      const rowGroupIds = ["prFunction"];
      return includes(rowGroupIds, id);
    };

    const getKeyCreator = (id) => {
      if (id === "prFunction") {
        return (params) => {
          return get(params, "value.name");
        };
      }
    };

    const getRowDrag = (name) => {
      const rowDragNames = ["组织"];
      return includes(rowDragNames, name);
    };

    // console.log("columns", columns);

    return getColumns(
      sortBy(
        map(columns, (item) => {
          const { id, name, parentId, sortId, width } = item;
          return {
            id,
            name,
            parentId,
            sortId,
            headerName: name,
            headerTooltip: name,
            headerClass: "my-header-class",
            // suppressMovable: !getMovable(name),
            // lockPosition: getLockPosition(name),
            // lockVisible: true,
            // checkboxSelection: true,
            rowDrag: getRowDrag(name),
            // dndSource:true,
            // rowGroup: true,
            // unSortIcon:true,
            editable: true,
            width: getWidth(width),
            colId: getColId(name, id),
            field: getColId(name, id),
            pinned: getPinned(name),
            // rowGroup: true,
            rowGroup: getRowGroup(id),
            keyCreator: getKeyCreator(id),
            // flex: getFlex(name),
            // filter:"agTextColumnFilter",
            // filter:"agNumberColumnFilter",
            // filter:"agDateColumnFilter",
            // filter:"agSetColumnFilter",
            filterParams: {
              buttons: ["reset", "apply"],
              excelMode: "windows",
            },
          };
        }),
        "sortId"
      )
    );
  };

  render() {
    const { columnDefs, rowData } = this.state;
    console.log("columnDefs", columnDefs);
    console.log("rowData", rowData);
    return (
      <Wrapper className="ag-theme-alpine">
        <AgGridReact
          // properties
          headerHeight={null}
          // headerHeight={40}
          // groupHeaderHeight={80}
          // rowHeight={100}
          rowSelection={"multiple"}
          enableRangeSelection
          enableRangeHandle
          // fillHandleDirection={"x"}
          // fillHandleDirection={"y"}
          fillHandleDirection={"xy"}
          suppressClearOnFillReduction={true}
          // colResizeDefault={"ctrl"}
          localeText={AG_GRID_LOCALE_ZH}
          columnDefs={columnDefs}
          rowData={rowData}
          // modules={AllCommunityModules}
          modules={AllModules}
          // events
          onGridReady={this.handleGridReady}
          // rowModelType={'serverSide'}
          defaultColDef={{
            // initialWidth: 100,
            filter: true,
            sortable: true,
            resizable: true,
            addEventListener: this.handleColWidthChanged,
            // sortingOrder: ["asc", "desc"],
            // wrapText:true,
            // autoHeight:true,
            // singleClickEdit: true,
          }}
          autoGroupColumnDef={{
            headerName: "所属职能",
            // field: "number",
            pinned: true,
            // hide: true,
            cellRendererParams: {
              // checkbox: true,
            },
          }}
          frameworkComponents={{
            prFunctionGroupCellRender: PrFunctionGroupCellRender,
          }}
          // groupRowRenderer={PrFunctionGroupCellRender}
          groupRowRendererParams={{
            innerRenderer: "prFunctionGroupCellRender",
            // checkbox: true,
            pinned: true,
            suppressCount: true,
          }}
          enableCellChangeFlash
          suppressDragLeaveHidesColumns
          animateRows
          rowDragManaged
          // sideBar
          alwaysShowBothConditions
          // suppressMovableColumns
          // applyColumnDefOrder
          // undoRedoCellEditing
          showOpenedGroup={true}
          groupUseEntireRow={true} // group row is full width
          groupDefaultExpanded={1} // 0 for none, 1 for first level only, etc. Set to -1 to expand everything.
          groupSuppressAutoColumn={true} // suppress auto column
        />
      </Wrapper>
    );
  }
}

MixExample.propTypes = {};

export default MixExample;
