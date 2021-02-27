import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-weight: 600;
`;

function PrFunctionGroupCellRender(props) {
  const { value } = props;
  return <Wrapper>{value}</Wrapper>;
}

PrFunctionGroupCellRender.propTypes = {};

export default PrFunctionGroupCellRender;
