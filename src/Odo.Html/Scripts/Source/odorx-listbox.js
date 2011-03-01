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

