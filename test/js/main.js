(function ($){
//*
	$('#ExampleSimple').on('send.ajaxForm', function (event){
		console.log(event);
	});

	$('#ExampleReset').on('send.ajaxForm', function (event){
		console.log(event);
	});

	$('#ExampleError').on('error.ajaxForm', function (event){
		console.log(event);
	});

	$('form.validate').validate({
		submitHandler: function(form) {
			$(form).ajaxForm('send');
		}
	});

	$('#ExampleValidation').on('send.ajaxForm', function (event){
		console.log(event);
	});

	$('#ExampleJson').on('success.ajaxForm', function (event, data){
		console.log(data);
	});

	$('#ExampleReloadFormTarget').on('domUpdated.ajaxForm', function(event, data){
		console.log(data);
	});
//*/
}(jQuery));