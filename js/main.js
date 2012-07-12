
/**
 * ProcessWire2.+ Cheatsheet 1.1
 * @author Philipp 'Soma Urlich
 *
 */


var advanced = false;
var $container = $('#isotope');
var columns = 3;
var animated = true;
var speed = 200;

var resizeColumns = function() {
	$('#isotope .section').css({ 'width': ($container.width() / columns) - 12 });
	$container.isotope({
	// update columnWidth to a percentage of container width
		masonry: { columnWidth: $container.width() / columns, gutterWidth: 12 }
	});

}

if( $.cookie('isotopeanim') ) {
	if( $.cookie('isotopeanim') == 0 ) {
		$('input[name="isotopeanim"]').removeAttr('checked');
		$('input[name="isotopeanim"]').parent('label').removeClass('checked');
		$('#isotope .section').addClass('no-transition');
		animated = false;
	} else {
		$('input[name="isotopeanim"]').attr({checked: 'checked'});
		$('input[name="isotopeanim"]').parent('label').addClass('checked');
		$('#isotope .section').removeClass('no-transition');
		animated = true;
	}
} else {
	$('input[name="isotopeanim"]').parent('label').addClass('checked');
}

$('#isotope div.section:has(".advanced"):not("#index")').each(function() {
	$inline_advanced = $('<a href="#" class="toggle_advanced" title="show advanced">+</a>')
		.click(function(){ $(this).text( function(){ return $(this).text() == '+' ? '-' : '+'} ).parent(".section").find('.advanced').slideToggle(100, function(){ $container.isotope('reLayout'); }); return false; });
	$(this).append($inline_advanced);
});

$('#isotope p').has('.descr').addClass('hasdescr');
$('#isotope .descr').hide();


// update columnWidth on window resize
$(window).smartresize(function(){
	resizeColumns();
});

if($.cookie("cols")){
	columns = $.cookie("cols");
	$('.cols a').removeClass('active');
	$('.cols a[data-cols='+columns+']').addClass('active');
}

var colWidth = $container.width() / columns;

$('#isotope .section').css({ 'width': colWidth  - 12 });

// initialize isotope

	$container.isotope({
	// options...
		itemSelector : '.section',
		resizable: false, // disable normal resizing
		// set columnWidth to a percentage of container width
		masonry: { columnWidth: colWidth, gutterWidth: 12 }
	});




$(function() {

	$('#isotope p').click(function(){
		//$('table').find('.descr:visible').hide();
		$(this).find('.descr').slideToggle( animated ? speed : 0, function() { $container.isotope('reLayout'); })
			.click(function(){ $(this).slideUp( animated ? speed : 0, function(){ $container.isotope('reLayout'); }); return false; });
		return false;
	});

	$('.section:not("#index") h3').attr({title:'click to toggle descriptions'});
	$('.section:not("#index") h3').bind('click', function(){
		parent = $(this).parent('.cat');
		if( parent.find('.descr:visible').length > 0 ) {
			parent.find('.descr').slideUp( animated ? speed : 0, function(){ $container.isotope('reLayout'); });
		}
		else {
			parent.find('.descr').slideDown( animated ? speed : 0, function(){ $container.isotope('reLayout'); });
		}
	});

	$("body").live('click',function(e) {
		var node = $(e.target);

		if( node.closest('.section').length == 0
			&& node.closest('.cols').length == 0
			&& node.closest('.mode').length == 0 ){
			$('input#filter').attr({'value':''});
			resetSheet();
		}
	});

	$('input[name="mode"]').bind('change',function() {
		if($(this).is(":checked")){
			$(this).parent('label').addClass('checked');
			$.cookie("mode", 'advanced',{expires:3600});
			advanced = true;
			resetSheet();
			$('.toggle_advanced').hide();
			$('input#filter').attr({'value':''});
			$('input#filter').liveUpdate('table');
		} else {
			$(this).parent('label').removeClass('checked');
			$.cookie("mode", 'simple',{expires:3600});
			advanced = false;
			resetSheet();
			$('.toggle_advanced').show();
			$('#filter').attr({'value':''});
			$('#filter').liveUpdate('table');
		}
	});

	$('input[name="isotopeanim"]').bind('change',function() {
		if($(this).is(':checked')){
			animated = true;
			$(this).parent('label').addClass('checked');
			$.cookie('isotopeanim', 1,{expires:3600});
			$('#isotope .section').removeClass('no-transition');
		} else {$
			animated = false;
			$(this).parent('label').removeClass('checked');
			$.cookie('isotopeanim', 0,{expires:3600});
			$('#isotope .section').addClass('no-transition');
		}
	});

	// $('input#columns').live("change",function() {
	// 	columns = $(this).val();
	// 	$.cookie("cols", columns ,{expires:3600});
	// 	resizeColumns();
	// 	//$('input#filter').attr({'value':''});
	// 	//$('input#filter').liveUpdate('table');
	// });

	$('.cols a').bind("click",function(e) {
		e.preventDefault();
		columns = $(this).data('cols');
		$(this).siblings('a').removeClass('active');
		$(this).addClass('active');
		$.cookie("cols", columns ,{expires:3600});
		resizeColumns();
		//$('input#filter').attr({'value':''});
		//$('input#filter').liveUpdate('table');
	});


	// index filter navigation
	$('#index a').bind('click',function(e){
		e.preventDefault();
		$(this).siblings('a').removeClass('active');
		$(this).toggleClass('active');
		var id = $(this).attr('rel');
		//$('.section:not("#index")').hide();
		//$(id).show();
		$container.isotope({ filter: id });
	});


	//$('#filter').liveUpdate('table');
	$('#filter').live('click *',function(e){
		//console.log($(this).val());
		if($(this).val().length < 1){
			resetSheet();
			$(this).keyup();
		}
	});


	$('#filter').liveUpdate('#isotope');


	// fire event function on window scroll
	var navtop = $('.navigation').offset().top;
	var navwidth = $('.navigation').width();

	$(window).scroll(function(){

		if($('.navigation').length == 0) return;

		posy = $('.navigation').offset().top;
		wtop = $(window).scrollTop();

		//console.log(posy);
		if(wtop >= posy){
			$('.navigation').css({ position: 'fixed', top:0, width: navwidth});
		}
		if(posy < navtop){
			//console.log("inline\n");
			$('.navigation').css({ position: 'inherit' });
		}

	});

});


$(window).load(function(){

	if($.cookie('mode')){
		if($.cookie("mode") == 'advanced'){
			$('input[name="mode"]').attr({checked:'checked'});
			$('input[name="mode"]').parent('label').addClass("checked");
			advanced = true;
			resetSheet();
			$('.toggle_advanced').hide();
		}
	}

	if( getParam('advanced') && advanced == false ){
		$('input[name="mode"]').attr({checked:'checked'});
		advanced = true;
		resetSheet();
		$('.toggle_advanced').hide();
	}

	var hash = window.location.hash;
	if (hash){
		$('#index a[href="'+hash+'"]').trigger('click');
	}

	if( getParam('filter') ){
		$('#filter').val(getParam('filter')).trigger('keyup');
		// google analytics event tracking
		_gaq.push(['_trackEvent', 'CheatSheet Search', 'GET filter', getParam('filter')]);
	}


});


function resetSheet() {
	$('.descr').hide();
	$('.section').removeClass('hidden');
	$('.section').show();

	$('#index a.active').removeClass('active');
	$('p').removeClass('notfiltered');
	$('p').removeClass('filtered');

	if(advanced){

		$('div.advanced').show();
		$('p.advanced').show();
		$('a.advanced').show();

	} else {

		$('div.advanced').hide();
		$('p.advanced').hide();
		$('a.advanced').hide();

	}
	$container.isotope({ filter: '*' });
	$container.isotope('reLayout');
};

function getParam(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++){
		var pair = vars[i].split("=");
		if(pair[0] == variable) return unescape(pair[1]);
	}
	return(false);
}



$.fn.liveUpdate = function(list) {

	list = $(list);

	if ( list.length ) {

	var rows = list.find('p');

	var cache = rows.map(function() {
		return $(this).children('.api').text().toLowerCase().replace("->"," ");
	});

	// console.log(cache);

	resetSheet();

	this
		.keyup(filter).keyup()
		.parents('form').submit(function() {
		//return false;
		});
	}

	return this;

	function filter() {

		var term = $.trim( $(this).val().toLowerCase().replace("->"," ") ), scores = [];

		if ( !term ) {
			resetSheet();

		} else {

			rows.addClass('notfiltered');
			$('.section').removeClass('hidden');

			cache.each(function(i){
				var score = this.score(term);
				if (score > 0.3) { scores.push([score, i]); }
			});

			$.each( scores.sort( function(a, b){ return b[0] - a[0]; }), function() {
				$(rows[ this[1] ]).removeClass('notfiltered');
			});

			$('.section:has(p):not(:has(p:visible))').addClass('hidden');

			$container.stop().isotope('reLayout');

		}
	}
};