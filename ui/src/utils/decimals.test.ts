import { amountToDecimal, decimalToAmount } from './decimals';

test('amountToDecimal() should be padded by correct number of decimals', () => {
  const noDecimal = '123456789';
  expect(amountToDecimal(noDecimal, undefined)).toEqual(undefined);
  expect(amountToDecimal(noDecimal, 0)).toEqual('123456789');
  expect(amountToDecimal(noDecimal, 1)).toEqual('1234567890');
  expect(amountToDecimal(noDecimal, 5)).toEqual('12345678900000');
  expect(amountToDecimal(noDecimal, 10)).toEqual('1234567890000000000');
  expect(amountToDecimal(noDecimal, 15)).toEqual('123456789000000000000000');
  expect(amountToDecimal(noDecimal, 18)).toEqual('123456789000000000000000000');

  const oneDecimal = '123456789.1';
  expect(amountToDecimal(oneDecimal, undefined)).toEqual(undefined);
  expect(amountToDecimal(oneDecimal, 0)).toEqual(undefined);
  expect(amountToDecimal(oneDecimal, 1)).toEqual('1234567891');
  expect(amountToDecimal(oneDecimal, 5)).toEqual('12345678910000');
  expect(amountToDecimal(oneDecimal, 10)).toEqual('1234567891000000000');
  expect(amountToDecimal(oneDecimal, 15)).toEqual('123456789100000000000000');
  expect(amountToDecimal(oneDecimal, 18)).toEqual(
    '123456789100000000000000000'
  );

  const multipleDecimals = '123456789.10505';
  expect(amountToDecimal(multipleDecimals, undefined)).toEqual(undefined);
  expect(amountToDecimal(multipleDecimals, 0)).toEqual(undefined);
  expect(amountToDecimal(multipleDecimals, 1)).toEqual(undefined);
  expect(amountToDecimal(multipleDecimals, 5)).toEqual('12345678910505');
  expect(amountToDecimal(multipleDecimals, 10)).toEqual('1234567891050500000');
  expect(amountToDecimal(multipleDecimals, 15)).toEqual(
    '123456789105050000000000'
  );
  expect(amountToDecimal(multipleDecimals, 18)).toEqual(
    '123456789105050000000000000'
  );

  const invalidAmount = '1.1.1';
  expect(amountToDecimal(invalidAmount, 18)).toEqual(undefined);
});

test('decimalToAmount() should remove correct number of decimals', () => {
  const noDecimal = '123456789';
  expect(decimalToAmount(noDecimal, undefined)).toEqual(noDecimal);
  expect(decimalToAmount(noDecimal, -1)).toEqual(noDecimal);
  expect(decimalToAmount(noDecimal, 0)).toEqual(noDecimal);
  expect(decimalToAmount('1234567890', 1)).toEqual(noDecimal);
  expect(decimalToAmount('12345678900000', 5)).toEqual(noDecimal);
  expect(decimalToAmount('1234567890000000000', 10)).toEqual(noDecimal);
  expect(decimalToAmount('123456789000000000000000', 15)).toEqual(noDecimal);
  expect(decimalToAmount('123456789000000000000000000', 18)).toEqual(noDecimal);

  const oneDecimal = '123456789.1';
  expect(decimalToAmount(oneDecimal, undefined)).toEqual(oneDecimal);
  expect(decimalToAmount(oneDecimal, -1)).toEqual(oneDecimal);
  expect(decimalToAmount(oneDecimal, 0)).toEqual(oneDecimal);
  expect(decimalToAmount('1234567891', 1)).toEqual(oneDecimal);
  expect(decimalToAmount('12345678910000', 5)).toEqual(oneDecimal);
  expect(decimalToAmount('1234567891000000000', 10)).toEqual(oneDecimal);
  expect(decimalToAmount('123456789100000000000000', 15)).toEqual(oneDecimal);
  expect(decimalToAmount('123456789100000000000000000', 18)).toEqual(
    oneDecimal
  );

  const multipleDecimals = '123456789.10505';
  expect(decimalToAmount(multipleDecimals, undefined)).toEqual(
    multipleDecimals
  );
  expect(decimalToAmount(multipleDecimals, -1)).toEqual(multipleDecimals);
  expect(decimalToAmount(multipleDecimals, 0)).toEqual(multipleDecimals);
  expect(decimalToAmount('12345678910505', 5)).toEqual(multipleDecimals);
  expect(decimalToAmount('1234567891050500000', 10)).toEqual(multipleDecimals);
  expect(decimalToAmount('123456789105050000000000', 15)).toEqual(
    multipleDecimals
  );
  expect(decimalToAmount('123456789105050000000000000', 18)).toEqual(
    multipleDecimals
  );
});
