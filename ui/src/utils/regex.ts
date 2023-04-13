const ffNameRegex = /^[0-9a-zA-Z]([0-9a-zA-Z._-]{0,62}[0-9a-zA-Z])?$/;
const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export const isValidFFName = (name: string) => {
  // have to use a variable to store the return value before return it
  // otherwise you'll see "jumpy" validation result when you use the function
  // directly as the value of a react component
  const result = ffNameRegex.test(name);
  return result;
};

export const isValidAddress = (address: string) => {
  const result = addressRegex.test(address);
  return result;
};
