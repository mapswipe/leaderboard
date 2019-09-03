import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelsContainer = styled.div`margin-bottom: 7px;`;
const Input = styled.input.attrs({ type: 'text' })``;
const Label = styled.label`
  cursor: pointer;
  font-size: 11px;
  margin-right: 5px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })``;

const SubmitButton = styled.button`
  margin-left: 16px;
`;

const SearchBar = ({ handleOnBlur, handleKeyUp, isSearcAtStart, toggleIsSearcAtStart, runSearch }) => (
  <FormContainer>
    <SubContainer>
      <LabelsContainer>
        <Label>
          <Checkbox checked={isSearcAtStart} onChange={toggleIsSearcAtStart} />
          starts with
        </Label>
        <Label>
          <Checkbox checked={!isSearcAtStart} onChange={toggleIsSearcAtStart} />
          includes
        </Label>
      </LabelsContainer>
      <Input onBlur={(e) => { handleOnBlur(e); }} onKeyUp={(e) => { handleKeyUp(e); }} />
    </SubContainer>
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
