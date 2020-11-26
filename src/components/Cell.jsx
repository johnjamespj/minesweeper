import React from 'react';
import styled from 'styled-components';
import Bomb from './Bomb';
import Flag from './Flag';

export const CellBase = styled.div`
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;

  border: dashed 0.5px rgba(0, 0, 0, 0.4);

  ${({ color }) => color ? `color: ${color};` : ''}

  &:hover{
    opacity: 0.6;
  }
`;

const SVGBase = styled.div`
  width: 25px;
  height: 25px;

  ${({ exploded }) => exploded ? `fill: red;` : ''}
  ${({ flagged }) => flagged ? `fill: #00e676;` : ''}
`;

const MousePointer = styled.span`
  cursor: pointer;
`;

const MousePointerDefault = styled.span`
  cursor: default;
  user-select:none;
`;

export const Cell = styled(CellBase)`
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

export const BombCell = ({ exploded, flagged, ...props }) => (
  <CellBase {...props}>
    <SVGBase exploded={exploded} flagged={flagged}>
      <Bomb />
    </SVGBase>
  </CellBase>
);

export const FlagCell = (props) => (
  <MousePointer {...props}>
    <Cell>
      <SVGBase>
        <Flag />
      </SVGBase>
    </Cell>
  </MousePointer>
);

const Color = [
  '#00e676',
  '#e6d53f',
  '#ff5722',
  '#00b0ff',
  '#651fff',
  '#ff1744',
  '#6a1b9a',
  '#2e7d32'
];

export const NumberCell = ({ number, ...props }) => {
  if (number <= 0 || number > Color.length)
    throw new Error(`Out Of Range: Number (${number}) should be in the 1 - ${Color.length} for NumberCell Component`);

  return (
    <CellBase color={Color[number - 1]} {...props}>
      <MousePointerDefault>{number}</MousePointerDefault>
    </CellBase>
  );
}
