import React, { Fragment } from 'react';

export function DisplayActionPanel({ moves, time, seed, mineCount, flags, paused, onTogglePause, onNewGame }) {
  return (
    <Fragment>
      <span>Time : {Math.floor(time / 1000)}s / </span>
      <span>Moves : {moves} / </span>
      <span>Flags: {mineCount - flags} / </span>
      <span>Seed: {seed}</span><br />
      <button onClick={onTogglePause}>{paused ? "start" : "pause"}</button>
      <button onClick={onNewGame}>New Game</button>
    </Fragment>
  );
}
