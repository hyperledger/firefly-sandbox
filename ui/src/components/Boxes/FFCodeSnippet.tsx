import { useTheme } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';

SyntaxHighlighter.registerLanguage('javascript', ts);

interface Props {
  codeBlock: string;
  language: string;
}

export const FFCodeSnippet: React.FC<Props> = ({ codeBlock, language }) => {
  const theme = useTheme();

  return (
    <SyntaxHighlighter
      showLineNumbers
      language={language}
      style={atomOneDark}
      customStyle={{
        backgroundColor: theme.palette.background.paper,
        fontSize: 12,
        overflow: 'auto',
        overflowWrap: 'break-word',
      }}
      wrapLongLines
    >
      {codeBlock}
    </SyntaxHighlighter>
  );
};
