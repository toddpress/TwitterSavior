// very content. wow. 
var blacklist, whitelist, unhandledTweets;

$.fn.isNearViewport = function(){
    var win = $(window),
    	top = win.scrollTop(),
    	bottom = top + win.height();

    var view = {
        top : top,
        bottom: bottom
    };
    
    var bounds = this.offset();
    bounds.bottom = bounds.top + this.outerHeight();
    
    return (!(view.bottom < bounds.top || view.top > bounds.bottom));
};

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
		handleTweets();
		console.log('blacklist', blacklist, 'whitelist', whitelist);
	});	
}

function appendBtn(el) {
		if (!$(el).find(".unblurTweet").length) {
			$(el).append('<button class="unblurTweet">Show</button>');	
		}
}

function handleTweets() {
	blacklistedWordsInTweet = [], whitelistedWordsInTweet = [];

	unhandledTweets = $('#stream-items-id .tweet-text:not(.blacklisted):not(.whitelisted)');
	$('.tweet.promoted-tweet').parent().remove();
	$('#stream-items-id li').not('.blacklisted').children('button').hide();

	unhandledTweets.each(function( index ) {
		var $tweet = $(unhandledTweets[index]),
			$parent = $tweet.closest('li[data-item-type=tweet]');

		blacklistedWordsInTweet = [],
		whitelistedWordsInTweet = [];

		blacklist.forEach(function( item ) {
			var text = $tweet.text().toLowerCase().split(" ");
			if(text.indexOf(item) != -1){
				blacklistedWordsInTweet.push(item);
			}
		});

		whitelist.forEach(function( item ) {
			var text = $tweet.text().toLowerCase().split(" ");
			if(text.indexOf(item) != -1){
				whitelistedWordsInTweet.push(item);
			}
		});

		if(blacklistedWordsInTweet.length) {
			$parent.addClass( 'blacklisted' ).data({blacklisted: blacklistedWordsInTweet});
			$parent.on('click', function(e){
				if($(e.target).hasClass('unblurTweet')) {
					$parent.toggleClass('unblurred');
					$(e.target).toggleClass('blurTweet');					
				} else if (!$parent.hasClass('unblurred')) {
					e.preventDefault();
					e.stopPropagation();							
				}
			});
			appendBtn($parent);
		} else {
			$parent.removeClass('blacklisted unblurred').data({blacklisted: blacklistedWordsInTweet});
			$parent.children('button.unblurTweet').remove();
		}

		if (whitelistedWordsInTweet.length) {
			$parent.addClass( 'whitelisted' ).data({whitelisted: whitelistedWordsInTweet});
		} else {
			$parent.removeClass('whitelisted').data({whitelisted: whitelistedWordsInTweet});
		}

	});
 }

getLocalStorage();

// $(window).on('scroll', function() {
// 	var tTo = setTimeout(function(){
// 		handleTweets();	
// 	}, 4000);
// });
