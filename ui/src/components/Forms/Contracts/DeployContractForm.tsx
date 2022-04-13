import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import { useTranslation } from 'react-i18next';

export const DeployContractForm: React.FC = () => {
  const { t } = useTranslation();
  const steps = [
    {
      label: 'Install the Solidity Compiler',
      description: `We first need the solc compiler to compile our smart contract. Follow the steps in the link to install the solc compiler. There are a couple of different ways to install the solc compiler. Open your Terminal and type "solc --version" to verify that the installation was successful.`,
      link: 'https://docs.soliditylang.org/en/v0.8.13/installing-solidity.html',
    },
    {
      label: 'Compile your smart contract',
      description:
        'Compile your own smart contract or use our sample simple-storage smart contract provided in the link. Copy and save the sample smart contract to a file called simple_storage.sol. Then, run "solc --combined-json abi,bin simple_storage.sol > simple_storage.json".',
      link: 'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#example-smart-contract',
    },
    {
      label: 'Deploy your compiled contract',
      description: `Lastly, you will tell FireFly to deploy the compiled contract to your running stack. Run "ff deploy <FF_STACK_NAME> simple_storage.json". You should receive a contract address back, which we will use while registering a contract API.`,
      link: 'https://hyperledger.github.io/firefly/gettingstarted/custom_contracts.html#contract-deployment',
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
              <Button
                variant="text"
                disableRipple
                disableFocusRipple
                sx={{ ':hover': { background: 'inherit' } }}
                onClick={() => {
                  window.open(step.link);
                }}
              >
                {' '}
                <LinkIcon />{' '}
              </Button>
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            You should now have an address for your deployed contract!
          </Typography>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1, textTransform: 'none' }}
          >
            {t('backToStepOne')}
          </Button>
        </Paper>
      )}
    </Box>
  );
};
