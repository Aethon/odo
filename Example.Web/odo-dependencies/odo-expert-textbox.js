(function ($) {

    $.widget("ui.experttextbox", {
        options: {
            source: null,
            selection: null,
            getSymbol: null
        },

        _create: function () {
            var self = this;

            _sourceObs = this.options.source || ko.observableArray([]);
            _selectionObs = this.options.selection || ko.observableArray([]);
            _getSymbol = this.options.getSymbol || function (e) { return e.toString(); }
            _ignoreChange = false;
            var _itemsMap = {};

            function _refreshFromSource() {
                _itemsMap = {}
                $.each(_sourceObs(), function (i, e) { _itemsMap[_getSymbol(e)] = { index: i, source: e }; });
            };

            function _refreshFromSelection() {
                var text;
                $.each(_selectionObs(), function (i, e) { if (!text) text = _getSymbol(e); else text = text + " " + _getSymbol(e); });
                _ignoreChange = true;
                self.element.val(text);
                _ignoreChange = false;
            };

            function _update() {
                if (!_ignoreChange) {
                    var inputSymbols = self.element.val().toUpperCase().split(/[\s;]+/); // TODO: .toUpperCase and .split should be specified by the design component
                    var sources = [];
                    var unknown = [];
                    $.each(inputSymbols, function (i, e) {
                        var item = _itemsMap[e];
                        if (!item) {
                            unknown.push(e);
                        } else {
                            sources.push(item);
                        }
                    });
                    // TODO: send unknown array to the standard error pathway
                    var sources = sources.sort(function (l, r) { return l.index - r.index; });
                    var losers = [];
                    $.each(sources, function (i, e) { if ((i > 0) && sources[i - 1].index == e.index) losers.unshift(i); });
                    $.each(losers, function (i, e) { sources.splice(e, 1); });
                    var newSelection = [];
                    $.each(sources, function (i, e) { newSelection.push(e.source); });
                    _selectionObs(newSelection);
                }
            };

            this.element
            //	.addClass("ui-widget ui-corner-all")
            .change(_update)
            .blur(_update);
            // TODO: aria classes

            _refreshFromSource();
            _refreshFromSelection();

            _sourceObs.subscribe(function () {
                _refreshFromSource();
            });

            _selectionObs.subscribe(function () {
                _refreshFromSelection();
            });
        }
    });
} (jQuery));
