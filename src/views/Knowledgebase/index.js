import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Breadcrumbs from "components/Breadcrumbs/PopBreadcrumbs.js";

import CollectionView from "./CollectionView.js";
import DetailView from "./DetailView.js";
import controller from "controllers/Knowledgebase";

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
  defaultState = {
    isLoading: true,
    collectionData: {},
    collectionHeader: [],
    collectionTitle: '',
    collectionDescription: '',
    detailTitle: '',
    detailDescription: '',
    detailFields: [],
    detailCollections: [],
    editMode: false,
    selectedRow: null,
    selectedCollection: null,
    breadcrumbs: [],
    location: '',
    controller: null,
  };

  state = this.defaultState;

  componentDidUpdate() {
    // will be true
    if (this.props.location.pathname === "/admin/knowledgebase" || this.props.location.pathname === "/admin/knowledgebase/"){
      this.props.history.push("/admin/knowledgebase/concepts");
      this._isMounted && this.forceUpdate();
      return;
    }
    if (this.state.location !== this.props.location.pathname) {
      let serializer = controller(this.props.location.pathname);
      if (serializer.is_valid()) {
        serializer.fetchData((data) => {
          if (this._isMounted) {
            let resetState = {};
            Object.keys(data).map(key => {
              resetState[key] = this.defaultState[key];
            });
            this.setState(resetState, () => {
              this.setState(data);
            })
          }
        });
      }
      if (this.state.controller === null)
        this.state.controller = serializer;
      this.state.location = this.props.location.pathname;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (window.location.pathname === "/admin/knowledgebase" || window.location.pathname === "/admin/knowledgebase/"){
      this.props.history.push("/admin/knowledgebase/concepts");
    }
    this._isMounted && this.forceUpdate();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleEditMode = () => {
    const { editMode } = this.state;
    this.setState({editMode: !editMode})
  }

  navigateToDetail = (rowId) => {
    const { controller } = this.state;
    const detailPath = controller.currentCollectionPath() + "/" + rowId;
    this.props.history.push(detailPath);
    this.forceUpdate();
  }

  navigateToCollection = (collectionKey) => {
    const { controller } = this.state;
    const collectionPath = controller.currentDetailPath() + "/" + collectionKey;
    this.props.history.push(collectionPath);
    this.forceUpdate();
  }

  render() {
    const { classes } = this.props;
    const { 
      collectionHeader, 
      collectionData, 
      collectionTitle,
      collectionDescription,
      selectedRow,
      detailTitle,
      detailDescription,
      detailFields,
      detailCollections,
      selectedCollection,
      breadcrumbs
    } = this.state;
    const {
      navigateToCollection,
      navigateToDetail
    } = this;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Breadcrumbs navigationData={breadcrumbs}/>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <CollectionView
            tableTitle={collectionTitle}
            tableDescription={collectionDescription}
            tableHead={collectionHeader}
            tableData={collectionData}
            onRowClick={navigateToDetail}
            selectedRows={selectedRow !== null ? [selectedRow] : []}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <DetailView
            title={detailTitle}
            description={detailDescription}
            fields={detailFields}
            collections={detailCollections}
            selectedCollection={selectedCollection}
            onCollectionSelected={navigateToCollection}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(Knowledgebase);
