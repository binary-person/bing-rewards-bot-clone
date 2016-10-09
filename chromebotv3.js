

var waitTimer = 0;
var mobileDisabled = 0;
var ExtIsInstalled;
var ExtId = "fjkloikadaafjolfnhhiogalghodfkmf";

if (ExtIsInstalled)
{
	var element = document.getElementById("status");
	element.classList.add("installed");
	document.getElementById("status").innerHTML = "Installed";
}
else
{
	var element = document.getElementById("status");
	element.classList.add("not-installed");
	document.getElementById("status").innerHTML = "Not Installed or Disabled <span class=\"download\"> (<a href=\"https://chrome.google.com/webstore/detail/pogocheats-bot-helper/fjkloikadaafjolfnhhiogalghodfkmf\" target=\"_blank\">Download Now</a>)</span>";
	document.getElementById('mobilecounter').disabled = true;
	mobileDisabled = 1;
}

function Start()
{
	$('#done').hide();
	$('#frmLoader').show();

	document.getElementById('counter').disabled = true;
	document.getElementById('mobilecounter').disabled = true;
	document.getElementById('sWaitOne').disabled = true;
	document.getElementById('sWaitTwo').disabled = true;
	document.getElementById('search').disabled = true;
	document.getElementById('search').value = "Please Wait";
	$("#search").css("background", "#00AA00");

	var count = +document.getElementById('counter').value;
	var mcount = +document.getElementById('mobilecounter').value;
	if (count == 0)
	{
		var brbcookie = readCookie('BSBChromeBot');
		if (brbcookie)
		{
			var array = brbcookie.split(",");
			count = array[3];
			mcount = array[4];
			if (count == 0) { count = 30; }
		}
		else
		{
			count = 30;
			mcount = 20;
		}
		document.getElementById('counter').value = count;
		document.getElementById('mobilecounter').value = mcount;
	}

	waitTimer = 0;
	save_settings();
	load_dictionary();
}

function load_dictionary()
{
	var use_dict = document.getElementById("dict_words");
	var use_top = document.getElementById("top_words");

	if (use_dict.checked) {
		var words_url = "dictionary.txt";
		var dict_type = "dictionary";
	}
	if (use_top.checked) {
		var words_url = "dictionary.txt";
		var dict_type = "top keywords";
	}

	document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Loading '+dict_type+' file ...<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"/web/20160516141346/http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';

	$.ajax({
		url : words_url,
		dataType: "text",
		cache: false,
		success : function (data) {
			window.words = data.split("\n");
			Search();
		},
		error: function() {
			waitTimer = 5;
			dictName = dict_type;
			setTimeout("load_timeout()", 1000);
		}
	});
}

function load_timeout()
{
	if (waitTimer == 0)
	{
		clearTimeout(dictTimeout);
		waitTimer = 0;
		load_dictionary();
		return;
	}
	else
	{
		var secs;
		if (waitTimer == 1) { secs = 'second'; } else { secs = 'seconds'; }
		document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Loading '+dictName+' file ... <font style=\"color:red;\">Failed</font> ... Retrying in '+waitTimer+' '+secs+' ...</div><div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';
		waitTimer--;
	}
	dictTimeout = setTimeout("load_timeout()", 1000);
}

function Search()
{
	var searchTimeout;
	if (waitTimer == 0)
	{
		var min = +document.getElementById('sWaitOne').value;
		var max = +document.getElementById('sWaitTwo').value;
		waitTimer = Math.floor(Math.random() * (max - min + 1)) + min;

		var count = +document.getElementById('counter').value;
		count = count - 1;
		document.getElementById('counter').value = count;

		if (count == 0 && mobileDisabled == 1) { waitTimer = 0; }

		if (count == -1)
		{
			document.getElementById('counter').value = '0';
			clearTimeout(searchTimeout);
			waitTimer = 0;

			var MobileSearches = document.getElementById('mobilecounter').value;
			if (MobileSearches > 0 && mobileDisabled == 0)
			{
				chrome.runtime.sendMessage(ExtId, {enableMobile: 1});
				SearchMobile();
				return;
			}
			else
			{
				document.getElementById('counter').disabled = false;
				if (mobileDisabled == 0) { document.getElementById('mobilecounter').disabled = false; }
				document.getElementById('sWaitOne').disabled = false;
				document.getElementById('sWaitTwo').disabled = false;
				document.getElementById('search').disabled = false;
				document.getElementById('search').value = "Start Searching!";
				$("#search").css("background", "#487BC0");
				$('#frmLoader').hide();
				$('#done').show();
				document.getElementById('status_message').innerHTML = "<strong>Status</strong> : <font color=\"green\"><strong>Finished!</strong></font> - come back each day to earn more reward points!<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>";
				return;
			}
		}

        var idx = Math.floor(window.words.length * Math.random());
        var searchQuery = window.words[idx];

		document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Loading <strong>'+searchQuery+'</strong> search results ...<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';

		var searchQuery = searchQuery.replace(/^\s+|\s+$/g,"");
		var searchQuery = searchQuery.replace(/\s+/g, '+');

		document.getElementById('frmLoader').src = 'http://www.bing.com/search?q=' + searchQuery;
	}
	else
	{
		var secs;
		if (waitTimer == 1) { secs = 'second'; } else { secs = 'seconds'; }
		document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Sleeping for <strong>'+waitTimer+'</strong> '+secs+' ...<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';
		waitTimer--;
	}
	searchTimeout = setTimeout("Search()", 1000);
}

function SearchMobile()
{
	var mSearchTimeout;
	if (waitTimer == 0)
	{
		var min = +document.getElementById('sWaitOne').value;
		var max = +document.getElementById('sWaitTwo').value;
		waitTimer = Math.floor(Math.random() * (max - min + 1)) + min;

		var count = +document.getElementById('mobilecounter').value;
		count = count - 1;
		document.getElementById('mobilecounter').value = count;

        var idx = Math.floor(window.words.length * Math.random());
        var searchQuery = window.words[idx];

		document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Loading <strong>'+searchQuery+'</strong> search results ...<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';

		var searchQuery = searchQuery.replace(/^\s+|\s+$/g,"");
		var searchQuery = searchQuery.replace(/\s+/g, '+');

		document.getElementById('frmLoader').src = 'http://www.bing.com/search?q=' + searchQuery;

		if (count == 0)
		{
			clearTimeout(mSearchTimeout);
			waitTimer = 0;

			setTimeout(function()
			{
				document.getElementById('counter').disabled = false;
				document.getElementById('mobilecounter').disabled = false;
				document.getElementById('sWaitOne').disabled = false;
				document.getElementById('sWaitTwo').disabled = false;
				document.getElementById('search').disabled = false;
				document.getElementById('search').value = "Start Searching!";
				$("#search").css("background", "#487BC0");
				$('#frmLoader').hide();
				$('#done').show();
				document.getElementById('status_message').innerHTML = "<strong>Status</strong> : <font color=\"green\"><strong>Finished!</strong></font> - come back each day to earn more reward points!<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>";
				chrome.runtime.sendMessage(ExtId, {disableMobile: 1});
			}, 1000);
			return;
		}
	}
	else
	{
		var secs;
		if (waitTimer == 1) { secs = 'second'; } else { secs = 'seconds'; }
		document.getElementById('status_message').innerHTML = '<strong>Status</strong> : Sleeping for <strong>'+waitTimer+'</strong> '+secs+' ...<div class=\"advert\"><font style=\"color:red;\"><strong>New!</strong></font> <a href=\"http://www.pogocheats.net/bing-search-bot/\">Bing Search Bot</a> - multiple accounts, mobile searches, custom words, proxies &amp; more!</div>';
		waitTimer--;
	}
	mSearchTimeout = setTimeout("SearchMobile()", 1000);
}

function save_settings()
{
	var SaveSettings = 1;
	var sWaitOne = document.getElementById('sWaitOne').value;
	var sWaitTwo = document.getElementById('sWaitTwo').value;
	var Counter = document.getElementById('counter').value;
	var MobileCounter = document.getElementById('mobilecounter').value;
	var Search = $('input[name="searchForm"]:checked').val();
	setCookie('BSBChromeBot', ''+SaveSettings+','+sWaitOne+','+sWaitTwo+','+Counter+','+MobileCounter+','+Search+'', 365);
}

function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
