import { Button, Chip, Grid, Paper, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import * as _ from 'underscore';
import { RunButton } from '../../../components/Buttons/RunButton';
import { FF_Paths } from '../../../constants/FF_Paths';
import LinkIcon from '@mui/icons-material/Link';
import {
  TutorialSections,
  TUTORIAL_CATEGORIES,
} from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  FFColors,
} from '../../../theme';

export const MiddlePane = () => {
  const {
    jsonPayload,
    apiResponse,
    apiStatus,
    activeForm,
    setApiResponse,
    setApiStatus,
  } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [template, setTemplate] = useState<string>('');
  const [codeBlock, setCodeBlock] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('broadcast');

  const endpoints = FF_Paths as any;

  useEffect(() => {
    if (activeForm === 'deploycontract' || activeForm === 'listener') {
      setCodeBlock('/*\nFollow steps outlined in the instructions\n*/');
      setApiResponse({});
      setApiStatus(undefined);
      return;
    }
    const templateCategory = getTemplateCategory();

    fetch(`/api/${templateCategory}/template/${activeForm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTemplate(data);
        setTemplateName(activeForm);
      })
      .catch((e) => {
        reportFetchError(e);
      });
  }, [activeForm]);

  useEffect(() => {
    const payload: any = jsonPayload;
    if (template && templateName === activeForm && payload) {
      buildCodeBlock(template);
    }
  }, [template, templateName, jsonPayload]);

  const buildCodeBlock = (codeTemplate: string) => {
    if (Object.keys(jsonPayload).length < 1) return;
    const compiled = _.template(codeTemplate);
    const result = compiled(jsonPayload);
    setCodeBlock(result);
  };

  const isSuccessfulResponse = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 299) {
      return true;
    } else if (statusCode >= 400 && statusCode < 600) {
      return false;
    }
    return false;
  };

  const getApiStatusColor = () => {
    return apiStatus?.status
      ? isSuccessfulResponse(apiStatus?.status)
        ? FFColors.Green
        : FFColors.Red
      : FFColors.White;
  };

  const getTutorials = (tutorialTitle: string) => {
    return TutorialSections.find(
      (t) => t.title === tutorialTitle
    )?.tutorials.map((tu) => tu.id);
  };

  const getTemplateCategory = () => {
    const messagingForms = getTutorials(TUTORIAL_CATEGORIES.MESSAGING);
    if (messagingForms?.includes(activeForm)) {
      return 'messages';
    }
    const tokenForms = getTutorials(TUTORIAL_CATEGORIES.TOKENS);
    if (tokenForms?.includes(activeForm)) {
      return 'tokens';
    }
    const contractsForms = getTutorials(TUTORIAL_CATEGORIES.CONTRACTS);
    if (contractsForms?.includes(activeForm)) {
      return 'contracts';
    }
    return 'messages';
  };
  return (
    <Grid>
      {/* Header */}
      <Grid container item p={DEFAULT_PADDING}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('serverCode')}
        </Typography>{' '}
        <Button
          variant="text"
          disableRipple
          disableFocusRipple
          sx={{ ':hover': { background: 'inherit' }, padding: 0 }}
          onClick={() => {
            window.open(
              'https://github.com/kaleido-io/firefly-sandbox/tree/main/server'
            );
          }}
        >
          <LinkIcon />{' '}
        </Button>
        <Typography variant="subtitle1" sx={{ paddingTop: '16px' }}>
          {t('serverCodeInfo')}
        </Typography>
      </Grid>
      <Grid container item p={DEFAULT_PADDING} pt={0}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            padding: DEFAULT_PADDING,
          }}
        >
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('typescriptSDK')}
            </Typography>
          </Grid>
          <Grid
            container
            item
            wrap="nowrap"
            direction="column"
            sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
            fontSize="12px"
          >
            <SyntaxHighlighter
              showLineNumbers
              language={'typescript'}
              style={tomorrowNightBright}
            >
              {codeBlock}
            </SyntaxHighlighter>
          </Grid>
          <Grid container item justifyContent="flex-end">
            <RunButton
              disabled={activeForm === 'deploycontract'}
              endpoint={endpoints[activeForm]}
              payload={jsonPayload}
            />
          </Grid>
        </Paper>

        {/* API Response Block */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            marginTop: DEFAULT_PADDING,
            padding: DEFAULT_PADDING,
          }}
        >
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('serverResponse')}
              </Typography>
            </Grid>
            <Grid item container xs={6} justifyContent="flex-end">
              {apiStatus?.status && (
                <Chip
                  variant="outlined"
                  sx={{
                    borderColor: getApiStatusColor(),
                    color: getApiStatusColor(),
                  }}
                  label={`${apiStatus?.status} ${apiStatus?.statusText}`}
                />
              )}
            </Grid>
          </Grid>
          <Grid
            pt={2}
            container
            item
            wrap="nowrap"
            direction="column"
            sx={{ borderRadius: DEFAULT_BORDER_RADIUS }}
            fontSize="12px"
          >
            <SyntaxHighlighter
              customStyle={{ borderRadius: '5px' }}
              showLineNumbers
              language={'json'}
              style={tomorrowNightBright}
            >
              {JSON.stringify(apiResponse, null, 1)}
            </SyntaxHighlighter>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
