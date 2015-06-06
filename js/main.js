$(document).ready(function() {
	$('#back-to-top').click(function(){
		$.smoothScroll({offset: 0});
	})
	$(document).scroll(function(event) {
		$('#back-to-top').css('opacity',($(document).scrollTop()-200)/300);
		if($('#back-to-top').css('opacity') > 0){
			$('#back-to-top').show()
		}
		else{
			$('#back-to-top').hide()
		}
	});
});