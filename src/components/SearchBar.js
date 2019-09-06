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

const SearchBar = ({ handleOnBlur, handleKeyUp, startsWithSearch, toggleStartsWithSearch, runSearch }) => (
  <FormContainer>
    <SubContainer>
      <LabelsContainer>
        <Label>
          <Checkbox checked={startsWithSearch} onChange={toggleStartsWithSearch} />
          starts with
        </Label>
        <Label>
          <Checkbox checked={!startsWithSearch} onChange={toggleStartsWithSearch} />
          includes
        </Label>
      </LabelsContainer>
      <Input onBlur={handleOnBlur} onKeyUp={handleKeyUp} />
    </SubContainer>
    <SubmitButton onClick={runSearch}>Search</SubmitButton>
  </FormContainer>
);

SearchBar.propTypes = {
  handleOnBlur: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
  startsWithSearch: PropTypes.bool.isRequired,
  toggleStartsWithSearch: PropTypes.func.isRequired,
  runSearch: PropTypes.func.isRequired,
};


export default SearchBar;
