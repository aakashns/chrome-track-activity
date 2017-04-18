# chrome-track-activity
Utility function to track browsing activity in a Chrome extension.

<img src="http://oi63.tinypic.com/k49enb.jpg" />

## Usage

This package exports a single function `startTrackingActivity` which can be used to track a user's browsing activity. 

The following example demonstates its usage:

```javascript
function onSessionStart(session) {
  console.log("START", session.startTime, session.url);
}

function onSessionEnd(session) {
  console.log("END", session.endTime, session.url);
}
var stopTracking = startTrackingActivity(onSessionStart, onSessionEnd);
```

`startTrackingActivity` accepts two arguments:

1. `onSessionStart`: Invoked each time the user loads a new page in the foreground tab or navigates to an existing page. The argument `session` contains the `url`, `startTime` and `tabId` for the new page.

2. `onSessionEnd`: Invoked each time the user loads a new page in the foreground tab, changes the tab or window, closes the foreground tab, or leaves the browser window. The argument `session` contains the `url`, `startTime`, `tabId` and `endTime` for the page that was closed/changed.

The return value of `startTrackingActivity` is another function, which can called to discontinue tracking when it is no longer required.

## Installation

**IMPORTANT NOTE**: To use `startTrackingAcvitity`, you need to declare the ["tabs"](https://developer.chrome.com/extensions/tabs#manifest) permission in your extension's [manifest](https://developer.chrome.com/extensions/manifest) file.

### Method 1: Copy-paste

The easiest way to add the utility `startTrackingActivity` is to copy-paste the code from [`tracking.js`](https://raw.githubusercontent.com/aakashns/chrome-track-activity/master/tracking.js) into your [background script/page](https://developer.chrome.com/extensions/background_pages). It's only 70 lines!

### Method 2: `<script>` tag

First download the the file into your extension directory using the following command: 

```
curl -O https://raw.githubusercontent.com/aakashns/chrome-track-activity/master/tracking.js
```

Then include it in your background page using a script tag:

```html
<head>
   <script src="tracking.js"></script>
</head>
```

Check out the [example](./example/) for an example of this approach.


### Method 3: Install from `npm`

Install the package from npm by running:

```
npm install chrome-track-activity --save
```

Then include it in your script using `require`:

```
var startTrackingActivity = require('chrome-track-activity');
```

## Running the Example

The `example` directory contains and example extension which uses `startTrackingActivity` to log the browsing activity of the user. 

First, clone the repository:

```
git clone https://github.com/aakashns/chrome-track-activity.git
```

Then, follow the instructions on [this page](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension into your browser. 

Then, visit chrome://extensions and inspect the background page:

<img src="http://oi65.tinypic.com/33ygm07.jpg" /> 

Open the 'Console' tab, leave the inspector window, and continue using the browser normally. You should see a log of the browsing activity as you enter and leave pages, like this:

<img src="http://oi63.tinypic.com/k49enb.jpg" />

The logic for the extension lives is [background.js](https://github.com/aakashns/chrome-track-activity/blob/master/example/background.js).
