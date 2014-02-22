var blacklist = whitelist = [];

function getProperList(_list) {
	return _list[0] == "" ? _list.shift() : _list;
}

chrome.runtime.onMessage.addListener(function(message) {
		lists = message.split("%$%$%");
		blacklist = getProperList(lists[0].split('**%**'));
		whitelist = getProperList(lists[1].split('**%**'));
		console.log(blacklist);
		console.log(whitelist);
		handleTweets();
	});

function addGlobalStyles() {
	// TODO: put meaningful styles here
	var blacklistStyle = "<style>\
	.blacklisted\
	{\
		background-color:yellow\
	}\
	  </style>\
	</div>";
 
	$("head").append(blacklistStyle);
}



function handleTweets() {
	var unhandledTweets = $('.tweet-text:not(.whitelisted):not(.blacklisted)');
	unhandledTweets.each(function( index ) {
		var blacklistedWordsInTweet = [];

		blacklist.forEach(function( blacklistMember ) {
			if($(unhandledTweets[index]).text().toLowerCase().indexOf(" " + blacklistMember + " ") != -1){
				blacklistedWordsInTweet.push(blacklistMember);
			}
		});

		if(blacklistedWordsInTweet.length) {
			$(unhandledTweets[index]).addClass( 'blacklisted' );
			console.log(blacklistedWordsInTweet.toString() + " // " + $( unhandledTweets[index] ).text());
		}		
	});
}



addGlobalStyles();
handleTweets();
