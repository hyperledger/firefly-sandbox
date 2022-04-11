import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FFAccordion } from '../../../components/Accordion/FFAccordion';
import { Header } from '../../../components/Header';
import { TutorialSections } from '../../../constants/TutorialSections';
import { JsonPayloadContext } from '../../../contexts/JsonPayloadContext';
import { DEFAULT_PADDING } from '../../../theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TUTORIAL_CATEGORIES = ['messaging', 'tokens'];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const { t } = useTranslation();
  const { activeForm, setActiveForm } = useContext(JsonPayloadContext);
  return (
    <Grid container p={DEFAULT_PADDING} sx={{ overflow: 'scroll' }}>
      <Grid container item wrap="nowrap" direction="column">
        {TutorialSections.filter(
          (t) => t.title.toLowerCase() === TUTORIAL_CATEGORIES[value]
        ).map((ts, idx) => {
          return (
            <Grid key={idx} pb={DEFAULT_PADDING}>
              <Grid item pb={DEFAULT_PADDING} pl={1}>
                {/* Section header */}
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {t(ts.title)}
                </Typography>
              </Grid>
              <Grid container item>
                {ts.tutorials.map((tutorial, idx) => {
                  return (
                    // Form accordion
                    <Grid key={idx} item pb={1} sx={{ width: '100%' }}>
                      <FFAccordion
                        title={t(tutorial.title)}
                        infoText={t(tutorial.shortInfo)}
                        form={tutorial.form}
                        type={tutorial.link}
                        isOpen={activeForm === tutorial.link}
                        activeForm={activeForm}
                      ></FFAccordion>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const LeftPane = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Messaging" {...a11yProps(0)} />
            <Tab label="Tokens" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}></TabPanel>
      </div>
    </>
  );
};
