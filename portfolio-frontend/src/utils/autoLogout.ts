const INACTIVITY_LIMIT = 5 * 60 * 1000;
//const INACTIVITY_LIMIT = 30 * 1000; // 30 seconds for testing

let logoutTimer: ReturnType<typeof setTimeout> | undefined;

const activityEvents = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
  "authChanged"
];

function logoutUser() {
  clearTimeout(logoutTimer);

  localStorage.removeItem("id");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");

  window.dispatchEvent(new Event("authChanged"));

  window.location.href = "/signin";
}

function resetLogoutTimer() {
  clearTimeout(logoutTimer);

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  logoutTimer = setTimeout(logoutUser, INACTIVITY_LIMIT);
}

export function startAutoLogout() {
  activityEvents.forEach((event) => {
    window.addEventListener(event, resetLogoutTimer);
  });

  resetLogoutTimer();
}

export function stopAutoLogout() {
  clearTimeout(logoutTimer);
  logoutTimer = undefined;

  activityEvents.forEach((event) => {
    window.removeEventListener(event, resetLogoutTimer);
  });
}
