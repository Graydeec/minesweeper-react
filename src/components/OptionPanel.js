import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export default function OptionPanel({
  easy,
  medium,
  hard,
  newGame,
  showRanking,
}) {
  const classes = useStyles();
  return (
    <div className={classes["modal-content-ele"]}>
      <Button
        className="option-btn"
        variant="contained"
        color="primary"
        onClick={easy}
      >
        Easy
      </Button>
      <Button
        className="option-btn"
        variant="contained"
        color="primary"
        onClick={medium}
      >
        Medium
      </Button>
      <Button
        className="option-btn"
        variant="contained"
        color="primary"
        onClick={hard}
      >
        Hard
      </Button>
      <Button
        className="option-btn"
        variant="contained"
        color="primary"
        onClick={newGame}
      >
        Restart
      </Button>
      <Button
        className="option-btn"
        variant="contained"
        color="primary"
        onClick={showRanking}
      >
        Ranking
      </Button>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  "modal-content-ele": {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
