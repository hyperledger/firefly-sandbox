import { Typography, useTheme } from '@mui/material';
import { ResourceUrls } from '../../../constants/ResourceUrls';

export const InstallSolcInstructions = () => {
  const theme = useTheme();

  return (
    <>
      {/* Follow the steps here to install solc */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - Follow the steps{' '}
        <a
          href={ResourceUrls.solidityInstall}
          target="_blank"
          style={{ color: theme.palette.warning.main }}
        >
          here
        </a>{' '}
        to install{' '}
        <pre
          style={{
            fontSize: 14,
            display: 'inline',
            backgroundColor: theme.palette.text.disabled,
          }}
        >
          solc
        </pre>
        .
      </Typography>
      {/* Once installed, verify the installation by running: */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - Once installed, verify the installation by running:
      </Typography>
      {/* solc --version */}
      <Typography sx={{ fontSize: 14 }} component="div">
        <pre
          style={{
            fontSize: 14,
            display: 'inline',
            backgroundColor: theme.palette.text.disabled,
          }}
        >
          solc --version
        </pre>
        .
      </Typography>
    </>
  );
};

export const CompileSCInstructions = () => {
  const theme = useTheme();

  return (
    <>
      {/* If you don't have a smart contract, use our sample SimpleStorage smart 
            contract here and name it simple_storage.sol */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - If you don't have a smart contract, use our sample{' '}
        <pre
          style={{
            fontSize: 14,
            display: 'inline',
          }}
        >
          SimpleStorage
        </pre>{' '}
        smart contract{' '}
        <a
          href={ResourceUrls.fireflyTutorialExampleSC}
          target="_blank"
          style={{ color: theme.palette.warning.main }}
        >
          here
        </a>{' '}
        and name it{' '}
        <pre
          style={{
            fontSize: 14,
            display: 'inline',
            backgroundColor: theme.palette.text.disabled,
          }}
        >
          simple_storage.sol
        </pre>
        .
      </Typography>
      {/* Compile the smart contract with solc: */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - Compile the smart contract with{' '}
        <pre
          style={{
            fontSize: 14,
            display: 'inline',
          }}
        >
          solc
        </pre>
        :
      </Typography>
      {/* solc --combined-json abi,bin simple_storage.sol > simple_storage.json */}
      <Typography sx={{ fontSize: 14 }} component="div">
        <pre
          style={{
            fontSize: 14,
            backgroundColor: theme.palette.text.disabled,
          }}
        >
          solc --combined-json abi,bin simple_storage.sol &gt;
          simple_storage.json
        </pre>
      </Typography>
    </>
  );
};

export const DeployContractInstructions = () => {
  const theme = useTheme();

  return (
    <>
      {/* To deploy the compiled contract to FireFly, run: */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - To deploy the compiled contract to FireFly, run:
      </Typography>
      <pre
        style={{
          fontSize: 14,
          backgroundColor: theme.palette.text.disabled,
        }}
      >
        {/* ff deploy <ethereum | fabric> <STACK_NAME> simple_storage.json */}
        ff deploy &lt;ethereum | fabric&gt; &lt;STACK_NAME&gt;
        simple_storage.json
      </pre>
      {/* The CLI will print your contract's blockchain address. We will use
        this when registering the contract's API. */}
      <Typography sx={{ fontSize: 14 }} component="div">
        - The CLI will print your contract's blockchain address. We will use
        this when registering the contract's API.
      </Typography>
    </>
  );
};
