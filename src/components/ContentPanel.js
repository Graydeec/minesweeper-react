import React, { useState, useEffect } from "react";
import Node from "./Node";
import InfoPanel from "./InfoPanel";
import EndModal from "./EndModal";
import OptionPanel from "./OptionPanel";
import RankingModal from "./RankingModal";
import axios from "axios";
import NameModal from "./NameModal";

export default function ContentPanel() {
  const [grid, setGrid] = useState(sampleGrid);
  const [lose, setLose] = useState(false);
  const [end, setEnd] = useState(false);
  const [win, setWin] = useState(false);
  const [numBomb, setNumBomb] = useState(10);
  const [ratio, setRatio] = useState(100);
  const [row, setRow] = useState(10);
  const [col, setCol] = useState(10);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  // LB = leaderboard
  const [isShowLB, setIsShowLB] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [size, setSize] = useState("small");

  useEffect(() => {
    if (ranks.length === 0) {
      fetchRanking();
    }
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setTime((time) => time + 0.01);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isActive]);

  const fetchRanking = () => {
    axios
      .get("https://ranking-django-api.herokuapp.com/records/")
      .then((resp) => {
        setRanks(resp.data);
      });
  };

  const openNode = (curRow, curCol) => {
    if (end) {
      return;
    }
    setIsActive(true);
    const newGrid = grid.slice();
    newGrid[curRow][curCol].isClose = false;
    if (!grid[curRow][curCol].isBomb) {
      if (grid[curRow][curCol].isFlag) {
        grid[curRow][curCol].isFlag = false;
      }
      findAllNeighboorEmptyNode(newGrid, curRow, curCol, row, col);
    } else {
      setGrid(newGrid);
      setLose(true);
      setEnd(true);
      setIsActive(false);
    }
    setGrid(newGrid);
    if (checkVictory(newGrid)) {
      setWin(true);
      setEnd(true);
      setIsActive(false);
    }
  };

  const putFlag = (row, col, e) => {
    e.preventDefault();
    if (end) {
      return;
    }
    if (!grid[row][col].isClose) {
      return;
    }
    const newGrid = grid.slice();
    newGrid[row][col].isFlag = !newGrid[row][col].isFlag;
    setGrid(newGrid);
    if (checkVictory(newGrid)) {
      setWin(true);
      setEnd(true);
      setIsActive(false);
    }
  };

  const tryAgain = () => {
    setLose(false);
    setWin(false);
    setEnd(false);
    setGrid(initializeGrid(initializeBomb(numBomb, ratio), row, col, size));
    setTime(0);
  };

  const cancel = () => {
    setLose(false);
    setWin(false);
  };

  const initializeGame = (row, col, numBombs, size) => {
    setRow(row);
    setCol(col);
    setRatio(row * col);
    setNumBomb(numBombs);
    setSize(size);
    setGrid(
      initializeGrid(initializeBomb(numBombs, row * col), row, col, size)
    );
    setEnd(false);
    setTime(0);
    setIsActive(false);
  };

  const easy = () => {
    initializeGame(10, 10, 10, "small");
  };

  const medium = () => {
    initializeGame(15, 15, 35, "medium");
  };

  const hard = () => {
    initializeGame(20, 20, 80, "large");
  };

  const newGame = () => {
    setGrid(initializeGrid(initializeBomb(numBomb, ratio), row, col, size));
    setEnd(false);
    setTime(0);
    setIsActive(false);
  };

  const showRanking = () => {
    setIsShowLB(true);
    setIsActive(false);
  };

  const rankHandleClose = () => {
    setIsShowLB(!isShowLB);
    if (time !== 0 && !end) setIsActive(true);
  };

  const postToRank = (name) => {
    if (name === "") {
      alert("Name can't be empty");
    } else {
      setIsActive(false);
      const dataTime = time.toFixed(2);
      const data = {
        name,
        time: dataTime,
        difficulty: size,
      };
      axios
        .post("https://ranking-django-api.herokuapp.com/records/", data)
        .then((res) => {
          setRanks([...ranks, data]);
          setIsShowLB(true);
          setWin(false);
        });
    }
  };

  return (
    <div className="content-panel">
      <NameModal
        open={win}
        onClose={() => setWin(false)}
        handleSubmit={(name) => postToRank(name)}
        handleClose={() => setWin(false)}
      />

      <EndModal lose={lose} tryAgain={tryAgain} cancel={cancel} />

      <RankingModal
        open={isShowLB}
        onClose={rankHandleClose}
        ranking={ranks}
        difficulty={size}
      />
      <OptionPanel
        easy={easy}
        medium={medium}
        hard={hard}
        newGame={newGame}
        showRanking={showRanking}
      />
      <InfoPanel grid={grid} time={time} />
      {grid.map((row, rowIdx) => {
        return (
          <div key={"d" + rowIdx} className="node-container">
            {row.map((col, colIdx) => {
              return (
                <Node
                  key={rowIdx + " " + colIdx}
                  openNode={(row, col) => openNode(row, col)}
                  putFlag={(row, col, e) => putFlag(row, col, e)}
                  {...col}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const initializeBomb = (numBomb, ratio) => {
  const bombs = [];
  while (bombs.length < numBomb) {
    const idx = Math.ceil(Math.random() * ratio) - 1;
    if (idx < 0) {
      continue;
    }
    if (!bombs.includes(idx)) {
      bombs.push(idx);
    }
  }
  return bombs;
};

const initializeGrid = (bombs, row, col, size) => {
  const grid = [];
  for (let r = 0; r < row; r++) {
    const curRow = [];
    for (let c = 0; c < col; c++) {
      curRow.push({
        row: r,
        col: c,
        isBomb: false,
        isClose: true,
        indicator: 0,
        isFlag: false,
        size: `node-${size}`,
      });
    }
    grid.push(curRow);
  }

  bombs.forEach((bomb) => {
    grid[Math.floor(bomb / row)][bomb % col].isBomb = true;
  });

  grid.forEach((curRow) => {
    curRow.forEach((node) => {
      if (!node.isBomb) {
        node.indicator = calculateIndicatior(
          grid,
          node.row,
          node.col,
          row,
          col
        );
      }
    });
  });
  return grid;
};

const calculateIndicatior = (grid, curRow, curCol, row, col) => {
  let indicator = 0;
  if (curRow > 0) {
    if (curCol > 0 && grid[curRow - 1][curCol - 1].isBomb) {
      indicator++;
    }
    if (grid[curRow - 1][curCol].isBomb) {
      indicator++;
    }
    if (curCol < col - 1 && grid[curRow - 1][curCol + 1].isBomb) {
      indicator++;
    }
  }
  if (curCol > 0 && grid[curRow][curCol - 1].isBomb) {
    indicator++;
  }
  if (curCol < col - 1 && grid[curRow][curCol + 1].isBomb) {
    indicator++;
  }
  if (curRow < row - 1) {
    if (curCol > 0 && grid[curRow + 1][curCol - 1].isBomb) {
      indicator++;
    }
    if (grid[curRow + 1][curCol].isBomb) {
      indicator++;
    }
    if (curCol < col - 1 && grid[curRow + 1][curCol + 1].isBomb) {
      indicator++;
    }
  }
  return indicator;
};

const findAllNeighboorEmptyNode = (
  grid,
  curRow,
  curCol,
  totalRow,
  totalCol
) => {
  const stack = [grid[curRow][curCol]];
  let limit = 0;
  while (stack.length > 0) {
    if (limit > 150) {
      alert("Infinite loop");
      break;
    }
    const node = stack.pop();
    node.isFlag = false;
    if (node.indicator !== 0) {
      continue;
    }
    const row = node.row;
    const col = node.col;
    if (row > 0) {
      if (
        col > 0 &&
        grid[row - 1][col - 1].isClose &&
        !grid[row - 1][col - 1].isBomb
      ) {
        grid[row - 1][col - 1].isClose = false;
        stack.push(grid[row - 1][col - 1]);
      }
      if (!grid[row - 1][col].isBomb && grid[row - 1][col].isClose) {
        grid[row - 1][col].isClose = false;
        stack.push(grid[row - 1][col]);
      }
      if (
        col < totalCol - 1 &&
        !grid[row - 1][col + 1].isBomb &&
        grid[row - 1][col + 1].isClose
      ) {
        grid[row - 1][col + 1].isClose = false;
        stack.push(grid[row - 1][col + 1]);
      }
    }
    if (col > 0 && !grid[row][col - 1].isBomb && grid[row][col - 1].isClose) {
      grid[row][col - 1].isClose = false;
      stack.push(grid[row][col - 1]);
    }
    if (
      col < totalCol - 1 &&
      !grid[row][col + 1].isBomb &&
      grid[row][col + 1].isClose
    ) {
      grid[row][col + 1].isClose = false;
      stack.push(grid[row][col + 1]);
    }
    if (row < totalRow - 1) {
      if (
        col > 0 &&
        grid[row + 1][col - 1].isClose &&
        !grid[row + 1][col - 1].isBomb
      ) {
        grid[row + 1][col - 1].isClose = false;
        stack.push(grid[row + 1][col - 1]);
      }
      if (!grid[row + 1][col].isBomb && grid[row + 1][col].isClose) {
        grid[row + 1][col].isClose = false;
        stack.push(grid[row + 1][col]);
      }
      if (
        col < totalCol - 1 &&
        !grid[row + 1][col + 1].isBomb &&
        grid[row + 1][col + 1].isClose
      ) {
        grid[row + 1][col + 1].isClose = false;
        stack.push(grid[row + 1][col + 1]);
      }
    }
    limit++;
  }
};

const checkVictory = (grid) => {
  return checkBombandFlags(grid) || checkOpenNodes(grid);
};

const checkBombandFlags = (grid) => {
  let result = true;
  grid.forEach((row) => {
    row.forEach((node) => {
      if (!result) {
        return;
      }
      if ((node.isBomb && node.isFlag) || (!node.isBomb && !node.isFlag)) {
        result = true;
      } else {
        result = false;
      }
    });
  });
  return result;
};

const checkOpenNodes = (grid) => {
  let result = true;
  grid.forEach((row) => {
    row.forEach((node) => {
      if (!result) {
        return;
      }
      if (!node.isBomb && node.isClose) {
        result = false;
      }
    });
  });
  return result;
};

const sampleGrid = initializeGrid(initializeBomb(10, 100), 10, 10, "small");
