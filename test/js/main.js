(function ($){

	$('#Form1').on('submit', function (event){
		console.log(event);
	});

	$('#Form3').on('error.ajaxForm', function (event){
		console.log(event);
	});

	$('form.validate').validate({
		submitHandler: function(form) {
			$(form).ajaxForm('send');
		}
	});

	$('#ExampleJson').on('success.ajaxForm', function (event, data){
		console.log(data);
	});

}(jQuery));