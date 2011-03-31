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

        this._sourceObs = this.options.source || ko.observableArray([]);
        this._selectionObs = this.options.selection || ko.observableArray([]);

        function _handleKeyDown(event) {
            if (self.options.disabled || self.element.attr("readonly")) {
                return;
            }

            var keyCode = $.ui.keyCode;
            switch (event.keyCode) {
                case keyCode.UP:
                    event.preventDefault();
                    self._move(-1, event.ctrlKey, event.shiftKey);
                    return false;
                case keyCode.DOWN:
                    event.preventDefault();
                    self._move(1, event.ctrlKey, event.shiftKey);
                    return false;
                case keyCode.PAGE_DOWN:
                    event.preventDefault();
                    self._move(self._stackpanel.getViewportLength(), event.ctrlKey, event.shiftKey);
                    return false;
                case keyCode.PAGE_UP:
                    event.preventDefault();
                    self._move(-self._stackpanel.getViewportLength(), event.ctrlKey, event.shiftKey);
                    return false;
                case keyCode.HOME:
                    event.preventDefault();
                    self._move(-self._stackpanel.getExtentLength(), event.ctrlKey, event.shiftKey);
                    return false;
                case keyCode.END:
                    event.preventDefault();
                    self._move(self._stackpanel.getExtentLength(), event.ctrlKey, event.shiftKey);
                    return false;
                case 65: // a
                    if (event.ctrlKey) {
                        self.selectAll();
                        event.preventDefault();
                        return false;
                    }
                    break;
            }
        }

        this._region = new Jspf.Region();
        this._region.host = this.element[0];
        this._stackpanel = new Jspf.VirtualStackPanel();
        this._region.set_child(this._stackpanel);
        this._region.layOut();


        var template = function (context) {
            var result = new Jspf.DomControl();
            var $dom = $("<div role='listitem' class='ui-list-item' style='cursor: default; position: absolute;'></div>")
              		.mousedown(function (event) {
              		    self.select(context, event.ctrlKey, event.shiftKey);
              		})
                    .dblclick(function (event) {
                        if (self.options.dblClickItem) {
                            self.options.dblClickItem($dom);
                        }
                    }).append(self.options.template(context));

            result.set_domContent($dom[0]);
            result.set_selected = function (isSelected) {
                if (isSelected) {
                    if (!$dom.is(".aria-selected")) {
                        $dom.addClass("aria-selected").addClass("ui-state-highlight");
                    }
                } else {
                    if ($dom.is(".aria-selected")) {
                        $dom.removeClass("aria-selected").removeClass("ui-state-highlight");
                    }
                }
            };

            // temp to support tooldatastufftips
            if (typeof self.options.tip === 'function') {
                $dom.attr("title", self.options.tip(context));
            }

            // set initial state
            result.set_selected(self._selectionObs().binarySearch(context, self.options.comparefn) >= 0);

            return result;
        };

        this._generator = new Jspf.OldListItemContainerGenerator();
        this._generator.set_comparer(this.options.comparefn);
        this._generator.set_allItems(this.options.source);
        this._generator.set_itemTemplate(template);
        this._stackpanel.set_itemContainerGenerator(this._generator);

        this.element
        .addClass("ui-list ui-widget ui-corner-all")
        .css({ overflow: "hidden", "-khtml-user-select": "none", "-moz-user-select": "none" })
		.attr({
		    role: "listbox",
		    "aria-activedescendant": "ui-active-menuitem"
		})
        .keydown(_handleKeyDown);
        this.element[0].onselectstart = function () { return false; }; // IE way of preventing text selection

        this._sourceObs.subscribe(function () {
            self.refreshFromSelection();
        });

        this._selectionObs.subscribe(function () {
            self.refreshFromSelection();
            self.triggerItemFocused();
        });

        this.refreshFromSelection();
    },

    layOut: function () {
        this._region.layOut();
    },

    refreshFromSelection: function () {
        var active = this._generator.getActiveItems();
        for (var i = active.length - 1; i >= 0; i--) {
            var item = active[i];
            var container = this._generator.getContainerForItem(item);
            if (container) {
                container.set_selected(this._selectionObs().binarySearch(item, this.options.comparefn) >= 0);
            }
        }
    },

    select: function (item, ctrlKey, shiftKey) {
        if ((!(shiftKey || ctrlKey)) || (shiftKey && !this._selectionBase)) {
            this._selectionObs.splice(0, this._selectionObs().length, item);
            this._selectionBase = item;
            this._selectionFocus = item;
        } else if (shiftKey) {
            var i0 = this._sourceObs().binarySearch(this._selectionBase, this.options.comparefn);
            var i1 = this._sourceObs().binarySearch(item, this.options.comparefn);
            if (i0 > i1) {
                var x = i0;
                i0 = i1;
                i1 = x;
            }
            var newSel = [];
            $.each(this._sourceObs().slice(i0, i1 + 1), function (i, e) { newSel.push(e); });
            this._selectionObs(newSel);
            this._selectionFocus = item;
        } else {
            if (odo.mergepass(this._selectionObs(), [item], this.options.comparefn,
            {
                match: function (l, r, li, ri, mod) { mod.removeLeft(); },
                rightOnly: function (l, r, li, ri, mod) { mod.addLeft(r); }
            })) {
                this._selectionObs.notifySubscribers(this._selectionObs());
            }
            this._selectionBase = item;
            this._selectionFocus = item;
        }
        this.triggerItemFocused();
    },

    triggerItemFocused: function () {
        var item = null;
        if (this._selectionFocus) {
            if (this._selectionObs().binarySearch(this._selectionFocus, this.options.comparefn) >= 0) {
                item = this._selectionFocus;
            }
        }
        this.element.trigger("itemFocus", [item]);
    },

    selectAll: function () {
        this._selectionObs($.merge([], this._sourceObs()));
    },

    _move: function (dist, ctrlKey, shiftKey) {
        // pgxx = move xx one page (from selection base) and select the item there
        // shift+pgxx = move xx one page (from selection base), selecting the range
        // ctrl+pgxx = move xx one page from current view (do not affect selection base)
        var from;
        if (ctrlKey) {
            from = this._stackpanel.getViewportPos();
        } else if (this._selectionFocus === null) {
            from = 0;
        } else {
            from = this._sourceObs().binarySearch(this._selectionFocus, this.options.comparefn);
        }

        var to = Math.min(Math.max(0, from + dist), this._sourceObs().length - 1);
        if (to >= 0) {
            if (!ctrlKey) {
                this.select(this._sourceObs()[to], false, shiftKey);
                this._stackpanel.scrollIntoViewport(to);
            } else {
                this._stackpanel.moveToPos(to);
            }
        }
        // reassert keyboard focus for IE
        this.element[0].focus();
    }
});
