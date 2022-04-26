import { Box, Modal, Typography, useTheme } from '@mui/material';
import { ResourceUrls } from '../../constants/ResourceUrls';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

interface Props {
  isOpen: boolean;
  handleModalOpen: (open: boolean) => void;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: DEFAULT_BORDER_RADIUS,
};

export const InstructionModal: React.FC<Props> = ({
  isOpen,
  handleModalOpen,
}) => {
  const theme = useTheme();

  return (
    <Modal open={isOpen} onClose={() => handleModalOpen(false)}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Using FireFly Sandbox
        </Typography>
        <Typography sx={{ mt: 2 }}>
          1. Build an action using the panels on the left.
        </Typography>
        <Typography>
          2. The code snippet in the middle is executed to the backend Node
          server when you press "Run".
        </Typography>
        <Typography pl={2}>
          - The code snippet leverages the{' '}
          <a
            href={ResourceUrls.fireflySDK}
            target="_blank"
            style={{ color: theme.palette.warning.main }}
          >
            FireFly SDK
          </a>{' '}
          to integrate with FireFly.
        </Typography>
        <Typography pl={2}>
          - It is recommended that you use this SDK when building your Web3 app
          on top of FireFly.
        </Typography>
        <Typography>
          3. After clicking "Run", you will receive an immediate response from
          FireFly below the code snippet.
        </Typography>
        <Typography>
          4. Then, on the right, you will see FireFly events as they come in
          through a websocket connection that is listening to a node in the
          FireFly stack.
        </Typography>
      </Box>
    </Modal>
  );
};
