// background.js


/* 
UTILITY FUNCTIONS
*/
chrome.browserAction.onClicked.addListener(function() {
	reflowULs();
});

function removeArrayItem(_item, _array) {
	var index = $.inArray(_item, _array);
	if (index != -1)
		_array.splice(index, 1);
}

function escapeHtml(unsafe) {
	return unsafe
		 .replace(/&/g, "&amp;")
		 .replace(/</g, "&lt;")
		 .replace(/>/g, "&gt;")
		 .replace(/"/g, "&quot;")
		 .replace(/'/g, "&#039;");
}

// REMOVE AFTER DEVEEE
function logLists() {
	console.log("Whitelist: " + localStorage["whitelist"]);
	console.log("Blacklist: " + localStorage["blacklist"]);
}



/* 
PLUGIN-SPECIFIC CODE
*/

function getLists(){
	lists = [];
	lists["black"] = localStorage["blacklist"].split('**%**');
	lists["white"] = localStorage["whitelist"].split('**%**');
	for (var list in lists){
		if(lists[list][0] == "") lists[list].shift();
	}
	return lists;
}
function validateItem(item) {
	lists = getLists();
	mergedLists = lists["white"].concat(lists["black"]);
	return mergedLists.indexOf(item) == -1;
}

function addListItem(list, item) {
	if (item.length) {
		switch (list) {
			case "white":
			case "black":
				strName = list;
				lists = getLists();
				list = lists[list];
				if (list[0] == "") list.shift();
				item = escapeHtml($.trim(item.toLowerCase()));
				if (validateItem(item)) {
					list.push(item); 
					localStorage[strName+"list"] = list.join('**%**');
					sendContent();
					return item;
				} 
		}
	}
	return false; 
}


function removeListItem(_list, _item){
	lists = getLists();
	list = lists[""+_list+""];
	removeArrayItem(_item, list);
	localStorage[_list+"list"] = list.join('**%**');
}

function sendContent() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		len = tabs.length;
		var listsString = localStorage["blacklist"] + "%$%$%" + localStorage["whitelist"];
		for (var i = 0; i<len; i++) {
			chrome.tabs.sendMessage(tabs[i].id, listsString);
		}
	 });
}
