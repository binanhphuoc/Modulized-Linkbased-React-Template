import React from 'react';
import PropTypes from 'prop-types';
import { emphasize, withStyles, makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

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
}))(Link);

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

function handleClick(event, path) {
  event.preventDefault();
  console.info(path);
}

export default function CustomizedBreadcrumbs(props) {
  const classes = useStyles();
  const { navigationData } = props;
  return (
    <Breadcrumbs className={classes.root} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {
        navigationData.map((nav, index) => {
          if (index % 2 !== 0)
            return null;
          const { icon: iconComponent } = navigationData[index];
          return (
            <div className={classes.part} key={index}>
              <StyledBreadcrumb
                component={Sublink}
                href={navigationData[index].path ? navigationData[index].path : ''}
                label={navigationData[index].label ? navigationData[index].label : ''}
                icon={iconComponent ? <iconComponent fontSize="small" /> : null}
              />
              { index + 1 < navigationData.length && 
                <LinkBreadcrumb 
                href={navigationData[index+1].path ? navigationData[index+1].path : ''} 
                fontSize={15}
                >
                  {navigationData[index+1].label}
                </LinkBreadcrumb>
              }
            </div>
          );
        })
      }
    </Breadcrumbs>
  );
}

CustomizedBreadcrumbs.defaultProps = {
  navigationData: [],
}

CustomizedBreadcrumbs.propTypes = {
  navigationData: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.object
  }))
}