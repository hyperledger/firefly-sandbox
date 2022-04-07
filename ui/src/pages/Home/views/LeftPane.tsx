import { Grid, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FFAccordion } from '../../../components/Accordion/FFAccordion';
import { TutorialSections } from '../../../constants/TutorialSections';
import { JsonPayloadContext } from '../../../contexts/JsonPayloadContext';
import { DEFAULT_PADDING } from '../../../theme';

export const LeftPane = () => {
  const { t } = useTranslation();
  const { activeForm, setActiveForm } = useContext(JsonPayloadContext);

  return (
    <Grid container p={DEFAULT_PADDING} sx={{ overflow: 'auto' }}>
      <Grid container item wrap="nowrap" direction="column">
        {TutorialSections.map((ts, idx) => {
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
};
