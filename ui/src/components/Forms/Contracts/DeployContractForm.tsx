import { LaunchOutlined } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceUrls } from '../../../constants/ResourceUrls';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { BLOCKCHAIN_TYPE } from '../../../enums/enums';
import {
  CompileSCInstructions,
  DeployContractInstructions,
  InstallSolcInstructions,
} from './DeployContractStepper';

export const DeployContractForm: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { blockchainPlugin } = useContext(ApplicationContext);
  const steps = [
    {
      label: i18next.t('installSolc'),
      description: <InstallSolcInstructions />,
      link: ResourceUrls.solidityInstall,
    },
    {
      label: i18next.t('compileSmartContract'),
      description: <CompileSCInstructions />,
      link: ResourceUrls.fireflyTutorialExampleSC,
    },
    {
      label: i18next.t('deployCompiledContract'),
      description: <DeployContractInstructions />,
      link: ResourceUrls.fireflyTutorialDeployContract,
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

  return blockchainPlugin !== BLOCKCHAIN_TYPE.FABRIC ? (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
              <IconButton
                color="secondary"
                disableRipple
                disableFocusRipple
                onClick={() => window.open(step.link)}
                size="small"
              >
                <LaunchOutlined sx={{ fontSize: '20px' }} />
              </IconButton>
            </StepLabel>
            <StepContent>
              {step.description}
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  color="success"
                >
                  <Typography sx={{ textTransform: 'none' }}>
                    {index === steps.length - 1 ? t('finish') : t('continue')}
                  </Typography>
                </Button>
                <Button
                  disabled={index === 0}
                  sx={{ ml: 1 }}
                  onClick={handleBack}
                  variant="outlined"
                >
                  <Typography sx={{ textTransform: 'none' }}>
                    {t('back')}
                  </Typography>
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ pl: 3 }}>
          <Typography>{t('contractDeployedToFirefly')}</Typography>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1, textTransform: 'none' }}
            color="success"
          >
            {t('backToStepOne')}
          </Button>
        </Paper>
      )}
    </Box>
  ) : (
    <Typography sx={{ fontSize: 14 }} component="div">
      Follow the steps{' '}
      <a
        href={ResourceUrls.fireflyTutorialDeployContractFabric}
        target="_blank"
        style={{ color: theme.palette.warning.main }}
      >
        here
      </a>{' '}
      to deploy a chaincode to the Fabric blockchain.
    </Typography>
  );
};
