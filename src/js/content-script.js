/**
 * Huge thanks to @jmar777 for great advice
 * 
 */

var blacklist, whitelist, reBlacklist, reWhitelist,
	reOpen = '(?:^|[^a-z])(?:',
	reClose = ')(?:$|[^a-z])';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == 'changedLocalStorage') {
		getLocalStorage();
	}
	sendResponse({});
});

function getLocalStorage() {
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "lists"}, function(response) {
		var lists = response.data;
		blacklist = lists.blacklist;
		whitelist = lists.whitelist;
		reBlacklist = getRegExList(blacklist);
		reWhitelist = getRegExList(whitelist);		
		handleTweets();
	});	
}

function getRegExList(arrList) {
	escList = arrList.map(function(item) {
		return item.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	});

	return new RegExp(reOpen + escList.join('|') + reClose, 'i');
}

function handleTweets() {
	$('.blacklist').removeClass('blacklist');
	$('#timeline li[data-item-type="tweet"]').each(function(i, tweet) {
		var txt = $(tweet).find('.tweet-text').text();
		if (blacklist.length && reBlacklist.test(txt)) {
			$(tweet).addClass('blacklist');
		}
	});
}

$(function() {
	getLocalStorage();

	document.getElementById('timeline').addEventListener('DOMNodeInserted', function(e) {
		if ($(e.target).data('item-type') == 'tweet') {
			setTimeout(function() {
				handleTweets();
			}, 200);
		}
	}, false);

});


