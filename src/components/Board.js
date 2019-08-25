import React from 'react';
import styled from 'styled-components';

import Table from './Table';
import { colors } from './styledComponents';
import { getUsersPromise } from '../lib/callApi';
import logo from '../assets/logo.png';

const MainContainer = styled.div`
  padding: 48px 15vw;
`;

const Img = styled.img`
  width: 450px;
`;

const P = styled.p`
  color: ${colors.grey};
`;

const EmphSpan1 = styled.span`
  color: ${colors.orange};
`;

const EmphSpan2 = styled.span`
  color: ${colors.lightOrange};
`;

const FormContainer = styled.div``;
const Input = styled.input``;
const SubmitButton = styled.button``;

class Board extends React.Component {
  constructor() {
    super();
    this.state = { totalData: [], totalContributions: 0, totalDistance: 0, query: '' };
    getUsersPromise().then(({ data, totalContributions, totalDistance }) => this.setState({
      totalData: data,
      totalContributions,
      totalDistance,
    }));
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  runSearch() {
    const { query } = this.state;
    getUsersPromise(query).then(({ data, totalContributions, totalDistance }) => this.setState({
      totalData: data,
      totalContributions,
      totalDistance,
    }));
  }

  render() {
    const { totalData, query, totalContributions, totalDistance } = this.state;
    return (
      <MainContainer>
        <Img src={logo} alt="MapSwipe logo" />
        <FormContainer>
          <Input type="text" value={query} onChange={(e) => { this.handleChange(e); }} />
          <SubmitButton onClick={() => { this.runSearch(); }}>Search</SubmitButton>
        </FormContainer>
        <P>
          Thanks for mapping &nbsp;
          <EmphSpan1>{totalContributions}</EmphSpan1>
          &nbsp; square kms and finding &nbsp;
          <EmphSpan2>{totalDistance}</EmphSpan2>
          &nbsp; objects!
        </P>
        <Table totalData={totalData} />
      </MainContainer>
    );
  }
}

export default Board;
