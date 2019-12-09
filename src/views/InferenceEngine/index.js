import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Tabs from "components/CustomTabs/CustomTabs.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import Stepper from "components/CustomStepper/CustomStepper.js";

import ProblemView from "./ProblemView.js";

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
    // If route not found, reroute to ... and return

    //
    if (this.state.location !== this.props.location.pathname) {
      // Handle data logic here based on this.props.location.pathname

      this.state.location = this.props.location.pathname;
    }
  }

  componentDidMount() {
    this._isMounted = true;
    // Pre-check routes
    // If route not found, reroute to ...
    this._isMounted && this.forceUpdate();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
        <Tabs
          //title="Tasks:"
          headerColor="rose"
          tabs={[
            {
              tabName: "Solution",
              tabIcon: BugReport,
              tabContent: (
                <Stepper
                  stepData={[{
                    label: "Find a",
                    content: <div>a = v / t</div>
                  },{
                    label: "Find m",
                    content: "m = F / a"
                  }]}
                />
              )
            },
            {
              tabName: "History",
              tabIcon: Code,
              tabContent: (
                <div>
                  History
                </div>
              )
            }
          ]}
        />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <ProblemView
            title="Define Problem"
            description="Enter a problem and select the domain for the solver"
            fields={[{
              key: "domain",
              label: "Knowledge Domain",
              default: null
            },
            {
              key: "hypothesis",
              label: "Given Facts",
              default: "[(F,20), (v, 7), (t,8)]"
            },
            {
              key: "goal",
              label: "Variables to Solve for",
              default: "[m]"
            }]}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(Knowledgebase);
