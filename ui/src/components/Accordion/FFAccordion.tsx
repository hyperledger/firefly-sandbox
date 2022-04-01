import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  title: string;
  infoText: string;
  isOpen?: boolean;
  form: JSX.Element;
}

export const FFAccordion: React.FC<Props> = ({
  form,
  infoText,
  title,
  isOpen = false,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  return (
    <Accordion
      sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          content={<FFAccordionText color="primary" text={title} isHeader />}
          subText={infoText}
        />
      </AccordionSummary>
      <AccordionDetails>{form}</AccordionDetails>
    </Accordion>
  );
};
