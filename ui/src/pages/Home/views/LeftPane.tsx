import { Adjust, Description, Message } from '@mui/icons-material';
import { Divider, Grid, Tab, Tabs } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContractStateAccordion } from '../../../components/Accordion/ContractStateAccordion';
import { FFAccordion } from '../../../components/Accordion/FFAccordion';
import { TokenStateAccordion } from '../../../components/Accordion/TokensStateAccordion';
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

const currentStateMap: { [idx: number]: JSX.Element | undefined } = {
  0: undefined,
  1: <TokenStateAccordion />,
  2: <ContractStateAccordion />,
};

export const LeftPane = () => {
  const { t } = useTranslation();
  const { activeForm, setActiveForm } = useContext(ApplicationContext);
  const [tabIdx, setTabIdx] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newTabIdx: number) => {
    const tutorials = TutorialSections.find(
      (t) => t.title === tutorialTabs[newTabIdx].title.toLowerCase()
    )?.tutorials;
    setTabIdx(newTabIdx);
    if (tutorials && tutorials.length > 0) {
      setActiveForm(tutorials[0].id);
    }
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
        {/* Tabs */}
        <Tabs variant="fullWidth" value={tabIdx} onChange={handleChange}>
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
            {currentStateMap[tabIdx] && (
              <Grid pb={1}>
                {currentStateMap[tabIdx]}
                <Divider />
              </Grid>
            )}
            {TutorialSections.filter(
              (section) => section.title === tutorialTabs[tabIdx].title
            ).map((ts, idx) => {
              return (
                <Grid key={idx} pb={DEFAULT_PADDING} pt={1}>
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
