import React from "react";
import { FaBomb } from "react-icons/fa";

export default function Node({
  row,
  col,
  isBomb,
  isClose,
  indicator,
  openNode,
  isFlag,
  putFlag,
  size,
}) {
  const extraName = isFlag
    ? "node-flag node-indicator-hide"
    : isClose
    ? "node-close node-indicator-hide node-open"
    : isBomb
    ? "node-bomb node-indicator-hide"
    : indicator === 0
    ? "node-indicator-hide node-open"
    : `node-indicator-${indicator}`;

  return (
    <button
      className={`node ${size} ${extraName}`}
      onClick={() => openNode(row, col)}
      onContextMenu={(e) => putFlag(row, col, e)}
    ></button>
  );
}
