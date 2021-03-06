import { TUTORIAL_FORMS } from '../constants/TutorialSections';

export const getShortHash = (hash: string): string => {
  return hash?.length >= 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;
};

export const jsNumberForAddress = (address: string): number => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
};

export const isJsonString = (str: string) => {
  if (!str) return false;
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isSuccessfulResponse = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 299) {
    return true;
  } else if (statusCode >= 400 && statusCode < 600) {
    return false;
  }
  return false;
};

export const isTokenMessage = (formID?: string) => {
  if (
    formID &&
    (
      [
        TUTORIAL_FORMS.MINT,
        TUTORIAL_FORMS.BURN,
        TUTORIAL_FORMS.TRANSFER,
      ] as string[]
    ).includes(formID)
  ) {
    return true;
  }
  return false;
};

export const onlyNumberRegex = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

export const isAmountInvalid = (amount: string): boolean => {
  return (
    amount !== '' &&
    amount.charAt(amount.length - 1) !== '.' &&
    amount.match(onlyNumberRegex) === null
  );
};
