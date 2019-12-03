import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
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
import List from "components/CustomLists/SelectedListItem.js";

const styles = {
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
  },
};

const useStyles = makeStyles(styles);

export default function DetailView(props) {
  const classes = useStyles();
  const { title, description, fields, collections, selectedCollection, onCollectionSelected } = props;
  return (
    <div>
    <Card>
        <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>{ title }</h4>
            <p className={classes.cardCategoryWhite}>{ description }</p>
        </CardHeader>
        <CardBody>
            <GridContainer>
            {
                fields.map(field => 
                <GridItem key={field.key} xs={12} sm={12} md={12}>
                    <CustomInput
                    labelText={field.label}
                    id={field.key}
                    formControlProps={{
                        fullWidth: true
                    }}
                    inputProps={{
                        disabled: false,
                        defaultValue: field.default
                    }}
                    />
                </GridItem>)
            }
            {/* <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Company (disabled)"
                id="company-disabled"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    disabled: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Username"
                id="username"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Email address"
                id="email-address"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            </GridContainer>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="First Name"
                id="first-name"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Last Name"
                id="last-name"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            </GridContainer>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="City"
                id="city"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Country"
                id="country"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                labelText="Postal Code"
                id="postal-code"
                formControlProps={{
                    fullWidth: true
                }}
                />
            </GridItem>
            </GridContainer>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                <CustomInput
                labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                id="about-me"
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    multiline: true,
                    rows: 5
                }}
                />
            </GridItem> */}
            </GridContainer>
        </CardBody>
        <CardFooter>
            <Button color="warning">Update Profile</Button>
        </CardFooter>
    </Card>
    <Card>
        <CardBody>
            <List 
                listData={collections} 
                selectedItem={selectedCollection}
                onItemSelected={onCollectionSelected}
            />
        </CardBody>
    </Card>
    </div>
  );
}

DetailView.defaultProps = {
    title: '',
    description: '',
    fields: [],
    collections: [],
    selectedCollection: null,
    onCollectionSelected: null,
};

DetailView.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        default: PropTypes.string
    })),
    collections: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.object,
    })),
    selectedCollection: PropTypes.string,
    onCollectionSelected: PropTypes.func
};