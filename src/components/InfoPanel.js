import React from "react";
import timerImage from "../images/timer.png";
import flagImage from "../images/flag.png";

export default function InfoPanel({ grid, time }) {
  let numberofBombs = 0;
  grid.forEach((row) => {
    row.forEach((node) => {
      if (node.isBomb && node.isClose) {
        numberofBombs++;
      }
      if (node.isFlag) {
        numberofBombs--;
      }
    });
  });

  return (
    <div className="info-panel">
      <img src={flagImage} title="flag" alt="" />
      <span className="info-panel-item">{numberofBombs}</span>
      <img src={timerImage} title="timer" alt="" />
      <span className="info-panel-item">{time.toFixed(2)}</span>
    </div>
  );
}
