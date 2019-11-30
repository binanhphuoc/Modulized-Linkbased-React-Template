import React from "react";
import { useParams } from "react-router-dom";
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
import IconButton from '@material-ui/core/IconButton';
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
    justifyContent: "space-between"
  }
});

class TableList extends React.Component {
  _isMounted = false;
  state = {
    isLoading: true,
    conceptList: {},
    editMode: false
  }
  componentDidMount() {
    this._isMounted = true;
  
    axios.get("/api/solverapp/knowledgebase/concepts")
    .then(concepts => {
      const formattedConceptData = concepts.data.reduce((obj, item) => {
        obj[item._id] = [item.name];
        return obj;
      }, {});
      if (this._isMounted) {
        this.setState({
          isLoading: false,
          conceptList: formattedConceptData
        })
      }
    }).catch(error => {
      console.log(error);
    });
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleEditMode = () => {
    const { editMode } = this.state;
    this.setState({editMode: !editMode})
  }
  
  render() {
    const { classes } = this.props;
    const { conceptList, editMode } = this.state;
    return (
      <GridContainer>
        <div>Movement / </div>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" className={classes.cardHeader}>
              <div>
                <h4 className={classes.cardTitleWhite}>Concepts</h4>
                <p className={classes.cardCategoryWhite}>
                  List of all concepts in the knowledgebase
                </p>
              </div>
              <IconButton onClick={this.toggleEditMode}>
                <EditIcon fontSize="large"/>
              </IconButton>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Name"]}
                tableData={conceptList}
                tableActions={[{
                  name: "Delete",
                  icon: DeleteIcon
                },
                {
                  name: "Edit",
                  icon: EditIcon
                }]}
                onActionClick={(entry, action) => {console.log(`${entry}:${action}`)}}
                onItemClick={(item) => {console.log(item)}}
                showId
                editMode={editMode}
              />
            </CardBody>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Table on Plain Background
              </h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Name", "Country", "City", "Salary"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                  [
                    "4",
                    "Philip Chaney",
                    "$38,735",
                    "Korea, South",
                    "Overland Park"
                  ],
                  [
                    "5",
                    "Doris Greene",
                    "$63,542",
                    "Malawi",
                    "Feldkirchen in Kärnten"
                  ],
                  ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>
    );
  }
}

export default withStyles(styles)(TableList);