// Shared anonymous usage tracking for the Wyman tools.
// Counts events (started / completed) AND unique people, by giving each
// browser a random ID stored locally. No names, no personal data.
(function () {
  function visitorId() {
    try {
      var key = 'wii_visitor';
      var id = localStorage.getItem(key);
      if (!id) {
        id = 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(key, id);
      }
      return id;
    } catch (e) {
      return null;
    }
  }

  // Fire a tracking event. Always safe — never blocks or breaks the page.
  window.wiiTrack = function (tool, eventName) {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool, event: eventName, visitorId: visitorId() })
      }).catch(function () {});
    } catch (e) {}
  };

  // Fire "started" at most once per page load, so opening or re-rating
  // doesn't inflate the count.
  var startedTools = {};
  window.wiiStartOnce = function (tool) {
    if (startedTools[tool]) return;
    startedTools[tool] = true;
    window.wiiTrack(tool, 'started');
  };
})();
