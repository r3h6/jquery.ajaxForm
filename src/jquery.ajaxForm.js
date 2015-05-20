/**
 * jquery.ajaxForm
 * @author R3 H6 <r3h6@outlook.com
 * Licensed under MIT
 */
(function ($){
	var AjaxForm = function (el, options){
		this.el = el;
		this.$el = $(el);
		this.$buttons = null;
		this.jqXHR = null;
		this.options = $.extend(true, {}, $.fn.ajaxForm.defaultOptions, options);

		// Register submit event
		this.$el.on('submit', function(event){
			var ajaxForm = $(this).data('ajaxForm');
			if (ajaxForm.isEnabled()){
				event.preventDefault();
				ajaxForm.send();
			}
		});
	}

	AjaxForm.VERSION  = '1.0.0';
	AjaxForm.STATUS_ABORT = 'abort';

	AjaxForm.prototype.isEnabled = function (){
		return Boolean(this.$el.data('ajaxform'));
	}

	AjaxForm.prototype.getOptions = function (){
		var options = {};
		for (var i in $.fn.ajaxForm.defaultOptions){
			if (this.el.hasAttribute('data-' + i)){
				options[i] = this.$el.data(i);
			}
		};
		return $.extend(true, this.options, options);
	}

	AjaxForm.prototype.send = function (){

		if (this.jqXHR){
			this.jqXHR.abort();
		}

		var $loader = null;
		var options = this.getOptions();

		var request = {
			url: options.action || this.$el.attr('action'),
			type: options.method || this.$el.attr('method'),
			dataType: options.format,
			data: this.$el.serialize(),
			context: this,
			complete: function(jqXHR, textStatus){
				// Trigger custom event.
				var e = new $.Event('complete.ajaxForm');
				this.$el.trigger(e, [jqXHR]);
				if (e.isDefaultPrevented()) return;

				// Unfreeze form.
				this.unfreeze();

				// Reset buttons to original state.
				this.$buttons.each(function (){
					var $el = $(this);
					if ($el.is('input')){
						$el.val($el.data('ajaxForm.text'));
					} else {
						$el.text($el.data('ajaxForm.text'));
					}
				});

				// Remove loader.
				if ($loader !== null){
					$loader.remove();
				}

				if (options.reset){
					this.$el.trigger('reset');
				}

				// Remove loading classes.
				this.$el.removeClass('loading');
				$(options.target).removeClass('loading');
			},
			success: function(data, textStatus, jqXHR) {
				// Trigger custom event.
				var e = new $.Event('success.ajaxForm');
				this.$el.trigger(e, [data]);
				if (e.isDefaultPrevented()) return;

				// Update content.
				if (options.target){
					$(options.target).html(data);
				}
				this.$el.trigger('updated.ajaxForm', [this]);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if (textStatus !== AjaxForm.STATUS_ABORT){
					// Trigger custom event.
					var e = $.Event('error.ajaxForm');
					this.$el.trigger(e, [jqXHR, textStatus, errorThrown]);
					if (e.isDefaultPrevented()) return;

					// Update content.
					$(options.target).html(jqXHR.responseText);
					this.$el.trigger('updated.ajaxForm', [this]);
				}
			}
		};

		// Trigger send event.
		var e = $.Event('send.ajaxForm');
		this.$el.trigger(e, [request]);
		if (e.isDefaultPrevented()) return;

		// Freeze form.
		if (options.freeze){
			this.freeze();
		}

		// Create loader.
		if (options.target){
			$loader = $('<div class="ajax-loader" />');
			$(options.target).addClass('loading').append($loader);
		}
		this.$el.addClass('loading');

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
		this.jqXHR = jQuery.ajax(request);
	}

	AjaxForm.prototype.freeze = function (){
		$(this.options.inputSelector, this.$el).prop('disabled', true);
	}

	AjaxForm.prototype.unfreeze = function (){
		$(this.options.inputSelector, this.$el).prop('disabled', false);
	}

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
		reset: false,
		format: null
	};

	$.fn.ajaxForm             = Plugin
	$.fn.ajaxForm.Constructor = AjaxForm

	$(document).ready(function() {
		$('form[data-ajaxform]').ajaxForm();
	});

}(jQuery));