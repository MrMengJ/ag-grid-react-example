import React, { Component } from "react";
import styled from "styled-components";
import { includes, map, sortBy, get, has } from "lodash";
import { AgGridReact } from "@ag-grid-community/react";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { AllModules } from "@ag-grid-enterprise/all-modules";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

import {
  AG_GRID_LOCALE_ZH,
  FLAT_COLUMNS,
  ROW_DATA,
} from "../MixExample/constants";
import { getColumns, getRowData } from "../MixExample/helper";
import PrFunctionGroupCellRender from "./PrFunctionGroupCellRender";
import OrderCellRender from "./OrderCellRender";

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
`;

const orderCol = {
  parentId: "0",
  id: "order",
  field: "order",
  colId: "order",
  name: "序号",
  headerName: "序号",
  pinned: true,
  width: 80,
  editable: false,
  cellRenderer: "orderCellRenderer",
  rowDrag: true,
};

const prFunctionCol = {
  parentId: "0",
  id: "prFunction",
  field: "prFunction",
  colId: "prFunction",
  name: "所属职能",
  hide: true,
};

class GroupTestExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseHoverRowIndex: null,
      columnDefs: this.transformColumns([
        orderCol,
        prFunctionCol,
        ...sortBy(FLAT_COLUMNS, "sortId"),
      ]),
      rowData: getRowData(ROW_DATA),
    };
  }

  handleGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  handleColWidthChanged = () => {};

  handleCellMouseOver = (params) => {
    const { rowIndex } = params;
    if (this.state.mouseHoverRowIndex !== rowIndex) {
      this.setState({
        mouseHoverRowIndex: rowIndex,
      });
    }
  };

  handleCellMouseOut = () => {
    this.setState({
      mouseHoverRowIndex: null,
    });
  };

  handleCellMouseDown = (params) => {
    console.log("params", params);
  };

  transformColumns = (columns) => {
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

    const getPinned = (data) => {
      if (has(data, "pinned")) {
        return data.pinned;
      }
      const leftPinnedNames = ["组织", "编号", "工作事项"];
      const { name } = data;
      if (includes(leftPinnedNames, name)) {
        return "left";
      }
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

    const getEditable = (data) => {
      return has(data, "editable") ? data.editable : true;
    };

    const getCellRendererParams = (data) => {};

    const transformedColumns = getColumns(
      map(columns, (item, index) => {
        const { id, name, parentId, sortId, width } = item;
        return {
          ...item,
          id,
          name,
          parentId,
          sortId,
          headerName: name,
          headerTooltip: name,
          headerClass: "my-header-class",
          editable: getEditable(item),
          width: getWidth(width),
          colId: getColId(name, id),
          field: getColId(name, id),
          pinned: getPinned(item),
          rowGroup: getRowGroup(id),
          keyCreator: getKeyCreator(id),
          cellRendererParams: getCellRendererParams(item),
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
      })
    );

    return [...transformedColumns];
  };

  render() {
    const { columnDefs, rowData } = this.state;
    // console.log("columnDefs", columnDefs);
    // console.log("rowData", rowData);
    return (
      <Wrapper className="ag-theme-alpine">
        <AgGridReact
          headerHeight={null}
          // headerHeight={40}
          // groupHeaderHeight={80}
          // rowHeight={100}
          // rowSelection={"multiple"}
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
            // sortable: true,
            resizable: true,
            addEventListener: this.handleColWidthChanged,
            // sortingOrder: ["asc", "desc"],
            // wrapText:true,
            // autoHeight:true,
            // singleClickEdit: true,
          }}
          frameworkComponents={{
            prFunctionGroupCellRenderer: PrFunctionGroupCellRender,
            orderCellRenderer: OrderCellRender,
          }}
          groupRowRendererParams={{
            innerRenderer: "prFunctionGroupCellRenderer",
            // checkbox: true,
            suppressCount: true,
          }}
          enableCellChangeFlash
          suppressDragLeaveHidesColumns
          animateRows
          rowDragManaged
          // sideBar
          // suppressMovableColumns
          // applyColumnDefOrder
          undoRedoCellEditing
          groupUseEntireRow={true} // group row is full width
          groupDefaultExpanded={1} // 0 for none, 1 for first level only, etc. Set to -1 to expand everything.
          onCellMouseOver={this.handleCellMouseOver}
          onCellMouseOut={this.handleCellMouseOut}
          onCellMouseDown={this.handleCellMouseDown}
        />
      </Wrapper>
    );
  }
}

GroupTestExample.propTypes = {};

export default GroupTestExample;
