import React, { Fragment, useEffect, useState } from 'react';
import { BombCell, Cell, FlagCell, NumberCell, CellBase } from './components/Cell';
import { Grid } from './components/Grid';
import { Minesweeper } from './controller/Minesweeper';

function GridItem({ cell, x, y, onFlag, onOpen, isActive }) {
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

function DisplayActionPanel({ moves, time, seed, mineCount, flags, paused, onTogglePause, onNewGame }) {
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

function GameBoard({ mine, onWin, onLose, onNewGame }) {
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
    }
  }, [mine]);

  const onFlag = (x, y) => {
    if (!paused) {
      updateActivity();
      updateGrid();

      if (!mine.toggleFlag(x, y) && mine.isWin)
        onWin();

      updateFlags();
    }
    incrementMoves();
  }

  const onOpen = (x, y) => {
    if (!paused) {
      updateActivity();
      updateGrid();

      if (!mine.open(x, y))
        onLose();
    }
    incrementMoves();
  }

  const onContextMenu = (e) => {
    e.preventDefault();
  };

  const onTogglePause = (e) => {
    mine.toggleTimer();
    setPause(!mine.isTimerRunning);
  }

  return (
    <div onContextMenu={onContextMenu}>
      <Grid x={10}>
        {grid.map((cell, k) => <GridItem key={k} cell={cell} x={Math.floor(k / 10)} y={k % 10} isActive={isActive} onFlag={onFlag} onOpen={onOpen} />)}
      </Grid>
      <DisplayActionPanel time={time} moves={moves} mineCount={mine.mineCount} flags={flags} seed={mine.seed} onTogglePause={onTogglePause} onNewGame={onNewGame} />
    </div>
  );
}

function App() {
  const [game, setGame] = useState(() => new Minesweeper(10, 10, 10));

  const delayed = (x) => setTimeout(x, 300)

  const onWin = () => delayed(_ => alert("You WON!\nTime Taken: " + game.time / 1000 + "s"));
  const onLose = () => delayed(_ => alert("Sorry Better luck next time!\nTime Taken: " + game.time / 1000 + "s"));
  const onNewGame = () => setGame(() => new Minesweeper(10, 10, 10));

  return <GameBoard mine={game} onWin={onWin} onLose={onLose} onNewGame={onNewGame} />;
}

export default App;
