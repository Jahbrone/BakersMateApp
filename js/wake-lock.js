let wakeLock = null;

async function enableWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      console.log("Wake lock released");
    });
    console.log("Wake lock active");
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

export function initWakeLock() {
  document.addEventListener("visibilitychange", () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
      enableWakeLock();
    }
  });
  enableWakeLock();
}