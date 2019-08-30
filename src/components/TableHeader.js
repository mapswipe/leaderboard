import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from './styledComponents';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
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
  @media(max-width: 600px) {
    font-size: 7px;
  }
`;

const Arrow = styled.span`
  margin-left: 0.5rem;
  font-size: 12px;
  transition: transform 0.4s;
  ${({ isUp }) => isUp && 'transform: rotate(-180deg);'}
`;

const TableHeader = ({ name, accessor, description, sortFunction, setSortedHeader }) => {
  const [desc, setDesc] = useState(accessor === 'distance');

  function handleClick() {
    sortFunction(!desc);
    setDesc(!desc);
    setSortedHeader(accessor);
  }

  return (
    <Container onClick={() => handleClick()}>
      <Name>
        {name}
        {description && <NameDescription>{description}</NameDescription>}
      </Name>
      {<Arrow id={`${accessor}SortArrow`} isUp={!desc} className="sort-arrows">&#9660;</Arrow>}
    </Container>
  );
};

TableHeader.propTypes = {
  name: PropTypes.string.isRequired,
  accessor: PropTypes.string.isRequired,
  description: PropTypes.string,
  sortFunction: PropTypes.func.isRequired,
  setSortedHeader: PropTypes.func.isRequired,
};

export default TableHeader;
