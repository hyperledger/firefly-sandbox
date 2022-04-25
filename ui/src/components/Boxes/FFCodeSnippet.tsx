import { useTheme } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
      }}
      wrapLongLines
    >
      {codeBlock}
    </SyntaxHighlighter>
  );
};
