var width = 0;
var height = 0;
var main = document.querySelector("main");

function updateClass() {
	width = window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;
	height = window.innerHeight ||
					document.documentElement.clientHeight ||
					document.body.clientHeight;

	if (width > 920) {
		$(".another-blog").removeClass("flex-col");
		$(".another-blog").addClass("flex-row");
	} else {
		$(".another-blog").removeClass("flex-row");
		$(".another-blog").addClass("flex-col");
	}
};

function updateAnotherBlogSize() {
	if (width > 920) {
		$(".another-blog").css("height", $(".another-blog").width() / 81 * 19.5);
		$(".blog-post").css("height", "inherit");
	} else if (width > 680) {
		$(".blog-post").css("height", $(".blog-post").width() / 16 * 9);
		$(".another-blog").css("height", "auto");
	} else {
		$(".blog-post").css("height", $(".blog-post").width() / 4 * 3);
		$(".another-blog").css("height", "auto");
	}
};

function updateAnotherBlogCaption() {
	var fontSize;
	if (width > 270) {
		fontSize = parseFloat($(".blog-post > div").height() / 6.5);
	} else {
		fontSize = parseFloat($(".blog-post > div").height() / 8.7);
	}
	if (fontSize > 16) {
	  $(".blog-post > div").css("font-size", "16px");
	} else if (fontSize > 12) {
	  $(".blog-post > div").css("font-size", fontSize);
	} else {
	  $(".blog-post > div").css("font-size", "12px");
	}

	function isOverflown(element) {
		return element.scrollHeight > element.clientHeight || 
						element.scrollWidth > element.clientWidth;
	}
	document.querySelectorAll(".blog-post > div").forEach(el => {
		if (isOverflown(el) || el.clientHeight > el.parentElement.clientHeight*0.45
				& width > 270) {
		  el.style.height = "fit-content";
		} else {
			el.style.height = "";
		}
	});
};

$(function() {
	updateClass();
	updateAnotherBlogSize();
	updateAnotherBlogCaption();
});

$(window).resize(function() {
	updateClass();
	updateAnotherBlogSize();
	updateAnotherBlogCaption();
});

$(window).scroll(function() {
	var blogEnd = $('.blog-foot').position().top - $('.blog-sidebar').height() - 200;
	if (width > 1310) {
		if ($(this).scrollTop() > blogEnd) {
			$('.blog-sidebar').fadeOut(200);
		} else {
			$('.blog-sidebar').fadeIn(200);
		}
	}
});