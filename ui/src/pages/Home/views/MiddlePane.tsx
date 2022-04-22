import { ContentCopy } from '@mui/icons-material';
import LinkIcon from '@mui/icons-material/Link';
import { Button, Chip, Grid, Paper, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import * as _ from 'underscore';
import { RunButton } from '../../../components/Buttons/RunButton';
import { SDK_PATHS } from '../../../constants/SDK_PATHS';
import {
  TUTORIAL_CATEGORIES,
  TUTORIAL_FORMS,
} from '../../../constants/TutorialSections';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FormContext } from '../../../contexts/FormContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  FFColors,
} from '../../../theme';
import { fetchCatcher } from '../../../utils/fetches';
import { isSuccessfulResponse } from '../../../utils/strings';

export const MiddlePane = () => {
  const { jsonPayload, apiResponse, apiStatus, setApiResponse, setApiStatus } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { formID, formObject, categoryID, isBlob } = useContext(FormContext);
  const [template, setTemplate] = useState<string>('');
  const [codeBlock, setCodeBlock] = useState<string>('');

  useEffect(() => {
    if (formID === TUTORIAL_FORMS.DEPLOY_CONTRACT) {
      setCodeBlock(`/*\n${t('followStepsInInstructions')}\n*/`);
      setApiResponse({});
      setApiStatus(undefined);
      return;
    }
    categoryID &&
      formID &&
      fetchCatcher(SDK_PATHS.template(categoryID, formID, isBlob))
        .then((template: string) => {
          setTemplate(template);
        })
        .catch((e) => {
          reportFetchError(e);
        });
  }, [categoryID, formID, isBlob]);

  useEffect(() => {
    if (template && jsonPayload && formID) {
      const { recipients, messagingMethod, value, jsonValue } =
        jsonPayload as any;
      if (
        (formID === TUTORIAL_FORMS.PRIVATE && !recipients) ||
        (categoryID === TUTORIAL_CATEGORIES.TOKENS &&
          messagingMethod &&
          !value &&
          !jsonValue &&
          !isBlob)
      ) {
        return;
      }
      const codeBlock: string | undefined = getCodeBlock(template);
      codeBlock && setCodeBlock(codeBlock);
    }
  }, [template, jsonPayload, formID]);

  const getCodeBlock = (codeTemplate: string) => {
    // Wrap in try/catch to prevent compiling different jsonPayload and template together
    try {
      if (Object.keys(jsonPayload).length < 1) return;
      const compiled = _.template(codeTemplate);
      const result = compiled(jsonPayload);

      return result;
    } catch {
      return undefined;
    }
  };

  const getApiStatusColor = () => {
    return apiStatus?.status
      ? isSuccessfulResponse(apiStatus?.status)
        ? FFColors.Green
        : FFColors.Red
      : FFColors.White;
  };

  return (
    <Grid>
      {/* Header */}
      <Grid container item p={DEFAULT_PADDING}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('serverCode')}
        </Typography>
        <Button
          variant="text"
          disableRipple
          disableFocusRipple
          sx={{ ':hover': { background: 'inherit' }, padding: 0 }}
          onClick={() => {
            window.open(
              'https://github.com/hyperledger/firefly-sandbox/tree/main/server'
            );
          }}
        >
          <LinkIcon />
        </Button>
        <Typography variant="subtitle1" sx={{ paddingTop: '16px' }}>
          {t('serverCodeInfo')}
        </Typography>
      </Grid>
      <Grid
        container
        item
        p={DEFAULT_PADDING}
        pt={0}
        sx={{ maxWidth: '550px' }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            padding: DEFAULT_PADDING,
          }}
        >
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
          <Grid container item justifyContent="space-between" direction="row">
            <Grid item xs={6}>
              <CopyToClipboard text={codeBlock}>
                <Button size="small" startIcon={<ContentCopy />}>
                  {t('copyCode')}
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid container item xs={6} justifyContent="flex-end">
              <RunButton
                disabled={formObject ? !formObject.runnable : true}
                endpoint={formObject?.endpoint ?? ''}
                payload={jsonPayload}
              />
            </Grid>
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
          <Grid item container xs={12} sx={{ maxWidth: '550px' }}>
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
