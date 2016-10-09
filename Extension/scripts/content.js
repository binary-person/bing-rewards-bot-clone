// block alerts
var s = document.createElement("script");
s.src = chrome.extension.getURL("scripts/block-alerts.js");
(document.head||document.documentElement).appendChild(s);
(document.head||document.documentElement).removeChild(s);