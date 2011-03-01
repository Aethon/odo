(function ($, undefined) {

    $.widget("ui.dropbutton", {
        options: {
            panel: null,
            $serves: null
        },

        _create: function () {
            var self = this;
            var doc = this.element[0].ownerDocument;
            var _$serves = this.options.$serves;

            if (_$serves) {
                odo.html.attachButtonToElement(this.element, _$serves);
                _$serves.keydown(function (event) {
                    var keyCode = $.ui.keyCode;
                    if (event.keyCode == keyCode.DOWN && event.altKey)
                        self.panel.open();
                });
            }

            this.element
			    .button({ icons: { primary: 'ui-icon-triangle-1-s' }, text: false })
			    .addClass("ui-corner-right")
			    .removeClass("ui-corner-all")
                .attr("tabIndex", "-1")
			    .mousedown(function () { self._openOnClick = !self.panel.element.is(":visible"); })
			    .click(function () { if (self._openOnClick) { self.panel.open(); } });

            this.panel = this.options.panel;
            this.panel.close();
            this.panel.element.keydown(function (event) {
                var keyCode = $.ui.keyCode;
                if (event.keyCode == keyCode.ESCAPE || (event.keyCode == keyCode.UP && event.altKey)) {
                    self.panel.close();
                    if (self.options.position.of) {
                        self.options.position.of.focus();
                    }
                }
            });
            this.panel.element.popup({ dismiss: function () { self.panel.close(); } });
        },

        destroy: function () {
            this.element
			.removeClass("ui-autocomplete-input")
			.removeAttr("autocomplete")
			.removeAttr("role")
			.removeAttr("aria-autocomplete")
			.removeAttr("aria-haspopup");
            $.Widget.prototype.destroy.call(this);
        },

        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            // TODO ?
        },

        widget: function () {
            return this.element;
        }
    });
} (jQuery));
