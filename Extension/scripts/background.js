var setMobileUA = 0;
var bsbTabId;

chrome.webRequest.onBeforeSendHeaders.addListener(function(data)
{
	var headers = data.requestHeaders;
	var reqTabId = data.tabId;

	if (setMobileUA && reqTabId == bsbTabId)
	{
		for (var i = 0; i < headers.length; i++)
		{
			if (headers[i].name == 'User-Agent')
			{
				headers[i].value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_4 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G35 Safari/601.1';
				break;
			}
		}
	}
	return {requestHeaders: headers};

}, {urls: ["<all_urls>"]}, ['requestHeaders', 'blocking']);


chrome.webRequest.onHeadersReceived.addListener(function(data)
{
	var headers = data.responseHeaders;
	var requestURL = data.url;
	var reqTabId = data.tabId;

	if (reqTabId == bsbTabId)
	{
		// set Access-Control-Allow-Origin to everything except reportActivity
		if (requestURL.indexOf("/rewardsapp/reportActivity") == -1)
		{
			headers.push({name: 'Access-Control-Allow-Origin', value: '*'});
		}
	}
	return {responseHeaders: headers};

}, {urls: ["<all_urls>"]}, ['responseHeaders', 'blocking']);


chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse)
{
	if (request.enableMobile) { setMobileUA = 1; }
	if (request.disableMobile) { setMobileUA = 0; }
	if (request.startSearching) { chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) { var tab = tabs[0]; bsbTabId = tab.id; setMobileUA = 0; }); }
});


var urls = [];
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	if (changeInfo.url) {
		urls[tabId] = changeInfo.url;
	}
	if (changeInfo.title && tabId == bsbTabId) {
		if (changeInfo.title != "Bing Rewards Bot (Chrome Edition)") { setMobileUA = 0; bsbTabId = 0; }
	}
});


chrome.tabs.onRemoved.addListener(function(tabId, removeinfo)
{
	var url = urls[tabId];
	if (typeof url != "undefined" && url.indexOf("pogocheats.net") != -1) { setMobileUA = 0; bsbTabId = 0; }
});
