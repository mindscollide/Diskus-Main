/**
 * @file history_logout.js
 * @description Singleton holder for global app references that need to be
 * accessed outside the React component tree (e.g. inside Axios interceptors
 * or MQTT callbacks).
 */

/**
 * Global static reference bag used to share mutable app-level handles.
 *
 * @property {Function|null} navigate    - React Router `navigate` function,
 *   set on app mount so non-component code can redirect programmatically.
 * @property {Object|null}   socket      - Active Paho MQTT client instance
 *   for the authenticated user.
 * @property {boolean}       isReload    - Flag set to `true` when a forced
 *   page reload is triggered (e.g. after token refresh).
 * @property {Object|null}   guestSocket - Paho MQTT client for guest/video
 *   meeting participants who are not fully authenticated.
 */
class Helper {
  static navigate = null;
  static socket = null;
  static isReload = false;
  static guestSocket = null;
}
export default Helper;
