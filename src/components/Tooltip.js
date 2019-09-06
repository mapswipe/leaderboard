import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TooltipText = styled.span`
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  right: 50%;
  margin-right: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    right: 56px;
    margin-right: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: visible !important;

  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = ({ children, text }) => (
  <TooltipContainer className="tooltip">
    {children}
    <TooltipText>{text}</TooltipText>
  </TooltipContainer>
);

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

export default Tooltip;
