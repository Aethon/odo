(function ($, undefined) {

    $.widget("ui.popup", {
        options: {
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none flip"
            }
        },

        _create: function () {
            var self = this,
			doc = this.element[0].ownerDocument,
			suppressKeyPress;

            this.element.attr("tabIndex", "-1").css("position", "absolute").hide();

            this.panelFocused = false;

            var firstElement = this.element.find(":enabled"); // TODO: figure out why :focusable/:tabbable do not work here
            if (firstElement.length > 0)
                this.lastFocusedElement = firstElement[0];

            this._onFocusIn = function () {
                self.panelFocused = true;
                var active = document.activeElement;
                if (active == self.element[0]) {
                    self._reassignFocus();
                } else {
                    self.lastFocusedElement = active;
                }
            };

            this._onFocusOut = function () {
                self.panelFocused = false;
                setTimeout(function () { self._checkFocus(); }, 1);
            };

            this.element.focusout(this._onFocusOut); // addEventListener("DOMFocusOut", this._onFocusOut);
            this.element.focusin(this._onFocusIn); // addEventListener("DOMFocusIn", this._onFocusIn);
            this.element.bind('mousedown', function () { self._suppressDismiss = true; });
            this.element.bind('mouseup', function () { self._suppressDismiss = false; setTimeout(function () { self._checkFocus(); }, 1); });
            this.element.bind('mouseout', function () { self._suppressDismiss = false; setTimeout(function () { self._checkFocus(); }, 1); });
        },

        _reassignFocus: function () {
            if (this.lastFocusedElement != null)
                this.lastFocusedElement.focus();
        },

        _checkFocus: function () {
            if (this._suppressDismiss) {
                this._reassignFocus();
            } else if (!this.panelFocused) {
                //     alert(document.activeElement);
                this._trigger("dismiss");
            }
        },

        destroy: function () {
            this.element
			.removeClass("ui-autocomplete-input")
			.removeAttr("autocomplete")
			.removeAttr("role")
			.removeAttr("aria-autocomplete")
			.removeAttr("aria-haspopup");
            this.element[0].removeEventListener("DOMFocusOut", function () { self._onFocusOut.apply(self); });
            this.element[0].removeEventListener("DOMFocusIn", function () { self._onFocusIn.apply(self); });

            this.menu.element.remove();
            $.Widget.prototype.destroy.call(this);
        },

        open: function () {
            var self = this;
            if (!this.element.is(":visible")) {
                //			this.element.position( $.extend({
                //				of: this.element
                //			}, this.options.position ));
                this.element.show();
                odo.html.applyLayout(this.element);
                this.element.focus();
            }
            // open event
        },

        close: function (event) {

            //	clearTimeout( this.closing );
            if (this.element.is(":visible")) {
                this.element.hide();
                //			this._trigger( "close", event );
            }
        },

        toggle: function () {
            if (this.element.is(":visible")) {
                this.close();
            } else {
                this.open();
            }
        },

        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            // TODO: watch option changes
        },

        widget: function () {
            return this.element;
        }
    });

} (jQuery));
