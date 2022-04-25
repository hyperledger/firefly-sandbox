import { ContentCopy } from '@mui/icons-material';
import {
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as _ from 'underscore';
import { FFCodeSnippet } from '../../../components/Boxes/FFCodeSnippet';
import { RunButton } from '../../../components/Buttons/RunButton';
import { FFPanelHeader } from '../../../components/Panels/FFPanelHeader';
import { SDK_PATHS } from '../../../constants/SDK_PATHS';
import { TUTORIAL_FORMS } from '../../../constants/TutorialSections';
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
  const theme = useTheme();
  const { jsonPayload, apiResponse, apiStatus, setApiResponse, setApiStatus } =
    useContext(ApplicationContext);
  const { formID, formObject, categoryID } = useContext(FormContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [codeBlock, setCodeBlock] = useState<string>('');
  const [template, setTemplate] = useState<string>('');

  useEffect(() => {
    if (formID === TUTORIAL_FORMS.DEPLOY_CONTRACT) {
      setCodeBlock(`/*\n${t('followStepsInInstructions')}\n*/`);
      setApiResponse({});
      setApiStatus(undefined);
      return;
    }
    categoryID &&
      formID &&
      fetchCatcher(SDK_PATHS.template(categoryID, formID))
        .then((template: string) => {
          setTemplate(template);
        })
        .catch((e) => {
          reportFetchError(e);
        });
  }, [categoryID, formID]);

  useEffect(() => {
    if (template && jsonPayload && formID) {
      if (
        formID === TUTORIAL_FORMS.PRIVATE &&
        !(jsonPayload as any).recipients
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
      <FFPanelHeader title={t('code')} />
      {/* Main content */}
      <Grid container item p={DEFAULT_PADDING} pt={0} direction="column">
        {/* Application Code Block */}
        <Paper
          elevation={0}
          sx={{
            padding: 1,
            borderRadius: DEFAULT_BORDER_RADIUS,
          }}
        >
          <Grid
            container
            item
            sx={{
              padding: 1,
              borderBottom: `3px solid ${theme.palette.background.default}`,
            }}
            direction="column"
          >
            {/* Header */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
              }}
            >
              {t('applicationCode')}
            </Typography>
            {/* Header */}
            <Grid container item alignItems="center">
              <Typography variant="caption">
                {t('appCodeInstructions')}
              </Typography>
            </Grid>
          </Grid>
          {/* Code Snippet */}
          <Grid p={1} item>
            <FFCodeSnippet codeBlock={codeBlock} language={'typescript'} />
          </Grid>
          {/* Button row */}
          <Grid
            p={1}
            container
            item
            alignItems={'center'}
            justifyContent="space-between"
            direction="row"
            sx={{
              borderTop: `3px solid ${theme.palette.background.default}`,
            }}
          >
            {/* Copy button */}
            <IconButton>
              <CopyToClipboard text={codeBlock}>
                <ContentCopy />
              </CopyToClipboard>
            </IconButton>
            {/* Run button */}
            <Grid item pl={1}>
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
            mt: DEFAULT_PADDING,
            padding: 1,
            borderRadius: DEFAULT_BORDER_RADIUS,
          }}
        >
          {/* Header */}
          <Grid
            container
            item
            direction="row"
            justifyContent={'space-between'}
            alignItems="center"
            sx={{
              borderBottom: `3px solid ${theme.palette.background.default}`,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                padding: 1,
                fontWeight: 600,
              }}
            >
              {t('serverResponse')}
            </Typography>

            {apiStatus?.status && (
              <Chip
                variant="outlined"
                sx={{
                  borderColor: getApiStatusColor(),
                  color: getApiStatusColor(),
                  m: 1,
                }}
                label={`${apiStatus?.status} ${apiStatus?.statusText}`}
              />
            )}
          </Grid>
          {/* Code Snippet */}
          <Grid p={1} item>
            <FFCodeSnippet
              codeBlock={JSON.stringify(apiResponse, null, 1)}
              language={'json'}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
