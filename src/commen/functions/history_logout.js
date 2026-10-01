/**
 * A module-level box for references that live outside React's tree.
 *
 * Used as a static singleton (never instantiated) so non-React code - the MQTT
 * client, interceptors, plain helpers - can reach things React normally owns.
 * `Helper.socket` is the main one: mqttconnection.js writes the live client
 * here, and roughly a dozen screens read it back rather than threading it
 * through props or context.
 *
 * Consequences worth knowing:
 *   - The fields are plain statics, NOT reactive. `Helper.socket` changing does
 *     not re-render anything, which is why call sites poll it in effects or
 *     guard with `if (Helper.socket === null)`. Listing it in a dependency
 *     array (as some do) does not work the way it looks like it does.
 *   - Nothing resets it on sign-out, so values survive a logout within the same
 *     tab and must be treated as possibly stale.
 *
 * The filename is historical and no longer describes the contents - this holds
 * socket/navigation state, not logout history.
 */
class Helper {
  static navigate = null;
  static socket = null;
  static isReload = false;
  static guestSocket = null;
}
export default Helper;
