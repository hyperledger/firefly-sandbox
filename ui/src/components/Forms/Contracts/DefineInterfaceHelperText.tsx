import { FormHelperText, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ResourceUrls } from '../../../constants/ResourceUrls';
import { BLOCKCHAIN_TYPE } from '../../../enums/enums';

interface Props {
  blockchainPlugin: string;
}

export const DefineInterfaceHelperText: React.FC<Props> = ({
  blockchainPlugin,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return blockchainPlugin === BLOCKCHAIN_TYPE.FABRIC ? (
    // In FFI format
    <FormHelperText>
      {t('in')}&nbsp;
      <a
        href={ResourceUrls.fireflyFFI}
        target="_blank"
        style={{ color: theme.palette.text.primary, textDecoration: 'none' }}
      >
        {t('ffiShort')}
      </a>
      &nbsp;
      {t('format')}
    </FormHelperText>
  ) : (
    // Either FFI or Solidity ABI format
    <FormHelperText>
      {t('either')}
      &nbsp;
      <a
        href={ResourceUrls.fireflyFFI}
        target="_blank"
        style={{ color: theme.palette.text.primary, textDecoration: 'none' }}
      >
        {t('ffiShort')}
      </a>
      &nbsp;{t('or')}&nbsp;
      <a
        href={ResourceUrls.solidityABI}
        target="_blank"
        style={{ color: theme.palette.text.primary, textDecoration: 'none' }}
      >
        {t('solidityABI')}
      </a>
      &nbsp;
      {t('format')}
    </FormHelperText>
  );
};
