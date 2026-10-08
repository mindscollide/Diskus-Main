/**
 * Silence console output in production builds.
 *
 * Called once from src/index.js before the app renders, so it applies to every
 * later console call in the bundle. This is why the ~1,100 `console.log` calls
 * scattered through the codebase are not a production concern - they are
 * compiled in, but no-oped at startup.
 *
 * -- Which builds are actually silenced --------------------------------------
 * The check is `REACT_APP_ENV === "prod"`, matched against the value in the
 * .env file the build used:
 *
 *   .env.production -> prod      SILENCED
 *   .env.pso        -> prod      SILENCED
 *   .env.uat        -> uat       not silenced
 *   .env.staging    -> staging   not silenced
 *   .env.local      -> dev       not silenced
 *
 * So UAT and staging builds still log everything. If that is not wanted, widen
 * the condition rather than deleting call sites.
 *
 * `console.error` is deliberately left working (see the commented-out line) so
 * genuine failures still surface in production.
 */
const disableConsole = () => {
  if (process.env.REACT_APP_ENV === "prod") {
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
