import React from "react";
import { Modal, makeStyles } from "@material-ui/core";

function RankingModal({ ranking }) {
  const sortedRanking = ranking
    .sort((a, b) => {
      return a.time - b.time;
    })
    .slice(0, 10);
  const classes = useStyle();
  return (
    <div className="leader-board-modal">
      <div id="ranking">
        <div className="leader-board-content">Ranking</div>
        <table className="leader-board-table">
          <tr>
            <th className="leader-board-ranking-header">Name</th>
            <th className="leader-board-ranking-header">Time</th>
          </tr>
          {sortedRanking.map((rank) => (
            <tr>
              <td className="leader-board-ranking-item">{rank.name}</td>
              <td className="leader-board-ranking-item">{rank.time}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default RankingModal;

const useStyle = makeStyles(() => ({
  modal: {
    width: "100",
    height: "100%",
  },
}));
