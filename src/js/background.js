// js commment yay

var defaultSettings = {
		whitelist: ['todd', 'twitter savior'],
		blacklist: ['boo', 'far'],
		options: {
			'use_whitelist': 'false',
			'use_blacklist': 'true'
		}
	}

// function cl(msg) {
// 	console.log(msg); 
// };
// 
function handleStorage() {
	if(!localStorage.settings){
		localStorage.settings = JSON.stringify(defaultSettings);
	} 

	settings = JSON.parse(localStorage.settings);

	return settings;
}
