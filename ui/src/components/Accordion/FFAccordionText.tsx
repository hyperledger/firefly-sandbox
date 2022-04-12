import { Typography } from '@mui/material';

interface Props {
  color: string;
  isHeader?: boolean;
  padding?: boolean;
  text: string;
}

export const FFAccordionText: React.FC<Props> = ({
  color,
  isHeader = false,
  padding = false,
  text,
}) => {
  return (
    <Typography
      sx={{
        fontSize: isHeader ? '16px' : '14px',
        fontWeight: isHeader ? '600' : '500',
        paddingBottom: padding ? 1 : 0,
      }}
      color={color}
      variant="body2"
      noWrap
    >
      {text}
    </Typography>
  );
};
