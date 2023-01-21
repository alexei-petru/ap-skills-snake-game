import { FIRST_BLOCK, PTS_GAME_SQUARE_NO_FIRST } from "data/gameConst";
import { startAppListening } from "Redux/middleware/listenerMiddleware";
import {
  setCurrentScore,
  setHighScore,
  setPrevScore,
} from "Redux/slices/scoreSlice";
import { startGame } from "Redux/slices/snakeSlice";

export const snakeScoreListener = () => {
  startAppListening({
    predicate: (action, currentState, previousState) => {
      return (
        currentState.snakeReducer.snakeCoords.length !==
          previousState.snakeReducer.snakeCoords.length ||
        action.type === startGame.type
      );
    },
    effect: (arg1, arg2) => {
      const snakeState = arg2.getState().snakeReducer;
      const scoreState = arg2.getState().scoreReducer;
      let localCurrentScore = scoreState.currentScore;

      if (
        snakeState.isGameStarted &&
        snakeState.snakeCoords.length > FIRST_BLOCK
      ) {
        localCurrentScore += PTS_GAME_SQUARE_NO_FIRST;
        arg2.dispatch(setCurrentScore(localCurrentScore));
      }

      if (arg1.type === startGame.type) {
        arg2.dispatch(setCurrentScore(0));
        arg2.dispatch(setPrevScore(localCurrentScore));
      }

      if (localCurrentScore > scoreState.highScore) {
        arg2.dispatch(setHighScore(localCurrentScore));
      }
    },
  });
};
