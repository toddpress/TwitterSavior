
// $("#"+strName+"list").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
// reflowULs();

//when li is removed

var bg = chrome.extension.getBackgroundPage();

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
		})
	});
}

// will become unnecessary when json implemented
function deleteEmptyElements() {
	var wl = $("#whitelist li:first-child span:first-child"),
		 bl = $("#blacklist li:first-child span:first-child");
		 
	if (!wl.text().length){
		wl.parent().remove();
	} else if (!bl.text().length) {
		bl.parent().remove();
	}
}

function init(){
		// localStorage.clear(); // DEV'T ONLY --- comment out for data persistence testing
		if (!localStorage["blacklist"]) {
			localStorage["blacklist"] = localStorage["whitelist"]  = "";
		} else {
			lists = bg.getLists();
			for (var $list in lists) {
				list = localStorage[$list+"list"].split('**%**');
				for (var item in list) {
					$("#"+$list+"list").append("<li><span>"+list[item]+"</span><span class='deleteItem'>&#x00D7;</span>");
				}
			}
			bg.sendContent();
		}
}


$(function() {
	//localStorage.clear();

	init();
	deleteEmptyElements();
	reflowULs();

	$(window).on("storage", function() {
		bg.sendContent();
	});

	
	$("#blacklistForm input").on("keypress", function(e){
		if (e.which == 13) {
			input =  $("#blacklistForm input");
			item = input.val();
			if(item = bg.addListItem("black", item)){
				$("#blacklist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
				reflowULs();
			}	
			input.val("");
		}
	});
	
	$("#whitelistForm input").on("keypress", function(e){
		if (e.which == 13) {
			input =  $("#whitelistForm input");
			item = $("#whitelistForm input").val();
			if(item = bg.addListItem("white", item)){
				$("#whitelist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
				reflowULs();
			}	
			input.val("");
		}
	});
	
	$("#blacklistForm").on("click", "button", function(){
			input =  $("#blacklistForm input");
			item = input.val();
			if(item = bg.addListItem("black", item)){
				$("#blacklist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
				reflowULs();
			}

			input.val("");
	});
	
	$("#whitelistForm").on("click", "button", function(){
			input =  $("#whitelistForm input");
			item = $("#whitelistForm input").val();
			if(item = bg.addListItem("white", item)){
				$("#whitelist").append("<li><span>"+item+"</span><span class='deleteItem'>&#x00D7;</span>");
				reflowULs();
			}	
			input.val("");
	});
	
	$('.pillbox').on("click", "span.deleteItem", function(e){
		item = $(e.target).prev().text();
		listItem = $(e.target).parent();
		list = $(listItem).parents("ul").attr("id").split("list")[0];

		item = bg.escapeHtml(item);
		bg.removeListItem(list, item);
		$(listItem).fadeOut(400, function(){
			$.when($(this).remove()).then(reflowULs());
		});		
	});
	
	$(".pillbox").on("mouseenter mouseleave", "span.deleteItem", function(){
			$(this).parent().toggleClass("linethrough");
	});
});