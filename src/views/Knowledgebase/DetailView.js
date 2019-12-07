import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
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
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
});

class DetailView extends React.Component {
    render() {
        const { classes, title, description, fields, collections, selectedCollection, onCollectionSelected } = this.props;
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
                                    defaultValue: field.default,
                                    readOnly:true
                                }}
                            />
                        </GridItem>)
                    }
                    </GridContainer>
                </CardBody>
                <CardFooter>
                    <Button color="warning">Update Profile</Button>
                </CardFooter>
            </Card>
            { collections.length > 0 &&
            <Card>
                <CardBody style={{paddingLeft: 0, paddingRight:0}}>
                    <List 
                        listData={collections} 
                        selectedItem={selectedCollection}
                        onItemSelected={onCollectionSelected}
                    />
                </CardBody>
            </Card>}
            </div>
        );
    }
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

export default withStyles(styles)(DetailView);