import  {useEffect, useState} from 'react';
import {
  randomIntFromInterval,
  reverseLinkedList,
} from '../../utils/utils';
import { useInterval } from '../../hooks/useInterval';
import './Board.css'

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}

const Direction = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
};

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 10;
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0.3;

const createBoard = (width, height) => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < height; row++) {
    const currentRow = [];
    for (let col = 0; col < width; col++) {
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
};

const getStartingSnakeLLValue = board => {
  const startingRow = Math.floor(BOARD_HEIGHT / 2);
  const startingCol = Math.floor(BOARD_WIDTH / 2);
  const startingCell = board[startingRow][startingCol];
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell,
  };
};

const Board = () => {
  const [highscore, setHighscore] = useState(0);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(createBoard(BOARD_WIDTH, BOARD_HEIGHT));
  const [snake, setSnake] = useState(
    new LinkedList(getStartingSnakeLLValue(board)),
  );
  const [snakeCells, setSnakeCells] = useState(
    new Set([snake.head.value.cell]),
  );
  const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5);
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] =
    useState(false);
  const [gameRunning, setGameRunning] = useState(false);

  // Update highscore when score changes
  useEffect(() => {
    if (score > highscore) {
      setHighscore(score);
    }
  }, [score]);

  useEffect(() => {
    const handleKeydown = e => {
      if (!gameRunning) {
        if (
          ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)
        ) {
          setGameRunning(true);
        }
      } else {
        const newDirection = getDirectionFromKey(e.key);
        const isValidDirection = newDirection !== '';
        if (isValidDirection) {
          const snakeWillRunIntoItself =
            getOppositeDirection(newDirection) === direction &&
            snakeCells.size > 1;
          if (!snakeWillRunIntoItself) {
            setDirection(newDirection);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [gameRunning, direction, snakeCells]);

  useInterval(() => {
    if (gameRunning) {
      moveSnake();
    }
  }, 150);

  const handleKeydown = e => {
    if (!gameRunning) {
      if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
        setGameRunning(true);
      }
    } else {
      const newDirection = getDirectionFromKey(e.key);
      const isValidDirection = newDirection !== '';
      if (isValidDirection) {
        const snakeWillRunIntoItself =
          getOppositeDirection(newDirection) === direction &&
          snakeCells.size > 1;
        if (!snakeWillRunIntoItself) {
          setDirection(newDirection);
        }
      }
    }
  };

  const startGame = () => {
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
  };

  const moveSnake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);
    if (isOutOfBounds(nextHeadCoords, board)) {
      handleGameOver();
      return;
    }
    const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
    if (snakeCells.has(nextHeadCell)) {
      handleGameOver();
      return;
    }

    const newHead = new LinkedListNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadCell,
    });
    const currentHead = snake.head;
    snake.head = newHead;
    currentHead.next = newHead;

    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.value.cell);
    newSnakeCells.add(nextHeadCell);

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    const foodConsumed = nextHeadCell === foodCell;
    if (foodConsumed) {
      growSnake(newSnakeCells);
      if (foodShouldReverseDirection) reverseSnake();
      handleFoodConsumption(newSnakeCells);
    }

    setSnakeCells(newSnakeCells);
  };

  const growSnake = newSnakeCells => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
    if (isOutOfBounds(growthNodeCoords, board)) {
      return;
    }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell,
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;

    newSnakeCells.add(newTailCell);
  };

  const reverseSnake = () => {
    const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction);
    const newDirection = getOppositeDirection(tailNextNodeDirection);
    setDirection(newDirection);

    reverseLinkedList(snake.tail);
    const snakeHead = snake.head;
    snake.head = snake.tail;
    snake.tail = snakeHead;
  };

  const handleFoodConsumption = newSnakeCells => {
    const maxPossibleCellValue = BOARD_WIDTH * BOARD_HEIGHT;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (newSnakeCells.has(nextFoodCell) || foodCell === nextFoodCell)
        continue;
      break;
    }

    const nextFoodShouldReverseDirection =
      Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;

    setFoodCell(nextFoodCell);
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
    setScore(score + 10);
  };

  const handleGameOver = () => {
    setScore(0);
    const snakeLLStartingValue = getStartingSnakeLLValue(board);
    setSnake(new LinkedList(snakeLLStartingValue));
    setFoodCell(snakeLLStartingValue.cell + 5);
    setSnakeCells(new Set([snakeLLStartingValue.cell]));
    setDirection(Direction.RIGHT);
    setGameRunning(false);
  };

  const getCoordsInDirection = (coords, direction) => {
    if (direction === Direction.UP) {
      return {
        row: coords.row - 1,
        col: coords.col,
      };
    }
    if (direction === Direction.RIGHT) {
      return {
        row: coords.row,
        col: coords.col + 1,
      };
    }
    if (direction === Direction.DOWN) {
      return {
        row: coords.row + 1,
        col: coords.col,
      };
    }
    if (direction === Direction.LEFT) {
      return {
        row: coords.row,
        col: coords.col - 1,
      };
    }
  };

  const isOutOfBounds = (coords, board) => {
    const {row, col} = coords;
    if (row < 0 || col < 0) return true;
    if (row >= board.length || col >= board[0].length) return true;
    return false;
  };

  const getDirectionFromKey = key => {
    if (key === 'ArrowUp') return Direction.UP;
    if (key === 'ArrowRight') return Direction.RIGHT;
    if (key === 'ArrowDown') return Direction.DOWN;
    if (key === 'ArrowLeft') return Direction.LEFT;
    return '';
  };

  const getNextNodeDirection = (node, currentDirection) => {
    if (node.next === null) return currentDirection;
    const {row: currentRow, col: currentCol} = node.value;
    const {row: nextRow, col: nextCol} = node.next.value;
    if (nextRow === currentRow && nextCol === currentCol + 1) {
      return Direction.RIGHT;
    }
    if (nextRow === currentRow && nextCol === currentCol - 1) {
      return Direction.LEFT;
    }
    if (nextCol === currentCol && nextRow === currentRow + 1) {
      return Direction.DOWN;
    }
    if (nextCol === currentCol && nextRow === currentRow - 1) {
      return Direction.UP;
    }
    return '';
  };

  const getGrowthNodeCoords = (snakeTail, currentDirection) => {
    const tailNextNodeDirection = getNextNodeDirection(
      snakeTail,
      currentDirection,
    );
    const growthDirection = getOppositeDirection(tailNextNodeDirection);
    const currentTailCoords = {
      row: snakeTail.value.row,
      col: snakeTail.value.col,
    };
    const growthNodeCoords = getCoordsInDirection(
      currentTailCoords,
      growthDirection,
    );
    return growthNodeCoords;
  };

  const getOppositeDirection = direction => {
    if (direction === Direction.UP) return Direction.DOWN;
    if (direction === Direction.RIGHT) return Direction.LEFT;
    if (direction === Direction.DOWN) return Direction.UP;
    if (direction === Direction.LEFT) return Direction.RIGHT;
  };

  const getCellClassName = (
    cellValue,
    foodCell,
    foodShouldReverseDirection,
    snakeCells,
  ) => {
    let className = 'cell';
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        className = 'cell cell-purple';
      } else {
        className = 'cell cell-red';
      }
    }
    if (snakeCells.has(cellValue)) {
      className = 'cell cell-green';
    }
    return className;
  };

  return (
    <div className='board-content'>
      <h2 className = "score">Score: {score}</h2>
      <h1 className = "high-score">Highscore: {highscore}</h1>
      <div className="board">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => {
              const className = getCellClassName(
                cellValue,
                foodCell,
                foodShouldReverseDirection,
                snakeCells,
              );
              if (snakeCells.has(cellValue)) {
                if (cellValue === snake.head.value.cell) {
                  return (
                    <div
                      key={cellIdx}
                      className={`${className} snake-head`}></div>
                  );
                } else if (cellValue === snake.tail.value.cell) {
                  return (
                    <div
                      key={cellIdx}
                      className={`${className} snake-tail`}></div>
                  );
                } else {
                  return (
                    <div
                      key={cellIdx}
                      className={`${className} snake-body`}></div>
                  );
                }
              }
              if (cellValue === foodCell) {
                return (
                  <div key={cellIdx} className={className}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                      }}>
                    </div>
                  </div>
                );
              }
              return <div key={cellIdx} className={className}></div>;
            })}
          </div>
        ))}
      </div>
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        {!gameRunning ? (
          <button
            className="hovereffect start-btn"
            onClick={startGame}>
            Start
          </button>
        ) : (
          <button
            className="hovereffect end-btn"
            onClick={stopGame}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Board;
