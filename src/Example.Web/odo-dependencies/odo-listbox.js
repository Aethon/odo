(function ($) {

    function isScrolledIntoView($host, $subject)
    {
        //var docViewTop = $host.scrollTop();
        //var docViewBottom = docViewTop + $host.height();

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
            template: null
        },

        _create: function () {
            var self = this;

            function _handleKeyDown(event) {
                if (self.options.disabled || self.element.attr("readonly")) {
                    return;
                }

                suppressKeyPress = false;
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
                    case keyCode.A:
                        if (event.ctrlKey)
                            self.selectAll();
                        break;
                    /*
                    //                    case keyCode.PAGE_UP:                    
                    //                        self._move("previousPage", event);                    
                    //                        break;                    
                    //                    case keyCode.PAGE_DOWN:                    
                    //                        self._move("nextPage", event);                    
                    //                        break;                    
                    case keyCode.UP:
                    self._move("previous", event);
                    // prevent moving cursor to beginning of text field in some browsers
                    event.preventDefault();
                    break;
                    case keyCode.DOWN:
                    self._move("next", event);
                    // prevent moving cursor to end of text field in some browsers
                    event.preventDefault();
                    break;
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                    // when menu is open and has focus
                    if (self.menu.active) {
                    // #6055 - Opera still allows the keypress to occur
                    // which causes forms to submit
                    suppressKeyPress = true;
                    event.preventDefault();
                    }
                    //passthrough - ENTER and TAB both select the current element
                    case keyCode.TAB:
                    if (!self.menu.active) {
                    return;
                    }
                    self.menu.select(event);
                    break;
                    case keyCode.ESCAPE:
                    self.element.val(self.term);
                    self.close(event);
                    break;
                    default:
                    // keypress is triggered before the input value is changed
                    clearTimeout(self.searching);
                    self.searching = setTimeout(function () {
                    // only search if the value has changed
                    if (self.term != self.element.val()) {
                    self.selectedItem = null;
                    self.search(null, event);
                    }
                    }, self.options.delay);
                    break;*/ 
                }
            };

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
            });

        },

        _compareListItemToSource: function (li, src) {
            return this.options.comparefn(li.source, src);
        },

        refreshFromSource: function () {
            var self = this;
            var $lastElement;

            odo.mergepass(this._items, this._sourceObs(), function (l, r) { return self._compareListItemToSource(l, r); },
                {
                    match: function (l) { $lastElement = l.$item; },
                    leftOnly: function (l, r, li, ri, mod) { mod.removeLeft(); l.$item.remove(); },
                    rightOnly: function (l, r, li, ri, mod) {
                        var listItem = {};
                        var innerItem = $.tmpl(self.options.template, r);
                        var $item = $("<li role='listitem' class='ui-list-item' style='cursor: default'></li>")
                            .data("source", listItem)
                            .append(innerItem)
                            .mouseenter(function (event) {
                                self.activate($(event.target).closest("li[role*='listitem']"));
                            })
                            .mouseleave(function () {
                                self.deactivate($(event.target).closest("li[role*='listitem']"));
                            });
                        if ($lastElement == null) {
                            self.element.prepend($item);
                        } else {
                            $lastElement.after($item);
                        }
                        $lastElement = $item;
                        listItem.$item = $item;
                        listItem.source = r;
                        mod.addLeft(listItem);
                    }
                })
                && this._sourceObs.notifySubscribers(this._sourceObs());
        },

        refreshFromSelection: function () {
            var self = this;
            var $lastElement;

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
                $.each(this._items.slice(i0, i1 + 1), function(i, e) { newSel.push(e.source); });
                this._selectionObs(newSel);
                this._selectionFocus = listItem;
            } else {
                odo.mergepass(this._selectionObs(), [listItem], function (l, r) { return -self._compareListItemToSource(r, l); },
                {
                    match: function (l, r, li, ri, mod) { mod.removeLeft(); },
                    rightOnly: function (l, r, li, ri, mod) { mod.addLeft(r.source); }
                })
                && this._selectionObs.notifySubscribers(this._selectionObs());
                this._selectionBase = listItem;
                this._selectionFocus = listItem;
            }
        },

        _moveup: function (ctrlKey, shiftKey) {
            var $to;
            if (this._selectionFocus == null) {
                $to = this.element.children("li:first");
            } else {
                $to = this._selectionFocus.$item.prev();
            }
            if ($to && $to.length) {
                this.select($to, ctrlKey, shiftKey);
                if (this._selectionFocus && !isScrolledIntoView(this.element, this._selectionFocus.$item))
                    this._selectionFocus.$item[0].scrollIntoView(true);
            }
        },

        _movedown: function (ctrlKey, shiftKey) {
            var $to;
            if (this._selectionFocus == null) {
                $to = this.element.children("li:last");
            } else {
                $to = this._selectionFocus.$item.next();
            }
            if ($to && $to.length) {
                this.select($to, ctrlKey, shiftKey);
                if (this._selectionFocus && !isScrolledIntoView(this.element, this._selectionFocus.$item))
                    this._selectionFocus.$item[0].scrollIntoView(false);
            }
        },

        /*
        activate: function ($item) {
        /* if (this.hasScroll()) {
        var offset = item.offset().top - this.element.offset().top,
        scroll = this.element.attr("scrollTop"),
        elementHeight = this.element.height();
        if (offset < 0) {
        this.element.attr("scrollTop", scroll + offset);
        } else if (offset >= elementHeight) {
        this.element.attr("scrollTop", scroll + offset - elementHeight + item.height());
        }
        }* /
        $item.addClass("ui-state-hover");
        //				.attr("id", "ui-active-menuitem");
        this._trigger("focus", event, { item: item });
        },

        deactivate: function ($item) {

        $item.removeClass("ui-state-hover");
        //.removeAttr("id");
        this._trigger("blur");
        //            this.active = null;
        },

        next: function (event) {
        this.move("next", ".ui-menu-item:first", event);
        },

        previous: function (event) {
        this.move("prev", ".ui-menu-item:last", event);
        },

        first: function () {
        return this.active && !this.active.prevAll(".ui-menu-item").length;
        },

        last: function () {
        return this.active && !this.active.nextAll(".ui-menu-item").length;
        },

        move: function (direction, edge, event) {
        if (!this.active) {
        this.activate(event, this.element.children(edge));
        return;
        }
        var next = this.active[direction + "All"](".ui-menu-item").eq(0);
        if (next.length) {
        this.activate(event, next);
        } else {
        this.activate(event, this.element.children(edge));
        }
        },

        // TODO merge with previousPage
        nextPage: function (event) {
        if (this.hasScroll()) {
        // TODO merge with no-scroll-else
        if (!this.active || this.last()) {
        this.activate(event, this.element.children(".ui-menu-item:first"));
        return;
        }
        var base = this.active.offset().top,
        height = this.element.height(),
        result = this.element.children(".ui-menu-item").filter(function () {
        var close = $(this).offset().top - base - height + $(this).height();
        // TODO improve approximation
        return close < 10 && close > -10;
        });

        // TODO try to catch this earlier when scrollTop indicates the last page anyway
        if (!result.length) {
        result = this.element.children(".ui-menu-item:last");
        }
        this.activate(event, result);
        } else {
        this.activate(event, this.element.children(".ui-menu-item")
        .filter(!this.active || this.last() ? ":first" : ":last"));
        }
        },

        // TODO merge with nextPage
        previousPage: function (event) {
        if (this.hasScroll()) {
        // TODO merge with no-scroll-else
        if (!this.active || this.first()) {
        this.activate(event, this.element.children(".ui-menu-item:last"));
        return;
        }

        var base = this.active.offset().top,
        height = this.element.height();
        result = this.element.children(".ui-menu-item").filter(function () {
        var close = $(this).offset().top - base + height - $(this).height();
        // TODO improve approximation
        return close < 10 && close > -10;
        });

        // TODO try to catch this earlier when scrollTop indicates the last page anyway
        if (!result.length) {
        result = this.element.children(".ui-menu-item:first");
        }
        this.activate(event, result);
        } else {
        this.activate(event, this.element.children(".ui-menu-item")
        .filter(!this.active || this.first() ? ":last" : ":first"));
        }
        },

        hasScroll: function () {
        return this.element.height() < this.element.attr("scrollHeight");
        },
        */

    });

} (jQuery));
