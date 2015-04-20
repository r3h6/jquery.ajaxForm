(function ($){
	var AjaxForm = function (el, options){
		this.el = el;
		this.$el = $(el);
		this.options = $.extend(true, {}, $.fn.ajaxForm.defaultOptions, options);
		this.jqXHR = null;
		this.$buttons = null;

		// Register submit event
		this.$el.on('submit', function(event){
			var ajaxForm = $(this).data('ajaxForm');
			console.log('submit!');
			console.log(event);
			console.log(ajaxForm);
			if (ajaxForm.isEnabled()){
				event.preventDefault();

					console.log("enabled!");
				if (!event.namespace){
					console.log("send!");
					ajaxForm.send();
				}
			}
		});

		//$('input[type="submit"]')
		// console.log('new AjaxForm');
		// console.log(this);
	}

	AjaxForm.prototype.STATUS_ABORT = 'abort';

	AjaxForm.prototype.isEnabled = function (){
		return Boolean(this.$el.data('ajaxform'));
	}

	AjaxForm.prototype.getOptions = function (){
		var options = {};
		for (var i in $.fn.ajaxForm.defaultOptions){
			// console.log(i + " " );
			if (this.el.hasAttribute('data-' + i)){
				options[i] = this.$el.data(i);
			}
		};

		return $.extend(true, this.options, options);
	}

	AjaxForm.prototype.send = function (request){
		// console.log('submit');

		if (this.jqXHR){
			this.jqXHR.abort();
		}

		var $loader;
		var options = this.getOptions();

		var request = {
			url: options.action || this.$el.attr('action'),
			type: options.method || this.$el.attr('method'),
			dataType: options.format || 'html',
			data: this.$el.serialize(),
			context: this,
			complete: function(jqXHR, textStatus){
				this.unfreeze();
				this.$buttons.each(function (){
					var $el = $(this);
					if ($el.is('input')){
						$el.val($el.data('ajaxForm.text'));
					} else {
						$el.text($el.data('ajaxForm.text'));
					}
				});
				this.$el.removeClass('loading');
				$(options.target).removeClass('loading');
				$loader.remove();

				this.$el.trigger('complete.ajaxForm');
			},
			success: function(data, textStatus, jqXHR) {
				// console.log('success');
				$(options.target).html(data);
				this.$el.trigger('success.ajaxForm');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// console.log('error:');
				// console.log(jqXHR);
				// console.log(textStatus);
				// console.log(errorThrown);
				if (textStatus !== AjaxForm.prototype.STATUS_ABORT){
					$(options.target).html(jqXHR.responseText);
					this.$el.trigger('error.ajaxForm');
				}
			}
		};

		// Trigger send event.
		this.$el.trigger(e = $.Event('send.ajaxForm', {request: request}));
		if (e.isDefaultPrevented()) return;

		// Freeze form.
		if (options.freeze){
			this.freeze();
		}

		// Create loader.
		$loader = $('<div class="ajax-loader" />');
		$(options.target).addClass('loading').append($loader);

		// Replace button text with loading text.
		this.$buttons = $('[data-loading-text]', this.$el).each(function (){
			var $el = $(this);
			if ($el.is('input')){
				$el.data('ajaxForm.text', $el.val());
				$el.val($el.data('loading-text'));
			} else {
				$el.data('ajaxForm.text', $el.text());
				$el.text($el.data('loading-text'));
			}
		});

		// Send request.
		this.$el.addClass('loading');
		this.jqXHR = jQuery.ajax(request);

		//this.$el.trigger('submit.ajaxForm');
	}

	AjaxForm.prototype.freeze = function (){
		$(this.options.inputSelector, this.$el).prop('disabled', true);
	}

	AjaxForm.prototype.unfreeze = function (){
		$(this.options.inputSelector, this.$el).prop('disabled', false);
	}


	AjaxForm.VERSION  = '1.0.0';

	var Plugin = function (options) {
		return this.each(function () {
			var $this = $(this);
			if (!$this.is('form')){
				console.error('Element is not a form!');
			} else {
				var data  = $this.data('ajaxForm');

				if (!data) {
					$this.data('ajaxForm', (data = new AjaxForm(this, options)));
				}
				if (typeof options == 'string'){
					data[options]();
				}
			}
		});
	}
	Plugin.defaultOptions = {
		inputSelector: 'input, textarea, select',
		freeze: true,
		action: null,
		target: null,
		method: null,
		format: 'html'
	};

	$.fn.ajaxForm             = Plugin
	$.fn.ajaxForm.Constructor = AjaxForm

	$(document).ready(function() {
		$('form[data-ajaxform]').ajaxForm();
	});

}(jQuery));