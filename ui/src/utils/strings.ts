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

export const copyToClipboard = (text: string) => {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
};
