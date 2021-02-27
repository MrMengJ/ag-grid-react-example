import React, { Component } from "react";
import styled from "styled-components";
import { get } from "lodash";

const Wrapper = styled.div`
  position: relative;
`;

class OrderCellRender extends Component {
  render() {
    const { node, value } = this.props;
    console.log("props", this.props);
    const rowIndex = get(node, "rowIndex", null);
    return <Wrapper>{value.a.a1}</Wrapper>;
  }
}

OrderCellRender.propTypes = {};

export default OrderCellRender;
