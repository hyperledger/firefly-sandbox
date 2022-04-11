import { Grid, Paper, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { RunButton } from '../../../components/Buttons/RunButton';
import { FF_Paths } from '../../../constants/FF_Paths';
import * as _ from 'underscore';
import { JsonPayloadContext } from '../../../contexts/JsonPayloadContext';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../../theme';

export const MiddlePane = () => {
  const { jsonPayload, apiResponse, activeForm } =
    useContext(JsonPayloadContext);
  const [template, setTemplate] = useState<string>('');
  const [codeBlock, setCodeBlock] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('broadcast');

  const endpoints = FF_Paths as any;

  useEffect(() => {
    const fetchTemplate = () => {
      const templateCategory =
        activeForm.includes('private') || activeForm.includes('broadcast')
          ? 'messages'
          : 'tokens';
      return fetch(`/api/${templateCategory}/template/${activeForm}`, {
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
          buildCodeBlock(data);
        })
        .catch(() => {
          return null;
        });
    };
    fetchTemplate();
  }, [activeForm]);

  useEffect(() => {
    const payload: any = jsonPayload;
    if (
      template &&
      templateName === activeForm &&
      payload &&
      !payload.connector
    ) {
      buildCodeBlock(template);
    }
  }, [template, templateName, jsonPayload]);

  const buildCodeBlock = (codeTemplate: string) => {
    const compiled = _.template(codeTemplate);
    const result = compiled(jsonPayload);
    setCodeBlock(result);
  };
  return (
    <Grid>
      <Grid
        container
        item
        p={DEFAULT_PADDING}
        sx={{
          background: '#12171d',
          height: 'auto',
          position: 'sticky',
          top: '0',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('code')}
        </Typography>
      </Grid>
      <Grid container item p={DEFAULT_PADDING} pt={0}>
        <Paper
          sx={{
            width: '100%',
            padding: DEFAULT_PADDING,
          }}
        >
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
              customStyle={{ borderRadius: '5px' }}
              showLineNumbers
              language={'typescript'}
              style={tomorrowNightBright}
            >
              {codeBlock}
            </SyntaxHighlighter>
          </Grid>
          <Grid container item justifyContent="flex-end">
            <RunButton endpoint={endpoints[activeForm]} payload={jsonPayload} />
          </Grid>
        </Paper>
        <Paper
          sx={{
            width: '100%',
            marginTop: DEFAULT_PADDING,
            padding: DEFAULT_PADDING,
          }}
        >
          <Grid item>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t('apiResponse')}
            </Typography>
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
