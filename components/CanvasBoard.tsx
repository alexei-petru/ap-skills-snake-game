import {
  DIR_DOWN,
  DIR_LEFT,
  DIR_RIGHT,
  DIR_TYPES,
  DIR_UP,
  GAME_HEIGHT,
  GAME_SPEED,
  GAME_WIDTH,
  initialSnakeCoords,
  ITEM_SIZE,
} from "data/constants";
import { useKeyHandler } from "hooks/useKeyHandler";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "Redux/redux";
import { useInterval } from "hooks/useInterval";
import {
  checkIsAppleConsumed,
  clearBoard,
  drawObject,
  getRandomApplePos,
  IObjectBody,
} from "utils/utils";
import { resetCounterR, stopGameR } from "Redux/slices/snakeSlice";

const SnakeTestC = () => {
  const isGameStarted = useSelector(
    (state: RootState) => state.snakeReducer.isGameStarted
  );
  const dispatch = useDispatch();

  const [snake, setSnake] = useState(initialSnakeCoords);
  const [snakeDir, setSnakeDir] = useState(DIR_RIGHT);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentKey, setCurrentKey] = useState<DIR_TYPES>(DIR_RIGHT);
  const [applePos, setApplePos] = useState<null | IObjectBody[]>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const getNextHeadPos = useCallback(() => {
    const snakeMoves = {
      [DIR_UP]: { x: snake[0]!.x, y: snake[0]!.y - ITEM_SIZE },
      [DIR_LEFT]: { x: snake[0]!.x - ITEM_SIZE, y: snake[0]!.y },
      [DIR_DOWN]: { x: snake[0]!.x, y: snake[0]!.y + ITEM_SIZE },
      [DIR_RIGHT]: { x: snake[0]!.x + ITEM_SIZE, y: snake[0]!.y },
    };
    return [snakeMoves[currentKey]];
  }, [snake, currentKey]);

  const gameSpeed = isGameStarted ? GAME_SPEED : null;

  //start game loop when speed is non null
  useInterval(gameLoop, gameSpeed);
  useKeyHandler(snakeDir, setCurrentKey);

  //set Initial item coords
  useEffect(() => {
    if (!isGameStarted) {
      setIsGameOver(false);
      setSnake(initialSnakeCoords);
      setCurrentKey(DIR_RIGHT);
    }
    applePos === null && setApplePos(getRandomApplePos());
  }, [applePos, isGameStarted]);

  //draw on canvas
  useEffect(() => {
    if (canvasRef.current) {
      !context && setContext(canvasRef.current.getContext("2d"));
      clearBoard(context);
      applePos && drawObject(context, applePos, "red");
      drawObject(context, snake, "black");
    }
  }, [snake, context, applePos]);

  function gameLoop() {
    const newHeadPosition = getNextHeadPos();
    const isSnakeCollided = chechIfSnakeCollided(newHeadPosition, snake);
    if (isSnakeCollided) {
      dispatch(resetCounterR());
      setIsGameOver(true);
      return;
    }
    const isAppleConsumed = checkIsAppleConsumed(newHeadPosition, applePos);
    const newSnakeArr = [...newHeadPosition, ...snake];

    if (isAppleConsumed) {
      setApplePos(getRandomApplePos(snake));
    } else {
      newSnakeArr.length !== 0 && newSnakeArr.pop();
    }
    setSnake(newSnakeArr);
    setSnakeDir(currentKey);
  }

  const chechIfSnakeCollided = (newHeadPosition, snake) => {
    // const hasCollidedItself2 = snake.forEach((object) => {
    //   if (
    //     newHeadPosition[0].x === object.x &&
    //     newHeadPosition[0].y === object.y
    //   ) {
    //     console.log("colided");
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    const hasCollidedItself = snake.some(
      (object) =>
        newHeadPosition[0].x === object.x && newHeadPosition[0].y === object.y
    );

    const checkIfHasCollidedBorders = () => {
      if (
        newHeadPosition[0].x < 0 ||
        newHeadPosition[0].x > GAME_WIDTH - ITEM_SIZE ||
        newHeadPosition[0].y < 0 ||
        newHeadPosition[0].y > GAME_HEIGHT - ITEM_SIZE
      ) {
        return true;
      } else {
        return false;
      }
    };
    console.log("hasCollidedItself", hasCollidedItself);
    return hasCollidedItself || checkIfHasCollidedBorders();
  };

  return (
    <div>
      {isGameOver && <h2>Game Over</h2>}
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid black" }}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
      />
      {!isGameStarted && <h2>Press space or start to start the game</h2>}
    </div>
  );
};

export default SnakeTestC;
