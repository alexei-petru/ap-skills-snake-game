import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "Redux/redux";
import { startGame } from "Redux/slices/snakeSlice";
import { StyledUILayer } from "components/index.styled";

const UILayer = () => {
  const { isGameOver, isUIShown, isArrowsTempShown: isStartArrowsShown } = useSelector(
    (state: RootState) => state.snakeReducer
  );

  const dispatch = useDispatch();
  return (
    <StyledUILayer className="UILayer">
      {isGameOver && <h2>Game Over</h2>}

      {isUIShown && (
        <div style={{ backgroundColor: "white " }}>
          <h1>Snake Game</h1>
          <button
            style={{ width: "150px", height: "100px" }}
            id="start"
            onClick={() => dispatch(startGame())}
          >
            Start
          </button>
        </div>
      )}
      {isStartArrowsShown && (
        <div>
          <h1 style={{ color: "white" }}>wasd</h1>
        </div>
      )}
    </StyledUILayer>
  );
};

export default UILayer;
