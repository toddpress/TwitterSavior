// very contents. wow. 
var blacklist, whitelist, unhandledTweets;

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
		blacklist = lists.blacklist;
		whitelist = lists.whitelist;
		// handleTweets();
		console.log('blacklist', blacklist, 'whitelist', whitelist);
	});	
}

