<<<<<<< HEAD
import { Grid, Tab, Tabs, Paper, Typography } from '@mui/material';
=======
import { Grid, Tab, Tabs } from '@mui/material';
>>>>>>> 610de5dce38b3677a68b2eb1ad22d0e479fdb5ee
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SplitPane from 'react-split-pane';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
<<<<<<< HEAD
import { FFAccordion } from '../../../components/Accordion/FFAccordion';
import { RunButton } from '../../../components/Buttons/RunButton';
import { EventSubscriptionForm } from '../../../components/Forms/EventSubscriptionForm';
=======
>>>>>>> 610de5dce38b3677a68b2eb1ad22d0e479fdb5ee
import { JsonPayloadContext } from '../../../contexts/JsonPayloadContext';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
<<<<<<< HEAD
  DEFAULT_SPACING,
=======
>>>>>>> 610de5dce38b3677a68b2eb1ad22d0e479fdb5ee
  FFColors,
} from '../../../theme';
import { LeftPane } from './LeftPane';

const styles = {
  background: FFColors.Pink,
  width: '4px',
  cursor: 'col-resize',
  margin: '0 5px',
  height: '100%',
};

export const HomeDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { jsonPayload } = useContext(JsonPayloadContext);

  const supportedLanguages = [
    {
      name: t('payload'),
      format: 'json',
    },
    {
      name: t('typescriptSDK'),
      format: 'typescript',
    },
  ];

  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const handleLanguageChange = (
    event: React.SyntheticEvent,
    newIdx: number
  ) => {
    setSelectedTabIdx(newIdx);
  };

  return (
    <>
      <Grid container px={DEFAULT_PADDING}>
        <SplitPane
          split="vertical"
          minSize={100}
          defaultSize={'30%'}
          resizerStyle={styles}
          style={{ position: 'relative' }}
        >
          <LeftPane />
          <SplitPane
            split="vertical"
            minSize={100}
            defaultSize={'50%'}
            resizerStyle={styles}
          >
            <Grid container p={DEFAULT_PADDING}>
              <Grid
                container
                item
                wrap="nowrap"
                direction="column"
                sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
                fontSize="12px"
              >
                <Tabs
                  textColor="secondary"
                  indicatorColor="secondary"
                  value={selectedTabIdx}
                  onChange={handleLanguageChange}
                >
                  {supportedLanguages.map((l, idx) => (
                    <Tab key={idx} label={l.name} />
                  ))}
                </Tabs>
                <SyntaxHighlighter
                  showLineNumbers
                  language={supportedLanguages[selectedTabIdx].format}
                  style={tomorrowNightBright}
                >
                  {JSON.stringify(jsonPayload, null, 2)}
                </SyntaxHighlighter>
              </Grid>
            </Grid>
            <Grid pb={DEFAULT_PADDING}>
              <Grid item pl={DEFAULT_PADDING} pt={DEFAULT_PADDING}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {t('eventSubscription')}
                </Typography>
              </Grid>
              <Grid container item p={DEFAULT_PADDING}>
                <Paper sx={{ overflow: 'auto', width: '100%' }}>
                  <Grid container spacing={1} p={2} wrap="nowrap">
                    <EventSubscriptionForm />
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </SplitPane>
        </SplitPane>
      </Grid>
    </>
  );
};
