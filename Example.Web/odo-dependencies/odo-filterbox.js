(function ($) {

    $.widget("ui.filterbox", {
        options: {
    },

    _create: function () {
        var self = this;

        var _lastFilter = this.element.val();

        function _onFilterChanged() {
            var filter = self.element.val();
            if (filter != _lastFilter) {
                if (filter.length) {
                    _button.element.button("option", "icons", { primary: "ui-icon-close" }).addClass("ui-state-highlight");
                    self.element.addClass("ui-state-highlight");
                } else {
                    _button.element.button("option", "icons", { primary: "ui-icon-search" }).removeClass("ui-state-highlight");
                    self.element.removeClass("ui-state-highlight");
                }
                _lastFilter = filter;
                self.element.change();
            }
        }

        var _button = $("<button type='button'>Search</button>")
            .css({ "margin-bottom": 0, width: 0, height: 0, tabIndex: -1 })
            .click(function () { self.element.val(""); _onFilterChanged(); })
            .button({ icons: { primary: "ui-icon-search" }, text: false })
            .removeClass("ui-corner-all")
            .addClass("ui-corner-right")
            .data("button");

        this.element
            .addClass("ui-text-box ui-corner-left")
            .keyup(function () { setTimeout(_onFilterChanged, 1) })
            .after(_button.element);
        // TODO: aria classes

        odo.html.attachButtonToElement(_button.element, this.element);
    }
});
} (jQuery));
