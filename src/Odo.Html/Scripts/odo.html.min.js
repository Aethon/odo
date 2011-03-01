/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, JÃ¶rn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Sets the type of metadata to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * There are three supported types of metadata storage:
 *
 *   attr:  Inside an attribute. The name parameter indicates *which* attribute.
 *          
 *   class: Inside the class attribute, wrapped in curly braces: { }
 *   
 *   elem:  Inside a child element (e.g. a script tag). The
 *          name parameter indicates *which* element.
 *          
 * The metadata for an element is loaded the first time the element is accessed via jQuery.
 *
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 * 
 * @name $.metadata.setType
 *
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("class")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from the class attribute
 * 
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("attr", "data")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a "data" attribute
 * 
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.metadata.setType("elem", "script")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a nested script element
 * 
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 * @see metadata()
 */

(function($) {

$.extend({
	metadata : {
		defaults : {
			type: 'class',
			name: 'metadata',
			cre: /({.*})/,
			single: 'metadata'
		},
		setType: function( type, name ){
			this.defaults.type = type;
			this.defaults.name = name;
		},
		get: function( elem, opts ){
			var settings = $.extend({},this.defaults,opts);
			// check for empty string in single property
			if ( !settings.single.length ) settings.single = 'metadata';
			
			var data = $.data(elem, settings.single);
			// returned cached data if it already exists
			if ( data ) return data;
			
			data = "{}";
			
			if ( settings.type == "class" ) {
				var m = settings.cre.exec( elem.className );
				if ( m )
					data = m[1];
			} else if ( settings.type == "elem" ) {
				if( !elem.getElementsByTagName )
					return undefined;
				var e = elem.getElementsByTagName(settings.name);
				if ( e.length )
					data = $.trim(e[0].innerHTML);
			} else if ( elem.getAttribute != undefined ) {
				var attr = elem.getAttribute( settings.name );
				if ( attr )
					data = attr;
			}
			
			if ( data.indexOf( '{' ) <0 )
			data = "{" + data + "}";
			
			data = eval("(" + data + ")");
			
			$.data( elem, settings.single, data );
			return data;
		}
	}
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
	return $.metadata.get( this[0], opts );
};

})(jQuery);
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
var odo = odo || {};

(function ($) {

    odo.html = odo.html || {};

    var _resources = {};

    odo.getResource = function(name) {
        return _resources[name];
    };
_resources['DivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberSelected"></span> selected</td><td></td><td><span data-bind="text: numberAvailable"></span> available</td></tr>\n' +
 '<tr><td rowspan="2"><ul local-id="selected" style="width: 200px; height: 250px" tabindex="0"></ul></td><td></td><td><input local-id="filterText" type="text" tabindex="0" /></td></tr>\n' +
 '<tr>\n' +
 '    <td>\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '    <td><ul local-id="available" style="width: 200px; height: 250px" tabindex="0"></ul></td>\n' +
 '</tr>\n' +
 '</table>\n' +
 '<select local-id="parallel-select" style="display:none" />\n' +
'';

_resources['ExpertSelectorTemplate_htm'] = '<div style="-khtml-user-select: none; -moz-user-select: none;">\n' +
 '<input local-id="expertText" type="text" value="" class="ui-text-box ui-corner-left" /><button local-id="dropButton" type="button">Select</button>\n' +
 '<div local-id=\'tradePanel\' class="ui-widget-content ui-corner-all" style=\'position: absolute; padding: 3px; z-index: 100\' tabindex="-1">\n' +
 '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberSelected"></span> selected</td><td></td><td><span data-bind="text: numberAvailable"></span> available</td></tr>\n' +
 '<tr><td rowspan="2"><ul local-id="selected" class="initial-focus" style="width: 200px; height: 250px" tabindex="0"></ul></td><td></td><td><div local-id="filterPlace"></div></td></tr>\n' +
 '<tr>\n' +
 '    <td>\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '    <td><ul local-id="available" style="width: 200px; height: 250px" tabindex="0"></ul></td>\n' +
 '</tr>\n' +
 '</table>\n' +
 '</div>\n' +
 '</div>\n' +
'';

_resources['FilteredReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"><select local-id="filterdrop" data-bind="options: _divaFilter.categories, optionsText: \'Name\', optionsValue: \'Code\'"></select></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block; width: 35px" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block; width: 35px" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '        <button style="display: block; visibility: hidden; width: 35px"></button>\n' +
 '        <button local-id="selectAll" type="button" style="display: block; width: 35px" data-bind="enable: canSelectAll, click: selectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\', secondary: \'ui-icon-triangle-1-e\' }, text: false }">Add all</button>\n' +
 '        <button local-id="unselectAll" type="button" style="display: block; width: 35px" data-bind="enable: canUnselectAll, click: unselectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\', secondary: \'ui-icon-triangle-1-w\' }, text: false }">Remove all</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['FilteredUniqueReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"><select local-id="filterdrop" data-bind="options: _divaFilter.categories, optionsText: \'Name\', optionsValue: \'Code\'"></select></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td><td rowspan="2" style="vertical-align: top">\n' +
 '    <button local-id="moveup" type="button" style="display: block" data-bind="enable: canArrangeUp, click: arrangeUp" data-button="{ icons: { primary: \'ui-icon-triangle-1-n\' }, text: false }">Move up</button>\n' +
 '    <button local-id="movedown" type="button" style="display: block" data-bind="enable: canArrangeDown, click: arrangeDown" data-button="{ icons: { primary: \'ui-icon-triangle-1-s\' }, text: false }">Move down</button>\n' +
 '    <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-close\' }, text: false }">Remove</button>\n' +
 '</td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['ReverseDivaSelectorTemplate_htm'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><select local-id="parallel-select" multiple="multiple" style="display:none" /><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block; width: 35px" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block; width: 35px" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '        <button style="display: block; visibility: hidden; width: 35px"></button>\n' +
 '        <button local-id="selectAll" type="button" style="display: block; width: 35px" data-bind="enable: canSelectAll, click: selectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\', secondary: \'ui-icon-triangle-1-e\' }, text: false }">Add all</button>\n' +
 '        <button local-id="unselectAll" type="button" style="display: block; width: 35px" data-bind="enable: canUnselectAll, click: unselectAll" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\', secondary: \'ui-icon-triangle-1-w\' }, text: false }">Remove all</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

_resources['ReverseDivaSelectorTemplate_htm_orig'] = '<table cellspacing="0" cellpadding="0">\n' +
 '<tr><td><span data-bind="text: numberAvailable"></span> available</td><td></td><td><span data-bind="text: numberSelected"></span> selected</td></tr>\n' +
 '<tr><td><div local-id="filterPlace" style="display:none"></div></td><td></td><td rowspan="2"><ul local-id="selected" id="selected" tabindex="0"></ul></td></tr>\n' +
 '<tr>\n' +
 '    <td><ul local-id="available" id="available" tabindex="0"></ul></td>\n' +
 '    <td style="vertical-align: top">\n' +
 '        <button local-id="select" type="button" style="display: block" data-bind="enable: canSelect, click: selectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-e\' }, text: false }">Add</button>\n' +
 '        <button local-id="unselect" type="button" style="display: block" data-bind="enable: canUnselect, click: unselectFocused" data-button="{ icons: { primary: \'ui-icon-triangle-1-w\' }, text: false }">Remove</button>\n' +
 '    </td>\n' +
 '</tr>\n' +
 '</table>\n' +
'';

// Normalization

// ensure that the Array.prototype.indexOf method is implemented
// from http://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0)
            return -1;

        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n)
                n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }

        if (n >= len)
            return -1;

        var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

        for (; k < len; k++) {
            if (k in t && t[k] === searchElement)
                return k;
        }
        return -1;
    };
}
// left and right must be sorted before calling this method
odo.mergepass = function(left, right, compare, actions) {
    var leftIndex = 0;
    var rightIndex = 0;
    var leftItem;
    var rightItem;
    var modified = false;

    var mod = {
        removeLeft: function() {
            if (leftItem) {
                left.splice(leftIndex, 1);
                leftIndex--;
                leftItem = null;
                modified = true;
            }
        },
        removeRight: function() {
            if (rightItem) {
                right.splice(rightIndex, 1);
                rightIndex--;
                rightItem = null;
                modified = true;
            }
        },
        addLeft: function(newItem) {
            if (!leftItem) {
                left.splice(leftIndex, 0, newItem);
                leftIndex++;
                leftItem = newItem;
                modified = true;
            }
        },
        addRight: function(newItem) {
            if (!rightItem) {
                right.splice(rightIndex, 0, newItem);
                rightIndex++;
                rightItem = newItem;
                modified = true;
            }
        }
    }

    for (; leftIndex < left.length; leftIndex++) {
        var found = false;
        while (rightIndex < right.length) {
            leftItem = left[leftIndex];
            rightItem = right[rightIndex];
            var comp = compare(leftItem, rightItem);

            if (comp < 0) {
                break;
            } else if (comp == 0) {
                if (actions.match) {
                    actions.match(leftItem, rightItem, leftIndex, rightIndex, mod);
                }
                rightIndex++;
                found = true;
                break;
            } else {
                if (actions.rightOnly) {
                    leftItem = null;
                    actions.rightOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
                }
                rightIndex++;
            }
        }
        if ((!found) && actions.leftOnly) {
            leftItem = left[leftIndex];
            rightItem = null;
            actions.leftOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
        }
    }

    if (actions.rightOnly) {
        while (rightIndex < right.length) {
            leftItem = null;
            rightItem = right[rightIndex];
            actions.rightOnly(leftItem, rightItem, leftIndex, rightIndex, mod);
            rightIndex++;
        }
    }

    return modified;
}

odo.MERGE_ACTIONS = {};

odo.MERGE_ACTIONS.UNION_TO_LEFT = {
    rightOnly: function(l,r,li,ri,mod) { mod.addLeft(r); }
};

odo.MERGE_ACTIONS.INTERSECTION_TO_LEFT = {
    leftOnly: function(l,r,li,ri,mod) { mod.removeLeft(); }
};

odo.MERGE_ACTIONS.NOT_RIGHT_TO_LEFT = {
    match: function(l,r,li,ri,mod) { mod.removeLeft(); }
};

odo.MERGE_ACTIONS.XOR_RIGHT_TO_LEFT = {
    match: function(l,r,li,ri,mod) { mod.removeLeft(); },
    rightOnly: function(l,r,li,ri,mod) { mod.addLeft(r); }
};

odo.html.createSelectorControl = function ($element, items, template) {
    // attach a selector control to the specified element
    var selectorControl = {};
    $element.data('odo.html.selectorControl', selectorControl);

    $element.css({ border: '1px solid blue', margin: '10px', padding: '10px', display: 'inline-block' });
    var $items = $.tmpl('<div class="nimble_selector_item"><div class="select_content">' + template + '</div></div>', items);
    $items.appendTo($element);

    $element.click(function (e) {
        var targetItem = $(e.target).closest('.nimble_selector_item');
        if ($(targetItem).hasClass('nimble_selector_item'))
            $(targetItem).find('.select_area').toggleClass('selected');
    })
    .focus(function (e) { $element.css('background', 'yellow'); })
    .blur(function () { $element.css('background', 'inherit'); });
}


odo.html.attachButtonToElement = function ($button, $element) {
    $element.css('margin-right', '-1px');
    $button.layOut(function () {
        var size = $element.outerHeight() + "px";
        $button.css({ width: size, height: size, 'margin-top': $element.css('margin-top') });
    });
}

odo.DefaultSort = function (l, r) {
    return 0; // TODO
};
(function () {
    odo.Rx = {};

    if (ko !== undefined) {
        odo.Rx.KoToObservable = function (koObservable) {
            var observable = Rx.Observable.Create(function (observer) {
                if (observer) {
                    var sub = koObservable.subscribe(function (newValue) {
                        observer.OnNext(newValue);
                    });
                }
                return Rx.Disposable.Create(function () {
                    sub.dispose();
                });
            });
            return observable;
        };
    }

    Array.prototype.binarySearch = function (find, compare) {
        var low = 0;
        var high = this.length - 1;
        var i;
        var comparison;
        while (low <= high) {
            i = Math.floor((low + high) / 2);
            comparison = compare(this[i], find);
            if (!comparison) {
                return i;
            }
            if (comparison < 0) {
                low = i + 1;
            }
            else {
                high = i - 1;
            }
        }
        return -1;
    }

    var QueueTimeout = 1;
    var _notificationQueue = [];

    var _primeNotificationQueue = function () {
     //   if (_notificationQueue.length > 0) {
     //       setTimeout(_processNotificationQueue, QueueTimeout);
      //  }
    }

    var _processNotificationQueue = function () {
        if (_notificationQueue.length > 0) {
            var fn = _notificationQueue.pop();
            fn();
            _primeNotificationQueue();
        }
    };

    var _queueNotificationList = function (observerList, value) {
        var dispatchList = observerList.ToArray();
     //   _notificationQueue.unshift(function () {
            var count = dispatchList.length;
            for (var i = 0; i < count; i++) {
                try {
                    dispatchList[i].OnNext(value);
                }
                catch (x) {
                    // suppressed, we are not in a context to propagate.
                    // future: send to some exception sink
                }
            }
       // });
        _primeNotificationQueue();
    };

    var _queueNotification = function (observer, value) {
   //     _notificationQueue.unshift(function () {
            try {
                observer.OnNext(value);
            }
            catch (x) {
                // suppressed, we are not in a context to propagate.
                // future: send to some exception sink
            }
        //});
        _primeNotificationQueue();
    };

    odo.Rx.CreateValueSubject = function (defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = null;
        }

        var _value = null;
        var _source = null;
        var _default = null;
        var _observers = new Rx.List();
        var _subscription = null;
        var _observer = null;

        var vs = Rx.Observable.Create(function (observer) {
            if (observer) {
                _observers.Add(observer);
                _queueNotification(observer, vs.Value());
            }
            return Rx.Disposable.Create(function () {
                _observers.Remove(observer);
            });
        });

        vs.Value = function (newValue) {
            if (newValue === undefined) {
                return _value;
            }

            if (newValue === null) {
                if (typeof defaultValue === 'function') {
                    newValue = defaultValue();
                } else {
                    newValue = defaultValue || null;
                }
            }

            _value = newValue;
            _queueNotificationList(_observers, _value);

            return vs;
        };

        vs.Source = function (newSource) {
            if (newSource === undefined) {
                return _source;
            }

            if (newSource !== _source) {
                if (_subscription) {
                    _subscription.Dispose();
                    _subscription = null;
                }
                _source = newSource;
                if (_source) {
                    _subscription = _source.Subscribe(_observer);
                }
            }
            return vs;
        };

        vs.Default = function (defaultValue) {
            if (defaultValue === undefined) {
                return _defaultValue;
            }

            _defaultValue = defaultValue;
            if (_value === null) {
                vs.Value(null);
            }
            return vs;
        };

        _observer = new Rx.Observer(function (value) {
            vs.Value(value);
        },
        function (exception) {
            vs.Source(null);
        },
        function () {
            vs.Source(null);
        });

        vs.Default(defaultValue);

        return vs;
    };

    /*
    odo.Rx.CreateTwoWayBinding = function (sub1, sub2) {
    var binding = {};

    sub1.Subscribe(sub2);
    sub2.Subscribe(sub1);
    return binding;
    }
    */
})();


// odo itemsSources are ko observable arrays extended with sorting information
odo.itemsSource = function (initialItems, compare) {
    var result = ko.observableArray(initialItems);
    if (compare) {
        result.odoCompare = compare;
    }
    return result;
};

// odo liveTransforms are item sources that actively present a transformed (sorted and filtered) view of
//  a source observable
odo.itemsView = function (sourceObservables, compare, transform) {
    var result = odo.itemsSource([], compare);
    var update = function () {
        var newItems = [];
        $.each(sourceObservables, function () {
            if (compare) {
                var ni = $.merge([], this());
                ni.sort(compare);
                newItems.push(ni);
            } else {
                newItems.push(this());
            }
        });
        if (transform) {
            newItems = transform(newItems);
        }
        result(newItems);
    };
    $.each(sourceObservables, function () { this.subscribe(update); });
    update();
    return result;
};

// This is a somewhat esoteric transform that exists to support a delivery vs being
// necessarily the best of ideas.
odo.categorizedItemsView = function (itemsObservable, categoriesObservable, categoryObservable, getCategoryId, getItemCategories, compareCategories, compareItems) {
    var result = {};
    result.categories = odo.itemsSource([], compareCategories);
    result.items = odo.itemsSource([], compareItems);

    var _all = { items: [] };

    var updateCategories = function () {
        var categories = categoriesObservable();
        var counts = {};
        _all = { category: { Name: 'All', Code: '' }, items: [] };

        $.each(categories, function (i,e) {
            counts[getCategoryId(e)] = { category: this, items: [] };
        });

        // stoopid NxN pass to perform the filter/group
        $.each(itemsObservable(), function () {
            var item = this;
            var found = false;
            $.each(getItemCategories(this)(), function (i,e) {
                var itemCategoryId = getCategoryId(e);
                $.each(categories, function (i,e) {
                    if (itemCategoryId === getCategoryId(e)) {
                        counts[itemCategoryId].items.push(item);
                        found = true;
                    }
                });
            });
            if (found) {
            _all.items.push(item);
            }
        });

        var newCategories = [];
        $.each(counts, function () {
            if (this.items.length > 0 && this.category.Name !== "All") {
                this.Name = this.category.Name + ' (' + this.items.length + ')';
                this.Code = this.category.Code;
                this.items.sort(compareItems);
                newCategories.push(this);
            }
        });
        _all.items.sort(compareItems);
        _all.Name = _all.category.Name + ' (' + _all.items.length + ')';
        _all.Code = _all.category.Code;

        newCategories.sort(compareCategories);
        newCategories.unshift(_all);
        result.categories(newCategories);
    };

    var updateItems = function () {
        var newCategory = categoryObservable();
        if (!newCategory || !newCategory.length)
            newCategory = _all;
        else
            newCategory = newCategory[0];
        result.items(newCategory.items);
    };

    $.each([itemsObservable, categoriesObservable], function () { this.subscribe(updateCategories); });
    $.each([result.categories, categoryObservable], function () { this.subscribe(updateItems); });

    updateCategories();

    return result;
};

$.fn.layOut = function (arg) {
    if (arg) {
        this.data("layOut", arg);
        return this;
    }

    return this.data("layOut");
};

odo.html.applyLayout = function ($element) {
    var layOut = $element.layOut();
    if (layOut)
        layOut.apply($element);
    $element.children().each(function () { odo.html.applyLayout($(this)); });
};
// jQuery UI Drop Button plugin
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
// jQuery UI Expert Textbox plugin
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

// jQuery UI Filterbox plugin
$.widget("ui.filterbox", {
    options: {},

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
function isScrolledIntoView($host, $subject)
{
    var docViewTop = $host.offset().top;
    var docViewBottom = docViewTop + $host.height();

    var elemTop = $subject.offset().top;
    var elemBottom = elemTop + $subject.height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
        && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop));
}

$.widget("ui.odorx_listbox", {
    options: {
        //     equality: odo.AreEqual,
        tip: null // this is TEMPORARY
    },

    _create: function () {
        var self = this;
        self.Source = odo.Rx.CreateValueSubject(function () { return []; });
        self.Selected = odo.Rx.CreateValueSubject(function () { return []; });
        self.Template = odo.Rx.CreateValueSubject();
        self.Sort = odo.Rx.CreateValueSubject();
        self.Focus = odo.Rx.CreateValueSubject();

        var _selectionFocus = null;
        var _selectionBase = null;
        var _setSelectionFocus = function ($item) {
            //           if (_selectionFocus) {
            //               _selectionFocus.removeClass("ui-list-focus");
            //           }
            //           if ($item) {
            //               $item.addClass("ui-list-focus");
            //           }
            _selectionFocus = $item;
        }

        var _getElements = function () {
            return self.element.children("li").toArray();
        };

        var _clearElements = function () {
            self.element.empty();
        };

        var _indexOf = function (array, item) {
            var count = array.length;
            for (var i = 0; i < count; i++) {
                if (self.Sort.Value()(item, array[i]) == 0)
                    return i;
            }
            return -1;
        };

        var _contains = function (array, item) {
            return _indexOf(array, item) != -1;
        };

        var _selectAll = function () {
            self.Selected.Value($.merge([], self.Source.Value()));
        };

        var _select = function ($item, ctrlKey, shiftKey) {
            var source = $item.data("source");
            if ((!(shiftKey || ctrlKey)) || (shiftKey && !_selectionBase)) {
                self.Selected.Value([source]);
                _selectionBase = $item;
                _setSelectionFocus($item);
            } else if (shiftKey) {
                var elements = _getElements();

                var i0 = elements.indexOf(_selectionBase[0]);
                var i1 = elements.indexOf($item[0]);
                if (i0 > i1) {
                    var x = i0;
                    i0 = i1;
                    i1 = x;
                }

                var newSel = [];
                $.each(elements.slice(i0, i1 + 1), function () { newSel.push($(this).data("source")); });
                self.Selected.Value(newSel);
                _setSelectionFocus($item);
            } else {
                var array = $.merge([], self.Selected.Value());
                var index = _indexOf(array, source);
                if (index !== -1) {
                    array.splice(index, 1);
                } else {
                    array.push(source);
                }
                self.Selected.Value(array);
                _selectionBase = $item;
                _setSelectionFocus($item);
            }
        };

        var _moveup = function (ctrlKey, shiftKey) {
            var $to;
            if (_selectionFocus === null) {
                $to = self.element.children("li:first");
            } else {
                $to = _selectionFocus.prev();
            }
            if ($to && $to.length) {
                _select($to, ctrlKey, shiftKey);
                if (_selectionFocus && !isScrolledIntoView(self.element, _selectionFocus)) {
                    _selectionFocus[0].scrollIntoView(true);
                }
            }
        };

        var _movedown = function (ctrlKey, shiftKey) {
            var $to;
            if (_selectionFocus === null) {
                $to = self.element.children("li:first");
            } else {
                $to = _selectionFocus.next();
            }
            if ($to && $to.length) {
                _select($to, ctrlKey, shiftKey);
                if (_selectionFocus && !isScrolledIntoView(self.element, _selectionFocus)) {
                    _selectionFocus[0].scrollIntoView(false);
                }
            }
        };

        function _handleKeyDown(event) {
            if (self.options.disabled || self.element.attr("readonly")) {
                return;
            }

            var keyCode = $.ui.keyCode;
            switch (event.keyCode) {
                case keyCode.UP:
                    _moveup(false, event.shiftKey);
                    event.preventDefault();
                    break;
                case keyCode.DOWN:
                    _movedown(false, event.shiftKey);
                    event.preventDefault();
                    break;
                case 65: // a
                    if (event.ctrlKey) {
                        _selectAll();
                        event.preventDefault();
                    }
                    break;
            }
        }


        var _compareElementToSource = function (e, src) {
            return self.Sort.Value()($(e).data("source"), src);
        };


        var _updateElement = function (element, item, selection) {
            var $e = $(element);
            if ($e.is(".ui-list-focus")) {
                $e.removeClass("ui-list-focus");
            }
            if (_contains(selection, item)) {
                if (!$e.is(".aria-selected")) {
                    $e.addClass("aria-selected").addClass("ui-state-highlight");
                }
                return true;
            }
            else {
                if ($e.is(".aria-selected")) {
                    $e.removeClass("aria-selected").removeClass("ui-state-highlight");
                }
                return false;
            }
        }

        var _updateElements = function (newItems, newSelection) {
            var lastElement = null;
            var lastSelected = self.element.children("li.ui-list-focus:last");

            var elements = _getElements();
            odo.mergepass(elements, newItems, _compareElementToSource,
                {
                    match: function (l) {
                        lastElement = l;
                        if (_updateElement(l, $(l).data("source"), newSelection)) {
                            lastSelected = $(l);
                        }
                    },
                    leftOnly: function (l) {
                        $(l).remove();
                    },
                    rightOnly: function (l, r) {
                        var $item = $("<li role='listitem' class='ui-list-item' style='cursor: default'></li>")
                            .data("source", r)
                            .dblclick(function (event) {
                                if (self.options.dblClickItem) {
                                    self.options.dblClickItem($(event.target).closest("li[role*='listitem']"));
                                    event.preventDefault();
                                }
                            });

                        if (typeof self.options.template === 'function') {
                            $item.html(self.options.template(r));
                        } else if (self.options.template !== undefined) {
                            $item.append($.tmpl(self.options.template, r));
                        }

                        // temp to support tooldatastufftips
                        if (typeof self.options.tip === 'function') {
                            $item.attr("title", self.options.tip(r));
                        }

                        if (_updateElement($item, r, newSelection)) {
                            lastSelected = $item;
                        }

                        if (lastElement === null) {
                            self.element.prepend($item);
                        } else {
                            $(lastElement).after($item);
                        }
                        lastElement = $item[0];
                    }
                });

            if (lastSelected) {
                lastSelected.addClass("ui-list-focus");
            }
        };

        this.Source
            .CombineLatest(self.Sort.Do(_clearElements), function (a, c) {
                var result = $.merge([], a);
                if (c) result.sort(c);
                return result;
            })
            .CombineLatest(self.Selected, function (i, s) {
                return { items: i, selected: s };
            })
            .Subscribe(new Rx.Observer(function (x) {
                _updateElements(x.items, x.selected);
            }));


        this.element
		.addClass("ui-list ui-widget ui-corner-all")
        .css({ overflow: "auto", "-khtml-user-select": "none", "-moz-user-select": "none" })
		.attr({
		    role: "listbox",
		    "aria-activedescendant": "ui-active-menuitem"
		})
		.click(function (event) {
		    var $item = $(event.target).closest("li[role*='listitem']");
		    if (!$item.length) {
		        return;
		    }
		    event.preventDefault();
		    _select($item, event.ctrlKey, event.shiftKey);
		})
        .keydown(_handleKeyDown);

        this.element[0].onselectstart = function () { return false; }; // IE way of preventing text selection
    }
});

function isScrolledIntoView($host, $subject)
{
    var docViewTop = $host.offset().top;
    var docViewBottom = docViewTop + $host.height();

    var elemTop = $subject.offset().top;
    var elemBottom = elemTop + $subject.height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
        && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop));
}

$.widget("ui.listbox", {
    options: {
        source: null,
        selection: null,
        comparefn: null,
        template: null,
        tip: null // this is TEMPORARY
    },

    _create: function () {
        var self = this;

        function _handleKeyDown(event) {
            if (self.options.disabled || self.element.attr("readonly")) {
                return;
            }

            var keyCode = $.ui.keyCode;
            switch (event.keyCode) {
                case keyCode.UP:
                    self._moveup(false, event.shiftKey);
                    // prevent moving cursor to beginning of text field in some browsers
                    event.preventDefault();
                    break;
                case keyCode.DOWN:
                    self._movedown(false, event.shiftKey);
                    // prevent moving cursor to end of text field in some browsers
                    event.preventDefault();
                    break;
                case 65: // a
                    if (event.ctrlKey) {
                        self.selectAll();
                        event.preventDefault();
                    }
                    break;
            }
        }

        this.element
		.addClass("ui-list ui-widget ui-corner-all")
        .css({ overflow: "auto", "-khtml-user-select": "none", "-moz-user-select": "none" })
		.attr({
		    role: "listbox",
		    "aria-activedescendant": "ui-active-menuitem"
		})
		.click(function (event) {
		    var $item = $(event.target).closest("li[role*='listitem']");
		    if (!$item.length) {
		        return;
		    }
		    // temporary
		    event.preventDefault();
		    self.select($item, event.ctrlKey, event.shiftKey);
		});
        this.element[0].onselectstart = function () { return false; }; // IE way of preventing text selection

        this.element.keydown(_handleKeyDown);

        this._sourceObs = this.options.source || ko.observableArray([]);
        this._items = [];

        this._selectionObs = this.options.selection || ko.observableArray([]);

        this.refreshFromSource();
        this.refreshFromSelection();

        this._sourceObs.subscribe(function () {
            self.refreshFromSource();
            self.refreshFromSelection();
        });

        this._selectionObs.subscribe(function () {
            self.refreshFromSelection();
            self.element.trigger("itemFocus", [self._selectionFocus ? self._selectionFocus.$item : null]);
        });

    },

    _compareListItemToSource: function (li, src) {
        return this.options.comparefn(li.source, src);
    },

    refreshFromSource: function () {
        var self = this;
        var $lastElement = null;

        if (odo.mergepass(this._items, this._sourceObs(), function (l, r) { return self._compareListItemToSource(l, r); },
            {
                match: function (l) { $lastElement = l.$item; },
                leftOnly: function (l, r, li, ri, mod) { mod.removeLeft(); l.$item.remove(); },
                rightOnly: function (l, r, li, ri, mod) {
                    var listItem = {};
                    var $item = $("<li role='listitem' class='ui-list-item' style='cursor: default'></li>")
                        .data("source", listItem)
                        .dblclick(function (event) {
                            if (self.options.dblClickItem) {
                                self.options.dblClickItem($(event.target).closest("li[role*='listitem']"));
                                event.preventDefault();
                            }
                        });


                    if (typeof self.options.template === 'function') {
                        $item.html(self.options.template(r));
                    } else {
                        $item.append($.tmpl(self.options.template, r));
                    }

                    // temp to support tooldatastufftips
                    if (typeof self.options.tip === 'function') {
                        $item.attr("title", self.options.tip(r));
                    }

                    if ($lastElement === null) {
                        self.element.prepend($item);
                    } else {
                        $lastElement.after($item);
                    }
                    $lastElement = $item;
                    listItem.$item = $item;
                    listItem.source = r;
                    mod.addLeft(listItem);
                }
            })) {
            //   this._sourceObs.notifySubscribers(this._sourceObs());
        }
    },

    refreshFromSelection: function () {
        var self = this;

        odo.mergepass(this._items, this._selectionObs(), function (l, r) { return self._compareListItemToSource(l, r); },
            {
                leftOnly: function (l, r) {
                    var $l = l.$item;
                    if ($l.is(".aria-selected")) {
                        $l.removeClass("aria-selected").removeClass("ui-state-highlight");
                    }
                },
                match: function (l, r) {
                    var $l = l.$item;
                    if (!$l.is(".aria-selected")) {
                        $l.addClass("aria-selected").addClass("ui-state-highlight");
                    }
                }
            });
    },

    select: function ($item, ctrlKey, shiftKey) {
        var self = this;
        var listItem = $item.data("source");
        if ((!(shiftKey || ctrlKey)) || (shiftKey && !this._selectionBase)) {
            this._selectionObs.splice(0, this._selectionObs().length, listItem.source);
            this._selectionBase = listItem;
            this._selectionFocus = listItem;
        } else if (shiftKey) {
            var i0 = this._items.indexOf(this._selectionBase);
            var i1 = this._items.indexOf(listItem);
            if (i0 > i1) {
                var x = i0;
                i0 = i1;
                i1 = x;
            }
            var newSel = [];
            $.each(this._items.slice(i0, i1 + 1), function (i, e) { newSel.push(e.source); });
            this._selectionObs(newSel);
            this._selectionFocus = listItem;
        } else {
            if (odo.mergepass(this._selectionObs(), [listItem], function (l, r) { return -self._compareListItemToSource(r, l); },
            {
                match: function (l, r, li, ri, mod) { mod.removeLeft(); },
                rightOnly: function (l, r, li, ri, mod) { mod.addLeft(r.source); }
            })) {
                this._selectionObs.notifySubscribers(this._selectionObs());
            }
            this._selectionBase = listItem;
            this._selectionFocus = listItem;
        }
        this.element.trigger("itemFocus", [this._selectionFocus ? this._selectionFocus.$item : null]);
    },

    selectAll: function () {
        this._selectionObs($.merge([], this._sourceObs()));
    },

    _moveup: function (ctrlKey, shiftKey) {
        var $to;
        if (this._selectionFocus === null) {
            $to = this.element.children("li:first");
        } else {
            $to = this._selectionFocus.$item.prev();
        }
        if ($to && $to.length) {
            this.select($to, ctrlKey, shiftKey);
            if (this._selectionFocus && !isScrolledIntoView(this.element, this._selectionFocus.$item)) {
                this._selectionFocus.$item[0].scrollIntoView(true);
            }
        }
    },

    _movedown: function (ctrlKey, shiftKey) {
        var $to;
        if (this._selectionFocus === null) {
            $to = this.element.children("li:last");
        } else {
            $to = this._selectionFocus.$item.next();
        }
        if ($to && $to.length) {
            this.select($to, ctrlKey, shiftKey);
            if (this._selectionFocus && !isScrolledIntoView(this.element, this._selectionFocus.$item)) {
                this._selectionFocus.$item[0].scrollIntoView(false);
            }
        }
    }
});
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
// apply a template to re/populate a region
odo.html.applyRegionTemplate = function ($region, template, vm) {

    $region.css({ visibility: 'visible' }).empty();
    // TODO: is there a good way to cleanup the tree we just removed

    $region.append(template(vm));

    setTimeout(function () {
        odo.html.applyLayout($region);
        $region.css({ visibility: 'visible' });
    }, 1);
};
odo.html.createGroup = function (svm, options) {
    options = options || {};

    $group = $("<div></div>");
    if (options.style) {
        $group.addClass(options.style(svm));
    }
    $.each(options.memberTemplates || [], function () { $group.append(this(svm)); });
    return $group;
};

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
                    var $ins = viewModel.getInsertionPoint();
                    if ($ins && $ins.length > 0) {
                        insertAt = $ins.data("source").__index + 1;
                    }
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
                selectedItems(temp);
            }
        };

        viewModel.arrangeUp = function () {
            var focus = viewModel.focusedSelectedItems();
            if (focus.length === 1) {
                var item = focus[0];
                var index = item.__index;
                if (index > 0) {
                    var items = viewModel.selectedItems();
                    items[index - 1].__index = index;
                    item.__index = index - 1;
                    items.sort(selectedSort);
                    viewModel.selectedItems(items);
                    viewModel.focusedSelectedItems([item]);
                }
            }
        };

        viewModel.arrangeDown = function () {
            var focus = viewModel.focusedSelectedItems();
            if (focus.length === 1) {
                var item = focus[0];
                var index = item.__index;
                var items = viewModel.selectedItems();
                if (index < items.length - 1) {
                    items[index + 1].__index = index;
                    item.__index = index + 1;
                    items.sort(selectedSort);
                    viewModel.selectedItems(items);
                    viewModel.focusedSelectedItems([item]);
                }
            }
        };

        viewModel.selectAll = function () { };
        viewModel.unselectAll = function () { };
    }
    else {
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
    viewModel.canArrangeUp = ko.dependentObservable(function () { return viewModel.focusedSelectedItems().length === 1; }, viewModel);
    viewModel.canArrangeDown = ko.dependentObservable(function () { return viewModel.focusedSelectedItems().length === 1; }, viewModel);


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
    });
    $("[local-id='available']", dom).listbox({ source: viewModel.availableItems,
        selection: viewModel.focusedAvailableItems,
        comparefn: options.compare,
        template: options.availableTemplate,
        dblClickItem: viewModel.selectFocused,
        tip: options.tip
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

    $("[local-id='available']", dom).listbox({ source: viewModel.availableItems,
        selection: viewModel.focusedAvailableItems,
        comparefn: options.compare,
        template: options.availableTemplate,
        dblClickItem: viewModel.selectFocused,
        tip: options.tip
    });
    $("[local-id='dropButton']", dom).dropbutton({ panel: $tradePanel.data("popup"), $serves: $expertText });

    var $filterPlace = $("[local-id='filter']", dom);
    if (options.filterTemplate && $filterPlace.length === 1) {
        var filterDom = option.filterTemplate();
        $filterPlace.append(filterDom);
    }

    viewModel.getInsertionPoint = function () {
        return selected.element.children(".ui-list-focus:last");
    };

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
})(jQuery);
