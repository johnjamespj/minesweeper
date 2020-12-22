import React from 'react';

export function DisplayActionPanel({ moves, time, mineCount, flags, paused, onTogglePause, onNewGame }) {
  return (
    <div>
      <span>Time : {Math.floor(time / 1000)}s / </span>
      <span>Moves : {moves} / </span>
      <span>Flags: {mineCount - flags} </span>
      <span>(Right click to flag)</span><br/>
      <span>Minesweeper BY john</span>
      <div>
        <button onClick={onTogglePause}>{paused ? "start" : "pause"}</button>
        <button onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}
