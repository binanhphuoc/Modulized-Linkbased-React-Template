import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import CollectionView from "./CollectionView.js";
import DetailView from "./DetailView.js";
import models from "variables/models.js";

import avatar from "assets/img/faces/marc.jpg";

const styles = theme => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
});

class Knowledgebase extends React.Component {
  _isMounted = false;
  state = {
    isLoading: true,
    conceptList: {},
    collectionData: {},
    collectionHeader: [],
    collectionTitle: '',
    collectionDescription: '',
    editMode: false,
    selectedRow: null,
  }
  componentDidMount() {
    this._isMounted = true;

    let model = ['',''];
    let pathsToCall = ['',''];

    // Retrieve links to call DB from path
    let path = window.location.pathname.replace("/admin/knowledgebase","").replace(/^\/|\/$/g, '');
    let pathTokens = path.split("/");
    if (pathTokens[0] === "")
      pathTokens[0] = "concepts";
    for (let i = 0; i < pathTokens.length-1; i++) {
      pathsToCall[0] = pathsToCall[0] + "/" + pathTokens[i];
    }
    pathsToCall[1] = pathsToCall[0] + "/" + pathTokens[pathTokens.length-1];
    let detailIndex, collectionIndex;
    if (pathTokens.length % 2 === 0) {
      model[0] = pathTokens[pathTokens.length - 2];
      model[1] = model[0];
      collectionIndex = 0;
      detailIndex = 1;
    }
    else {
      model[0] = pathTokens.length >= 3 ? pathTokens[pathTokens.length - 3] : '';
      model[1] = pathTokens[pathTokens.length - 1];
      collectionIndex = 1;
      detailIndex = 0;
    }
    model[0] = model[0].charAt(0).toUpperCase() + model[0].substring(1,model[0].length-1);
    model[1] = model[1].charAt(0).toUpperCase() + model[1].substring(1,model[1].length-1);

    axios.get("/api/solverapp/knowledgebase" + pathsToCall[collectionIndex])
    .then(collectionResults => {
      const modelName = model[collectionIndex];
      const attributes = models[modelName].filter(attribute => !attribute.hiddenInTable);
      const formattedCollectionData = collectionResults.data.reduce((obj, item) => {
        obj[item._id] = attributes.map(attribute => (item[attribute.key]));
        return obj;
      }, {});
      // prevent setting state if component is unmounted
      if (this._isMounted) {
        this.setState({
          isLoading: false,
          collectionData: formattedCollectionData,
          collectionHeader: attributes.map(attribute => attribute.label),
          collectionTitle: modelName+'s',
          collectionDescription: 'List of concepts of the knowledgebase'
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

  navigateToConceptDetail = (id) => {
    this.props.history.push(`/admin/knowledgebase/concepts/${id}`);
  }

  onRowClick = (id) => {
    this.setState({selectedRow: id})
  }

  render() {
    const { classes } = this.props;
    const { 
      collectionHeader, 
      collectionData, 
      collectionTitle,
      collectionDescription, 
      selectedRow
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            Material-UI > Breadcrumbs > Expansion Panel for Sidebar > 
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <CollectionView
              tableTitle={collectionTitle}
              tableDescription={collectionDescription}
              tableHead={collectionHeader}
              tableData={collectionData}
              onRowClick={this.onRowClick}
              selectedRows={selectedRow !== null ? [selectedRow] : []}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <DetailView/>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Knowledgebase);
