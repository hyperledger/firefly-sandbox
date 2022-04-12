import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  form: JSX.Element;
  infoText: string;
  isOpen?: boolean;
  title: string;
  type: string;
}

export const FFAccordion: React.FC<Props> = ({
  form,
  infoText,
  isOpen = false,
  title,
  type,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);
  const { activeForm, setActiveForm } = useContext(ApplicationContext);
  useEffect(() => {
    if (type + 'blob' !== activeForm && type !== activeForm) {
      setExpanded(false);
    }
  }, [activeForm]);

  return (
    <Accordion
      sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
      expanded={expanded}
      onChange={() => {
        setActiveForm(type);
        setExpanded(!expanded);
      }}
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
