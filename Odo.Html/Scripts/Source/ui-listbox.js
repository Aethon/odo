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
