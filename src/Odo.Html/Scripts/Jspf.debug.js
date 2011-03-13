//! Jspf.debug.js
//

(function() {
function executeScript() {

Type.registerNamespace('Jspf');

////////////////////////////////////////////////////////////////////////////////
// Jspf.IScrollableAxis

Jspf.IScrollableAxis = function() { 
};
Jspf.IScrollableAxis.prototype = {
    getExtentLength : null,
    getViewportPos : null,
    getViewportLength : null,
    add_changed : null,
    remove_changed : null,
    moveLineNear : null,
    moveLineFar : null,
    movePageNear : null,
    movePageFar : null,
    moveToPos : null,
    scrollIntoViewport : null
}
Jspf.IScrollableAxis.registerInterface('Jspf.IScrollableAxis');


////////////////////////////////////////////////////////////////////////////////
// Jspf.IListItem

Jspf.IListItem = function() { 
};
Jspf.IListItem.prototype = {
    get_data : null,
    set_data : null,
    get_isSelected : null,
    set_isSelected : null,
    get_isEnabled : null,
    set_isEnabled : null
}
Jspf.IListItem.registerInterface('Jspf.IListItem');


////////////////////////////////////////////////////////////////////////////////
// Jspf.IItemContainerGenerator

Jspf.IItemContainerGenerator = function() { 
};
Jspf.IItemContainerGenerator.prototype = {
    count : null,
    generateContainer : null,
    getContainerForIndex : null,
    getContainerForItem : null,
    getItemForContainer : null,
    getIndexForContainer : null,
    releaseContainer : null,
    getActiveItems : null,
    add_changed : null,
    remove_changed : null
}
Jspf.IItemContainerGenerator.registerInterface('Jspf.IItemContainerGenerator');


////////////////////////////////////////////////////////////////////////////////
// Jspf.Axis

Jspf.Axis = function Jspf_Axis() {
    /// <field name="length" type="Number" integer="true">
    /// </field>
    /// <field name="minLength" type="Number" integer="true">
    /// </field>
    /// <field name="maxLength" type="Number" integer="true">
    /// </field>
    /// <field name="nearMargin" type="Number" integer="true">
    /// </field>
    /// <field name="farMargin" type="Number" integer="true">
    /// </field>
    /// <field name="alignment" type="Jspf.AxisAlignment">
    /// </field>
    this.length = -1;
    this.minLength = -1;
    this.maxLength = -1;
    this.alignment = Jspf.AxisAlignment.stretch;
}
Jspf.Axis.prototype = {
    nearMargin: 0,
    farMargin: 0,
    
    effectiveMaxLength: function Jspf_Axis$effectiveMaxLength() {
        /// <returns type="Number" integer="true"></returns>
        return (this.maxLength < 0) ? Constants.maX_INT : this.maxLength;
    },
    
    effectiveMinLength: function Jspf_Axis$effectiveMinLength() {
        /// <returns type="Number" integer="true"></returns>
        return Math.max(this.minLength, 0);
    },
    
    effectiveLength: function Jspf_Axis$effectiveLength() {
        /// <returns type="Number" integer="true"></returns>
        return Math.min(this.effectiveMaxLength(), Math.max(this.effectiveMinLength(), this.length));
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.AxisArrangement

Jspf.AxisArrangement = function Jspf_AxisArrangement(position, length) {
    /// <param name="position" type="Number" integer="true">
    /// </param>
    /// <param name="length" type="Number" integer="true">
    /// </param>
    /// <field name="position" type="Number" integer="true">
    /// </field>
    /// <field name="length" type="Number" integer="true">
    /// </field>
    this.position = position;
    this.length = length;
}
Jspf.AxisArrangement.prototype = {
    position: 0,
    length: 0,
    
    clone: function Jspf_AxisArrangement$clone() {
        /// <returns type="Jspf.AxisArrangement"></returns>
        return new Jspf.AxisArrangement(this.position, this.length);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Constants

Constants = function Constants() {
    /// <field name="maX_INT" type="Number" integer="true" static="true">
    /// </field>
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Container

Jspf.Container = function Jspf_Container() {
    /// <field name="_child$1" type="Jspf.Control">
    /// </field>
    Jspf.Container.initializeBase(this);
}
Jspf.Container.prototype = {
    
    get_child: function Jspf_Container$get_child() {
        /// <value type="Jspf.Control"></value>
        return this._child$1;
    },
    set_child: function Jspf_Container$set_child(value) {
        /// <value type="Jspf.Control"></value>
        if (this._child$1 != null) {
            this._child$1._setParent(null);
        }
        this._child$1 = value;
        if (this._child$1 != null) {
            this._child$1._setParent(this);
        }
        return value;
    },
    
    _child$1: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ScrollBar

Jspf.ScrollBar = function Jspf_ScrollBar() {
    /// <field name="_scrollableAxis$1" type="Jspf.IScrollableAxis">
    /// </field>
    /// <field name="_inputSource$1" type="jQueryObject">
    /// </field>
    /// <field name="_delayMilliseconds$1" type="Number" integer="true">
    /// </field>
    /// <field name="_repeatMilliseconds$1" type="Number" integer="true">
    /// </field>
    /// <field name="_scrubbing$1" type="Boolean">
    /// </field>
    /// <field name="_auto$1" type="Boolean">
    /// </field>
    /// <field name="_dom$1" type="jQueryObject">
    /// </field>
    /// <field name="_near$1" type="jQueryObject">
    /// </field>
    /// <field name="_far$1" type="jQueryObject">
    /// </field>
    /// <field name="_track$1" type="jQueryObject">
    /// </field>
    /// <field name="_thumb$1" type="jQueryObject">
    /// </field>
    /// <field name="_minThumbLength$1" type="Number" integer="true">
    /// </field>
    /// <field name="_scrollTimer$1" type="Number" integer="true">
    /// </field>
    /// <field name="_grabPoint$1" type="Number" integer="true">
    /// </field>
    /// <field name="_disabled$1" type="Boolean">
    /// </field>
    /// <field name="_dragHandler$1" type="jQueryEventHandler">
    /// </field>
    /// <field name="_stopScrollHandler$1" type="jQueryEventHandler">
    /// </field>
    Jspf.ScrollBar.initializeBase(this);
    this._stopScrollHandler$1 = ss.Delegate.create(this, this._stopScroll$1);
    this._dragHandler$1 = ss.Delegate.create(this, this._drag$1);
}
Jspf.ScrollBar.prototype = {
    
    get_scrollableAxis: function Jspf_ScrollBar$get_scrollableAxis() {
        /// <value type="Jspf.IScrollableAxis"></value>
        return this._scrollableAxis$1;
    },
    set_scrollableAxis: function Jspf_ScrollBar$set_scrollableAxis(value) {
        /// <value type="Jspf.IScrollableAxis"></value>
        this._scrollableAxis$1 = value;
        this._scrollableAxis$1.add_changed(ss.Delegate.create(this, this._scrollableAxisChanged$1));
        return value;
    },
    
    _scrollableAxis$1: null,
    
    get_inputSource: function Jspf_ScrollBar$get_inputSource() {
        /// <value type="Object" domElement="true"></value>
        return this._inputSource$1[0];
    },
    set_inputSource: function Jspf_ScrollBar$set_inputSource(value) {
        /// <value type="Object" domElement="true"></value>
        this._inputSource$1 = $(value);
        this._inputSource$1.bind('mousewheel', ss.Delegate.create(this, this._wheel$1));
        return value;
    },
    
    _inputSource$1: null,
    _delayMilliseconds$1: 400,
    _repeatMilliseconds$1: 40,
    _scrubbing$1: false,
    _auto$1: false,
    _dom$1: null,
    _near$1: null,
    _far$1: null,
    _track$1: null,
    _thumb$1: null,
    _minThumbLength$1: 10,
    _scrollTimer$1: 0,
    _grabPoint$1: 0,
    _disabled$1: false,
    
    show: function Jspf_ScrollBar$show(show) {
        /// <param name="show" type="Boolean">
        /// </param>
        if (this._dom$1 != null) {
            if (show) {
                this._dom$1.css('visibility', 'visible');
            }
            else {
                this._dom$1.css('visibility', 'hidden');
            }
        }
    },
    
    arrange: function Jspf_ScrollBar$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.ScrollBar.callBaseMethod(this, 'arrange', [ horizontal, vertical, hostElement ]);
        if (this._dom$1 == null) {
            this._dom$1 = $('<div class=\'ui-vertical-scrollbar\' style=\'position: absolute;\'></div>').appendTo(hostElement);
            this._near$1 = $('<div class=\'ui-scroll-up-button\'></div>').appendTo(this._dom$1).mousedown(ss.Delegate.create(this, this._lineNear$1));
            this._track$1 = $('<div class=\'ui-scroll-vertical-track\'></div>').appendTo(this._dom$1).mousedown(ss.Delegate.create(this, this._page$1));
            this._thumb$1 = $('<div class=\'ui-scroll-vertical-thumb\' style=\'position: relative\'></div>').appendTo(this._track$1).mousedown(ss.Delegate.create(this, this._scrub$1));
            this._far$1 = $('<div class=\'ui-scroll-down-button\'></div>').appendTo(this._dom$1).mousedown(ss.Delegate.create(this, this._lineFar$1));
        }
        var buttonLength = (vertical.length > 2 * horizontal.length) ? horizontal.length : Math.floor(vertical.length / 2);
        var trackHeight = vertical.length - 2 * buttonLength;
        this._minThumbLength$1 = Math.min(buttonLength, trackHeight);
        this._dom$1.css('width', horizontal.length + 'px').css('height', vertical.length + 'px').css('top', vertical.position + 'px').css('left', horizontal.position + 'px');
        this._near$1.css('width', horizontal.length + 'px').css('height', buttonLength + 'px');
        this._far$1.css('width', horizontal.length + 'px').css('height', buttonLength + 'px');
        this._track$1.css('width', horizontal.length + 'px').css('height', trackHeight + 'px');
        this._thumb$1.css('width', horizontal.length + 'px');
        this._scrollableAxisChanged$1();
    },
    
    _scrollableAxisChanged$1: function Jspf_ScrollBar$_scrollableAxisChanged$1() {
        if (!this._scrubbing$1) {
            var logicalLength = this._scrollableAxis$1.getExtentLength() - this._scrollableAxis$1.getViewportLength();
            var thumbLength = Math.max(Math.floor(this._track$1.height() / this._scrollableAxis$1.getExtentLength() * this._scrollableAxis$1.getViewportLength()), this._minThumbLength$1);
            var physicalLength = this._track$1.height() - thumbLength;
            var thumbPos = 0;
            if (logicalLength > 0 && physicalLength > 0) {
                var ratio = physicalLength / logicalLength;
                thumbPos = Math.round(this._scrollableAxis$1.getViewportPos() * ratio);
            }
            else {
            }
            this._thumb$1.css('top', thumbPos + 'px').css('height', thumbLength + 'px');
        }
    },
    
    _lineNear$1: function Jspf_ScrollBar$_lineNear$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$1) {
            this._startScroll$1(ss.Delegate.create(this._scrollableAxis$1, this._scrollableAxis$1.moveLineNear));
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _lineFar$1: function Jspf_ScrollBar$_lineFar$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$1) {
            this._startScroll$1(ss.Delegate.create(this._scrollableAxis$1, this._scrollableAxis$1.moveLineFar));
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _page$1: function Jspf_ScrollBar$_page$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$1) {
            var curY = e.pageY;
            var thumbTop = this._thumb$1.offset().top;
            if (curY <= thumbTop) {
                this._startScroll$1(ss.Delegate.create(this._scrollableAxis$1, this._scrollableAxis$1.movePageNear));
            }
            else {
                this._startScroll$1(ss.Delegate.create(this._scrollableAxis$1, this._scrollableAxis$1.movePageFar));
            }
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _scrub$1: function Jspf_ScrollBar$_scrub$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$1) {
            this._scrubbing$1 = true;
            var curY = e.pageY;
            this._grabPoint$1 = curY - this._thumb$1.offset().top;
            $(document).mousemove(this._dragHandler$1);
            $(document).mouseup(this._stopScrollHandler$1);
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _dragHandler$1: null,
    
    _drag$1: function Jspf_ScrollBar$_drag$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$1) {
            var thumbPos = (e.pageY - this._grabPoint$1);
            var physicalPos = thumbPos - this._track$1.offset().top;
            var physicalLength = this._track$1.height();
            var logicalLength = this._scrollableAxis$1.getExtentLength();
            this._scrollableAxis$1.moveToPos(physicalPos * logicalLength / physicalLength);
            thumbPos = Math.max(0, Math.min(physicalLength - this._thumb$1.height(), physicalPos));
            this._thumb$1.css('top', thumbPos + 'px');
        }
    },
    
    _wheel$1: function Jspf_ScrollBar$_wheel$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        var ee = e;
        if (ee.wheelDelta >= 120) {
            this._scrollableAxis$1.movePageNear();
        }
        else if (ee.wheelDelta <= -120) {
            this._scrollableAxis$1.movePageFar();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    
    _startScroll$1: function Jspf_ScrollBar$_startScroll$1(action) {
        /// <param name="action" type="Action">
        /// </param>
        action.invoke();
        this._scrollTimer$1 = window.setInterval(ss.Delegate.create(this, function() {
            if (this._scrollTimer$1 > 0) {
                window.clearInterval(this._scrollTimer$1);
                this._scrollTimer$1 = window.setInterval(ss.Delegate.create(this, function() {
                    action.invoke();
                }), this._repeatMilliseconds$1);
                action.invoke();
            }
        }), this._delayMilliseconds$1);
        $(document).mouseup(this._stopScrollHandler$1);
    },
    
    _stopScrollHandler$1: null,
    
    _stopScroll$1: function Jspf_ScrollBar$_stopScroll$1(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        $(document).unbind('mouseup', this._stopScrollHandler$1);
        $(document).unbind('mousemove', this._dragHandler$1);
        if (this._scrubbing$1) {
            this._scrubbing$1 = false;
            this._scrollableAxisChanged$1();
        }
        if (this._scrollTimer$1 > 0) {
            window.clearInterval(this._scrollTimer$1);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf._generation

Jspf._generation = function Jspf__generation(item, container) {
    /// <param name="item" type="Object">
    /// </param>
    /// <param name="container" type="Jspf.Control">
    /// </param>
    /// <field name="container" type="Jspf.Control">
    /// </field>
    /// <field name="item" type="Object">
    /// </field>
    this.container = container;
    this.item = item;
}
Jspf._generation.prototype = {
    container: null,
    item: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.OldListItemContainerGenerator

Jspf.OldListItemContainerGenerator = function Jspf_OldListItemContainerGenerator() {
    /// <field name="_generations" type="Array">
    /// </field>
    /// <field name="_comparer" type="Jspf.UniqueSortCompare">
    /// </field>
    /// <field name="_allItems" type="Jspf.KoObservableArray">
    /// </field>
    /// <field name="_itemTemplate" type="Jspf.Template">
    /// </field>
    /// <field name="__changed" type="Action">
    /// </field>
    this._generations = [];
}
Jspf.OldListItemContainerGenerator.prototype = {
    
    get_comparer: function Jspf_OldListItemContainerGenerator$get_comparer() {
        /// <value type="Jspf.UniqueSortCompare"></value>
        return this._comparer;
    },
    set_comparer: function Jspf_OldListItemContainerGenerator$set_comparer(value) {
        /// <value type="Jspf.UniqueSortCompare"></value>
        this._comparer = value;
        return value;
    },
    
    _comparer: null,
    
    get_allItems: function Jspf_OldListItemContainerGenerator$get_allItems() {
        /// <value type="Jspf.KoObservableArray"></value>
        return this._allItems;
    },
    set_allItems: function Jspf_OldListItemContainerGenerator$set_allItems(value) {
        /// <value type="Jspf.KoObservableArray"></value>
        this._allItems = value;
        if (this._allItems != null) {
            (this._allItems).subscribe(ss.Delegate.create(this, function() {
                if (this.__changed != null) {
                    this.__changed.invoke();
                }
            }));
        }
        return value;
    },
    
    _allItems: null,
    
    count: function Jspf_OldListItemContainerGenerator$count() {
        /// <returns type="Number" integer="true"></returns>
        return (this._allItems == null) ? 0 : this._allItems.invoke().length;
    },
    
    get_itemTemplate: function Jspf_OldListItemContainerGenerator$get_itemTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemTemplate;
    },
    set_itemTemplate: function Jspf_OldListItemContainerGenerator$set_itemTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemTemplate = value;
        return value;
    },
    
    _itemTemplate: null,
    
    generateContainer: function Jspf_OldListItemContainerGenerator$generateContainer(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.Control"></returns>
        var result = this.getContainerForIndex(index);
        if (result == null) {
            var item = this._allItems.invoke()[index];
            result = this._itemTemplate.invoke(item);
            this._generations.add(new Jspf._generation(item, result));
        }
        return result;
    },
    
    getContainerForIndex: function Jspf_OldListItemContainerGenerator$getContainerForIndex(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.Control"></returns>
        var item = this._allItems.invoke()[index];
        return this.getContainerForItem(item);
    },
    
    getContainerForItem: function Jspf_OldListItemContainerGenerator$getContainerForItem(item) {
        /// <param name="item" type="Object">
        /// </param>
        /// <returns type="Jspf.Control"></returns>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            var g = this._generations[i];
            if (g.item === item) {
                return g.container;
            }
        }
        return null;
    },
    
    getItemForContainer: function Jspf_OldListItemContainerGenerator$getItemForContainer(container) {
        /// <param name="container" type="Jspf.Control">
        /// </param>
        /// <returns type="Object"></returns>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            var g = this._generations[i];
            if (g.container === container) {
                return g.item;
            }
        }
        return null;
    },
    
    getIndexForContainer: function Jspf_OldListItemContainerGenerator$getIndexForContainer(container) {
        /// <param name="container" type="Jspf.Control">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        var item = this.getItemForContainer(container);
        if (item == null) {
            return -1;
        }
        return (this._allItems.invoke()).binarySearch(item, this._comparer);
    },
    
    releaseContainer: function Jspf_OldListItemContainerGenerator$releaseContainer(container) {
        /// <param name="container" type="Jspf.Control">
        /// </param>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            if ((this._generations[i]).container === container) {
                this._generations.removeAt(i);
                break;
            }
        }
    },
    
    add_changed: function Jspf_OldListItemContainerGenerator$add_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.combine(this.__changed, value);
    },
    remove_changed: function Jspf_OldListItemContainerGenerator$remove_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.remove(this.__changed, value);
    },
    
    __changed: null,
    
    getActiveItems: function Jspf_OldListItemContainerGenerator$getActiveItems() {
        /// <returns type="Array"></returns>
        return $.map(this._generations, ss.Delegate.create(this, function(element, index) {
            return (element).item;
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ValueSubject

Jspf.ValueSubject = function Jspf_ValueSubject() {
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.VirtualStackPanel

Jspf.VirtualStackPanel = function Jspf_VirtualStackPanel() {
    /// <field name="_itemContainerGenerator$1" type="Jspf.IItemContainerGenerator">
    /// </field>
    /// <field name="_fixedItemHeight$1" type="Number" integer="true">
    /// </field>
    /// <field name="_desiredFirstItem$1" type="Number" integer="true">
    /// </field>
    /// <field name="_firstItem$1" type="Number" integer="true">
    /// </field>
    /// <field name="_firstItemContainer$1" type="Jspf.Control">
    /// </field>
    /// <field name="_lastItem$1" type="Number" integer="true">
    /// </field>
    /// <field name="_viewportLines$1" type="Number" integer="true">
    /// </field>
    /// <field name="_firstRealizedItem$1" type="Number" integer="true">
    /// </field>
    /// <field name="_lastRealizedItem$1" type="Number" integer="true">
    /// </field>
    /// <field name="_realizedItems$1" type="Array">
    /// </field>
    /// <field name="_scroller$1" type="jQueryObject">
    /// </field>
    /// <field name="_content$1" type="jQueryObject">
    /// </field>
    /// <field name="_scrollbar$1" type="Jspf.ScrollBar">
    /// </field>
    /// <field name="_needsSync$1" type="Boolean">
    /// </field>
    /// <field name="__changed$1" type="Action">
    /// </field>
    this._firstItem$1 = -1;
    this._lastItem$1 = -1;
    this._firstRealizedItem$1 = -1;
    this._lastRealizedItem$1 = -1;
    this._realizedItems$1 = [];
    Jspf.VirtualStackPanel.initializeBase(this);
}
Jspf.VirtualStackPanel.prototype = {
    
    get_itemContainerGenerator: function Jspf_VirtualStackPanel$get_itemContainerGenerator() {
        /// <value type="Jspf.IItemContainerGenerator"></value>
        return this._itemContainerGenerator$1;
    },
    set_itemContainerGenerator: function Jspf_VirtualStackPanel$set_itemContainerGenerator(value) {
        /// <value type="Jspf.IItemContainerGenerator"></value>
        this._itemContainerGenerator$1 = value;
        if (this._itemContainerGenerator$1 != null) {
            this._itemContainerGenerator$1.add_changed(ss.Delegate.create(this, function() {
                this._synchronize$1(true);
            }));
        }
        this._synchronize$1(true);
        return value;
    },
    
    _itemContainerGenerator$1: null,
    
    get_fixedItemHeight: function Jspf_VirtualStackPanel$get_fixedItemHeight() {
        /// <value type="Number" integer="true"></value>
        return this._fixedItemHeight$1;
    },
    set_fixedItemHeight: function Jspf_VirtualStackPanel$set_fixedItemHeight(value) {
        /// <value type="Number" integer="true"></value>
        this._fixedItemHeight$1 = value;
        this._synchronize$1(true);
        return value;
    },
    
    _fixedItemHeight$1: 15,
    _desiredFirstItem$1: 0,
    _firstItemContainer$1: null,
    _viewportLines$1: 0,
    _scroller$1: null,
    _content$1: null,
    _scrollbar$1: null,
    
    _getAvailableItemCount$1: function Jspf_VirtualStackPanel$_getAvailableItemCount$1() {
        /// <returns type="Number" integer="true"></returns>
        return (this._itemContainerGenerator$1 != null) ? this._itemContainerGenerator$1.count() : 0;
    },
    
    _synchronize$1: function Jspf_VirtualStackPanel$_synchronize$1(clear) {
        /// <param name="clear" type="Boolean">
        /// </param>
        var available = this._getAvailableItemCount$1();
        var changed = false;
        if (this._scroller$1 != null) {
            if (clear || (available === 0)) {
                if (this._itemContainerGenerator$1 != null) {
                    this._desiredFirstItem$1 = this._itemContainerGenerator$1.getIndexForContainer(this._firstItemContainer$1);
                    if (this._desiredFirstItem$1 < 0) {
                        this._desiredFirstItem$1 = this._firstItem$1;
                    }
                }
                for (var i = Math.max(this._firstRealizedItem$1, 0); i <= this._lastRealizedItem$1; i++) {
                    this._releaseContainer$1(i);
                    changed = true;
                }
                this._firstItem$1 = -1;
                this._firstItemContainer$1 = null;
                this._lastItem$1 = -1;
                this._firstRealizedItem$1 = -1;
                this._lastRealizedItem$1 = -1;
            }
            if (available > 0) {
                this._content$1.height(available * this._fixedItemHeight$1);
                this._desiredFirstItem$1 = Math.max(0, Math.min(this._desiredFirstItem$1, this._getAvailableItemCount$1()));
                if (this._desiredFirstItem$1 !== this._firstItem$1) {
                    changed = true;
                }
                var firstRequired = this._desiredFirstItem$1;
                var viewSize = this._scroller$1.innerHeight();
                var buffer = viewSize / this._fixedItemHeight$1;
                var usableBuffer = Math.floor(buffer);
                var lastRequired = firstRequired + usableBuffer - 1;
                if (lastRequired > available - 1) {
                    var overshot = lastRequired - available + 1;
                    firstRequired = Math.max(firstRequired - overshot, 0);
                    lastRequired = available - 1;
                }
                var firstAllowed = firstRequired - 2;
                var lastAllowed = lastRequired + 2;
                this._firstItem$1 = firstRequired;
                this._desiredFirstItem$1 = this._firstItem$1;
                this._firstItemContainer$1 = this._itemContainerGenerator$1.getContainerForIndex(this._firstItem$1);
                this._lastItem$1 = lastRequired;
                if (buffer - usableBuffer > 0) {
                    lastRequired = Math.min(lastRequired + 1, available - 1);
                }
                this._showScrollbar$1((this._firstItem$1 > 0) || (this._viewportLines$1 < available));
                var layoutWidth = this._content$1.innerWidth();
                for (var i = firstRequired; i <= lastRequired; i++) {
                    if (this._realizedItems$1[i] == null) {
                        changed = true;
                        var item = this._itemContainerGenerator$1.generateContainer(i);
                        this._realizedItems$1[i] = item;
                        item._setParent(this);
                        item.measure(new Jspf.Size(layoutWidth, this._fixedItemHeight$1));
                        var v = this.arrangeAxis(item.get_vertical(), item.measuredSize.height, this._fixedItemHeight$1);
                        v.position += i * this._fixedItemHeight$1;
                        item.arrange(this.arrangeAxis(item.get_horizontal(), item.measuredSize.width, this._content$1.innerWidth()), v, this._content$1[0]);
                    }
                }
                this._content$1.css('top', (-firstRequired * this._fixedItemHeight$1) + 'px');
                for (var i = Math.max(this._firstRealizedItem$1, 0); i < firstAllowed; i++) {
                    this._releaseContainer$1(i);
                }
                for (var i = lastAllowed + 1; i <= this._lastRealizedItem$1; i++) {
                    this._releaseContainer$1(i);
                }
                this._firstRealizedItem$1 = Math.min(firstRequired, Math.max(firstAllowed, this._firstRealizedItem$1));
                this._lastRealizedItem$1 = Math.max(lastRequired, Math.min(lastAllowed, this._lastRealizedItem$1));
            }
            else {
                this._showScrollbar$1(false);
            }
        }
        if (changed && this.__changed$1 != null) {
            this.__changed$1.invoke();
        }
    },
    
    _showScrollbar$1: function Jspf_VirtualStackPanel$_showScrollbar$1(show) {
        /// <param name="show" type="Boolean">
        /// </param>
        this._scrollbar$1.show(show);
    },
    
    _releaseContainer$1: function Jspf_VirtualStackPanel$_releaseContainer$1(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        var loser = this._realizedItems$1[index];
        if (loser != null) {
            this._realizedItems$1[index] = null;
            loser._setParent(null);
            this._itemContainerGenerator$1.releaseContainer(loser);
        }
    },
    
    arrange: function Jspf_VirtualStackPanel$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.VirtualStackPanel.callBaseMethod(this, 'arrange', [ horizontal, vertical, hostElement ]);
        var scrollbarWidth = 18;
        if (this._scroller$1 == null) {
            this._scroller$1 = $('<div style=\'overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute\'></div>').appendTo(hostElement);
            this._content$1 = $('<div style=\'overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute\'></div>').appendTo(this._scroller$1);
            this._scrollbar$1 = new Jspf.ScrollBar();
            this._scrollbar$1.set_scrollableAxis(this);
            this._scrollbar$1.set_inputSource(this._scroller$1[0]);
        }
        this._content$1.width(horizontal.length).height(this._getAvailableItemCount$1() * this._fixedItemHeight$1);
        this._scroller$1.width(horizontal.length).height(vertical.length).css('top', vertical.position + 'px').css('left', horizontal.position + 'px');
        this._viewportLines$1 = Math.floor(this._scroller$1.innerHeight() / this._fixedItemHeight$1);
        var h = horizontal.clone();
        h.position = h.position + h.length - scrollbarWidth;
        h.length = scrollbarWidth;
        this._scrollbar$1.arrange(h, vertical, this._scroller$1[0]);
        this._synchronize$1(true);
    },
    
    _needsSync$1: false,
    
    _scrollChanged$1: function Jspf_VirtualStackPanel$_scrollChanged$1() {
        this._needsSync$1 = true;
        window.setTimeout(ss.Delegate.create(this, this._onDelayedScroll$1), 10);
    },
    
    _onDelayedScroll$1: function Jspf_VirtualStackPanel$_onDelayedScroll$1() {
        if (this._needsSync$1) {
            this._needsSync$1 = false;
            this._synchronize$1(false);
        }
    },
    
    getExtentLength: function Jspf_VirtualStackPanel$getExtentLength() {
        /// <returns type="Number" integer="true"></returns>
        return this._getAvailableItemCount$1();
    },
    
    getViewportPos: function Jspf_VirtualStackPanel$getViewportPos() {
        /// <returns type="Number" integer="true"></returns>
        return this._firstItem$1;
    },
    
    getViewportLength: function Jspf_VirtualStackPanel$getViewportLength() {
        /// <returns type="Number" integer="true"></returns>
        return this._viewportLines$1;
    },
    
    add_changed: function Jspf_VirtualStackPanel$add_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed$1 = ss.Delegate.combine(this.__changed$1, value);
    },
    remove_changed: function Jspf_VirtualStackPanel$remove_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed$1 = ss.Delegate.remove(this.__changed$1, value);
    },
    
    __changed$1: null,
    
    moveLineNear: function Jspf_VirtualStackPanel$moveLineNear() {
        this._desiredFirstItem$1 = this._desiredFirstItem$1 - 1;
        this._scrollChanged$1();
    },
    
    moveLineFar: function Jspf_VirtualStackPanel$moveLineFar() {
        this._desiredFirstItem$1 = this._desiredFirstItem$1 + 1;
        this._scrollChanged$1();
    },
    
    movePageNear: function Jspf_VirtualStackPanel$movePageNear() {
        this._desiredFirstItem$1 = this._desiredFirstItem$1 - 10;
        this._scrollChanged$1();
    },
    
    movePageFar: function Jspf_VirtualStackPanel$movePageFar() {
        this._desiredFirstItem$1 = this._desiredFirstItem$1 + 10;
        this._scrollChanged$1();
    },
    
    moveToPos: function Jspf_VirtualStackPanel$moveToPos(position) {
        /// <param name="position" type="Number" integer="true">
        /// </param>
        this._desiredFirstItem$1 = Math.floor(position);
        this._scrollChanged$1();
    },
    
    scrollIntoViewport: function Jspf_VirtualStackPanel$scrollIntoViewport(line) {
        /// <param name="line" type="Number" integer="true">
        /// </param>
        if (line < this._firstItem$1) {
            this._desiredFirstItem$1 = line;
            this._scrollChanged$1();
        }
        if (line > this._lastItem$1) {
            this._desiredFirstItem$1 = line - this.getViewportLength() + 1;
            this._scrollChanged$1();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf._listItem

Jspf._listItem = function Jspf__listItem(selected, index) {
    /// <param name="selected" type="Array">
    /// </param>
    /// <param name="index" type="Number" integer="true">
    /// </param>
    /// <field name="_selected" type="Array">
    /// </field>
    /// <field name="_index" type="Number" integer="true">
    /// </field>
    /// <field name="_data" type="Object">
    /// </field>
    this._selected = selected;
    this._index = index;
}
Jspf._listItem.prototype = {
    _selected: null,
    _index: 0,
    
    get_isSelected: function Jspf__listItem$get_isSelected() {
        /// <value type="Boolean"></value>
        return this._selected.contains(this._data);
    },
    set_isSelected: function Jspf__listItem$set_isSelected(value) {
        /// <value type="Boolean"></value>
        this._selected[this._index] = value;
        return value;
    },
    
    get_isEnabled: function Jspf__listItem$get_isEnabled() {
        /// <value type="Boolean"></value>
        return true;
    },
    set_isEnabled: function Jspf__listItem$set_isEnabled(value) {
        /// <value type="Boolean"></value>
        return value;
    },
    
    get_data: function Jspf__listItem$get_data() {
        /// <value type="Object"></value>
        return this._data;
    },
    set_data: function Jspf__listItem$set_data(value) {
        /// <value type="Object"></value>
        this._data = value;
        return value;
    },
    
    _data: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ListBox

Jspf.ListBox = function Jspf_ListBox() {
    /// <field name="_itemContainerGenerator$1" type="Jspf.IItemContainerGenerator">
    /// </field>
    /// <field name="_fixedItemHeight$1" type="Number" integer="true">
    /// </field>
    /// <field name="_itemTemplate$1" type="Jspf.Template">
    /// </field>
    /// <field name="_itemContainerTemplate$1" type="Jspf.Template">
    /// </field>
    /// <field name="_stackPanel$1" type="Jspf.VirtualStackPanel">
    /// </field>
    /// <field name="_selectionFocus$1" type="Number" integer="true">
    /// </field>
    /// <field name="_selectionBase$1" type="Number" integer="true">
    /// </field>
    /// <field name="_source$1" type="Array">
    /// </field>
    /// <field name="_selected$1" type="Array">
    /// </field>
    /// <field name="_focus$1" type="Object">
    /// </field>
    this._itemTemplate$1 = Jspf.ListBox._defaultTemplate$1;
    this._itemContainerTemplate$1 = Jspf.ListBox._defaultTemplate$1;
    this._source$1 = [];
    this._selected$1 = [];
    Jspf.ListBox.initializeBase(this);
}
Jspf.ListBox._defaultTemplate$1 = function Jspf_ListBox$_defaultTemplate$1(data) {
    /// <param name="data" type="Object">
    /// </param>
    /// <returns type="Jspf.Control"></returns>
    var result = new Jspf.DomControl();
    result.set_domContent($('<div style=\'height: 12px\'>' + data + '</div>')[0]);
    return result;
}
Jspf.ListBox.isScrolledIntoView = function Jspf_ListBox$isScrolledIntoView(host, subject) {
    /// <param name="host" type="jQueryObject">
    /// </param>
    /// <param name="subject" type="jQueryObject">
    /// </param>
    /// <returns type="Boolean"></returns>
    var docViewTop = host.offset().top;
    var docViewBottom = docViewTop + host.height();
    var elemTop = subject.offset().top;
    var elemBottom = elemTop + subject.height();
    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
Jspf.ListBox.prototype = {
    
    get_itemContainerGenerator: function Jspf_ListBox$get_itemContainerGenerator() {
        /// <value type="Jspf.IItemContainerGenerator"></value>
        return this._itemContainerGenerator$1;
    },
    set_itemContainerGenerator: function Jspf_ListBox$set_itemContainerGenerator(value) {
        /// <value type="Jspf.IItemContainerGenerator"></value>
        this._itemContainerGenerator$1 = value;
        return value;
    },
    
    _itemContainerGenerator$1: null,
    
    get_fixedItemHeight: function Jspf_ListBox$get_fixedItemHeight() {
        /// <value type="Number" integer="true"></value>
        return this._fixedItemHeight$1;
    },
    set_fixedItemHeight: function Jspf_ListBox$set_fixedItemHeight(value) {
        /// <value type="Number" integer="true"></value>
        this._fixedItemHeight$1 = value;
        return value;
    },
    
    _fixedItemHeight$1: 14,
    
    get_itemTemplate: function Jspf_ListBox$get_itemTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemTemplate$1;
    },
    set_itemTemplate: function Jspf_ListBox$set_itemTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemTemplate$1 = value || Jspf.ListBox._defaultTemplate$1;
        return value;
    },
    
    get_itemContainerTemplate: function Jspf_ListBox$get_itemContainerTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemContainerTemplate$1;
    },
    set_itemContainerTemplate: function Jspf_ListBox$set_itemContainerTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemContainerTemplate$1 = value || Jspf.ListBox._defaultTemplate$1;
        return value;
    },
    
    _stackPanel$1: null,
    
    _getAvailableItemCount$1: function Jspf_ListBox$_getAvailableItemCount$1() {
        /// <returns type="Number" integer="true"></returns>
        return (this._itemContainerGenerator$1 != null) ? this._itemContainerGenerator$1.count() : 0;
    },
    
    measure: function Jspf_ListBox$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
        if (this._stackPanel$1 == null) {
            this._stackPanel$1 = new Jspf.VirtualStackPanel();
            this._stackPanel$1._setParent(this);
            this._stackPanel$1.set_horizontal(this.get_horizontal());
            this._stackPanel$1.set_vertical(this.get_vertical());
            this._stackPanel$1.set_fixedItemHeight(this.get_fixedItemHeight());
            this._stackPanel$1.set_itemContainerGenerator(this.get_itemContainerGenerator());
        }
        this._stackPanel$1.measure(size);
        this.measuredSize = this._stackPanel$1.measuredSize;
    },
    
    arrange: function Jspf_ListBox$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.ListBox.callBaseMethod(this, 'arrange', [ horizontal, vertical, hostElement ]);
        if (this._stackPanel$1 != null) {
            this._stackPanel$1.arrange(horizontal, vertical, hostElement);
        }
    },
    
    _selectionFocus$1: 0,
    _selectionBase$1: 0,
    
    _setSelectionFocus$1: function Jspf_ListBox$_setSelectionFocus$1(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        this._selectionFocus$1 = index;
    },
    
    get_source: function Jspf_ListBox$get_source() {
        /// <value type="Array"></value>
        return this._source$1;
    },
    set_source: function Jspf_ListBox$set_source(value) {
        /// <value type="Array"></value>
        this._source$1 = value || [];
        return value;
    },
    
    get_selected: function Jspf_ListBox$get_selected() {
        /// <value type="Array"></value>
        return this._selected$1;
    },
    set_selected: function Jspf_ListBox$set_selected(value) {
        /// <value type="Array"></value>
        this._selected$1 = value || [];
        return value;
    },
    
    get_focus: function Jspf_ListBox$get_focus() {
        /// <value type="Object"></value>
        return this._focus$1;
    },
    set_focus: function Jspf_ListBox$set_focus(value) {
        /// <value type="Object"></value>
        return value;
    },
    
    _focus$1: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Decorator

Jspf.Decorator = function Jspf_Decorator() {
    /// <field name="_child$1" type="Jspf.Control">
    /// </field>
    Jspf.Decorator.initializeBase(this);
}
Jspf.Decorator.prototype = {
    
    get_child: function Jspf_Decorator$get_child() {
        /// <value type="Jspf.Control"></value>
        return this._child$1;
    },
    set_child: function Jspf_Decorator$set_child(value) {
        /// <value type="Jspf.Control"></value>
        if (this._child$1 != null) {
            this._child$1._setParent(null);
        }
        this._child$1 = value;
        if (this._child$1 != null) {
            this._child$1._setParent(this);
        }
        return value;
    },
    
    _child$1: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.DomControl

Jspf.DomControl = function Jspf_DomControl() {
    /// <field name="_isReal$1" type="Boolean">
    /// </field>
    /// <field name="_domContent$1" type="jQueryObject">
    /// </field>
    Jspf.DomControl.initializeBase(this);
}
Jspf.DomControl.prototype = {
    _isReal$1: false,
    
    get_domContent: function Jspf_DomControl$get_domContent() {
        /// <value type="Object" domElement="true"></value>
        return (this._domContent$1 != null) ? this._domContent$1[0] : null;
    },
    set_domContent: function Jspf_DomControl$set_domContent(value) {
        /// <value type="Object" domElement="true"></value>
        if (this._domContent$1 != null) {
            this._domContent$1.remove();
            this._domContent$1 = null;
        }
        this._isReal$1 = false;
        if (value != null) {
            this._domContent$1 = $(value);
        }
        return value;
    },
    
    _domContent$1: null,
    
    _setParent: function Jspf_DomControl$_setParent(parent) {
        /// <param name="parent" type="Jspf.Control">
        /// </param>
        Jspf.DomControl.callBaseMethod(this, '_setParent', [ parent ]);
        if ((parent == null) && (this._domContent$1 != null)) {
            this._domContent$1.remove();
            this._isReal$1 = false;
        }
    },
    
    arrange: function Jspf_DomControl$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.DomControl.callBaseMethod(this, 'arrange', [ horizontal, vertical, hostElement ]);
        if (this._domContent$1 != null) {
            if (!this._isReal$1) {
                this._domContent$1.appendTo(hostElement);
            }
            this._domContent$1.css('position', 'absolute').css('left', horizontal.position + 'px').css('top', vertical.position + 'px').css('width', horizontal.length + 'px').css('height', vertical.length + 'px');
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Rect

Jspf.Rect = function Jspf_Rect() {
    /// <field name="top" type="Number" integer="true">
    /// </field>
    /// <field name="left" type="Number" integer="true">
    /// </field>
    /// <field name="width" type="Number" integer="true">
    /// </field>
    /// <field name="height" type="Number" integer="true">
    /// </field>
}
Jspf.Rect.prototype = {
    top: 0,
    left: 0,
    width: 0,
    height: 0
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Region

Jspf.Region = function Jspf_Region() {
    /// <field name="host" type="Object" domElement="true">
    /// </field>
    Jspf.Region.initializeBase(this);
}
Jspf.Region.getRegion = function Jspf_Region$getRegion(descendant) {
    /// <param name="descendant" type="Jspf.Control">
    /// </param>
    /// <returns type="Jspf.Region"></returns>
    while (descendant != null && !(Type.canCast(descendant, Jspf.Region))) {
        descendant = descendant.getParent();
    }
    return descendant;
}
Jspf.Region.prototype = {
    host: null,
    
    layOut: function Jspf_Region$layOut() {
        var c;
        if (this.host == null || this.host.tagName !== 'DIV') {
            throw new Error('Host must be a div element');
        }
        var div = $(this.host);
        div.css('padding', '0px');
        var width = div.innerWidth();
        var height = div.innerHeight();
        if (width === 0 && height === 0) {
            width = parseInt(div.css('width'));
            height = parseInt(div.css('height'));
        }
        c = new Jspf.Size(width, height);
        if (this.get_child() != null) {
            this.get_child().measure(c);
            var xaxis = this.arrangeAxis(this.get_child().get_horizontal(), this.get_child().measuredSize.width, c.width);
            var yaxis = this.arrangeAxis(this.get_child().get_vertical(), this.get_child().measuredSize.height, c.height);
            this.get_child().arrange(xaxis, yaxis, this.host);
        }
    },
    
    measure: function Jspf_Region$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
        this.measuredSize = size.clone();
    },
    
    arrange: function Jspf_Region$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Size

Jspf.Size = function Jspf_Size(width, height) {
    /// <param name="width" type="Number" integer="true">
    /// </param>
    /// <param name="height" type="Number" integer="true">
    /// </param>
    /// <field name="width" type="Number" integer="true">
    /// </field>
    /// <field name="height" type="Number" integer="true">
    /// </field>
    this.width = width;
    this.height = height;
}
Jspf.Size.prototype = {
    width: 0,
    height: 0,
    
    clone: function Jspf_Size$clone() {
        /// <returns type="Jspf.Size"></returns>
        return new Jspf.Size(this.width, this.height);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Control

Jspf.Control = function Jspf_Control() {
    /// <field name="_horizontal" type="Jspf.Axis">
    /// </field>
    /// <field name="_vertical" type="Jspf.Axis">
    /// </field>
    /// <field name="measuredSize" type="Jspf.Size">
    /// </field>
    /// <field name="verticalArrangement" type="Jspf.AxisArrangement">
    /// </field>
    /// <field name="horizontalArrangement" type="Jspf.AxisArrangement">
    /// </field>
    /// <field name="_parent" type="Jspf.Control">
    /// </field>
    this._horizontal = new Jspf.Axis();
    this._vertical = new Jspf.Axis();
}
Jspf.Control.prototype = {
    
    get_horizontal: function Jspf_Control$get_horizontal() {
        /// <value type="Jspf.Axis"></value>
        return this._horizontal;
    },
    set_horizontal: function Jspf_Control$set_horizontal(value) {
        /// <value type="Jspf.Axis"></value>
        this._horizontal = value || new Jspf.Axis();
        return value;
    },
    
    get_vertical: function Jspf_Control$get_vertical() {
        /// <value type="Jspf.Axis"></value>
        return this._vertical;
    },
    set_vertical: function Jspf_Control$set_vertical(value) {
        /// <value type="Jspf.Axis"></value>
        this._vertical = value || new Jspf.Axis();
        return value;
    },
    
    measuredSize: null,
    verticalArrangement: null,
    horizontalArrangement: null,
    
    getParent: function Jspf_Control$getParent() {
        /// <returns type="Jspf.Control"></returns>
        return this._parent;
    },
    
    _setParent: function Jspf_Control$_setParent(parent) {
        /// <param name="parent" type="Jspf.Control">
        /// </param>
        this._parent = parent;
    },
    
    _parent: null,
    
    measure: function Jspf_Control$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
        var width = this.get_horizontal().effectiveLength();
        var height = this.get_vertical().effectiveLength();
        this.measuredSize = new Jspf.Size(width, height);
    },
    
    arrange: function Jspf_Control$arrange(horizontal, vertical, hostElement) {
        /// <param name="horizontal" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="vertical" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        this.verticalArrangement = vertical.clone();
        this.horizontalArrangement = horizontal.clone();
    },
    
    arrangeAxis: function Jspf_Control$arrangeAxis(axis, measured, available) {
        /// <param name="axis" type="Jspf.Axis">
        /// </param>
        /// <param name="measured" type="Number" integer="true">
        /// </param>
        /// <param name="available" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.AxisArrangement"></returns>
        var length = 0;
        var pos = 0;
        var totalNeeded = 0;
        if (axis.alignment === Jspf.AxisAlignment.stretch) {
            length = Math.min(available, axis.effectiveMaxLength());
        }
        else {
            length = Math.min(available, measured);
        }
        length = Math.max(axis.effectiveMinLength(), length - axis.nearMargin - axis.farMargin);
        switch (axis.alignment) {
            case Jspf.AxisAlignment.near:
                pos = axis.nearMargin;
                break;
            case Jspf.AxisAlignment.far:
                pos = available - axis.farMargin - length;
                break;
            case Jspf.AxisAlignment.center:
            case Jspf.AxisAlignment.stretch:
                totalNeeded = axis.farMargin + axis.nearMargin + length;
                if (totalNeeded !== available) {
                    pos = Math.floor((available - totalNeeded) / 2);
                }
                break;
            default:
                throw new Error('Unknown axis alignment specified');
        }
        return new Jspf.AxisArrangement(pos, length);
    }
}


Jspf.Axis.registerClass('Jspf.Axis');
Jspf.AxisArrangement.registerClass('Jspf.AxisArrangement');
Constants.registerClass('Constants');
Jspf.Control.registerClass('Jspf.Control');
Jspf.Container.registerClass('Jspf.Container', Jspf.Control);
Jspf.ScrollBar.registerClass('Jspf.ScrollBar', Jspf.Control);
Jspf._generation.registerClass('Jspf._generation');
Jspf.OldListItemContainerGenerator.registerClass('Jspf.OldListItemContainerGenerator', null, Jspf.IItemContainerGenerator);
Jspf.ValueSubject.registerClass('Jspf.ValueSubject');
Jspf.VirtualStackPanel.registerClass('Jspf.VirtualStackPanel', Jspf.Control, Jspf.IScrollableAxis);
Jspf._listItem.registerClass('Jspf._listItem', null, Jspf.IListItem);
Jspf.ListBox.registerClass('Jspf.ListBox', Jspf.Control);
Jspf.Decorator.registerClass('Jspf.Decorator', Jspf.Control);
Jspf.DomControl.registerClass('Jspf.DomControl', Jspf.Control);
Jspf.Rect.registerClass('Jspf.Rect');
Jspf.Region.registerClass('Jspf.Region', Jspf.Decorator);
Jspf.Size.registerClass('Jspf.Size');
Constants.maX_INT = Math.pow(2, 31) - 1;

}
ss.loader.registerScript('Jspf', [], executeScript);
})();

//! This script was generated using Script# v0.6.3.0
