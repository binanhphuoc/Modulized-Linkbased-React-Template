import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Breadcrumbs from "components/Breadcrumbs/PopBreadcrumbs.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import CollectionView from "./CollectionView.js";
import DetailView from "./DetailView.js";
import controller from "controllers/Knowledgebase";

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
    detailPath: '',
    controller: null,
    snackbar: {
      status: false,
      message: '',
      color: 'info'
    },
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

  updateDetail = (detailData) => {
    const { controller } = this.state;
    controller.updateDetail(detailData)
    .then(stateData => {
      if (this._isMounted) {
        let resetState = {};
        Object.keys(stateData).map(key => {
          resetState[key] = this.defaultState[key];
        });
        this.setState(resetState, () => {
          this.setState(stateData, () => this.setSnackbar(
            true,
            "Successfully Updated.",
            "success"
          ));
        })
      }
    }).catch(error => {
      console.log(error);
      this.setSnackbar(
        true,
        "Failed to Update Detail.",
        "danger"
      );
    });
  }

  setSnackbar = (status, message, color) => {
    this.setState({snackbar: {
      status,
      message,
      color
    }}, () => setTimeout(() => {
      this.setState({snackbar: {
        status: false,
        message: message,
        color
      }});
    }, 6000))
  }

  onActionClick = (rowId, action) => {
    const { controller } = this.state;
    action === "Delete" && controller.deleteFromCollection(rowId)
    .then((result) => {
      this.setSnackbar(true, "Successfully Deleted.", "success");
      if (result.redirectPath) {
        this.props.history.push(result.redirectPath);
        this.forceUpdate();
      } else if (result.stateData) {
        this.setState(result.stateData);
      }
    }).catch(err => {
      console.log(err);
      this.setSnackbar(true, "Failed to Delete Item.", "danger");
    })
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
      breadcrumbs,
      detailPath,
      snackbar
    } = this.state;
    const {
      onActionClick,
      navigateToCollection,
      navigateToDetail,
      updateDetail,
      setSnackbar
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
            onActionClick={onActionClick}
            onRowClick={navigateToDetail}
            selectedRows={selectedRow !== null ? [selectedRow] : []}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <DetailView
            key={detailPath}
            title={detailTitle}
            description={detailDescription}
            fields={detailFields}
            collections={detailCollections}
            selectedCollection={selectedCollection}
            onCollectionSelected={navigateToCollection}
            onDetailUpdate={updateDetail}
          />
        </GridItem>
        <Snackbar
          place="br"
          color={snackbar.color}
          icon={AddAlert}
          message={snackbar.message}
          open={snackbar.status}
          closeNotification={() => setSnackbar(false, '', 'info')}
          close
        />
      </GridContainer>
    );
  }
}

export default withStyles(styles)(Knowledgebase);
