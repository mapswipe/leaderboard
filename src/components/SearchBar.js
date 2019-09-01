import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { mobileThresholdsPixels } from './styledComponents';

const FormContainer = styled.div``;
const Input = styled.input.attrs({ type: 'text' })`
`;

const Checkbox = styled.span`
  cursor: pointer;
  font-size: 11px;
  margin-right: -1px;
  padding: 2px 7px;
  border: 1px solid #d8d8d8;
  border-radius: 10px 0px 0px 10px;
  ${({ isActive }) => isActive && `
    background-color: #3092f9ba;
    border-color: #3092f9ba;
  `}
  @media(max-width: ${mobileThresholdsPixels}) {
    border-radius: 10px;
  }
`;

const SubmitButton = styled.button`
  margin-left: 16px;
`;

const SearchBar = ({ handleOnBlur, handleKeyUp, isSearcAtStart, toggleIsSearcAtStart, runSearch }) => (
  <FormContainer>
    <Checkbox isActive={isSearcAtStart} onClick={() => toggleIsSearcAtStart()}>
      Starts with
    </Checkbox>
    <Input onBlur={(e) => { handleOnBlur(e); }} onKeyUp={(e) => { handleKeyUp(e); }} />
    <SubmitButton onClick={() => { runSearch(); }}>Search</SubmitButton>
  </FormContainer>
);

SearchBar.propTypes = {
  handleOnBlur: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
  isSearcAtStart: PropTypes.bool.isRequired,
  toggleIsSearcAtStart: PropTypes.func.isRequired,
  runSearch: PropTypes.func.isRequired,
};


export default SearchBar;
