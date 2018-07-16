export function requiredParam(funcName, argName) {
  // eslint-disable-next-line no-console
  console.error(`${funcName}: argument \`${argName}\` is required`);
}
