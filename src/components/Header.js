import React from 'react'
import { makeStyles } from '@material-ui/core'
import {Paper} from '@material-ui/core'
import Flag from '../images/flag.png'
import Timer from '../images/timer.png'

function Header() {
    const classes = useStyle()
    return (
        <Paper className={classes.header}>
            
            <span className={classes.timeFlag}></span>
            <span>Minesweeper</span>
            
            <span className={classes.flagIcon}></span>
        </Paper>
    )
}

export default Header

const useStyle = makeStyles(()=> ({
    header: {
        height: "60px",
        fontSize: "2.2rem",
        fontWeight: "700",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        width: "420px",
        backgroundColor: "gray",
        textTransform: "uppercase",
        fontFamily: "Verdana, sans-serif",
        borderRadius: "10%",
    },
    flagIcon:{
        height: "40px",
        width: "40px",
        backgroundSize: 'cover', 
        backgroundImage: `url(${Flag})`,
    },
    timeFlag: {
        height: "40px",
        width: "40px",
        backgroundImage: `url(${Timer})`,
        backgroundSize: 'cover', 
    }

})) 