$( ".mobilebuttonmenuck" ).click(function() {
	$( "#maximenuck-mobile" ).slideDown();
	$( "#maximenuck-mobilebarmenuck" ).hide();
	
});

$( ".mobilemaximenuckclose" ).click(function() {
	$( "#maximenuck-mobile" ).slideUp();
	$( "#maximenuck-mobilebarmenuck" ).show( 300 ).delay( 2000 );
});


$(window).resize(function() {
    //do something

    var width = $(document).width();
    if (width > 758) {
     $( "#maximenuck" ).show();
	 $( ".mobilemaximenuck" ).hide();
    }
});

// bookmark //

$(function() {
        $('#bookmarkme').click(function() {
            if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
                window.sidebar.addPanel(document.title,window.location.href,'');
            } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
                window.external.AddFavorite(location.href,document.title); 
            } else if(window.opera && window.print) { // Opera Hotlist
                this.title=document.title;
                return true;
            } else { // webkit - safari/chrome
                alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
            }
        });
    });
	
// colorbox disable //


if (window.matchMedia) {
        // Establishing media check
			width700Check = window.matchMedia("(max-width: 758px)");
			if (width700Check.matches){
				$.colorbox.remove();
			}


    }	
	
