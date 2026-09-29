// Plays a sound (e.g. a call ringtone). Browsers can refuse to play audio
// before the user has interacted with the page (Safari always does); instead
// of failing silently with an unhandled rejection, retry on the next click,
// key press or touch. Returns a stop() function that also removes the retry.
export const playSoundWithAutoplayRetry = (src, { loop = false } = {}) => {
  const audio = new Audio(src);
  audio.loop = loop;

  let stopped = false;
  const retryEvents = ["click", "keydown", "touchstart"];

  const removeRetry = () => {
    retryEvents.forEach((eventName) =>
      document.removeEventListener(eventName, retry, true),
    );
  };

  function retry() {
    removeRetry();
    if (!stopped) {
      audio.play().catch(() => {});
    }
  }

  audio.play().catch(() => {
    if (!stopped) {
      retryEvents.forEach((eventName) =>
        document.addEventListener(eventName, retry, true),
      );
    }
  });

  return () => {
    stopped = true;
    removeRetry();
    audio.pause();
    audio.currentTime = 0;
  };
};
