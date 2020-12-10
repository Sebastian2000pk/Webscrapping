/* Open */
function openNav() {
  document.getElementById("overlay-menu").style.height = "100%";
}

/* Close */
function closeNav() {
  document.getElementById("overlay-menu").style.height = "0%";
}

jQuery( function ( $ ) {
	$(function () {
    
		$('.slider-autoplay').slick({
			dots: false,
			arrows: true,
			focusOnSelect: true,
			autoplay: true,
			autoplaySpeed: 5000,
			adaptiveHeight: true,
		});
		
		$('.responsive-carousel').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 4,
		  slidesToScroll: 4,
		  responsive: [
			{
			  breakpoint: 1024,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			  }
			},
			{
			  breakpoint: 600,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
		});	
		
	});
	
	
	
	$('#header .btn-search, #mobileSearch-button').on('click', function(e) {  
	  e.preventDefault();                  
		$('#search_wrapper').addClass('open');
		$('#search_wrapper form input[type="text"]').focus();
    return false;
	});  
	
	$('#search_wrapper button.close').on('click', function(event) {
		$('#search_wrapper').removeClass('open');
	});
	
  
	
	var btn = $('#scrollTop');

	$(window).scroll(function() {
	  if ($(window).scrollTop() > 200) {
		btn.addClass('show');
	  } else {
		btn.removeClass('show');
	  }
	});

	btn.on('click', function(e) {
	  e.preventDefault();
	  $('html, body').animate({scrollTop:0}, '300');
	});
	
	
	

	// Hide Header on on scroll down
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navbarHeight = $('header').outerHeight();

	$(window).scroll(function(event){
		didScroll = true;
	});

	setInterval(function() {
		if (didScroll) {
			hasScrolled();
			didScroll = false;
		}
	}, 250);

	function hasScrolled() {
		var st = $(this).scrollTop();
		
		// Make sure they scroll more than delta
		if(Math.abs(lastScrollTop - st) <= delta)
			return;
		
		// If they scrolled down and are past the navbar, add class .nav-up.
		// This is necessary so you never see what is "behind" the navbar.
		if (st > lastScrollTop && st > navbarHeight){
			// Scroll Down
			$('header, #submenu-paginas').removeClass('nav-down').addClass('nav-up');
		} else {
			// Scroll Up
			if(st + $(window).height() < $(document).height()) {
				$('header, #submenu-paginas').removeClass('nav-up').addClass('nav-down');
			}
		}
		
		lastScrollTop = st;
	}
	
	
	
	
	$('#mobileMenu-button').click(function() {
		$(this).toggleClass("on");
		 $('body').toggleClass("overflowToggle");
     setTimeout(function(){ 
      $('header').toggleClass("fixedToggle");
     }, 300);

	});  
	$('#mobileMenu-button').click(function() {
		$("#mobileMenu").toggleClass("show");
	});
	$('#mobileMenu-button').click(function() {
		$(".menu-item").removeClass("show");
	});
	
	$("#mobileMenu ul li a").click(function(){
		$("#mobileMenu-button").removeClass("on");
	});  
	$( "li.menu-item-has-children" ).click(function() {
		$(this).addClass( "show" );
	});
	$( "li.menu-item-has-children" ).click(function() {
		$("li.menu-item-has-children > a + span + .sub-menu").addClass( "show-sub-menu" );
	});
		
	$( "<span class='back-button'><i class='fas fa-chevron-left'></i></span>" ).insertBefore( $( "#mobileMenu .sub-menu" ) );



	// sub-menus

	$('ul#menu-cabecera li.menu-item-has-children').click(function(){
		$(this).addClass('show');
	});

	$('.back-button').click(function(e){
		$(this).parent().removeClass('show');
		e.stopPropagation();
	});




  // We can attach the `fileselect` event to all file inputs on the page
  $( document ).on( 'change', '.custom-form :file', function () {
    var input = $( this ),
      label = input.val().replace( /\\/g, '/' ).replace( /.*\//, '' );
    input.trigger( 'fileselect', [ label ] );
  } );

  // We can watch for our custom `fileselect` event like this
  $( document ).ready( function () {
    $( '.custom-form :file' ).on( 'fileselect', function ( event, label ) {

      var fileText = $( this ).parents( '.input-group' ).find( ':text' ),
        log = label;

      if ( fileText.length )
        fileText.val( log );

    } );
  } );
  
  
  





});

/* Helper function */
function download_file(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
        save.download = fileName || filename;
	       if ( navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
				document.location = save.href; 
// window event not working here
			}else{
		        var evt = new MouseEvent('click', {
		            'view': window,
		            'bubbles': true,
		            'cancelable': false
		        });
		        save.dispatchEvent(evt);
		        (window.URL || window.webkitURL).revokeObjectURL(save.href);
			}	
    }

    // for IE < 11
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}



// Custom scripts for WP Quiz Pro
/* -- WP Quiz Pro -- */
jQuery(document).ready(function( $ ) {
  if ( $( '.trivia_quiz' ).length && $('.wq_quizPaginationValue').length ) {
	
	if ( $( '#related-quiz-content-widget' ).length && $('#related-post-widget').length ) {
		$('#related-post-widget').parent().hide(); // Hide related post block
		$('.banner-newsletter').hide(); // Hide banner newsletter block
	}

	var index = 0;
	$('#related-quiz-content-widget div.post').hide();
	$('#related-quiz-content-widget div.post:eq(' + index + ')').show();

	var trivia_quiz = $('.trivia_quiz');
	var quizTotalQuestion = $('.wq-question').length;
	var quizQuestionAnswered = $('.wq-question.wq_questionAnswered').length;
	var quizQuestionPosition = quizQuestionAnswered + 1;
	var quizPagination = quizQuestionPosition + '/' + quizTotalQuestion;
	$('.wq_quizPaginationValue').text(quizPagination);
	trivia_quiz.on("click.nextQuestion", ".wq-continue-btn", function() {
		quizQuestionAnswered = $('.wq-question.wq_questionAnswered').length;
		quizPagination = (quizQuestionAnswered + 1) + '/' + quizTotalQuestion;
		$('.wq_quizPaginationValue').text(quizPagination).fadeIn('slow');
		index = quizQuestionAnswered;
		if( $('#related-quiz-content-widget div.post:eq(' + index + ')').length ) {
			$('#related-quiz-content-widget div.post').hide();
			$('#related-quiz-content-widget div.post:eq(' + index + ')').delay(800).fadeIn('slow');
		}
	});
	
	trivia_quiz.on('click.answer', '.wq-answer', function() {
	
		quizQuestionAnswered = $('.wq-question.wq_questionAnswered').length;
		quizPagination = quizQuestionAnswered + '/' + quizTotalQuestion;		
		if( quizQuestionAnswered === quizTotalQuestion ) {
			$('#related-post-widget').parent().delay(800).fadeIn('slow'); // Show related post block
			$('.banner-newsletter').delay(800).fadeIn('slow'); // Show banner newsletter block
		}

	});
	
  }
});
/* -- WP Quiz Pro -- */



