import React from 'react';
import { emphasize, withStyles, makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[300],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[400],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const LinkBreadcrumb = withStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(1),
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      textDecoration: "underline",
      color: "DodgerBlue",
      cursor: "pointer"
    },
    '&:active': {
      color: "#0066FF"
    },
  },
}))(Box);

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  part: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function CustomizedBreadcrumbs() {
  const classes = useStyles();
  return (
    <Breadcrumbs className={classes.root} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      <div className={classes.part}>
        <StyledBreadcrumb
          //component="a"
          href="#"
          label="Concepts"
          icon={<HomeIcon fontSize="small" />}
          onClick={handleClick}
        />
        <LinkBreadcrumb fontSize={15}>
          Movement
        </LinkBreadcrumb>
      </div>
      <div className={classes.part}>
        <StyledBreadcrumb
          //component="a"
          href="#"
          label="Equations"
          icon={<HomeIcon fontSize="small" />}
          onClick={handleClick}
        />
        <LinkBreadcrumb fontSize={15}>
          Velocity vs Time
        </LinkBreadcrumb>
      </div>
    </Breadcrumbs>
  );
}