import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';
import Button from "components/CustomButtons/Button.js";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

class CustomTable extends React.Component {

  state = {
    actionHover: false
  }

  toggleActionHover = () => {
    this.setState({actionHover: !this.state.actionHover});
  }

  render() {
    const { classes, tableHead, tableData, tableHeaderColor, tableActions, onRowClick, onActionClick, onIdClick, showId, editMode, hover, selectedRows } = this.props;
    const { actionHover } = this.state;
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? (
            <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                { showId ? <TableCell 
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key="_id">
                    ID
                </TableCell> : null}
                {tableHead.map((prop, key) => {
                  return (
                    <TableCell
                      className={classes.tableCell + " " + classes.tableHeadCell}
                      key={key}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
                {editMode ? <TableCell
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key="action"
                >
                  Actions
                </TableCell> : null}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {Object.entries(tableData).map(([key, prop]) => {
              return (
                <TableRow 
                  key={key} 
                  className={classes.tableBodyRow}
                  hover={hover}
                  selected={selectedRows.includes(key)}
                  onClick={() => { !actionHover && onRowClick && onRowClick(key) }}
                >
                  { showId ? <TableCell 
                    className={classes.tableCell}
                    key="_id">
                      <Link href="" variant="body2" onClick={() => { onIdClick && onIdClick(key) }}>
                        {key}
                      </Link>
                  </TableCell> : null}
                  {prop.map((prop, key) => {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  })}
                  {editMode ?
                  <TableCell 
                    style={{padding:0}}
                    key="action"
                  >
                    {tableActions.map(action => {
                      return (
                        <Tooltip
                          key={action.name}
                          id="tooltip-top"
                          title={action.name}
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            onMouseEnter={this.toggleActionHover}
                            onMouseLeave={this.toggleActionHover}
                            onClick={() => {actionHover && onActionClick && onActionClick(key, action.name)}}
                          >
                            <action.icon fontSize="small"/>
                          </IconButton>
                        </Tooltip>
                      )
                    })}
                  </TableCell> : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  onRowClick: null,
  onActionClick: null,
  onIdClick: null,
  selectedRows: []
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  tableActions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired
    }).isRequired
  ),
  onRowClick: PropTypes.func,
  onActionClick: PropTypes.func,
  onIdClick: PropTypes.func,
  showId: PropTypes.bool,
  editMode: PropTypes.bool,
  hover: PropTypes.bool,
  selectedRows: PropTypes.arrayOf(PropTypes.string)
};

export default withStyles(styles)(CustomTable);