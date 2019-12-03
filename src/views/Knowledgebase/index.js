import React from "react";
import { withRouter } from "react-router-dom";
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
import meta from "serializers/meta.js";
import models from "serializers/models.js";

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
    detailFields: [],
    editMode: false,
    selectedRow: null,
  }

  componentDidMount() {
    this._isMounted = true;
    if (window.location.pathname === "/admin/knowledgebase" || window.location.pathname === "/admin/knowledgebase/")
      this.props.history.push("/admin/knowledgebase/concepts");
    const { paths, model, detailIndex, collectionIndex } = meta();
    axios.get("/api/solverapp/knowledgebase" + paths[collectionIndex])
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
          collectionData: formattedCollectionData,
          collectionHeader: attributes.map(attribute => attribute.label),
          collectionTitle: modelName+'s',
          collectionDescription: 'List of concepts of the knowledgebase'
        })
      }
    }).catch(error => {
      console.log(error);
    });
    
    paths[detailIndex] !== '' && axios.get("/api/solverapp/knowledgebase" + paths[detailIndex])
    .then(detailResult => {
      const modelName = model[detailIndex];
      const editableFields = models[modelName].filter(attribute => !attribute.isCollection)
        .map(attribute => {
          attribute.default = detailResult.data[attribute.key];
          return attribute;
        });
      const collectionFields = models[modelName].filter(attribute => attribute.isCollection);
      if (this._isMounted) {
        this.setState({
          detailFields:[],
          detailCollections: [],
        }, () => {this.setState({
          detailFields: editableFields,
          detailCollections: collectionFields,
        })})
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

  navigateToDetail = (id) => {
    {
      const { paths, collectionIndex } = meta();
      const detailPath = paths[collectionIndex] + "/" + id;
      this.props.history.push("/admin/knowledgebase"+detailPath);
    }
    const { paths, model, detailIndex } = meta();
    paths[detailIndex] !== '' && axios.get("/api/solverapp/knowledgebase" + paths[detailIndex])
    .then(detailResult => {
      const modelName = model[detailIndex];
      const editableFields = models[modelName].filter(attribute => !attribute.isCollection)
        .map(attribute => {
          attribute.default = detailResult.data[attribute.key];
          return attribute;
        });
      const collectionFields = models[modelName].filter(attribute => attribute.isCollection);
      if (this._isMounted) {
        this.setState({
          detailFields:[],
          detailCollections: [],
        }, () => {this.setState({
          detailFields: editableFields,
          detailCollections: collectionFields,
        })})
      }
    }).catch(error => {
      console.log(error);
    });
  }

  navigateToCollection = (collectionKey) => {
    {
      const { paths, detailIndex } = meta();
      const collectionPath = paths[detailIndex] + "/" + collectionKey;
      this.props.history.push("/admin/knowledgebase"+collectionPath);
    }
    const { paths, model, collectionIndex } = meta();
    axios.get("/api/solverapp/knowledgebase" + paths[collectionIndex])
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

  onRowClick = (id) => {
    this.navigateToDetail(id);
    this.setState({selectedRow: id});
  }

  onCollectionSelected = (key) => {
    this.navigateToCollection(key)
    this.setState({selectedCollection: key});
  }

  render() {
    const { classes } = this.props;
    const { 
      collectionHeader, 
      collectionData, 
      collectionTitle,
      collectionDescription,
      selectedRow,
      detailFields,
      detailCollections,
      selectedCollection
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
            <DetailView
              title="Detail"
              description="Here is a little bit detail"
              fields={detailFields}
              collections={detailCollections}
              selectedCollection={selectedCollection}
              onCollectionSelected={this.onCollectionSelected}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Knowledgebase));
