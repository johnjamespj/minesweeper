import React from 'react';
import styled from 'styled-components';
import Bomb from './Bomb';
import Flag from './Flag';

const CellBase = styled.div`
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;

  &:hover{
    opacity: 0.6;
  }
`;

const SVGBase = styled.div`
  width: 25px;
  height: 25px;

  ${({ exploded }) => exploded ? `fill: red;` : ''}
`;

export const Cell = styled(CellBase)`
  background-color: rgba(0, 0, 0, 0.2);
`;

export const BombCell = (props) => (
  <CellBase>
    <SVGBase {...props}>
      <Bomb />
    </SVGBase>
  </CellBase>
);

export const FlagCell = () => (
  <Cell>
    <SVGBase>
      <Flag />
    </SVGBase>
  </Cell>
)
