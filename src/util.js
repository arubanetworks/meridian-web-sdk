export function requiredParam(funcName, argName) {
  // eslint-disable-next-line no-console
  console.error(`${funcName}: argument \`${argName}\` is required`);
}

// The point of asyncClientCall is that calls a callback on the next tick of the
// event loop so that client callbacks don't cause errors within our code
//
// Example:
//
// var foo = this.getFoo();
// asyncClientCall(this.callback, foo);
// ^---- client error happens later, allowing `getBar` to be called
// var bar = this.getBar();
export function asyncClientCall(func, ...args) {
  setTimeout(func, 0, ...args);
}
