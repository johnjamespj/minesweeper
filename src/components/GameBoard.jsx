import React, { useEffect, useState } from 'react';
import { Grid } from './Grid';
import { DisplayActionPanel } from './DisplayActionPanel';
import { GridItem } from './GridItem';

export function GameBoard({ mine, onWin, onLose, onNewGame }) {
  const [grid, setGrid] = useState(() => mine.grid);
  const [isActive, setActive] = useState(true);
  const [paused, setPause] = useState(false);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [flags, setFlags] = useState(0);

  const updateGrid = () => setGrid(() => mine.grid);
  const updateActivity = () => setActive(() => mine.isActive);
  const updateFlags = () => setFlags(() => mine.flagCount);
  const incrementMoves = () => setMoves(x => x + 1);

  useEffect(() => {
    updateGrid();
    updateActivity();
    setPause(false);
    setTime(0);
    setMoves(0);
    setFlags(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mine]);

  useEffect(() => {
    let timer = setInterval(() => {
      if (mine.isTimerRunning)
        setTime(mine.time);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [mine]);

  const onFlag = (x, y) => {
    if (!paused) {
      updateActivity();
      updateGrid();
      incrementMoves();

      if (!mine.toggleFlag(x, y) && mine.isWin)
        onWin();

      updateFlags();
    }
  };

  const onOpen = (x, y) => {
    if (!paused) {
      updateActivity();
      updateGrid();
      incrementMoves();

      if (!mine.open(x, y))
        onLose();
    }
  };

  const onContextMenu = (e) => {
    e.preventDefault();
  };

  const onTogglePause = (e) => {
    mine.toggleTimer();
    setPause(!mine.isTimerRunning);
  };

  return (
    <div onContextMenu={onContextMenu}>
      <Grid x={10}>
        {grid.map((cell, k) => <GridItem key={k} cell={cell} x={Math.floor(k / 10)} y={k % 10} isActive={isActive} onFlag={onFlag} onOpen={onOpen} />)}
      </Grid>
      <DisplayActionPanel time={time} moves={moves} mineCount={mine.mineCount} flags={flags} seed={mine.seed} onTogglePause={onTogglePause} onNewGame={onNewGame} />
    </div>
  );
}
