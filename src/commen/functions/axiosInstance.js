/**
 * The single axios client every API call in the app goes through.
 *
 * Two things it owns, so no call site has to think about them:
 *   1. attaching the auth token to every request
 *   2. detecting an expired/invalid session in the response and signing out
 *
 * ── The response convention this backend uses ────────────────────────────────
 * Failures are NOT signalled by HTTP status. The server answers 200 and puts the
 * real outcome in the body as `responseCode` (+ `errorMessage`), which is why the
 * interceptors below inspect `response.data` rather than `response.status`, and
 * why the same auth check has to be repeated in both the success and the error
 * handler — an expired session can arrive down either path.
 *
 * ── Known rough edges, documented rather than silently changed ───────────────
 * • On the two sign-out branches in the SUCCESS handler this returns `undefined`
 *   instead of rejecting. Callers doing `.then(res => res.data)` will therefore
 *   throw on a session expiry rather than land in `.catch`. Sign-out is already
 *   under way at that point so it rarely surfaces, but it is the reason some
 *   call sites guard with `response?.data`.
 * • The error handler reads `error.response.data` unguarded, so a request that
 *   fails with no response at all (network down, DNS, timeout, CORS preflight)
 *   throws inside the interceptor and masks the original error.
 */
import axios from "axios";
import { signOut } from "../../store/actions/Auth_Sign_Out";
import store from "../../store/store";

const axiosInstance = axios.create({
  // Read once at module load. Changing REACT_APP_BASE_URL needs a rebuild, not
  // just a restart, because CRA inlines it at build time.
  baseURL: process.env.REACT_APP_BASE_URL,
});

// ------------------- REQUEST -------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // The token is stored JSON-encoded, hence the parse, and is sent as the
    // custom `_token` header this backend expects — not `Authorization:
    // Bearer`. Requests made with bare axios/fetch instead of this instance
    // will be unauthenticated.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers._token = JSON.parse(token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ------------------- RESPONSE -------------------
axiosInstance.interceptors.response.use(
  (response) => {
    let data = response.data;

    // Downloads are requested as `responseType: "arraybuffer"`, so a session
    // expiry on one of those arrives as bytes rather than an object. Decode it
    // back to JSON so the auth checks below still see the responseCode instead
    // of silently handing the caller a corrupt "file".
    if (data instanceof ArrayBuffer) {
      try {
        data = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
      } catch (error) {
        console.error(error);
      }
    }
    const code = Number(data?.responseCode);
    const message = (data?.errorMessage || "").toLowerCase().trim();

    // The three shapes a dead session arrives in. They are matched on the
    // message as well as the code because 400/401 are also used for ordinary
    // validation failures, which must NOT sign the user out.
    //   400 "Token is required"   - no token reached the server
    //   401 "tokens does not match" - token no longer matches the session
    //   401 "invalid agent"         - session bound to a different device/agent
    if (
      code === 400 &&
      message.toLowerCase() === "Token is required".toLowerCase()
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" ||
        message === "Invalid Agent".toLowerCase())
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    return response;
  },
  // Mirror of the checks above for genuine HTTP-level failures. Kept as a
  // separate copy rather than a shared helper because the two paths differ at
  // the end: this one re-rejects so call sites still see the error.
  (error) => {
    let data = error.response.data;

    // Same arraybuffer decode as the success path - see the comment there.
    if (data instanceof ArrayBuffer) {
      try {
        data = JSON.parse(new TextDecoder().decode(new Uint8Array(data)));
      } catch (error) {
        console.error(error);
      }
    }
    const code = Number(data?.responseCode);
    const message = (data?.errorMessage || "").toLowerCase().trim();

    if (
      code === 400 &&
      message.toLowerCase() === "Token is required".toLowerCase()
    ) {
      signOut("Session expired", store.dispatch);
      return;
    }

    if (
      code === 401 &&
      (message === "tokens does not match" ||
        message === "Invalid Agent".toLowerCase())
    ) {
      signOut("Session expired", store.dispatch);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
