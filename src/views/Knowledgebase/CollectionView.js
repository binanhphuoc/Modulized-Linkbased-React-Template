import React from "react";
import axios from "axios";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { convertCompilerOptionsFromJson } from "typescript";
import { Icon } from "@material-ui/core";

const styles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableRow: {
    cursor: "pointer"
  }
});

class TableList extends React.Component {
  _isMounted = false;
  state = {
    isLoading: true,
    editMode: false
  }

  toggleEditMode = () => {
    const { editMode } = this.state;
    this.setState({editMode: !editMode})
  }
  
  render() {
    const { classes, tableTitle, tableDescription, tableHead, tableData, onActionClick, onRowClick, selectedRows } = this.props;
    const { editMode } = this.state;
    return (
        <Card>
            <CardHeader color="primary" className={classes.cardHeader}>
                <div>
                <h4 className={classes.cardTitleWhite}>{tableTitle}</h4>
                <p className={classes.cardCategoryWhite}>
                    { tableDescription }
                </p>
                </div>
                <Button variant="contained" color="transparent" onClick={this.toggleEditMode}>
                {!editMode ? "Show Actions" : "Cancel"}
                </Button>
            </CardHeader>
            <CardBody>
                <Table
                // tableHeaderColor="primary"
                tableHead={tableHead}
                tableData={tableData}
                tableActions={[{
                    name: "Delete",
                    icon: DeleteIcon,
                }]}
                onActionClick={onActionClick}
                onRowClick={onRowClick}
                editMode={editMode}
                selectedRows={selectedRows}
                hover
                classes={{
                  tableBodyRow: classes.tableRow
                }}
                />
            </CardBody>
        </Card>
    );
  }
}

export default withStyles(styles)(TableList);