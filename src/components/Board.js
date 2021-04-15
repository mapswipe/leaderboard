import React from 'react';
import { reverse, sortBy } from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';

import Table from './Table';
import SearchBar from './SearchBar';
import { colors, mobileThresholdsPixels } from './styledComponents';
import { getUsersPromise } from '../lib/callApi';
import { formattedNumber, formattedDate } from '../lib/formatting';
import { defaultAccessor } from '../constants';
import logo from '../assets/logo.mapSwipe.banner.png';
import logoV1 from '../assets/logo.mapSwipe.banner.v1.png';

const MainContainer = styled.div`
  padding: 48px 15vw;
  @media(max-width: ${mobileThresholdsPixels}) {
    width: 100%;
    padding: 32px 10px;
  }
`;

const Img = styled.img`
  width: 450px;
  @media(max-width: ${mobileThresholdsPixels}) {
    width: 250px;
  }
`;

const P = styled.p`
  color: ${colors.grey};
  width: 100%;
  @media(max-width: ${mobileThresholdsPixels}) {
    font-size: 12px;
  }
`;

const EmphSpan1 = styled.span`color: ${colors.orange};`;
const EmphSpan2 = styled.span`color: ${colors.lightOrange}`;
const StyledCSVLink = styled(CSVLink)`
  margin-left: 10px;
  color: ${colors.grey};
`;

const getCSVHeaders = isV1 => ([
  { label: 'Username', key: 'username' },
  { label: 'Level', key: 'level.grade' },
  ...(isV1
    ? ([
      { label: 'Contributions', key: 'contributions' },
      { label: 'Mapped Area', key: 'distance' },
    ])
    : ([
      { label: 'Task Contribution Count', key: 'taskContributionCount' },
      { label: 'Project Contribution Count', key: 'projectContributionCount' },
      { label: 'Group Contribution Count', key: 'groupContributionCount' },
    ])
  ),
]);


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalData: [],
      totalCount: {},
      overallDataLength: 0,
      query: '',
      startsWithSearch: true,
      isLoading: true,
    };
    getUsersPromise().then(({ data, totalCount, overallDataLength }) => this.setState({
      totalData: reverse(sortBy(data, defaultAccessor)),
      totalCount,
      overallDataLength,
      isLoading: false,
    }));
  }

  handleOnBlur = (event) => {
    this.setState({ query: event.target.value });
  }

  handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.setState({ query: event.target.value }, this.runSearch);
    }
  }

  toggleStartsWithSearch = () => {
    const { startsWithSearch } = this.state;
    this.setState({ startsWithSearch: !startsWithSearch });
  }

  runSearch = () => {
    const { query, startsWithSearch } = this.state;
    this.setState({ totalData: [], isLoading: true });
    getUsersPromise(query, startsWithSearch)
      .then(({ data, totalCount, overallDataLength }) => this.setState({
        totalData: reverse(sortBy(data, defaultAccessor)),
        totalCount,
        overallDataLength,
        isLoading: false,
      }));
  }

  sortFunction = (accessor, desc = true) => {
    const { totalData } = this.state;
    const data = sortBy(totalData, accessor);
    this.setState({ totalData: desc ? reverse(data) : data });
  }

  render() {
    const { totalData, totalCount, startsWithSearch, query, ...props } = this.state;
    const { isV1 } = this.props;

    return (
      <MainContainer>
        <a href="/"><Img src={isV1 ? logoV1 : logo} alt="MapSwipe logo" /></a>
        <SearchBar
          handleOnBlur={this.handleOnBlur}
          handleKeyUp={this.handleKeyUp}
          startsWithSearch={startsWithSearch}
          toggleStartsWithSearch={this.toggleStartsWithSearch}
          runSearch={this.runSearch}
        />
        {isV1 ? (
          <P>
            Thanks for mapping &nbsp;
            <EmphSpan1>{formattedNumber(totalCount.contributions)}</EmphSpan1>
            &nbsp; square kms and finding &nbsp;
            <EmphSpan2>{formattedNumber(totalCount.distance)}</EmphSpan2>
            &nbsp; objects!
          </P>
        ) : (
          <P>
            In the past 24 hours MapSwipe users have worked on &nbsp;
            <EmphSpan2>{formattedNumber(totalCount.projectContributionCount)}</EmphSpan2>
            &nbsp; groups!
          </P>
        )}

        <Table
          totalData={totalData}
          sortFunction={this.sortFunction}
          query={query}
          isV1={isV1}
          defaultAccessor={defaultAccessor}
          {...props}
        />
        <StyledCSVLink
          data={totalData}
          headers={getCSVHeaders(isV1)}
          filename={`users_leaderboard_${formattedDate(new Date())}.csv`}
        >
          Export CSV
        </StyledCSVLink>
      </MainContainer>
    );
  }
}

Board.propTypes = {
  isV1: PropTypes.bool,
};

export default Board;
