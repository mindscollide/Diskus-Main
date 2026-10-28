import styles from "./PageFallback.module.css";

/**
 * Shown while a lazily loaded route chunk is being fetched.
 *
 * Deliberately dependency-free: no Redux, no antd, no i18n and no images.
 * It renders in exactly the moment the app is waiting for code, so it must not
 * itself depend on code that has not been loaded yet (the shared `Loader`
 * element pulls in the store, antd and a GIF).
 */
const PageFallback = () => (
  <div className={styles.wrap} role='status' aria-live='polite'>
    <span className={styles.spinner} aria-hidden='true' />
  </div>
);

export default PageFallback;
