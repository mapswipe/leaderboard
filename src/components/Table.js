import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

import TableHeader from './TableHeader';
import Tooltip from './Tooltip';
import LoadingComponent from './LoadingComponent';
import { ColoredSpan, Icon, mobileThresholdsPixels } from './styledComponents';
import { formattedNumber } from '../lib/formatting';

const StyledDataTable = styled(DataTable)`&&&{
  .rdt_TableCell, .rdt_TableCol {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rdt_TableHeadRow .rdt_TableCol:first-child, .rdt_TableRow .rdt_TableCell:first-child {
    min-width: 50px;
    max-width: 50px;
    padding-left: 12px;
  }
  .rdt_TableFooter {
    @media(max-width: ${mobileThresholdsPixels}) {
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
    }
  }
}`;

const UsernameCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 5%;
  @media(max-width: ${mobileThresholdsPixels}) {
    padding-left: 0px;
  }
`;

const BagdeCell = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: visible !important;
`;

const IndexSpan = styled(ColoredSpan)`
  min-width: 42px;
  font-size: 13px;
  ${({ center }) => center && 'text-align: center;'}
`;

const ContributionsSpan = styled(ColoredSpan)`margin-left: -20px;`;
const DistanceSpan = styled(ColoredSpan)`
  min-width: 75px
  text-align: center;
  @media(max-width: ${mobileThresholdsPixels}) {
    margin-right: 6px;
    min-width: 60px
  }
`;

const LevelSpan = styled(ColoredSpan)`
  margin-right: -20px;
  text-align: right;
  @media(max-width: ${mobileThresholdsPixels}) {
    margin-right: 6px;
    min-width: 60px
  }
`;

const styledIndexCell = row => (<IndexSpan color="blue">{`${row.index}.`}</IndexSpan>);
const styledRankCell = row => (<IndexSpan color="blue" center>{`${formattedNumber(row.rank)}`}</IndexSpan>);
const styledUsernameCell = row => (
  <UsernameCell>
    <Icon src={row.logo} alt={row.username} />
    <ColoredSpan color="blue">{row.username}</ColoredSpan>
  </UsernameCell>
);

const styledDistanceCell = row => (<DistanceSpan color="darkGrey">{formattedNumber(row.distance)}</DistanceSpan>);

const styledLevelCell = row => (
  <BagdeCell>
    {/* to avoid react-data-table force css injection on the first Children */}
    <div />
    <Tooltip text={row.level.title}>
      <LevelSpan color="darkGrey">{row.level.grade}</LevelSpan>
    </Tooltip>
    <Icon src={row.level.badge} alt={row.level.title} />
  </BagdeCell>
);

const styledContributionsCell = row => (
  <ContributionsSpan color="orange">{formattedNumber(row.contributions)}</ContributionsSpan>
);

const getRowIndex = (index, page, perPage) => ((page - 1) * perPage) + index + 1;
const getDataForPage = memoize((totalData, page, perPage) => (
  {
    data: totalData.slice((page - 1) * perPage, (page * perPage))
      .map((datum, index) => ({ ...datum, index: getRowIndex(index, page, perPage) })),
    totalRows: totalData.length,
  }
));

class Table extends React.Component {
  constructor(props) {
    super(props);
    const headers = {
      username: { name: 'Username', desc: false },
      distance: { name: 'Mapped Area', description: 'Sq Km Checked', desc: true },
      contributions: { name: 'Contributions', description: 'Objects Found', desc: false },
    };
    this.state = { page: 1, perPage: 10, headers, activeHeader: 'distance' };
  }

  updateHeader = (accessor) => {
    const { sortFunction } = this.props;
    const { headers } = this.state;
    const { desc } = headers[accessor];
    const updatedHeader = { ...headers[accessor], desc: !desc };

    sortFunction(accessor, desc);
    this.setState({ headers: { ...headers, [accessor]: updatedHeader }, activeHeader: accessor });
  }

  getColumns = () => {
    const { query, overallDataLength } = this.props;
    const { headers, activeHeader } = this.state;
    const columns = [
      { cell: styledIndexCell },
      {
        name: (
          <TableHeader
            {...headers.username}
            isActive={activeHeader === 'username'}
            updateHeader={() => this.updateHeader('username')}
          />
        ),
        selector: 'username',
        cell: styledUsernameCell,
      },
      {
        name: (
          <TableHeader
            {...headers.distance}
            isActive={activeHeader === 'distance'}
            updateHeader={() => this.updateHeader('distance')}
          />
        ),
        selector: 'distance',
        cell: styledDistanceCell,
      },
      {
        name: (<TableHeader name="Level" notSortable />),
        cell: styledLevelCell,
      },
      {
        name: (
          <TableHeader
            {...headers.contributions}
            isActive={activeHeader === 'contributions'}
            updateHeader={() => this.updateHeader('contributions')}
          />
        ),
        selector: 'contributions',
        cell: styledContributionsCell,
      },
    ];
    if (query) {
      columns.push({
        name: (
          <TableHeader name="MapSwipe Rank" description={`out of ${formattedNumber(overallDataLength)}`} notSortable />
        ),
        cell: styledRankCell,
      });
    }
    return columns;
  }

  handlePageChange = (page) => {
    this.setState({ page });
  }

  handlePerRowsChange = (perPage, page) => {
    this.setState({ perPage, page });
  }

  /* eslint-disable no-shadow */
  render() {
    const { loading, page, perPage } = this.state;
    const { totalData, isLoading } = this.props;
    const { data, totalRows } = getDataForPage(totalData, page, perPage);

    return (
      <StyledDataTable
        columns={this.getColumns()}
        data={data}
        progressPending={loading}
        pagination
        noHeader
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={this.handlePerRowsChange}
        onChangePage={this.handlePageChange}
        noDataComponent={isLoading ? <LoadingComponent /> : 'No data available'}
      />
    );
  }
}

Table.propTypes = {
  totalData: PropTypes.arrayOf(PropTypes.shape({
    contributions: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  })).isRequired,
  sortFunction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  query: PropTypes.string,
  overallDataLength: PropTypes.number,
};

export default Table;
