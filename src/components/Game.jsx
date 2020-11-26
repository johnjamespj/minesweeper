import React, { useState } from 'react';
import { Minesweeper } from '../controller/Minesweeper';
import { GameBoard } from './GameBoard';

export function Game() {
  const [game, setGame] = useState(() => new Minesweeper(10, 10, 10));

  const delayed = (x) => setTimeout(x, 300);

  const onWin = () => delayed(_ => alert("You WON!\nTime Taken: " + game.time / 1000 + "s"));
  const onLose = () => delayed(_ => alert("Sorry Better luck next time!\nTime Taken: " + game.time / 1000 + "s"));
  const onNewGame = () => setGame(() => new Minesweeper(10, 10, 10));

  return <GameBoard mine={game} onWin={onWin} onLose={onLose} onNewGame={onNewGame} />;
}
