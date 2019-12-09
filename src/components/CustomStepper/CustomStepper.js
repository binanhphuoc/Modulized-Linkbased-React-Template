import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from 'components/CustomButtons/Button';

import CustomStepIcon from './CustomStepIcon';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps(stepData) {
  return stepData.map(step => step.label);
}

function getStepContent(step, stepData) {
  if (step < stepData.length)
    return stepData[step].content;
  return 'Unknown step';
}

export default function VerticalLinearStepper(props) {
  const classes = useStyles();
  const { stepData } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps(stepData);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
          <StepLabel 
            StepIconComponent={CustomStepIcon}
          >
            {label}
          </StepLabel>
            <StepContent>
              <Typography>{getStepContent(index,stepData)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    color="transparent"
                    size="sm"
                    round
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    muiClasses={{
                      root: classes.button
                    }}
                  >
                    <div style={{fontWeight:"bold", fontSize: "14px"}}>
                      Back
                    </div>
                  </Button>
                  <Button
                    size="sm"
                    round
                    variant="contained"
                    color="warning"
                    onClick={handleNext}
                    muiClasses={{
                      root: classes.button
                    }}
                  >
                    <div style={{fontWeight:"bold", fontSize: "14px"}}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </div>
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button 
            round color="warning"
            size="sm" 
            onClick={handleReset} 
            muiClasses={{
              root: classes.button
            }}
          >
            <div style={{fontWeight:"bold", fontSize: "14px"}}>
              Reset
            </div>
          </Button>
        </Paper>
      )}
    </div>
  );
}

VerticalLinearStepper.defaultProps = {
  stepData: []
}

VerticalLinearStepper.propTypes = {
  stepData: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired
  }))
}