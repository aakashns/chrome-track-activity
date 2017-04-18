function startTrackingActivity(onSessionStart, onSessionEnd) {
  var session = { tabId: -1 };

  function endSession() {
    if (session.tabId !== -1) {
      session.endTime = Date.now();
      onSessionEnd && onSessionEnd(session);
      session = { tabId: -1 };
    }
  }

  function startSession(tab) {
    endSession();
    session = {
      tabId: tab.id,
      url: tab.url,
      startTime: Date.now()
    };
    onSessionStart &&
      onSessionStart({
        tabId: session.tabId,
        url: session.url,
        startTime: session.startTime
      });
  }

  function trackWindowFocus(windowId) {
    if (windowId !== -1) {
      chrome.windows.getCurrent({ populate: true }, function(window) {
        var activeTab = window.tabs.filter(function(tab) {
          return tab.active;
        })[0];
        if (activeTab && activeTab.id !== session.tabId) {
          startSession(activeTab);
        }
      });
    } else {
      endSession();
    }
  }

  function trackActiveTab(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      if (!chrome.runtime.lastError && tab.id !== session.tabId) {
        startSession(tab);
      }
    });
  }

  function trackTabUpdates(tabId, changeInfo, tab) {
    if (
      tab.active && changeInfo.status === "loading" && tab.url !== session.url
    ) {
      chrome.windows.get(tab.windowId, function(window) {
        if (!chrome.runtime.lastError && window.focused) {
          startSession(tab);
        }
      });
    }
  }

  chrome.windows.onFocusChanged.addListener(trackWindowFocus);
  chrome.tabs.onUpdated.addListener(trackTabUpdates);
  chrome.tabs.onActivated.addListener(trackActiveTab);

  return function stopTracking() {
    chrome.windows.onFocusChanged.removeListener(trackWindowFocus);
    chrome.tabs.onUpdated.removeListener(trackTabUpdates);
    chrome.tabs.onActivated.removeListener(trackActiveTab);
  };
}

if (typeof exports !== "undefined") {
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = trackActivity;
  }
  exports.trackActivity = trackActivity;
}
