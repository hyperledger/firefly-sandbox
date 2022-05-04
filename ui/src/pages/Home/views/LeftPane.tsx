import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Icon,
  Tab,
  Tabs,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_ACTION } from '../../../AppWrapper';
import { ContractStateBox } from '../../../components/Boxes/ContractStateBox';
import { FFAccordionHeader } from '../../../components/Accordion/FFAccordionHeader';
import { FFAccordionText } from '../../../components/Accordion/FFAccordionText';
import { TokenStateBox } from '../../../components/Boxes/TokenStateBox';
import {
  TutorialSections,
  TUTORIAL_CATEGORIES,
} from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { DEFAULT_PADDING } from '../../../theme';

const currentStateMap: { [idx: number]: JSX.Element | undefined } = {
  0: undefined,
  1: <TokenStateBox />,
  2: <ContractStateBox />,
};

export const LeftPane = () => {
  const { t } = useTranslation();
  const { tokensDisabled } = useContext(ApplicationContext);
  const { formID, categoryID, setActionParam, setPoolObject } =
    useContext(FormContext);
  const [tabIdx, setTabIdx] = useState(0);

  // Set tab index when category ID changes
  useEffect(() => {
    if (formID && categoryID) {
      const tabIdx = TutorialSections.findIndex(
        (t) => t.category === categoryID
      );
      if (tabIdx === -1) {
        // Category not found, set to default
        setActionParam(DEFAULT_ACTION[0], DEFAULT_ACTION[1]);
        setTabIdx(0);
      } else {
        setTabIdx(tabIdx);
      }
    }
  }, [formID, categoryID]);

  const handleTabChange = (_: React.SyntheticEvent, newTabIdx: number) => {
    setPoolObject(undefined);
    const selectedTutorial = TutorialSections.find(
      (t) => t.category === TutorialSections[newTabIdx].category
    );
    if (selectedTutorial) {
      setActionParam(
        selectedTutorial.category,
        selectedTutorial.tutorials[0].formID
      );
    } else {
      setActionParam(DEFAULT_ACTION[0], DEFAULT_ACTION[1]);
    }
  };

  return (
    <Grid container direction="column">
      {/* Tabs */}
      <Tabs
        variant="fullWidth"
        sx={{ maxHeight: 65 }}
        value={tabIdx ?? 0}
        onChange={handleTabChange}
      >
        {TutorialSections.map((section) => {
          return (
            <Tab
              iconPosition="start"
              icon={section.icon}
              label={t(section.category)}
              key={section.category}
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                maxHeight: 65,
              }}
              disabled={
                tokensDisabled &&
                section.category === TUTORIAL_CATEGORIES.TOKENS
              }
            />
          );
        })}
      </Tabs>
      <Grid container p={DEFAULT_PADDING} pt={1} direction="column">
        {tabIdx !== undefined && formID && (
          // Current state of FireFly section
          <Grid container item wrap="nowrap" direction="column">
            {currentStateMap[tabIdx] && (
              <Grid pb={1}>{currentStateMap[tabIdx]}</Grid>
            )}
            {/* Tutorial section column */}
            {TutorialSections.filter(
              (section) =>
                section.category === TutorialSections[tabIdx].category
            ).map((ts) => {
              return (
                <Grid key={ts.category} pb={DEFAULT_PADDING} pt={1}>
                  {ts.tutorials.map((tutorial) => {
                    // Tutorial form
                    return (
                      <Grid
                        key={tutorial.formID}
                        item
                        pb={1}
                        sx={{ width: '100%' }}
                      >
                        <Accordion
                          expanded={formID === tutorial.formID}
                          onChange={() =>
                            setActionParam(ts.category, tutorial.formID)
                          }
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <FFAccordionHeader
                              content={
                                <>
                                  <Icon sx={{ mr: 1, mb: 1 }}>
                                    {tutorial.icon}
                                  </Icon>
                                  <FFAccordionText
                                    color="primary"
                                    text={t(tutorial.title)}
                                    isHeader
                                  />
                                </>
                              }
                              subText={t(tutorial.shortInfo)}
                            />
                          </AccordionSummary>
                          <AccordionDetails>{tutorial.form}</AccordionDetails>
                        </Accordion>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
