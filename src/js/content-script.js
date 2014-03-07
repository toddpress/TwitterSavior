// very content. wow. 
var blacklist, whitelist;

chrome.runtime.sendMessage({method: "getLocalStorage", key: "lists"}, function(response) {
		var lists = response.data;
		blacklist = lists.blacklist;
		whitelist = lists.whitelist;

		console.log("blacklist", blacklist, "whitelist", whitelist);
});	

document.addEventListener('DOMNodeInserted', function(e) {

});