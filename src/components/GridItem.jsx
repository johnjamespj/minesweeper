import React from 'react';
import { BombCell, Cell, FlagCell, NumberCell, CellBase } from './Cell';

export function GridItem({ cell, x, y, onFlag, onOpen, isActive }) {
  const onContextMenu = (e) => {
    onFlag(x, y);
    e.preventDefault();
  };

  const onClick = (e) => onOpen(x, y);

  if (cell.isOpen || !isActive)
    return cell.isMined ? <BombCell exploded={cell.isOpen} flagged={cell.isFlagged} /> : (cell.number > 0 ? <NumberCell number={cell.number} /> : <CellBase />);
  else if (cell.isFlagged)
    return <FlagCell onContextMenu={onContextMenu} />;

  else
    return <Cell onContextMenu={onContextMenu} onClick={onClick} />;
}
