import {
  AnyAction,
  createAction,
  ListenerEffectAPI,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { RootState } from "Redux/redux";
import {
  setGameOver,
  setRandomApplePos,
  setSnakeDir,
  setSnakeNewCoords,
  updateSkillsImages,
} from "Redux/slices/snakeSlice";
import { getNextHeadPos } from "utils/getNextHeadPos";
import {
  chechIfSnakeCollided,
  checkIsAppleConsumed,
  getRandomApplePos,
} from "utils/utils";

export const moveSnake = createAction<undefined>("snake/startSnakeLogic");

export const startSnakeLogic = (
  _action: AnyAction,
  listenerApi: ListenerEffectAPI<
    RootState,
    ThunkDispatch<unknown, unknown, AnyAction>,
    unknown
  >
) => {
  const { snakeCoords, gameSizes, currentKey, applePos, isGameWin } =
    listenerApi.getState().snakeReducer;

  const dispatch = listenerApi.dispatch;

  const newHeadPosition = getNextHeadPos(
    snakeCoords,
    gameSizes.itemSize,
    currentKey
  );
  const isSnakeCollided = chechIfSnakeCollided(
    newHeadPosition,
    snakeCoords,
    gameSizes.gameWidth,
    gameSizes.gameHeight,
    gameSizes.itemSize
  );
  if (isSnakeCollided) {
    dispatch(setGameOver());
    return;
  }
  const isAppleConsumed = checkIsAppleConsumed(newHeadPosition, applePos);
  const newSnakeArr = [...newHeadPosition, ...snakeCoords];

  if (isAppleConsumed) {
    if (isGameWin) return;

    const randomApplePos = getRandomApplePos(
      newSnakeArr,
      gameSizes.gameWidth,
      gameSizes.gameHeight,
      gameSizes.itemSize
    );
    dispatch(setRandomApplePos(randomApplePos));
    dispatch(updateSkillsImages());
  } else if (!isAppleConsumed) {
    newSnakeArr.length !== 0 && newSnakeArr.pop();
  }
  dispatch(setSnakeNewCoords(newSnakeArr));
  dispatch(setSnakeDir(currentKey));
};
