import React from "react";

export default function Diffculities({ easy, medium, hard }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-content-ele">Difficulties</span>
        <span className="modal-content-ele">
          <button className="modal-difficulty-btn" onClick={easy}>
            Easy
          </button>
          <button className="modal-difficulty-btn" onClick={medium}>
            Medium
          </button>
          <button className="modal-difficulty-btn" onClick={hard}>
            Hard
          </button>
        </span>
      </div>
    </div>
  );
}
