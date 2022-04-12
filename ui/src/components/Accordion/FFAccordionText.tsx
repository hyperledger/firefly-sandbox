import { Typography } from '@mui/material';

interface Props {
  color: string;
  isBold?: boolean;
  isHeader?: boolean;
  padding?: boolean;
  text: string;
}

export const FFAccordionText: React.FC<Props> = ({
  color,
  isBold = false,
  isHeader = false,
  padding = false,
  text,
}) => {
  return (
    <Typography
      sx={{
        fontSize: isHeader ? '16px' : '14px',
        fontWeight: isHeader || isBold ? '600' : '500',
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
