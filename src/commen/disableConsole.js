const disableConsole = () => {
  if (
    process.env.REACT_APP_ENV === "uat" ||
    process.env.REACT_APP_ENV === "prod"
  ) {
    const noop = () => {};

    console.log = noop;
    console.info = noop;
    console.warn = noop;
    // console.error = noop;
    console.debug = noop;
    console.trace = noop;
    console.table = noop;
    console.dir = noop;
    console.group = noop;
    console.groupCollapsed = noop;
    console.groupEnd = noop;
    console.time = noop;
    console.timeEnd = noop;
    console.timeLog = noop;
    console.clear = noop;
  }
};

export default disableConsole;
