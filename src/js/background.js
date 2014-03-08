// js commment yay

var defaultSettings = {
		whitelist: ['todd', 'twitter savior'],
		blacklist: ['boo', 'far'],
		options: {
			'use_whitelist': 'false',
			'use_blacklist': 'true'
		}
	}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
    	var key = request.key,
    		settingsObj = JSON.parse(localStorage.settings),
    		res = {};
    		
    	if (key === 'lists') {
    		res.whitelist = settingsObj.whitelist;
    		res.blacklist = settingsObj.blacklist;
    	} else if (key === 'settings') {
    		res = settingsObj.options;
    	}
    	sendResponse({data: res});
    } else {
    	sendResponse({}); // snub them.
    }
});

function handleStorage() {
	if(!localStorage.settings){
		localStorage.settings = JSON.stringify(defaultSettings);
	} 

	settings = JSON.parse(localStorage.settings);

	return settings;
}