
odo.createSelectorViewModel = function (items, selectedItems, comparefn, /*symbolfn, filterfn,*/copyMode) {
    var self = this;
    copyMode = copyMode || false;

    var _returnFirstInput = function (inputs) { return inputs[0]; };

    /*
    var _applyFilter = function (items, filter) {
    if (filterfn && filter && filter.length) {
    return $.map(items, function (e) {
    if (filterfn(e, filter)) {
    return e;
    }
    return null;
    });
    }
    return items;
    }
    */

    function _notify(obs) {
        obs.notifySubscribers(obs());
    }

    var viewModel = {}
    viewModel.focusedAvailableItems = odo.itemsSource([], comparefn);

    var selectedSort = function (l, r) {
        var first = l.__index - r.__index;
        if (first) {
            return first;
        }
        return comparefn(l, r);
    };

    viewModel.selectedSort = selectedSort;

    if (copyMode) {
        // sort selected side based on index and always show all "prototypes" on the available side
        viewModel.focusedSelectedItems = odo.itemsSource([], selectedSort);
        viewModel.availableItems = odo.itemsView([items], comparefn, _returnFirstInput);
        viewModel.selectedItems = odo.itemsView([selectedItems], selectedSort, _returnFirstInput);
    } else {
        // filter selected items out of the available list; keep both sides sorted the same
        viewModel.focusedSelectedItems = odo.itemsSource([], comparefn);
        viewModel.selectedItems = odo.itemsView([selectedItems], comparefn, _returnFirstInput);
        viewModel.availableItems = odo.itemsView([items, selectedItems], comparefn, function (newInputs) {
            odo.mergepass(newInputs[0], newInputs[1], comparefn, odo.MERGE_ACTIONS.NOT_RIGHT_TO_LEFT);
            return newInputs[0];
        });
    }

    // keep the focus to one side or the other...
    viewModel.focusedSelectedItems.subscribe(function (value) {
        if (value.length > 0) {
            viewModel.focusedAvailableItems([]);
        }
    });
    viewModel.focusedAvailableItems.subscribe(function (value) {
        if (value.length > 0) {
            viewModel.focusedSelectedItems([]);
        }
    });

    // [observable] expert view of selected items
    viewModel.expertSelectedItems = ko.observable("");

    // [observable] filter string
    viewModel.filter = ko.observable("");

    if (copyMode) {
        var reindex = function (array) {
            var index = 0;
            $.each(array, function () { this.__index = index++; });
        };

        // adds a copy all items in the focusedAvailableItems list into the selected list at the insertion point
        viewModel.selectFocused = function () {
            var movers = [];
            $.each(viewModel.focusedAvailableItems(), function () { movers.push($.extend({}, this)); });
            if (movers.length) {
                var temp = $.merge([], viewModel.selectedItems());
                var insertAt = temp.length;
                if (typeof viewModel.getInsertionPoint === 'function') {
                    insertAt = viewModel.getInsertionPoint() + 1;
                }
                $.each(movers, function () { temp.splice(insertAt++, 0, this); });
                reindex(temp);
                viewModel.selectedItems(temp);
                viewModel.focusedSelectedItems(movers);
            }
        };

        // moves all items in the focusedSelectedItems out of the selected list
        viewModel.unselectFocused = function () {
            var movers = $.merge([], viewModel.focusedSelectedItems());
            if (movers.length) {
                var temp = $.merge([], viewModel.selectedItems());
                for (var i = movers.length - 1; i >= 0; i--) {
                    temp.splice(movers[i].__index, 1);
                }
                reindex(temp);
                viewModel.selectedItems(temp);
                viewModel.focusedSelectedItems([]);
            }
        };

        viewModel.arrangeUp = function () {
            var focus = viewModel.focusedSelectedItems();
            if (focus.length && focus[0].__index) {
                var items = viewModel.selectedItems();
                for (var i = 0; i < focus.length; i++) {
                    var item = focus[i];
                    var index = item.__index;
                    var other = items[index - 1];
                    items[index - 1] = item;
                    items[index] = other;
                }
                reindex(items);
                viewModel.selectedItems.notifySubscribers(items);
                viewModel.focusedSelectedItems.notifySubscribers(focus);
            }
        };

        viewModel.arrangeDown = function () {
            var focus = viewModel.focusedSelectedItems();
            var items = viewModel.selectedItems();
            if (focus.length && focus[focus.length - 1].__index < items.length - 1) {
                for (var i = focus.length - 1; i >= 0; i--) {
                    var item = focus[i];
                    var index = item.__index;
                    var other = items[index + 1];
                    items[index + 1] = item;
                    items[index] = other;
                }
                reindex(items);
                viewModel.selectedItems.notifySubscribers(items);
                viewModel.focusedSelectedItems.notifySubscribers(focus);
            }
        };

        viewModel.selectAll = function () { };
        viewModel.unselectAll = function () { };
    } else {
        // moves all items in the focusedAvailableItems list into the selected list
        viewModel.selectFocused = function () {
            var movers = $.merge([], viewModel.focusedAvailableItems());
            if (movers.length) {
                var temp = $.merge([], viewModel.selectedItems());
                if (odo.mergepass(temp, movers, comparefn, odo.MERGE_ACTIONS.UNION_TO_LEFT)) {
                    selectedItems(temp);
                }
                viewModel.focusedSelectedItems(movers);
            }
        };

        // moves all items in the focusedSelectedItems out of the selected list
        viewModel.unselectFocused = function () {
            var movers = $.merge([], viewModel.focusedSelectedItems());
            if (movers.length) {
                var temp = $.merge([], viewModel.selectedItems());
                if (odo.mergepass(temp, movers, comparefn, odo.MERGE_ACTIONS.NOT_RIGHT_TO_LEFT)) {
                    selectedItems(temp);
                }
                viewModel.focusedAvailableItems(movers);
            }
        };

        viewModel.arrangeUp = function () {
        };

        viewModel.arrangeDown = function () {
        };

        // moves all known items into the selectedItems list
        viewModel.selectAll = function () {
            var movers = $.merge([], viewModel.availableItems());
            if (movers.length) {
                var temp = $.merge([], viewModel.selectedItems());
                if (odo.mergepass(temp, movers, comparefn, odo.MERGE_ACTIONS.UNION_TO_LEFT)) {
                    selectedItems(temp);
                }
                viewModel.focusedSelectedItems(movers);
            }
        };

        // moves all known items into the availableItems list
        viewModel.unselectAll = function () {
            var movers = $.merge([], viewModel.selectedItems());
            selectedItems([]);
            viewModel.focusedAvailableItems(movers);
        };
    }

    // set up the dependent bindings
    viewModel.canSelect = ko.dependentObservable(function () { return viewModel.focusedAvailableItems().length !== 0; }, viewModel);
    viewModel.canUnselect = ko.dependentObservable(function () { return viewModel.focusedSelectedItems().length !== 0; }, viewModel);
    viewModel.canSelectAll = ko.dependentObservable(function () { return viewModel.availableItems().length !== 0; }, viewModel);
    viewModel.canUnselectAll = ko.dependentObservable(function () { return viewModel.selectedItems().length !== 0; }, viewModel);
    viewModel.numberSelected = ko.dependentObservable(function () { return viewModel.selectedItems().length; }, viewModel);
    viewModel.numberAvailable = ko.dependentObservable(function () {
        return viewModel.availableItems().length;
    }, viewModel);
    viewModel.canArrangeUp = ko.dependentObservable(function () { return viewModel.focusedSelectedItems().length; }, viewModel);
    viewModel.canArrangeDown = ko.dependentObservable(function () { return viewModel.focusedSelectedItems().length; }, viewModel);


    if (!copyMode) {
        viewModel.selectedItems.subscribe(function () {
            var newSelectedItems = viewModel.selectedItems();
            if (odo.mergepass(viewModel.focusedSelectedItems(), newSelectedItems, comparefn, odo.MERGE_ACTIONS.INTERSECTION_TO_LEFT))
                _notify(viewModel.focusedSelectedItems);
            if (odo.mergepass(viewModel.focusedAvailableItems(), newSelectedItems, comparefn, odo.MERGE_ACTIONS.NOT_RIGHT_TO_LEFT))
                _notify(viewModel.focusedAvailableItems);
        });
        viewModel.availableItems.subscribe(function () {
            if (odo.mergepass(viewModel.focusedAvailableItems(), viewModel.availableItems, comparefn, odo.MERGE_ACTIONS.INTERSECTION_TO_LEFT))
                _notify(viewModel.focusedAvailableItems);
        });
    }
    return viewModel;
};

var nextOdoId = 1;
function getOdoId(object) {
    var id = object.__odoId;
    if (!id) {
        id = nextOdoId++;
        object.__odoId = id;
    }
    return id;
}

var createSelectorDomOptions = {
    mode: "Expert",
    availableTemplate: function () { return ""; },
    compare: function (l, r) {
        return getOdoId(l) - getOdoId(r);
    }
    //captureId
    //captureKey
    //tip
};

// $().buttonFromMetadata creates a button widget using options found in the data-button attribute
$.fn.extend({ buttonFromMetadata: function () { return this.button(this.metadata({ type: 'attr', name: 'data-button' })); } });

odo.html.createSelectorDom = function (viewModel, options) {

    options = $.extend({}, createSelectorDomOptions, options || {});

    var dom = $.tmpl(odo.getResource(options.mode + 'SelectorTemplate_htm'), {})[0];

    // wire up the new elements
    var $expertText = $("[local-id='expertText']", dom).experttextbox({ source: viewModel.allItems, selection: viewModel.selectedItems, getSymbol: options.symbol });
    $("[local-id='select']", dom).buttonFromMetadata();
    $("[local-id='unselect']", dom).buttonFromMetadata();
    var $tradePanel = $("[local-id='tradePanel']", dom).popup()
        .layOut(function () {
            this.position({ my: "left top", at: "left bottom", of: $expertText, offset: "0 -1" });
        });
    $("[local-id='selected']", dom).listbox({ source: viewModel.selectedItems,
        selection: viewModel.focusedSelectedItems,
        comparefn: options.compare,
        template: options.selectedTemplate || options.availableTemplate,
        tip: options.tip
    }).layOut(function () {
        this.data("listbox").layOut();
    });
    $("[local-id='available']", dom).listbox({ source: viewModel.availableItems,
        selection: viewModel.focusedAvailableItems,
        comparefn: options.compare,
        template: options.availableTemplate,
        dblClickItem: viewModel.selectFocused,
        tip: options.tip
    }).layOut(function () {
        this.data("listbox").layOut();
    });
    $("[local-id='dropButton']", dom).dropbutton({ panel: $tradePanel.data("popup"), $serves: $expertText });
    var $t = $("[local-id='selectAll']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }
    $t = $("[local-id='unselectAll']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }

    var $filterPlace = $("[local-id='filter']", dom);
    if (options.filterTemplate && $filterPlace.length === 1) {
        var filterDom = option.filterTemplate();
        $filterPlace.append(filterDom);
    }

    // TODO Move elsewhere
    $t = $("[local-id='moveup']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }
    $t = $("[local-id='movedown']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }

    ko.applyBindings(viewModel, dom);

    // keep the parallel select up to date
    if (options.captureId && options.captureKey) {
        var $parallel = $("#" + options.captureId);
        if ($parallel.length > 0) {
            var _updateParallelSelect = function () {
                $parallel.empty();
                $.each(viewModel.selectedItems(), function () {
                    $parallel.append($("<option selected='selected'/>").val(options.captureKey(this)));
                });
                $parallel.change();
            };
            viewModel.selectedItems.subscribe(_updateParallelSelect);
            _updateParallelSelect();
        }
    }
    return dom;
};

odo.html.createListComposerDom = function (viewModel, options) {

    options = $.extend({}, createSelectorDomOptions, options || {});

    var dom = $.tmpl(odo.getResource(options.mode + 'SelectorTemplate_htm'), {})[0];

    // mark the natural order of the existing selected items...
    var index = 0;
    $.each(viewModel.selectedItems(), function () {
        this.__index = index++;
    });

    // wire up the new elements
    var $expertText = $("[local-id='expertText']", dom).experttextbox({ source: viewModel.allItems, selection: viewModel.selectedItems, getSymbol: options.symbol });
    $("[local-id='select']", dom).buttonFromMetadata();
    $("[local-id='unselect']", dom).buttonFromMetadata();
    var $tradePanel = $("[local-id='tradePanel']", dom).popup()
        .layOut(function () {
            this.position({ my: "left top", at: "left bottom", of: $expertText, offset: "0 -1" });
        });
    /*
    var selected = $("[local-id='selected']", dom).odorx_listbox({ source: viewModel.selectedItems,
    template: options.selectedTemplate || options.availableTemplate,
    tip: options.tip
    }).data("odorx_listbox");
    selected.Sort.Value(viewModel.selectedSort);
    selected.Source.Source(odo.Rx.KoToObservable(viewModel.selectedItems));
    viewModel.selectedItems.notifySubscribers(viewModel.selectedItems());

    selected.Selected.Source(odo.Rx.KoToObservable(viewModel.focusedSelectedItems));

    selected.Selected.Select(function (x) {
    return $.merge([], x).sort(viewModel.focusedSelectedItems.odoCompare);
    }).DistinctUntilChanged(function (x) {
    return x;
    }, function (l, r) {
    if (l.length !== r.length) {
    return false;
    }
    var count = l.length;
    var comp = selected.Sort.Value();
    for (var i = 0; i < count; i++) {
    if (comp(l[i], r[i]) != 0) {
    return false;
    }
    }
    return true;
    }).Subscribe(new Rx.Observer(function (value) {
    viewModel.focusedSelectedItems(value);
    }));
    */


    var selected = $("[local-id='selected']", dom).listbox({ source: viewModel.selectedItems,
        selection: viewModel.focusedSelectedItems,
        comparefn: viewModel.selectedSort,
        template: options.selectedTemplate || options.availableTemplate,
        tip: options.tip
    }).layOut(function () {
        this.data("listbox").layOut();
    }).data("listbox");
    //selected.Sort.Value(viewModel.selectedSort);
    //selected.Source.Source(odo.Rx.KoToObservable(viewModel.selectedItems));
    //viewModel.selectedItems.notifySubscribers(viewModel.selectedItems());
    //selected.Selected.Source(odo.Rx.KoToObservable(viewModel.focusedSelectedItems));
    /*
    odo.Rx.KoToObservable(viewModel.selectedItems).Select(function (x) {
    return $.merge([], x).sort(viewModel.focusedSelectedItems.odoCompare);
    }).DistinctUntilChanged(function (x) {
    return x;
    }, function (l, r) {
    if (l.length !== r.length) {
    return false;
    }
    var count = l.length;
    var comp = selected.Sort.Value();
    for (var i = 0; i < count; i++) {
    if (comp(l[i], r[i]) != 0) {
    return false;
    }
    }
    return true;
    }).Subscribe(new Rx.Observer(function (value) {
    viewModel.focusedSelectedItems(value);
    }));
    */

    $("[local-id='available']", dom).listbox({ source: viewModel.availableItems,
        selection: viewModel.focusedAvailableItems,
        comparefn: options.compare,
        template: options.availableTemplate,
        dblClickItem: viewModel.selectFocused,
        tip: options.tip
    }).layOut(function () {
        this.data("listbox").layOut();
    });
    $("[local-id='dropButton']", dom).dropbutton({ panel: $tradePanel.data("popup"), $serves: $expertText });

    var $filterPlace = $("[local-id='filter']", dom);
    if (options.filterTemplate && $filterPlace.length === 1) {
        var filterDom = option.filterTemplate();
        $filterPlace.append(filterDom);
    }

    var _insertionPoint = -1;
    viewModel.getInsertionPoint = function () {
        return _insertionPoint < 0 ? viewModel.selectedItems().length : _insertionPoint;
    };
    viewModel.focusedSelectedItems.subscribe(function (v) {
        if (v.length > 0) {
            _insertionPoint = v[0].__index;
        }
    });

    // TODO Move elsewhere
    var $t = $("[local-id='moveup']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }
    $t = $("[local-id='movedown']", dom);
    if ($t.length > 0) {
        $t.buttonFromMetadata();
    }

    ko.applyBindings(viewModel, dom);

    // keep the parallel select up to date
    if (options.captureId && options.captureKey) {
        var $parallel = $("#" + options.captureId);
        if ($parallel.length > 0) {
            var _updateParallelSelect = function () {
                $parallel.empty();
                $.each(viewModel.selectedItems(), function () {
                    $parallel.append($("<option selected='selected'/>").val(options.captureKey(this)));
                });
                $parallel.change();
            };
            viewModel.selectedItems.subscribe(_updateParallelSelect);
            _updateParallelSelect();
        }
    }
    return dom;
};
