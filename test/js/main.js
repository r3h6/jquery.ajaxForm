(function ($){

	$('form').on('submit.ajaxForm', function (event){
		console.log("submit.ajaxForm");
		console.log(event);
	}).on('success.ajaxForm', function (event){
		console.log("success.ajaxForm");
		console.log(event);
	});

}(jQuery));