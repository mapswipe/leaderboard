import React from 'react';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';

import Table from './Table';
import { colors } from './styledComponents';
import { getUsersPromise } from '../lib/callApi';
import { formattedNumber, formattedDate } from '../lib/formatting';
import { basicSort } from '../lib/sortFunctions';
import logo from '../assets/logo.mapSwipe.banner.png';

const MainContainer = styled.div`
  padding: 48px 15vw;
  @media(max-width: 600px) {
    width: 100%;
    padding: 32px 10px;
  }
`;

const Img = styled.img`
  width: 450px;
  @media(max-width: 600px) {
    width: 250px;
  }
`;

const P = styled.p`
  color: ${colors.grey};
  width: 100%;
  @media(max-width: 600px) {
    font-size: 12px;
  }
`;

const EmphSpan1 = styled.span`color: ${colors.orange};`;
const EmphSpan2 = styled.span`color: ${colors.lightOrange}`;
const FormContainer = styled.div``;
const Input = styled.input``;
const SubmitButton = styled.button``;
const StyledCSVLink = styled(CSVLink)`
  margin-left: 10px;
  color: ${colors.grey};
`;

const csvHeaders = [
  { label: 'Mapped Area', key: 'distance' },
  { label: 'Contributions', key: 'contributions' },
  { label: 'Username', key: 'username' },
];

class Board extends React.Component {
  constructor() {
    super();
    this.state = { totalData: [], totalContributions: 0, totalDistance: 0, query: '', isLoading: true };
    getUsersPromise().then(({ data, totalContributions, totalDistance }) => this.setState({
      totalData: data.sort((a, b) => basicSort(a, b, 'distance')),
      totalContributions,
      totalDistance,
      isLoading: false,
    }));
  }

  handleOnBlur(event) {
    this.setState({ query: event.target.value });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.setState({ query: event.target.value }, () => { this.runSearch(); });
    }
  }

  runSearch() {
    const { query } = this.state;
    this.setState({ totalData: [], isLoading: true });
    getUsersPromise(query).then(({ data, totalContributions, totalDistance }) => this.setState({
      totalData: data.sort((a, b) => basicSort(a, b, 'distance')),
      totalContributions,
      totalDistance,
      isLoading: false,
    }));
  }

  sortFunction(accessor, desc = true) {
    const { totalData } = this.state;
    const data = [...totalData.sort((a, b) => basicSort(a, b, accessor, desc))];
    this.setState({ totalData: data });
  }

  render() {
    const { totalData, totalContributions, totalDistance, isLoading } = this.state;
    return (
      <MainContainer>
        <Img src={logo} alt="MapSwipe logo" />
        <FormContainer>
          <Input type="text" onBlur={(e) => { this.handleOnBlur(e); }} onKeyUp={(e) => { this.handleKeyUp(e); }} />
          <SubmitButton onClick={() => { this.runSearch(); }}>Search</SubmitButton>
        </FormContainer>
        <P>
          Thanks for mapping &nbsp;
          <EmphSpan1>{formattedNumber(totalContributions)}</EmphSpan1>
          &nbsp; square kms and finding &nbsp;
          <EmphSpan2>{formattedNumber(totalDistance)}</EmphSpan2>
          &nbsp; objects!
        </P>
        <Table
          totalData={totalData}
          sortFunction={(accessor, desc) => this.sortFunction(accessor, desc)}
          isLoading={isLoading}
        />
        <StyledCSVLink
          data={totalData}
          headers={csvHeaders}
          filename={`users_leaderboard_${formattedDate(new Date())}.csv`}
        >
          Export CSV
        </StyledCSVLink>
      </MainContainer>
    );
  }
}

export default Board;
