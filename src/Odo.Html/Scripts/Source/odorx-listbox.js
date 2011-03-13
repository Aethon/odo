$.widget("ui.odorx_listbox", {
    options: {
        //     equality: odo.AreEqual,
        tip: null // this is TEMPORARY
    },

    _create: function () {
        var self = this;
        this.Source = odo.Rx.CreateValueSubject(function () { return []; });
        this.Selected = odo.Rx.CreateValueSubject(function () { return []; });
        this.Template = odo.Rx.CreateValueSubject();
        this.Sort = odo.Rx.CreateValueSubject();
        this.Focus = odo.Rx.CreateValueSubject();
        this._koItems = ko.observableArray(this.Source.Value());

        this._selectionFocus = null;
        this._selectionBase = null;

        var _handleKeyDown = function (event) {
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
        };

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
                    }).append(self.Template.Value()(context));

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

            // set initial state
            result.set_selected(self.Selected.Value().binarySearch(context, self.Sort.Value()) >= 0);

            return result;
        };

        this._generator = new Jspf.OldListItemContainerGenerator();
        this._generator.set_comparer(this.Sort.Value());
        this._generator.set_allItems(this._koItems);
        this._generator.set_itemTemplate(template);
        this._stackpanel.set_itemContainerGenerator(this._generator);

        this.Source
            .Do(function (n) { self._koItems(n); })
            .CombineLatest(self.Sort.Do(function(v) { self._generator.set_comparer(v); }), function (a, c) {
                var result = $.merge([], a);
                if (c) result.sort(c);
                return result;
            })
            .CombineLatest(self.Selected, function (i, s) {
                return { items: i, selected: s };
            })
            .Subscribe(new Rx.Observer(function (x) {
                self._updateElements(x.selected);
            }));

        this.Selected.Subscribe(new Rx.Observer(function (x) {
                self._updateElements(x);
            }));

        this.element
		.addClass("ui-list ui-widget ui-corner-all")
        .css({ overflow: "hidden", "-khtml-user-select": "none", "-moz-user-select": "none" })
		.attr({
		    role: "listbox",
		    "aria-activedescendant": "ui-active-menuitem"
		})
        .keydown(_handleKeyDown);

        this.element[0].onselectstart = function () { return false; }; // IE way of preventing text selection
    },

    select: function (item, ctrlKey, shiftKey) {
        if ((!(shiftKey || ctrlKey)) || (shiftKey && !_selectionBase)) {
            this.Selected.Value([item]);
            this._selectionBase = item;
            this._selectionFocus = item;
        } else if (shiftKey) {
            var i0 = this.Source.Value().binarySearch(_selectionBase, this.Sort.Value());
            var i1 = this.Source.Value().binarySearch(item, this.Sort.Value());
            if (i0 > i1) {
                var x = i0;
                i0 = i1;
                i1 = x;
            }
            var newSel = [];
            $.each(this.Source.Value().slice(i0, i1 + 1), function (i, e) { newSel.push(e); });
            this.Selected.Value(newSel);
            this._selectionFocus = item;
        } else {
            var array = $.merge([], this.Selected.Value());
            var index = array.binarySearch(item, this.Sort.Value());
            if (index !== -1) {
                array.splice(index, 1);
            } else {
                array.push(index);
            }
            this.Selected.Value(array);
            this._selectionBase = item;
            this._selectionFocus = item;
        }
    },

    _selectAll: function () {
        this.Selected.Value($.merge([], self.Source.Value()));
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
            from = this.Source.Value().binarySearch(this._selectionFocus, this.Sort.Value());
        }

        var to = Math.min(Math.max(0, from + dist), this.Source.Value().length - 1);
        if (to >= 0) {
            if (!ctrlKey) {
                this.select(this.Source.Value()[to], false, shiftKey);
                this._stackpanel.scrollIntoViewport(to);
            } else {
                this._stackpanel.moveToPos(to);
            }
        }
    },

    _updateElements: function (newSelection) {
        var active = this._generator.getActiveItems();
        for (var i = active.length - 1; i >= 0; i--) {
            var item = active[i];
            var container = this._generator.getContainerForItem(item);
            if (container) {
                container.set_selected(newSelection.binarySearch(item, self.Sort.Value()) >= 0);
            }
        }
    }
});



$.widget("ui.odorx_listbox_depr", {
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

