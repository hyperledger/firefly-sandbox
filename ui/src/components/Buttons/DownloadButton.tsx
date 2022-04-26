import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { downloadExternalFile } from '../../utils/files';

interface Props {
  filename?: string;
  url: string;
}

export const DownloadButton: React.FC<Props> = ({ filename, url }) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        downloadExternalFile(url, filename);
      }}
    >
      <Download sx={{ fontSize: '20px' }} />
    </IconButton>
  );
};
