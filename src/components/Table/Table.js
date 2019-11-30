import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor, tableActions, onItemClick, onActionClick, showId, editMode } = props;
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
                hover={onItemClick !== null && !editMode}
                onClick={() => { !editMode && onItemClick && onItemClick(key) }}
              >
                { showId ? <TableCell 
                  className={classes.tableCell}
                  key="_id">
                    {key}
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
                        <IconButton onClick={() => {onActionClick && onActionClick(key, action.name)}}>
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

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  onItemClick: null,
  onActionClick: null
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
  onItemClick: PropTypes.func,
  onActionClick: PropTypes.func,
  showId: PropTypes.bool,
  editMode: PropTypes.bool
};
