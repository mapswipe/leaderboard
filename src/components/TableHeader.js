import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from './styledComponents';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: ${({ notSortable }) => notSortable ? 'default' : 'pointer'};
`;

const Name = styled.div`
  color: ${colors.darkGrey};
  font-size: 14px;
  @media(max-width: 600px) {
    font-size: 11px;
  }
`;

const NameDescription = styled.p`
  color: ${colors.grey};
  font-size: 11px;
  margin: 3px;
  text-align: center;
  @media(max-width: 600px) {
    font-size: 7px;
  }
`;

const Arrow = styled.span`
  margin-left: 0.5rem;
  font-size: 12px;
  ${({ isUp }) => isUp && 'transform: rotate(-180deg);'}
  ${({ isVisible }) => !isVisible && 'opacity: 0;'}
`;

const TableHeader = ({ name, desc, isActive, description, updateHeader, notSortable }) => (
  <Container onClick={() => !notSortable && updateHeader()} notSortable={notSortable}>
    <Name>
      {name}
      {description && <NameDescription>{description}</NameDescription>}
    </Name>
    {!notSortable && <Arrow isUp={!desc} isVisible={isActive}>&#9660;</Arrow>}
  </Container>
);

TableHeader.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.bool,
  isActive: PropTypes.bool,
  description: PropTypes.string,
  updateHeader: PropTypes.func,
  notSortable: PropTypes.bool,
};

export default TableHeader;
