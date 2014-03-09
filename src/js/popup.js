var bg = chrome.extension.getBackgroundPage();
var settings, whitelist, blacklist, options, useWhitelist, useBlacklist;

function changedLocalStorage() {
	chrome.tabs.query({currentWindow: true}, function(tabs){		
		var len = tabs.length;
		for (var i = 0; i<len; i++) {
 			chrome.tabs.sendMessage(tabs[i].id, {method: 'changedLocalStorage'});
 		}
	});
}

function reflowULs(){
	$(".pillbox").each(function(){
		lis = $(this).find("li");
		$(lis[0]).css("margin-left", "0");
		$(lis).each(function(i){
			if(i>0){
				$(this).css("margin-left", "0.3em");
				if ($(this).position().top > $(this).prev().position().top){
					$(this).css("margin-left", "0");
				}
			}			
		});
	});
}

function init(){
	settings = bg.handleStorage();
	whitelist = settings.whitelist;
	blacklist = settings.blacklist;
	options = settings.options;
	useWhitelist = options.use_whitelist;
	useBlacklist = options.use_blacklist;

	var wClass = useWhitelist == false ? 'disabled' : '',
		bClass = useBlacklist == false ? 'disabled' : '';

	for (w in whitelist) {
		$('#whitelist').append("<li class='"+wClass+"'><span>"+whitelist[w]+"</span><span class='deleteItem'>&#x00D7;</span>");
	}
	for (b in blacklist) {
		$('#blacklist').append("<li class='"+bClass+"'><span>"+blacklist[b]+"</span><span class='deleteItem'>&#x00D7;</span>");
	}
	setTimeout(function(){
		reflowULs();
	}, 10);
}

function isNullOrWhiteSpace(str){
    return str === null || str.match(/^ *$/) !== null;
}

function validateInput(value) {
	if ($('.pillbox li:contains('+ value + ')').length) return false;
	if (!isNullOrWhiteSpace(value)){
		return true;
	}
	return false;
}

function listChangeHandler(_list) {
	var listArray = [],
		list = _list;

	$('#'+list+' li').each(function(i, el){
		var text = $.trim($(el).find('span:first-child').text().toLowerCase());
		listArray.push(text);
	});
	var currentSettings = JSON.parse(localStorage.settings);
	currentSettings[list] = listArray;
	localStorage.settings = JSON.stringify(currentSettings);
	changedLocalStorage();
	reflowULs();
	return true;
}

$(function() {
	// localStorage.clear(); // remove in prod
	init();
	
	$("#blacklistForm input").on("keypress", function(e){
		if (e.which == 13) {
			input =  $("#blacklistForm input");
			item = input.val();
			if(validateInput(item)){
				$("#blacklist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
				listChangeHandler("blacklist");			
			}	
			input.val("");
		}
	});
	
	$("#whitelistForm input").on("keypress", function(e){
		if (e.which == 13) {
			input =  $("#whitelistForm input");
			item = $("#whitelistForm input").val();
			if(validateInput(item)){
				$("#whitelist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");			
				listChangeHandler("whitelist");
			}	
			input.val("");
		}
	});
	
	$("#blacklistForm").on("click", "button", function(){
		input =  $("#blacklistForm input");
		item = input.val();
		if(validateInput(item)){
			blacklist.push(item);
			$("#blacklist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
			listChangeHandler("blacklist");			
		}
		input.val("");
	});
	
	$("#whitelistForm").on("click", "button", function(){
		input =  $("#whitelistForm input");
		item = $("#whitelistForm input").val();
		if(validateInput(item)){
			whitelist.push(item);
			$("#whitelist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
			listChangeHandler('whitelist');
		}	
		input.val("");
	});
	
	$('.pillbox').on("click", "span.deleteItem", function(e){
		item = $(e.target).prev().text();
		listItem = $(e.target).parent();
		list = $(listItem).parents("ul").attr("id");
		$(listItem).fadeOut(400, function(){
			$.when($(this).remove()).then(listChangeHandler(list));
			reflowULs();
		});		
		
	});
	
	$(".pillbox").on("mouseenter mouseleave", "span.deleteItem", function(){
		$(this).parent().toggleClass("linethrough");
	});
});
