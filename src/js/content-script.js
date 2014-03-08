// very content. wow. 
var blacklist, whitelist;

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

		console.log("blacklist", blacklist, "whitelist", whitelist); // We're getting msgs!
	});	
}

getLocalStorage();

document.addEventListener('DOMNodeInserted', function(e) {

});