(function ($) {
	$(function () {
		var initializeEvent = {
			type: 'initialize',
			firstLoad: true,
			debug: false
		};
		$(document).trigger(initializeEvent);

		$(document).on('keydown', 'textarea', function(e) {
			if(e.keyCode === 9) { // tab was pressed
				// get caret position/selection
				var start = this.selectionStart;
				var end = this.selectionEnd;

				var $this = $(this);
				var value = $this.val();

				// set textarea value to: text before caret + tab + text after caret
				$this.val(value.substring(0, start)
					+ "    "
					+ value.substring(end));

				// put caret at right position again (add one for the tab)
				this.selectionStart = this.selectionEnd = start + 4;

				// prevent the focus lose
				e.preventDefault();
			}
		});
	});
})(jQuery);