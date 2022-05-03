import { IconButton, MenuItem, Typography } from '@mui/material';

interface Props {
  icon: JSX.Element;
  title: string;
  url: string;
}

export const FFMenuItem: React.FC<Props> = ({ icon, title, url }) => {
  return (
    <MenuItem
      sx={{ width: 110 }}
      onClick={() => window.open(url)}
      disableGutters
    >
      <IconButton color="secondary" size="small">
        {icon}
      </IconButton>
      <Typography sx={{ pl: 1, fontSize: '16px' }}>{title}</Typography>
    </MenuItem>
  );
};
