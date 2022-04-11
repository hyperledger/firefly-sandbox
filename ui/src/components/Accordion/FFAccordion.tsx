import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StringIfPlural } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  title: string;
  type: string;
  infoText: string;
  isOpen?: boolean;
  form: JSX.Element;
  activeForm: string;
}

export const FFAccordion: React.FC<Props> = ({
  form,
  infoText,
  title,
  type,
  isOpen = false,
  activeForm,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);
  const { setActiveForm } = useContext(ApplicationContext);
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
