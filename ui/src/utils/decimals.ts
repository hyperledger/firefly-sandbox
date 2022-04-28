export const amountToDecimal = (
  amount: string,
  decimals: number | undefined
): string | undefined => {
  // If decimals is undefined
  if (decimals === undefined) return undefined;

  // Split amount by decimal
  const splitStr = amount.split('.');

  // If no decimal, pad 0s to the right and return
  if (splitStr.length === 1) return splitStr[0] + '0'.repeat(decimals);

  // If invalid amount string, return undefined
  if (splitStr[1].length > decimals || splitStr.length !== 2) return undefined;

  // Return decimal amount
  return (
    splitStr[0] +
    splitStr[1] +
    (decimals - splitStr[1].length >= 0
      ? '0'.repeat(decimals - splitStr[1].length)
      : '')
  );
};

export const decimalToAmount = (
  amount: string,
  decimals: number | undefined
) => {
  // If pool doesn't support decimals, return normal amount
  if (decimals === -1 || decimals === undefined) return amount;
  // Pad amount with (decimals) amount of '0's on the left hand side
  let decAmount = amount.padStart(decimals + 1, '0');
  // Add decimal to correct spot
  decAmount =
    decAmount.slice(0, decAmount.length - decimals) +
    '.' +
    decAmount.slice(decAmount.length - decimals);
  // Remove trailing 0s
  decAmount = decAmount.replace(/\.?0*$/, '');

  return decAmount;
};
