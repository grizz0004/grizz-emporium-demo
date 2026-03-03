window.App = window.App || {};

// debug indicator – see console to verify script is loaded
console.log('popular.js executed');

// 10 most-popular items (handpicked for now)
// protect against missing data definitions by defaulting to empty arrays
const subs = (window.App.SUBSCRIPTIONS || []);
const games = (window.App.GAMES || []);
window.App.POPULAR_ITEMS = [
  // several subscriptions
  subs.find(s => s.brand === "Discord Nitro"),
  subs.find(s => s.brand === "YouTube Premium"),
  subs.find(s => s.brand === "Netflix Premium"),
  subs.find(s => s.brand === "Spotify Premium"),
  subs.find(s => s.brand === "ChatGPT Plus"),
  // some games/services
  games.find(g => g.brand === "Cheaper Games Service"),
  games.find(g => g.brand === "Epic Games Service"),
  games.find(g => g.brand === "Fall Guys Service"),
  games.find(g => g.brand === "Fortnite Service"),
  games.find(g => g.brand === "League of Legends RP"),
].filter(Boolean);
