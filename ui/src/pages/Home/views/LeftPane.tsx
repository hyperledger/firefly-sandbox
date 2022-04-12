import { Adjust, Description, Message } from '@mui/icons-material';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FFAccordion } from '../../../components/Accordion/FFAccordion';
import {
  TutorialSections,
  TUTORIAL_CATEGORIES,
} from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DEFAULT_PADDING } from '../../../theme';

const tutorialTabs = [
  {
    icon: <Message />,
    title: TUTORIAL_CATEGORIES.MESSAGING,
  },
  {
    icon: <Adjust />,
    title: TUTORIAL_CATEGORIES.TOKENS,
  },
  {
    icon: <Description />,
    title: TUTORIAL_CATEGORIES.CONTRACTS,
  },
];

export const LeftPane = () => {
  const { t } = useTranslation();
  const { activeForm, setActiveForm } = useContext(ApplicationContext);
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const tutorials = TutorialSections.find(
      (t) => t.title === tutorialTabs[newValue].title.toLowerCase()
    )?.tutorials;
    setValue(newValue);
    if (tutorials && tutorials.length > 0) {
      setActiveForm(tutorials[0].id);
    }
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        {/* Tabs */}
        <Tabs variant="fullWidth" value={value} onChange={handleChange}>
          {tutorialTabs.map((tt, idx) => {
            return (
              <Tab
                iconPosition="start"
                icon={tt.icon}
                label={t(tt.title)}
                key={idx}
              />
            );
          })}
        </Tabs>
        <Grid container p={DEFAULT_PADDING} sx={{ overflow: 'scroll' }}>
          <Grid container item wrap="nowrap" direction="column">
            {TutorialSections.filter(
              (section) => section.title === tutorialTabs[value].title
            ).map((ts, idx) => {
              return (
                <Grid key={idx} pb={DEFAULT_PADDING}>
                  <Grid item pb={DEFAULT_PADDING}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {t(ts.title)}
                    </Typography>
                  </Grid>
                  <Grid container item>
                    {ts.tutorials.map((tutorial, idx) => {
                      return (
                        <Grid key={idx} item pb={1} sx={{ width: '100%' }}>
                          <FFAccordion
                            title={t(tutorial.title)}
                            infoText={t(tutorial.shortInfo)}
                            form={tutorial.form}
                            type={tutorial.id}
                            isOpen={activeForm === tutorial.id}
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
      </div>
    </>
  );
};
