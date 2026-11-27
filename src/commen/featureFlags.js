/**
 * Feature flags
 *
 * Each flag is set in the runtime configuration (`/runtime-config.js`, validated
 * in src/config/appConfig.js), so one build can be deployed with different
 * features per environment — e.g. PSO sets HIDE_VIDEO and SHOW_PSO_LOGO. Changing
 * a flag means editing that file on the server; no rebuild.
 *
 * Usage in any component:
 *
 *   import { HIDE_VIDEO } from "@/commen/featureFlags";
 *   {!HIDE_VIDEO && <VideoButton />}
 */

import appConfig from "../config/appConfig";

export const HIDE_VIDEO = appConfig.HIDE_VIDEO;
export const ALLOW_AGENDA_START_TIME_AND_END_TIME =
  appConfig.MANAGE_AGENDA_START_END_TIME;
export const HIDE_FREETRAIL_BAR = appConfig.HIDE_HEADER_FREETRAIL_BAR;
export const PSO_LOGO = appConfig.SHOW_PSO_LOGO;
