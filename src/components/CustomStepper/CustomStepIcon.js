import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

import { 
    primaryColor,
    warningColor,
    dangerColor,
    successColor,
    infoColor,
    roseColor,
    grayColor,
    blackColor,
    whiteColor,
  } from "assets/jss/material-dashboard-react.js";
import { minWidth } from '@material-ui/system';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: roseColor[1],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "25px",
        height: "25px",
        borderRadius: "100%",
        color: whiteColor
    },
    inactive: {
        backgroundColor: grayColor[1]
    },
}));

export default function CustomStepIcon(props) {
    const defaultClasses = useStyles();
    const {
        active,
        completed,
        error,
        icon: IconComponent,
        classes
    } = props;
    const iconStyles = classNames({
        [classes.root ? classes.root : defaultClasses.root]: true,
        [classes.inactive ? classes.inactive : defaultClasses.inactive]: !active && !completed,
    });
    return (
        <div
            className={iconStyles}
        >
            { !completed && IconComponent}
            { completed && <CheckIcon/>}
        </div>
    )
}

CustomStepIcon.defaultProps = {
    classes: {}
}

CustomStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    error: PropTypes.bool,
    icon: PropTypes.node.isRequired,
}