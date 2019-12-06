import React from "react";
import { emphasize, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';

const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[300],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[400],
      cursor: "pointer"
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const Sublink = withStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    color: 'inherit',
    fontWeight: 'inherit',
    '&:hover, &:focus': {
      textDecoration: 'inherit',
      color: 'inherit',
    }
  },
}))(Link);

export default function CustomizedBreadcrumbs(props) {
  return (
    <StyledBreadcrumb
      component={Sublink}
      {...props}
    />
  )
}