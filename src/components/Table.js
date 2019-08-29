import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

import TableHeader from './TableHeader';
import LoadingComponent from './LoadingComponent';
import { ColoredSpan, Icon } from './styledComponents';
import { formattedNumber } from '../lib/formatting';
import icon from '../assets/logo.mapSwipe.png';

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
  .sort-arrows { opacity: 0; }
  ${({ activeHeader }) => `
    #usernameSortArrow { opacity: ${(activeHeader === 'username') ? 1 : 0} }
    #contributionsSortArrow { opacity: ${(activeHeader === 'contributions') ? 1 : 0} }
    #distanceSortArrow { opacity: ${(activeHeader === 'distance') ? 1 : 0} }
  `}
}`;

const UsernameCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 25%;
`;

const IndexSpan = styled.span`
  min-width: 42px;
  margin-right: 6%;
  font-size: 13px;
  text-align: center;
`;

const StyledColoredSpan = styled(ColoredSpan)`margin-left: -20px`;

const styledContributionsCell = row => (
  <StyledColoredSpan color="orange">{formattedNumber(row.contributions)}</StyledColoredSpan>
);

const styledDistanceCell = row => (
  <StyledColoredSpan color="darkGrey">{formattedNumber(row.distance)}</StyledColoredSpan>
);

const styledIndexCell = row => (
  <ColoredSpan color="blue">{<IndexSpan>{`${row.index}.`}</IndexSpan>}</ColoredSpan>
);
const styledUsernameCell = row => (
  <UsernameCell>
    <Icon src={icon} alt={row.username} />
    <ColoredSpan color="blue">{row.username}</ColoredSpan>
  </UsernameCell>
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
    const { sortFunction } = props;
    this.state = { page: 1, perPage: 10, sortedHeader: 'distance' };
    this.columns = [
      { cell: styledIndexCell },
      {
        name: (
          <TableHeader
            name="Mapped Area"
            accessor="distance"
            description="Sq Km Checked"
            sortFunction={desc => sortFunction('distance', desc)}
            setSortedHeader={(name) => { this.setState({ sortedHeader: name }); }}
          />
        ),
        selector: 'distance',
        cell: styledDistanceCell,
      },
      {
        name: (
          <TableHeader
            name="Contributions"
            accessor="contributions"
            description="Objects Found"
            sortFunction={desc => sortFunction('contributions', desc)}
            setSortedHeader={(name) => { this.setState({ sortedHeader: name }); }}
          />
        ),
        selector: 'contributions',
        cell: styledContributionsCell,
      },
      {
        name: (
          <TableHeader
            accessor="username"
            name="Username"
            sortFunction={desc => sortFunction('username', desc)}
            setSortedHeader={(name) => { this.setState({ sortedHeader: name }); }}
          />
        ),
        selector: 'username',
        cell: styledUsernameCell,
      },
    ];
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  handlePerRowsChange(perPage, page) {
    this.setState({ perPage, page });
  }

  /* eslint-disable no-shadow */
  render() {
    const { loading, page, perPage, sortedHeader } = this.state;
    const { totalData, isLoading } = this.props;
    const { data, totalRows } = getDataForPage(totalData, page, perPage);
    return (
      <StyledDataTable
        activeHeader={sortedHeader}
        columns={this.columns}
        data={data}
        progressPending={loading}
        pagination
        noHeader
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(perPage, page) => { this.handlePerRowsChange(perPage, page); }}
        onChangePage={(page) => { this.handlePageChange(page); }}
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
};

export default Table;
