/**
 * Build-time feature flags
 *
 * Each flag is set in the environment file loaded for that build target:
 *
 *   npm run build          → .env          (default — all features on)
 *   npm run build:pso      → .env.pso      (PSO build — video hidden)
 *   npm run build:uat      → .env.uat      (UAT build)
 *   npm run build:staging  → .env.staging  (Staging build)
 *
 * Usage in any component:
 *
 *   import { HIDE_VIDEO } from "@/commen/featureFlags";
 *   {!HIDE_VIDEO && <VideoButton />}
 */

export const HIDE_VIDEO = process.env.REACT_APP_HIDE_VIDEO === "true";
export const ALLOW_AGENDA_START_TIME_AND_END_TIME =
  process.env.REACT_APP_MANAGE_AGENDA_START_END_TIME === "true";
export const HIDE_FREETRAIL_BAR =
  process.env.REACT_APP_HIDE_HEADER_FREETRAIL_BAR === "true";
export const PSO_LOGO = process.env.REACT_APP_SHOW_PSO_LOGO === "true";
