function formatTime(t) {
  var time = new Date(t);
  return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

function onSessionStart(session) {
  console.log("START", formatTime(session.startTime), session.url);
}

function onSessionEnd(session) {
  console.log("END", formatTime(session.endTime), session.url);
}
var stopTracking = startTracking(onSessionStart, onSessionEnd);
