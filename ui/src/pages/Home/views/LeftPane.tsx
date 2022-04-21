import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContractStateAccordion } from '../../../components/Accordion/ContractStateAccordion';
import { FFAccordionHeader } from '../../../components/Accordion/FFAccordionHeader';
import { FFAccordionText } from '../../../components/Accordion/FFAccordionText';
import { TokenStateAccordion } from '../../../components/Accordion/TokensStateAccordion';
import { TutorialSections } from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../../theme';

const currentStateMap: { [idx: number]: JSX.Element | undefined } = {
  0: undefined,
  1: <TokenStateAccordion />,
  2: <ContractStateAccordion />,
};

export const LeftPane = () => {
  const { t } = useTranslation();
  const { setPayloadMissingFields } = useContext(ApplicationContext);
  const { formID, setFormParam, categoryID, setCategoryParam } =
    useContext(FormContext);
  const [tabIdx, setTabIdx] = useState(0);

  // Set tab index when category ID changes
  useEffect(() => {
    if (categoryID !== null && categoryID !== '') {
      const tabIdx = TutorialSections.findIndex(
        (t) => t.category === categoryID
      );
      if (tabIdx === -1) {
        // Category not found, set to default
        setCategoryParam(TutorialSections[0].category);
        setTabIdx(0);
      } else {
        setTabIdx(tabIdx);
      }
    }
  }, [formID, categoryID]);

  const handleTabChange = (_: React.SyntheticEvent, newTabIdx: number) => {
    const selectedTutorial = TutorialSections.find(
      (t) => t.category === TutorialSections[newTabIdx].category
    );

    if (selectedTutorial) {
      setCategoryParam(selectedTutorial.category);
      setFormParam(selectedTutorial.tutorials[0].formID);
    } else {
      setCategoryParam(TutorialSections[0].category);
      setFormParam(TutorialSections[0].tutorials[0].formID);
    }
  };

  // useEffect(() => {
  //   if (formID + 'blob' !== activeForm && formID !== activeForm) {
  //     setExpanded(false);
  //   }
  // }, [activeForm]);

  return (
    <>
      <Grid container direction="column">
        {/* Tabs */}
        <Tabs
          variant="fullWidth"
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
              />
            );
          })}
        </Tabs>
        <Grid container p={DEFAULT_PADDING}>
          {tabIdx !== undefined && formID ? (
            // Current state of FireFly section
            <Grid container item wrap="nowrap" direction="column">
              {currentStateMap[tabIdx] && (
                <Grid pb={1}>
                  {currentStateMap[tabIdx]}
                  <Divider />
                </Grid>
              )}
              {/* Tutorial section column */}
              {TutorialSections.filter(
                (section) =>
                  section.category === TutorialSections[tabIdx].category
              ).map((ts) => {
                return (
                  <Grid key={ts.category} pb={DEFAULT_PADDING} pt={1}>
                    <Grid container item>
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
                              sx={{
                                borderRadius: DEFAULT_BORDER_RADIUS,
                              }}
                              expanded={formID === tutorial.formID}
                              onChange={() => {
                                setFormParam(tutorial.formID);
                                setPayloadMissingFields(false);
                              }}
                            >
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <FFAccordionHeader
                                  content={
                                    <FFAccordionText
                                      color="primary"
                                      text={t(tutorial.title)}
                                      isHeader
                                    />
                                  }
                                  subText={t(tutorial.shortInfo)}
                                />
                              </AccordionSummary>
                              <AccordionDetails>
                                {tutorial.form}
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Grid>Loading</Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
