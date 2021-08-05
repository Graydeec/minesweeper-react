import { Modal } from "@material-ui/core";
import React from "react";

import { useStyle } from "./styles";

function RankingModal({ open, onClose, ranking, difficulty }) {
  const diffiRank = ranking.filter((rank) => rank.difficulty === difficulty);

  const classes = useStyle();
  const sortedRanking = diffiRank
    .sort((a, b) => {
      return a.time - b.time;
    })
    .slice(0, 10);

  return (
    <Modal className={classes.modal} open={open} onClose={onClose}>
      <div className="leader-board-modal">
        <div id="ranking">
          <div className="leader-board-content">
            Ranking(
            {difficulty === "small"
              ? "Easy"
              : difficulty === "medium"
              ? "Medium"
              : "Hard"}
            )
          </div>
          <table className="leader-board-table">
            <thead>
              <tr>
                <th className="leader-board-ranking-header">Name</th>
                <th className="leader-board-ranking-header">Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedRanking.map((rank, idx) => (
                <tr key={idx}>
                  <td className="leader-board-ranking-item">{rank.name}</td>
                  <td className="leader-board-ranking-item">{rank.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default RankingModal;
