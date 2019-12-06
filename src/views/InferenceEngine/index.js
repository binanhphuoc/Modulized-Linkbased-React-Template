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
import meta from "serializers/meta.js";
import models from "serializers/models.js";
import serializer from "serializers";

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
    location: ''
  }

  componentDidUpdate() {
    // will be true
    if (this.state.location !== this.props.location.pathname) {
      // Handle data logic here based on this.props.location.pathname

      this.state.location = this.props.location.pathname;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.forceUpdate();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
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
            title="Detail"
            description="Here is a little bit detail"
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
