// moodTheme.js

// Apply mood to <html> so your CSS works
export function applyMoodTheme(mood) {
  document.documentElement.setAttribute("data-mood", mood);
}

export function setMood(mood) {
  localStorage.setItem("userMood", mood);
  applyMoodTheme(mood);
}

export function initMood() {
  const savedMood = localStorage.getItem("userMood") || "neutral";
  applyMoodTheme(savedMood);
}
