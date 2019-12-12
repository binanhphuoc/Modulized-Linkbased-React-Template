import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";

const useStyles = makeStyles(styles);

export default function RegularButton(props) {
  const classes = useStyles();
  const {
    color,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    classes: propClasses,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [propClasses[size] ? propClasses[size] : classes[size]]: size,
    [propClasses[color] ? propClasses[color] : classes[color]]: color,
    [propClasses[round] ? propClasses[round] : classes.round]: round,
    [propClasses[disabled] ? propClasses[disabled] : classes.disabled]: disabled,
    [propClasses[simple] ? propClasses[simple] : classes.simple]: simple,
    [propClasses[block] ? propClasses[block] : classes.block]: block,
    [propClasses[link] ? propClasses[link] : classes.link]: link,
    [propClasses[justIcon] ? propClasses[justIcon] : classes.justIcon]: justIcon,
    [className]: className
  });
  return (
    <Button {...rest} classes={muiClasses} className={btnClasses}>
      {children}
    </Button>
  );
}

RegularButton.defaultProps = {
  classes: {}
}

RegularButton.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "white",
    "transparent"
  ]),
  size: PropTypes.oneOf(["sm", "lg"]),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.object,
  // use this to pass the classes props from Material-UI
  muiClasses: PropTypes.object,
  children: PropTypes.node,
};
