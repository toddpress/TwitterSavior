var blacklist, whitelist, unhandledTweets, $tweets;

// $.fn.isNearViewport = function(){
// 	var win = $(window),
// 		top = win.scrollTop(),
// 		bottom = top + win.height();

// 	var view = {
// 		top : top,
// 		bottom: bottom
// 	};
	
// 	var bounds = this.offset();
// 	bounds.bottom = bounds.top + this.outerHeight();
	
// 	return (!(view.bottom < bounds.top || view.top > bounds.bottom));
// };

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == 'changedLocalStorage') {
		getLocalStorage();
	}
	sendResponse({});
});

function getLocalStorage() {
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "lists"}, function(response) {
		var lists = response.data;
		blacklist = formatList(lists.blacklist);
		whitelist = formatList(lists.whitelist);
	});	
}

function formatList(listArray) {
	var formattedList = {};
	listArray = $.makeArray(listArray);
	$.map(listArray, function(key, i) {
		return formattedList[key] = true;
	});
	return formattedList;
}

function handleTweets(tweets) {
	$('.blacklist').removeClass('blacklist')
	tweets.each(function(i, tweet) {
		var words = $(tweet).find('.tweet-text').text().split(' ');
		for (var i=0, len = words.length; i < len; i++) {
			if (blacklist[words[i]]) {
				$(tweet).addClass('blacklist');
			} 
		}
	});
}

getLocalStorage();

$(function() {
	$tweets = $('li[id^="stream-item-tweet"]');
	$tweets = $($tweets);
	handleTweets($tweets);
});

setInterval(function(){
	handleTweets($tweets);
}, 1000);	

var timeline = document.getElementById('timeline');

timeline.addEventListener('DOMNodeInserted', function(e) {
	if ($(e.target).data('item-type') == 'tweet') {
		if ($tweets){
			$tweets.push($(e.target));
		}
	}
}, false);
