import React from 'react';
import { map } from 'lodash';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

import TableHeader from './TableHeader';
import LoadingComponent from './LoadingComponent';
import { getStyledCell, mobileThresholdsPixels } from './styledComponents';
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
    const { isV1, defaultAccessor } = props;
    const headers = {
      username: { name: 'Username', desc: false },
      ...(isV1
        ? {
          distance: { name: 'Mapped Area', description: 'Sq Km Checked', desc: false },
          level: { name: 'Level', noSelector: true, notSortable: true },
          contributions: { name: 'Contributions', description: 'Objects Found', desc: false },
        } : {
          taskContributionCount: { name: 'Tasks Count', desc: false },
          projectContributionCount: { name: 'Project Contribution', desc: false },
          level: { name: 'Level', noSelector: true, notSortable: true },
          groupContributionCount: { name: 'Group Contribution', desc: false },
        }
      ),
    };
    this.state = { page: 1, perPage: 10, headers, activeHeader: defaultAccessor };
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
    const columns = [{ cell: getStyledCell('index') }].concat(
      map(headers, ({ noSelector, ...value }, key) => ({
        name: (
          <TableHeader
            {...value}
            isActive={activeHeader === key}
            updateHeader={() => this.updateHeader(key)}
          />
        ),
        cell: getStyledCell(key),
        ...(!noSelector && { selector: key }),
      })),
    );

    if (query) {
      columns.push({
        name: (
          <TableHeader name="MapSwipe Rank" description={`out of ${formattedNumber(overallDataLength)}`} notSortable />
        ),
        cell: getStyledCell('rank'),
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
    username: PropTypes.string.isRequired,
    // v1 fields
    contributions: PropTypes.number,
    distance: PropTypes.number,
    // v2 fields
    taskContributionCount: PropTypes.number,
    projectContributionCount: PropTypes.number,
    groupContributionCount: PropTypes.number,
  })).isRequired,
  sortFunction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isV1: PropTypes.bool,
  query: PropTypes.string,
  overallDataLength: PropTypes.number,
  defaultAccessor: PropTypes.string.isRequired,
};

export default Table;
