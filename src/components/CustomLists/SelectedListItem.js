import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class SelectedListItem extends React.Component {

  render() {
    const { classes, listData, selectedItem, onItemSelected } = this.props;
    return (
      <div className={classes.root}>
        <List style={{padding:0}} component="nav" aria-label="main mailbox folders">
          {listData.map((itemMeta, index) => (
            <div key={itemMeta.key}>
              <ListItem
                button
                selected={selectedItem === itemMeta.key}
                onClick={() => {onItemSelected && onItemSelected(itemMeta.key)}}
              >
                {itemMeta.icon && 
                <ListItemIcon>
                  <itemMeta.icon/>
                </ListItemIcon>}
                <h4 style={{margin:0, fontSize:"16px"}}>{itemMeta.label}</h4>
              </ListItem>
              {index !== (listData.length-1) && <Divider />}
            </div>
          ))}
          
        </List>
      </div>
    );
  }
}

SelectedListItem.defaultProps = {
  listData: [],
  selectedItem: null,
  onItemSelected: null
}

SelectedListItem.propTypes = {
  listData: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.object,
  })),
  selectedItem: PropTypes.string,
  onItemSelected: PropTypes.func
}

export default withStyles(styles)(SelectedListItem);