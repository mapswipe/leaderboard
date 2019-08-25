import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

import { colors } from './styledComponents';
import icon from '../assets/icon.png';

const tableTheme = {
  rows: {
    // backgroundColor: 'blue',
  },
  cells: { textAlign: 'center' },
};

const Name = styled.p`
  color: ${colors.darkGrey};
  font-size: 14px;
`;

const NameDescription = styled.span`
  color: ${colors.grey};
  font-size: 11px;
`;

const UsernameCell = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  margin-right: 10px;
  width: 35px;
`;

const ColoredSpan = styled.span`color: ${props => colors[props.color]};`;

const styledUsernameCell = row => (
  <UsernameCell>
    <Icon src={icon} alt={row.username} />
    <ColoredSpan color="blue">{row.username}</ColoredSpan>
  </UsernameCell>
);

const styledContributionsCell = row => <ColoredSpan color="orange">{row.contributions}</ColoredSpan>;

const columns = [
  {
    name: <Name>Username</Name>,
    selector: 'username',
    sortable: true,
    cell: styledUsernameCell,
  },
  {
    name: (
      <Name>
        Contributions
        <br />
        <NameDescription>(Objects Found)</NameDescription>
      </Name>
    ),
    selector: 'contributions',
    sortable: true,
    cell: styledContributionsCell,
  },
  {
    name: (
      <Name>
        Mapped Area
        <br />
        <NameDescription>(Sq Km Checked)</NameDescription>
      </Name>
    ),
    selector: 'distance',
    sortable: true,
  },
];

const getDataForPage = memoize((totalData, page, perPage) => (
  {
    data: totalData.slice((page - 1) * perPage, (page * perPage) - 1),
    totalRows: totalData.length,
  }
));

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 1, perPage: 10 };
  }

  handlePageChange(page) {
    this.setState({ page });
  }

  handlePerRowsChange(perPage, page) {
    this.setState({ perPage, page });
  }

  /* eslint-disable no-shadow */
  render() {
    const { loading, page, perPage } = this.state;
    const { totalData } = this.props;
    const { data, totalRows } = getDataForPage(totalData, page, perPage);
    return (
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        noHeader
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(perPage, page) => { this.handlePerRowsChange(perPage, page); }}
        onChangePage={(page) => { this.handlePageChange(page); }}
        customTheme={tableTheme}
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
};

export default Table;
