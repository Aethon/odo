// jQuery UI Popup addin
$.widget("ui.popup", {
    options: {
        position: {
            my: "left top",
            at: "left bottom",
            collision: "none flip"
        }
    },

    _create: function () {
        var self = this;
        this.lastFocusedElement = null;
        this.panelFocused = false;


        this.element.attr("tabIndex", "-1").css("position", "absolute").hide();

        var $firstElement = this.element.find(".initial-focus");
        if ($firstElement.length > 0) {
            this.lastFocusedElement = $firstElement[0];
            setTimeout(function () { self._checkFocus(); }, 1);
        }

        var _onFocusIn = function () {
            self.panelFocused = true;
            var active = document.activeElement;
            if (active === self.element[0]) {
                self._reassignFocus();
            } else {
                self.lastFocusedElement = active;
            }
        };

        var _onFocusOut = function () {
            self.panelFocused = false;
            setTimeout(function () { self._checkFocus(); }, 1);
        };

        this.element.focusout(_onFocusOut);
        //  addEventListener("DOMFocusOut", this._onFocusOut);
        this.element.focusin(_onFocusIn);
        // addEventListener("DOMFocusIn", this._onFocusIn);
        this.element.bind('mousedown', function () { self._suppressDismiss = true; });
        this.element.bind('mouseup', function () { self._suppressDismiss = false; setTimeout(function () { self._checkFocus(); }, 1); });
    },

    _reassignFocus: function () {
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    },

    _checkFocus: function () {
        if (this._suppressDismiss) {
            this._reassignFocus();
        } else if (!this.panelFocused) {
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
        this.menu.element.remove();
        $.Widget.prototype.destroy.call(this);
    },

    open: function () {
        if (!this.element.is(":visible")) {
            this.element.show();
            odo.html.applyLayout(this.element);
            this._reassignFocus();
        }
    },

    close: function (event) {
        if (this.element.is(":visible")) {
            this.element.hide();
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
    },

    widget: function () {
        return this.element;
    }
});
