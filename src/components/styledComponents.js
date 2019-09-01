import styled from 'styled-components';

export const mobileThresholdsPixels = '600px';
export const colors = {
  darkGrey: '#7f7f7f',
  grey: '#9B9B9B',
  orange: '#E49042',
  lightOrange: '#F6C08D',
  blue: '#655eea',
};

export const ColoredSpan = styled.span`
  color: ${props => colors[props.color]};
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
