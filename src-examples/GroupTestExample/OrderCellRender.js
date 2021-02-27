import React, { Component } from "react";
import styled from "styled-components";
import { get } from "lodash";

const Wrapper = styled.div`
  position: relative;
`;

class OrderCellRender extends Component {
  render() {
    const { node } = this.props;
    const rowIndex = get(node, "rowIndex", null);
    return <Wrapper>{rowIndex}</Wrapper>;
  }
}

OrderCellRender.propTypes = {};

export default OrderCellRender;
