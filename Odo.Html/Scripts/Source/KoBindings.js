(function ($) {

    // override the enable handler to refresh known jqui widgets
    {
        var enablingWidgets = ["button"];
        var original = ko.bindingHandlers.enable;

        ko.bindingHandlers.enable = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

                disabled = element.disabled;
                original.update(element, valueAccessor, allBindingsAccessor, viewModel);
                var changed = element.disabled !== disabled;

                var $e = $(element);
                var widgets = $e.data("enableWidgets");
                if (!widgets) {
                    widgets = [];
                    $.each(enablingWidgets, function (i, n) {
                        var widget = $e.data(n);
                        if (widget != null)
                            widgets.push(widget);
                    });
                    $e.data("enableWidgets", widgets);
                    changed = true;
                }

                if (changed) {
                    $.each(widgets, function (i, w) { w.refresh(); });
                }
            }
        };
    }
} (jQuery));
