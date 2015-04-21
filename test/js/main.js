(function ($){

	$('#Form3').on('error.ajaxForm', function (event){
		console.log(event);
	});

	$('form.validate').validate({
		submitHandler: function(form) {
			$(form).ajaxForm('send');
		}
	});

}(jQuery));