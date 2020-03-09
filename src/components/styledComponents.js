import React from 'react';
import styled from 'styled-components';

import Tooltip from './Tooltip';
import { formattedNumber } from '../lib/formatting';

export const mobileThresholdsPixels = '600px';
export const colors = {
  darkGrey: '#7f7f7f',
  grey: '#9B9B9B',
  orange: '#E49042',
  lightOrange: '#F6C08D',
  blue: '#655eea',
};

export const ColoredSpan = styled.span`
  color: ${props => colors[props.color || 'darkGrey']};
  @media(max-width: ${mobileThresholdsPixels}) {
    font-size: 10px;
  }
`;

export const Icon = styled.img`
  margin-right: 10px;
  width: 35px;
  @media(max-width: ${mobileThresholdsPixels}) {
    width: 22px;
    margin-right: 6px;
  }
`;

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

const Span = styled(ColoredSpan)`margin-left: -20px;`;
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
  <Span color="orange">{formattedNumber(row.contributions)}</Span>
);

const styledDefaultCell = accessor => row => (
  <Span>{formattedNumber(row[accessor])}</Span>
);


export const getStyledCell = (accessor) => {
  switch (accessor) {
    case 'index': return styledIndexCell;
    case 'level': return styledLevelCell;
    case 'rank': return styledRankCell;
    case 'username': return styledUsernameCell;
    // v1 cells
    case 'distance': return styledDistanceCell;
    case 'contributions': return styledContributionsCell;
    // v2 cells
    // case 'distance': return styledDistanceCell;
    // case 'contributions': return styledContributionsCell;
    default: return styledDefaultCell(accessor);
  }
};
