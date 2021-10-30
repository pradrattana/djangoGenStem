var width = 0;
var height = 0;

function updateDisplay() {
	width = window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;
	height = window.innerHeight ||
					document.documentElement.clientHeight ||
					document.body.clientHeight;

	if (width > 800) {
		$("#menu-hamburger").css("display", "none");
		$("#menu-close").css("display", "none");
		$(".menu-nav").css("display", "initial");
		$(".overlay").css("display", "none");
		$(".nav-listitem-drop").css("display", "none")
		$(".nav-listitem-drop").parent().css("background-color", "white");
		$('html, body').css({
			overflow: 'auto',
			height: 'auto'
		});
	}
	else if ($("#menu-close").css("display") == "none") {
		$("#menu-hamburger").css("display", "");
		$(".menu-nav").css("display", "none");
	}
};

$(function() {
	updateDisplay();
});

$(window).resize(function() {
	updateDisplay();
});

$("#menu-hamburger").click(function() {
	$(this).css("display", "none");
	$("#menu-close").css("display", "");
	$(".menu-nav").css("display", "initial");
	$(".overlay").css("display", "initial");
	$('html, body').css({
    overflow: 'hidden',
    height: '100%'
	});
});

$("#menu-close").click(function() {
	$(this).css("display", "none");
	$("#menu-hamburger").css("display", "");
	$(".menu-nav").css("display", "none");
	$(".overlay").css("display", "none");
	$(".nav-listitem-drop").css("display", "none")
	$(".nav-listitem-drop").parent().css("background-color", "white");
	$('html, body').css({
    overflow: 'auto',
    height: 'auto'
	});
});

$(".nav-listitem").click(function() {
	if (width < 800) {
		$(".nav-listitem-drop").parent().not(this).css("background-color", "white");
		$(".nav-listitem-drop").not($(this).children()).css("display", "none");

		if ($(this).children(".nav-listitem-drop").css("display") == "none") {
			$(this).css("background-color", "#fce4ec");
			$(this).children(".nav-listitem-drop").attr('style', 'display: flex !important'); 
		} else {
			$(this).css("background-color", "white");
			$(this).children(".nav-listitem-drop").css("display", "none");
		}
	}
});