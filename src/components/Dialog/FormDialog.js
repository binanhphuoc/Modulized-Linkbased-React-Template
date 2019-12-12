import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";

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
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  textField: {
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	width: 200,
  },
  dialogPaper: {
    boxShadow: "none",
    backgroundColor: "transparent"
  },
});

const useStyles = makeStyles(styles);

export default function FormDialog(props) {
  const { open, onClose, title, description, actionLabel, onActionClick, fields } = props;
  const classes = useStyles();
  let values = {};
  const onValueChange = (key, value) => {
    values[key] = value;
  }
  return (
      <Dialog open={open} onClose={() => {onClose && onClose()}} aria-labelledby="form-dialog-title"
        classes={{
          root: classes.dialogRoot,
          paper: classes.dialogPaper
        }}
      >
        <Card>
				<CardHeader color="primary" className={classes.cardHeader}>
					<div style={{overflow: "hidden"}}>
						<h4 className={classes.cardTitleWhite}>{title}</h4>
						<p className={classes.cardCategoryWhite}>{description}</p>
					</div>
				</CardHeader>
				<CardBody>
					<GridContainer>
          {
            fields.map(field => (
              <GridItem key={field.key} xs={12} sm={12} md={12}>
                <CustomInput
                  labelText={field.label}
                  id={field.key}
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: false,
                    onChange: (e) => {onValueChange(field.key, e.target.value)}
                  }}
                />
              </GridItem>
            ))
          }
					</GridContainer>
				</CardBody>
        <CardFooter className={classes.cardFooter}>
          <Button
            color="transparent"
            onClick={() => {onClose && onClose()}}
          >
            <div style={{fontWeight:"bold", fontSize: "14px"}}>
              Cancel
            </div>
          </Button>
          <Button 
            color="warning"
            onClick={() => {onActionClick && onActionClick(values)}}
          >
            <div style={{fontWeight:"bold", fontSize: "14px"}}>
              {actionLabel}
            </div>
          </Button>
        </CardFooter>
			</Card>
      </Dialog>
  );
}

FormDialog.defaultProps = {
  open: false,
  onClose: null,
  title: '',
  description: '',
  actionLabel: 'Action',
  fields: []
}

FormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onActionClick: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }))
}