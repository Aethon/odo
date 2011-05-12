//! Jspf.debug.js
//

(function() {
function executeScript() {

Type.registerNamespace('Jspf');

////////////////////////////////////////////////////////////////////////////////
// Jspf.INotifyPropertyChanged

Jspf.INotifyPropertyChanged = function() { 
};
Jspf.INotifyPropertyChanged.prototype = {
    add_propertyChanged : null,
    remove_propertyChanged : null
}
Jspf.INotifyPropertyChanged.registerInterface('Jspf.INotifyPropertyChanged');


////////////////////////////////////////////////////////////////////////////////
// Jspf.ISortedSet

Jspf.ISortedSet = function() { 
};
Jspf.ISortedSet.prototype = {
    get_count : null,
    get_compare : null,
    indexOf : null,
    getItem : null,
    getItems : null,
    getAllItems : null
}
Jspf.ISortedSet.registerInterface('Jspf.ISortedSet');


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
// Jspf.Control

Jspf.Control = function Jspf_Control() {
    /// <field name="_template$1" type="Jspf.ControlTemplate">
    /// </field>
    /// <field name="_visualTree$1" type="Jspf.UiElement">
    /// </field>
    Jspf.Control.initializeBase(this);
}
Jspf.Control._defaultControlTemplate$1 = function Jspf_Control$_defaultControlTemplate$1(control) {
    /// <param name="control" type="Jspf.Control">
    /// </param>
    /// <returns type="Jspf.UiElement"></returns>
    var result = new Jspf.DomUiElement();
    result.set_domContent($('<div style=\'background: red;></div>').get(0));
    return result;
}
Jspf.Control.prototype = {
    
    get_template: function Jspf_Control$get_template() {
        /// <value type="Jspf.ControlTemplate"></value>
        return this._template$1;
    },
    set_template: function Jspf_Control$set_template(value) {
        /// <value type="Jspf.ControlTemplate"></value>
        this._template$1 = value;
        return value;
    },
    
    _template$1: null,
    
    get_visualTree: function Jspf_Control$get_visualTree() {
        /// <value type="Jspf.UiElement"></value>
        return this._visualTree$1;
    },
    
    _visualTree$1: null,
    
    getTemplateElement: function Jspf_Control$getTemplateElement(elementName) {
        /// <param name="elementName" type="String">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        return null;
    },
    
    applyTemplate: function Jspf_Control$applyTemplate() {
        this.releaseVisualTree();
        var template = this.get_template() || Jspf.Control._defaultControlTemplate$1;
        this._visualTree$1 = template.invoke(this);
    },
    
    releaseVisualTree: function Jspf_Control$releaseVisualTree() {
        this._visualTree$1 = null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ItemsControl

Jspf.ItemsControl = function Jspf_ItemsControl() {
    /// <field name="_source$2" type="Jspf.ISortedSet">
    /// </field>
    /// <field name="_itemTemplate$2" type="Jspf.Template">
    /// </field>
    /// <field name="_itemContainerTemplate$2" type="Jspf.ControlTemplate">
    /// </field>
    /// <field name="_itemContainerGenerator" type="Jspf.IItemContainerGenerator">
    /// </field>
    /// <field name="_itemsPanel$2" type="Jspf.VirtualStackPanel">
    /// </field>
    this._source$2 = Jspf.SortedSet.empty;
    Jspf.ItemsControl.initializeBase(this);
}
Jspf.ItemsControl._defaultItemTemplate$2 = function Jspf_ItemsControl$_defaultItemTemplate$2(data) {
    /// <param name="data" type="Object">
    /// </param>
    /// <returns type="Jspf.UiElement"></returns>
    var result = new Jspf.DomUiElement();
    result.set_domContent($('<div style=\'height: 12px\'>' + data + '</div>')[0]);
    return result;
}
Jspf.ItemsControl.prototype = {
    
    get_source: function Jspf_ItemsControl$get_source() {
        /// <value type="Jspf.ISortedSet"></value>
        return this._source$2;
    },
    set_source: function Jspf_ItemsControl$set_source(value) {
        /// <value type="Jspf.ISortedSet"></value>
        if (value !== this._source$2) {
            this._source$2 = value || Jspf.SortedSet.empty;
            this.invalidateMeasure();
            this.onPropertyChanged('Source');
        }
        return value;
    },
    
    get_itemTemplate: function Jspf_ItemsControl$get_itemTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemTemplate$2;
    },
    set_itemTemplate: function Jspf_ItemsControl$set_itemTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemTemplate$2 = value;
        this.invalidateMeasure();
        this.onPropertyChanged('ItemTemplate');
        return value;
    },
    
    _itemTemplate$2: null,
    
    get_itemContainerTemplate: function Jspf_ItemsControl$get_itemContainerTemplate() {
        /// <value type="Jspf.ControlTemplate"></value>
        return this._itemContainerTemplate$2;
    },
    set_itemContainerTemplate: function Jspf_ItemsControl$set_itemContainerTemplate(value) {
        /// <value type="Jspf.ControlTemplate"></value>
        this._itemContainerTemplate$2 = value;
        this.invalidateMeasure();
        this.onPropertyChanged('ItemContainerTemplate');
        this._itemContainerTemplate$2 = value;
        return value;
    },
    
    _itemContainerTemplate$2: null,
    
    get_itemContainerGenerator: function Jspf_ItemsControl$get_itemContainerGenerator() {
        /// <value type="Jspf.IItemContainerGenerator"></value>
        return this._itemContainerGenerator;
    },
    
    _itemContainerGenerator: null,
    
    get_itemsPanel: function Jspf_ItemsControl$get_itemsPanel() {
        /// <value type="Jspf.VirtualStackPanel"></value>
        return this._itemsPanel$2;
    },
    set_itemsPanel: function Jspf_ItemsControl$set_itemsPanel(value) {
        /// <value type="Jspf.VirtualStackPanel"></value>
        this._itemsPanel$2 = value;
        return value;
    },
    
    _itemsPanel$2: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ItemsSelectorControl

Jspf.ItemsSelectorControl = function Jspf_ItemsSelectorControl() {
    /// <field name="selection" type="Jspf.ISortedSet">
    /// </field>
    /// <field name="_selectionBase$3" type="Object">
    /// </field>
    /// <field name="_selectionFocus$3" type="Object">
    /// </field>
    Jspf.ItemsSelectorControl.initializeBase(this);
}
Jspf.ItemsSelectorControl.prototype = {
    selection: null,
    _selectionBase$3: null,
    _selectionFocus$3: null,
    
    selectAll: function Jspf_ItemsSelectorControl$selectAll() {
        this.selection = new Jspf.SortedSet(this.get_source().get_compare(), this.get_source().getAllItems(), true);
    },
    
    select: function Jspf_ItemsSelectorControl$select(item, ctrlKey, shiftKey) {
        /// <param name="item" type="Object">
        /// </param>
        /// <param name="ctrlKey" type="Boolean">
        /// </param>
        /// <param name="shiftKey" type="Boolean">
        /// </param>
        if ((!(shiftKey || ctrlKey)) || (shiftKey && this._selectionBase$3 == null)) {
            this.selection = new Jspf.SortedSet(this.get_source().get_compare(), [item], true);
            this._selectionBase$3 = item;
            this._selectionFocus$3 = item;
        }
        else if (shiftKey) {
            var first = this.get_source().indexOf(this._selectionBase$3);
            var last = this.get_source().indexOf(item);
            if (first > last) {
                var x = first;
                first = last;
                last = x;
            }
            this.selection = new Jspf.SortedSet(this.get_source().get_compare(), this.get_source().getItems(first, last - first + 1), true);
            this._selectionFocus$3 = item;
        }
        else {
            var newSel = this.selection.getAllItems();
            var ins = Jspf.Util.binarySearchForInsert(newSel, item, this.selection.get_compare());
            (newSel).insert(ins, item);
            this.selection = new Jspf.SortedSet(this.selection.get_compare(), newSel, true);
            this._selectionBase$3 = item;
            this._selectionFocus$3 = item;
        }
    },
    
    move: function Jspf_ItemsSelectorControl$move(distance, ctrlKey, shiftKey) {
        /// <param name="distance" type="Number" integer="true">
        /// </param>
        /// <param name="ctrlKey" type="Boolean">
        /// </param>
        /// <param name="shiftKey" type="Boolean">
        /// </param>
        var from;
        if (ctrlKey) {
            from = this.get_itemsPanel().getViewportPos();
        }
        else if (this._selectionFocus$3 == null) {
            from = 0;
        }
        else {
            from = this.get_source().indexOf(this._selectionFocus$3);
        }
        var to = Math.min(Math.max(0, from + distance), this.get_source().get_count() - 1);
        if (to >= 0) {
            if (!ctrlKey) {
                this.select(this.get_source().getItem(to), false, shiftKey);
                this.get_itemsPanel().scrollIntoViewport(to);
            }
            else {
                this.get_itemsPanel().moveToPos(to);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.TableItem

Jspf.TableItem = function Jspf_TableItem(item, index) {
    /// <param name="item" type="Object">
    /// </param>
    /// <param name="index" type="Number" integer="true">
    /// </param>
    /// <field name="item" type="Object">
    /// </field>
    /// <field name="index" type="Number" integer="true">
    /// </field>
    /// <field name="isSelected" type="Boolean">
    /// </field>
    this.item = item;
    this.index = index;
}
Jspf.TableItem.prototype = {
    item: null,
    index: 0,
    isSelected: false
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.TableItemContainerGenerator

Jspf.TableItemContainerGenerator = function Jspf_TableItemContainerGenerator() {
    /// <field name="_generations" type="Array">
    /// </field>
    /// <field name="_allItems" type="Jspf.ISortedSet">
    /// </field>
    /// <field name="_itemTemplate" type="Jspf.Template">
    /// </field>
    /// <field name="__changed" type="Action">
    /// </field>
    this._generations = [];
}
Jspf.TableItemContainerGenerator.prototype = {
    
    get_allItems: function Jspf_TableItemContainerGenerator$get_allItems() {
        /// <value type="Jspf.ISortedSet"></value>
        return this._allItems;
    },
    set_allItems: function Jspf_TableItemContainerGenerator$set_allItems(value) {
        /// <value type="Jspf.ISortedSet"></value>
        this._allItems = value;
        if (this.__changed != null) {
            this.__changed.invoke();
        }
        return value;
    },
    
    _allItems: null,
    
    count: function Jspf_TableItemContainerGenerator$count() {
        /// <returns type="Number" integer="true"></returns>
        return (this._allItems == null) ? 0 : this._allItems.get_count();
    },
    
    get_itemTemplate: function Jspf_TableItemContainerGenerator$get_itemTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemTemplate;
    },
    set_itemTemplate: function Jspf_TableItemContainerGenerator$set_itemTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemTemplate = value;
        return value;
    },
    
    _itemTemplate: null,
    
    generateContainer: function Jspf_TableItemContainerGenerator$generateContainer(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        var result = this.getContainerForIndex(index);
        if (result == null) {
            var item = this._allItems.getItem(index);
            result = this._itemTemplate.invoke(new Jspf.TableItem(item, index));
            this._generations.add(new Jspf._generation(item, result));
        }
        return result;
    },
    
    getContainerForIndex: function Jspf_TableItemContainerGenerator$getContainerForIndex(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        var item = this._allItems.getItem(index);
        return this.getContainerForItem(item);
    },
    
    getContainerForItem: function Jspf_TableItemContainerGenerator$getContainerForItem(item) {
        /// <param name="item" type="Object">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            var g = this._generations[i];
            if (g.item === item) {
                return g.container;
            }
        }
        return null;
    },
    
    getItemForContainer: function Jspf_TableItemContainerGenerator$getItemForContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
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
    
    getIndexForContainer: function Jspf_TableItemContainerGenerator$getIndexForContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        var item = this.getItemForContainer(container);
        if (item == null) {
            return -1;
        }
        return this._allItems.indexOf(item);
    },
    
    releaseContainer: function Jspf_TableItemContainerGenerator$releaseContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
        /// </param>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            if ((this._generations[i]).container === container) {
                this._generations.removeAt(i);
                break;
            }
        }
    },
    
    add_changed: function Jspf_TableItemContainerGenerator$add_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.combine(this.__changed, value);
    },
    remove_changed: function Jspf_TableItemContainerGenerator$remove_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.remove(this.__changed, value);
    },
    
    __changed: null,
    
    getActiveItems: function Jspf_TableItemContainerGenerator$getActiveItems() {
        /// <returns type="Array"></returns>
        return $.map(this._generations, ss.Delegate.create(this, function(element, index) {
            return (element).item;
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.SortedSetItemContainerGenerator

Jspf.SortedSetItemContainerGenerator = function Jspf_SortedSetItemContainerGenerator() {
    /// <field name="_generations" type="Array">
    /// </field>
    /// <field name="_allItems" type="Jspf.ISortedSet">
    /// </field>
    /// <field name="_itemTemplate" type="Jspf.Template">
    /// </field>
    /// <field name="__changed" type="Action">
    /// </field>
    this._generations = [];
}
Jspf.SortedSetItemContainerGenerator.prototype = {
    
    get_allItems: function Jspf_SortedSetItemContainerGenerator$get_allItems() {
        /// <value type="Jspf.ISortedSet"></value>
        return this._allItems;
    },
    set_allItems: function Jspf_SortedSetItemContainerGenerator$set_allItems(value) {
        /// <value type="Jspf.ISortedSet"></value>
        this._allItems = value;
        if (this.__changed != null) {
            this.__changed.invoke();
        }
        return value;
    },
    
    _allItems: null,
    
    count: function Jspf_SortedSetItemContainerGenerator$count() {
        /// <returns type="Number" integer="true"></returns>
        return (this._allItems == null) ? 0 : this._allItems.get_count();
    },
    
    get_itemTemplate: function Jspf_SortedSetItemContainerGenerator$get_itemTemplate() {
        /// <value type="Jspf.Template"></value>
        return this._itemTemplate;
    },
    set_itemTemplate: function Jspf_SortedSetItemContainerGenerator$set_itemTemplate(value) {
        /// <value type="Jspf.Template"></value>
        this._itemTemplate = value;
        return value;
    },
    
    _itemTemplate: null,
    
    generateContainer: function Jspf_SortedSetItemContainerGenerator$generateContainer(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        var result = this.getContainerForIndex(index);
        if (result == null) {
            var item = this._allItems.getItem(index);
            result = this._itemTemplate.invoke(item);
            this._generations.add(new Jspf._generation(item, result));
        }
        return result;
    },
    
    getContainerForIndex: function Jspf_SortedSetItemContainerGenerator$getContainerForIndex(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        var item = this._allItems.getItem(index);
        return this.getContainerForItem(item);
    },
    
    getContainerForItem: function Jspf_SortedSetItemContainerGenerator$getContainerForItem(item) {
        /// <param name="item" type="Object">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            var g = this._generations[i];
            if (g.item === item) {
                return g.container;
            }
        }
        return null;
    },
    
    getItemForContainer: function Jspf_SortedSetItemContainerGenerator$getItemForContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
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
    
    getIndexForContainer: function Jspf_SortedSetItemContainerGenerator$getIndexForContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        var item = this.getItemForContainer(container);
        if (item == null) {
            return -1;
        }
        return this._allItems.indexOf(item);
    },
    
    releaseContainer: function Jspf_SortedSetItemContainerGenerator$releaseContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
        /// </param>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            if ((this._generations[i]).container === container) {
                this._generations.removeAt(i);
                break;
            }
        }
    },
    
    add_changed: function Jspf_SortedSetItemContainerGenerator$add_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.combine(this.__changed, value);
    },
    remove_changed: function Jspf_SortedSetItemContainerGenerator$remove_changed(value) {
        /// <param name="value" type="Function" />
        this.__changed = ss.Delegate.remove(this.__changed, value);
    },
    
    __changed: null,
    
    getActiveItems: function Jspf_SortedSetItemContainerGenerator$getActiveItems() {
        /// <returns type="Array"></returns>
        return $.map(this._generations, ss.Delegate.create(this, function(element, index) {
            return (element).item;
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ColumnTemplate

Jspf.ColumnTemplate = function Jspf_ColumnTemplate() {
    /// <field name="cellTemplate" type="Jspf.Template">
    /// </field>
    /// <field name="headerTemplate" type="Jspf.Template">
    /// </field>
    /// <field name="width" type="Number" integer="true">
    /// </field>
}
Jspf.ColumnTemplate.prototype = {
    cellTemplate: null,
    headerTemplate: null,
    width: 0
}


////////////////////////////////////////////////////////////////////////////////
// Constants

Constants = function Constants() {
    /// <field name="maX_INT" type="Number" integer="true" static="true">
    /// </field>
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.ScrollBar

Jspf.ScrollBar = function Jspf_ScrollBar() {
    /// <field name="_scrollableAxis$2" type="Jspf.IScrollableAxis">
    /// </field>
    /// <field name="_inputSource$2" type="jQueryObject">
    /// </field>
    /// <field name="_delayMilliseconds$2" type="Number" integer="true">
    /// </field>
    /// <field name="_repeatMilliseconds$2" type="Number" integer="true">
    /// </field>
    /// <field name="_scrubbing$2" type="Boolean">
    /// </field>
    /// <field name="_auto$2" type="Boolean">
    /// </field>
    /// <field name="_dom$2" type="jQueryObject">
    /// </field>
    /// <field name="_near$2" type="jQueryObject">
    /// </field>
    /// <field name="_far$2" type="jQueryObject">
    /// </field>
    /// <field name="_track$2" type="jQueryObject">
    /// </field>
    /// <field name="_thumb$2" type="jQueryObject">
    /// </field>
    /// <field name="_minThumbLength$2" type="Number" integer="true">
    /// </field>
    /// <field name="_scrollTimer$2" type="Number" integer="true">
    /// </field>
    /// <field name="_grabPoint$2" type="Number" integer="true">
    /// </field>
    /// <field name="_disabled$2" type="Boolean">
    /// </field>
    /// <field name="_dragHandler$2" type="jQueryEventHandler">
    /// </field>
    /// <field name="_stopScrollHandler$2" type="jQueryEventHandler">
    /// </field>
    Jspf.ScrollBar.initializeBase(this);
    this._stopScrollHandler$2 = ss.Delegate.create(this, this._stopScroll$2);
    this._dragHandler$2 = ss.Delegate.create(this, this._drag$2);
}
Jspf.ScrollBar.prototype = {
    
    get_scrollableAxis: function Jspf_ScrollBar$get_scrollableAxis() {
        /// <value type="Jspf.IScrollableAxis"></value>
        return this._scrollableAxis$2;
    },
    set_scrollableAxis: function Jspf_ScrollBar$set_scrollableAxis(value) {
        /// <value type="Jspf.IScrollableAxis"></value>
        this._scrollableAxis$2 = value;
        this._scrollableAxis$2.add_changed(ss.Delegate.create(this, this._scrollableAxisChanged$2));
        return value;
    },
    
    _scrollableAxis$2: null,
    
    get_inputSource: function Jspf_ScrollBar$get_inputSource() {
        /// <value type="Object" domElement="true"></value>
        return this._inputSource$2[0];
    },
    set_inputSource: function Jspf_ScrollBar$set_inputSource(value) {
        /// <value type="Object" domElement="true"></value>
        this._inputSource$2 = $(value);
        this._inputSource$2.bind('mousewheel', ss.Delegate.create(this, this._wheel$2));
        return value;
    },
    
    _inputSource$2: null,
    _delayMilliseconds$2: 400,
    _repeatMilliseconds$2: 40,
    _scrubbing$2: false,
    _auto$2: false,
    _dom$2: null,
    _near$2: null,
    _far$2: null,
    _track$2: null,
    _thumb$2: null,
    _minThumbLength$2: 10,
    _scrollTimer$2: 0,
    _grabPoint$2: 0,
    _disabled$2: false,
    
    show: function Jspf_ScrollBar$show(show) {
        /// <param name="show" type="Boolean">
        /// </param>
        if (this._dom$2 != null) {
            if (show) {
                this._dom$2.css('visibility', 'visible');
            }
            else {
                this._dom$2.css('visibility', 'hidden');
            }
        }
    },
    
    arrange: function Jspf_ScrollBar$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.ScrollBar.callBaseMethod(this, 'arrange', [ x, y, hostElement ]);
        if (this._dom$2 == null) {
            this._dom$2 = $('<div class=\'ui-vertical-scrollbar\' style=\'position: absolute;\'></div>').appendTo(hostElement);
            this._near$2 = $('<div class=\'ui-scroll-up-button\'></div>').appendTo(this._dom$2).mousedown(ss.Delegate.create(this, this._lineNear$2));
            this._track$2 = $('<div class=\'ui-scroll-vertical-track\'></div>').appendTo(this._dom$2).mousedown(ss.Delegate.create(this, this._page$2));
            this._thumb$2 = $('<div class=\'ui-scroll-vertical-thumb\' style=\'position: relative\'></div>').appendTo(this._track$2).mousedown(ss.Delegate.create(this, this._scrub$2));
            this._far$2 = $('<div class=\'ui-scroll-down-button\'></div>').appendTo(this._dom$2).mousedown(ss.Delegate.create(this, this._lineFar$2));
        }
        var buttonLength = (y.length > 2 * x.length) ? x.length : Math.floor(y.length / 2);
        var trackHeight = y.length - 2 * buttonLength;
        this._minThumbLength$2 = Math.min(buttonLength, trackHeight);
        this._dom$2.css('width', x.length + 'px').css('height', y.length + 'px').css('top', y.position + 'px').css('left', x.position + 'px');
        this._near$2.css('width', x.length + 'px').css('height', buttonLength + 'px');
        this._far$2.css('width', x.length + 'px').css('height', buttonLength + 'px');
        this._track$2.css('width', x.length + 'px').css('height', trackHeight + 'px');
        this._thumb$2.css('width', x.length + 'px');
        this._scrollableAxisChanged$2();
    },
    
    _scrollableAxisChanged$2: function Jspf_ScrollBar$_scrollableAxisChanged$2() {
        if (!this._scrubbing$2) {
            var logicalLength = this._scrollableAxis$2.getExtentLength() - this._scrollableAxis$2.getViewportLength();
            var thumbLength = Math.max(Math.floor(this._track$2.height() / this._scrollableAxis$2.getExtentLength() * this._scrollableAxis$2.getViewportLength()), this._minThumbLength$2);
            var physicalLength = this._track$2.height() - thumbLength;
            var thumbPos = 0;
            if (logicalLength > 0 && physicalLength > 0) {
                var ratio = physicalLength / logicalLength;
                thumbPos = Math.round(this._scrollableAxis$2.getViewportPos() * ratio);
            }
            else {
            }
            this._thumb$2.css('top', thumbPos + 'px').css('height', thumbLength + 'px');
        }
    },
    
    _lineNear$2: function Jspf_ScrollBar$_lineNear$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$2) {
            this._startScroll$2(ss.Delegate.create(this._scrollableAxis$2, this._scrollableAxis$2.moveLineNear));
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _lineFar$2: function Jspf_ScrollBar$_lineFar$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$2) {
            this._startScroll$2(ss.Delegate.create(this._scrollableAxis$2, this._scrollableAxis$2.moveLineFar));
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _page$2: function Jspf_ScrollBar$_page$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$2) {
            var curY = e.pageY;
            var thumbTop = this._thumb$2.offset().top;
            if (curY <= thumbTop) {
                this._startScroll$2(ss.Delegate.create(this._scrollableAxis$2, this._scrollableAxis$2.movePageNear));
            }
            else {
                this._startScroll$2(ss.Delegate.create(this._scrollableAxis$2, this._scrollableAxis$2.movePageFar));
            }
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _scrub$2: function Jspf_ScrollBar$_scrub$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$2) {
            this._scrubbing$2 = true;
            var curY = e.pageY;
            this._grabPoint$2 = curY - this._thumb$2.offset().top;
            $(document).mousemove(this._dragHandler$2);
            $(document).mouseup(this._stopScrollHandler$2);
        }
        e.preventDefault();
        e.stopPropagation();
    },
    
    _dragHandler$2: null,
    
    _drag$2: function Jspf_ScrollBar$_drag$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        if (!this._disabled$2) {
            var thumbPos = (e.pageY - this._grabPoint$2);
            var physicalPos = thumbPos - this._track$2.offset().top;
            var physicalLength = this._track$2.height();
            var logicalLength = this._scrollableAxis$2.getExtentLength();
            this._scrollableAxis$2.moveToPos(physicalPos * logicalLength / physicalLength);
            thumbPos = Math.max(0, Math.min(physicalLength - this._thumb$2.height(), physicalPos));
            this._thumb$2.css('top', thumbPos + 'px');
        }
    },
    
    _wheel$2: function Jspf_ScrollBar$_wheel$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        var ee = e;
        if (ee.wheelDelta >= 120) {
            this._scrollableAxis$2.movePageNear();
        }
        else if (ee.wheelDelta <= -120) {
            this._scrollableAxis$2.movePageFar();
        }
        e.stopPropagation();
        e.preventDefault();
    },
    
    _startScroll$2: function Jspf_ScrollBar$_startScroll$2(action) {
        /// <param name="action" type="Action">
        /// </param>
        action.invoke();
        this._scrollTimer$2 = window.setInterval(ss.Delegate.create(this, function() {
            if (this._scrollTimer$2 > 0) {
                window.clearInterval(this._scrollTimer$2);
                this._scrollTimer$2 = window.setInterval(ss.Delegate.create(this, function() {
                    action.invoke();
                }), this._repeatMilliseconds$2);
                action.invoke();
            }
        }), this._delayMilliseconds$2);
        $(document).mouseup(this._stopScrollHandler$2);
    },
    
    _stopScrollHandler$2: null,
    
    _stopScroll$2: function Jspf_ScrollBar$_stopScroll$2(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        $(document).unbind('mouseup', this._stopScrollHandler$2);
        $(document).unbind('mousemove', this._dragHandler$2);
        if (this._scrubbing$2) {
            this._scrubbing$2 = false;
            this._scrollableAxisChanged$2();
        }
        if (this._scrollTimer$2 > 0) {
            window.clearInterval(this._scrollTimer$2);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.SortedSet

Jspf.SortedSet = function Jspf_SortedSet(compare, items, alreadySorted) {
    /// <param name="compare" type="Jspf.Compare">
    /// </param>
    /// <param name="items" type="Array">
    /// </param>
    /// <param name="alreadySorted" type="Boolean">
    /// </param>
    /// <field name="empty" type="Jspf.SortedSet" static="true">
    /// </field>
    /// <field name="_compare" type="Jspf.Compare">
    /// </field>
    /// <field name="_items" type="Array">
    /// </field>
    if (compare == null) {
        throw new Error('compare must be provided');
    }
    this._compare = compare;
    this._items = items || [];
    if (!alreadySorted) {
        this._items.sort(this._compare);
    }
}
Jspf.SortedSet._emptyCompare = function Jspf_SortedSet$_emptyCompare(left, right) {
    /// <param name="left" type="Object">
    /// </param>
    /// <param name="right" type="Object">
    /// </param>
    /// <returns type="Number" integer="true"></returns>
    return 0;
}
Jspf.SortedSet.prototype = {
    
    get_count: function Jspf_SortedSet$get_count() {
        /// <value type="Number" integer="true"></value>
        return this._items.length;
    },
    
    get_compare: function Jspf_SortedSet$get_compare() {
        /// <value type="Jspf.Compare"></value>
        return this._compare;
    },
    
    _compare: null,
    _items: null,
    
    indexOf: function Jspf_SortedSet$indexOf(item) {
        /// <param name="item" type="Object">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        return Jspf.Util.binarySearch(this._items, item, this._compare);
    },
    
    getItem: function Jspf_SortedSet$getItem(index) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <returns type="Object"></returns>
        return this._items[index];
    },
    
    getItems: function Jspf_SortedSet$getItems(index, count) {
        /// <param name="index" type="Number" integer="true">
        /// </param>
        /// <param name="count" type="Number" integer="true">
        /// </param>
        /// <returns type="Array"></returns>
        var result = [];
        var max = Math.min(index + count, this._items.length);
        for (var i = index; i < max; i++) {
            result[i - index] = this._items[i];
        }
        return result;
    },
    
    getAllItems: function Jspf_SortedSet$getAllItems() {
        /// <returns type="Array"></returns>
        return this._items.clone();
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Table

Jspf.Table = function Jspf_Table() {
    /// <field name="_columnTemplates$4" type="Array" elementType="ColumnTemplate">
    /// </field>
    Jspf.Table.initializeBase(this);
    this._itemContainerGenerator = new Jspf.TableItemContainerGenerator();
}
Jspf.Table.prototype = {
    
    get_columnTemplates: function Jspf_Table$get_columnTemplates() {
        /// <value type="Array" elementType="ColumnTemplate"></value>
        return this._columnTemplates$4;
    },
    set_columnTemplates: function Jspf_Table$set_columnTemplates(value) {
        /// <value type="Array" elementType="ColumnTemplate"></value>
        this._columnTemplates$4 = value;
        return value;
    },
    
    _columnTemplates$4: null,
    
    _refreshFromSelection$4: function Jspf_Table$_refreshFromSelection$4() {
        var active = this.get_itemContainerGenerator().getActiveItems();
        for (var i = active.length - 1; i >= 0; i--) {
            var item = active[i];
            var container = this.get_itemContainerGenerator().getContainerForItem(item);
            if (container != null) {
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf._generation

Jspf._generation = function Jspf__generation(item, container) {
    /// <param name="item" type="Object">
    /// </param>
    /// <param name="container" type="Jspf.UiElement">
    /// </param>
    /// <field name="container" type="Jspf.UiElement">
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
        /// <returns type="Jspf.UiElement"></returns>
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
        /// <returns type="Jspf.UiElement"></returns>
        var item = this._allItems.invoke()[index];
        return this.getContainerForItem(item);
    },
    
    getContainerForItem: function Jspf_OldListItemContainerGenerator$getContainerForItem(item) {
        /// <param name="item" type="Object">
        /// </param>
        /// <returns type="Jspf.UiElement"></returns>
        for (var i = this._generations.length - 1; i >= 0; i--) {
            var g = this._generations[i];
            if (g.item === item) {
                return g.container;
            }
        }
        return null;
    },
    
    getItemForContainer: function Jspf_OldListItemContainerGenerator$getItemForContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
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
        /// <param name="container" type="Jspf.UiElement">
        /// </param>
        /// <returns type="Number" integer="true"></returns>
        var item = this.getItemForContainer(container);
        if (item == null) {
            return -1;
        }
        return (this._allItems.invoke()).binarySearch(item, this._comparer);
    },
    
    releaseContainer: function Jspf_OldListItemContainerGenerator$releaseContainer(container) {
        /// <param name="container" type="Jspf.UiElement">
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
// Jspf.Util

Jspf.Util = function Jspf_Util() {
}
Jspf.Util.binarySearch = function Jspf_Util$binarySearch(items, item, compare) {
    /// <param name="items" type="Array">
    /// </param>
    /// <param name="item" type="Object">
    /// </param>
    /// <param name="compare" type="Jspf.Compare">
    /// </param>
    /// <returns type="Number" integer="true"></returns>
    var low = 0;
    var high = items.length - 1;
    var test;
    var comparison;
    while (low <= high) {
        test = (low + high) >> 1;
        comparison = compare.invoke(items[test], item);
        if (comparison === 0) {
            return test;
        }
        if (comparison < 0) {
            low = test + 1;
        }
        else {
            high = test - 1;
        }
    }
    return -1;
}
Jspf.Util.binarySearchForInsert = function Jspf_Util$binarySearchForInsert(items, item, compare) {
    /// <param name="items" type="Array">
    /// </param>
    /// <param name="item" type="Object">
    /// </param>
    /// <param name="compare" type="Jspf.Compare">
    /// </param>
    /// <returns type="Number" integer="true"></returns>
    var low = 0;
    var high = items.length - 1;
    var test = -1;
    var comparison = 0;
    while (low <= high) {
        test = (low + high) >> 1;
        comparison = compare.invoke(items[test], item);
        if (comparison === 0) {
            return test;
        }
        if (comparison < 0) {
            low = test + 1;
        }
        else {
            high = test - 1;
        }
    }
    return (comparison < 0) ? test + 1 : test;
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
    /// <field name="_firstItemContainer$1" type="Jspf.UiElement">
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
                        item.set_parent(this);
                        item.measure(new Jspf.Size(layoutWidth, this._fixedItemHeight$1));
                        var v = this.arrangeAxis(item.get_yAxis(), item.get_measuredSize().height, this._fixedItemHeight$1);
                        v.position += i * this._fixedItemHeight$1;
                        item.arrange(this.arrangeAxis(item.get_xAxis(), item.get_measuredSize().width, this._content$1.innerWidth()), v, this._content$1[0]);
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
            loser.set_parent(null);
            this._itemContainerGenerator$1.releaseContainer(loser);
        }
    },
    
    arrange: function Jspf_VirtualStackPanel$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.VirtualStackPanel.callBaseMethod(this, 'arrange', [ x, y, hostElement ]);
        var scrollbarWidth = 18;
        if (this._scroller$1 == null) {
            this._scroller$1 = $('<div style=\'overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute\'></div>').appendTo(hostElement);
            this._content$1 = $('<div style=\'overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute\'></div>').appendTo(this._scroller$1);
            this._scrollbar$1 = new Jspf.ScrollBar();
            this._scrollbar$1.set_scrollableAxis(this);
            this._scrollbar$1.set_inputSource(this._scroller$1[0]);
        }
        this._content$1.width(x.length).height(this._getAvailableItemCount$1() * this._fixedItemHeight$1);
        this._scroller$1.width(x.length).height(y.length).css('top', y.position + 'px').css('left', x.position + 'px');
        this._viewportLines$1 = Math.floor(this._scroller$1.innerHeight() / this._fixedItemHeight$1);
        var h = x.clone();
        h.position = h.position + h.length - scrollbarWidth;
        h.length = scrollbarWidth;
        this._scrollbar$1.arrange(h, y, this._scroller$1[0]);
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
    /// <field name="_fixedItemHeight$4" type="Number" integer="true">
    /// </field>
    Jspf.ListBox.initializeBase(this);
}
Jspf.ListBox.prototype = {
    
    get_fixedItemHeight: function Jspf_ListBox$get_fixedItemHeight() {
        /// <value type="Number" integer="true"></value>
        return this._fixedItemHeight$4;
    },
    set_fixedItemHeight: function Jspf_ListBox$set_fixedItemHeight(value) {
        /// <value type="Number" integer="true"></value>
        this._fixedItemHeight$4 = value;
        return value;
    },
    
    _fixedItemHeight$4: 14,
    
    measure: function Jspf_ListBox$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
    },
    
    arrange: function Jspf_ListBox$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.ListBox.callBaseMethod(this, 'arrange', [ x, y, hostElement ]);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.Decorator

Jspf.Decorator = function Jspf_Decorator() {
    /// <field name="_child$1" type="Jspf.UiElement">
    /// </field>
    Jspf.Decorator.initializeBase(this);
}
Jspf.Decorator.prototype = {
    
    get_child: function Jspf_Decorator$get_child() {
        /// <value type="Jspf.UiElement"></value>
        return this._child$1;
    },
    set_child: function Jspf_Decorator$set_child(value) {
        /// <value type="Jspf.UiElement"></value>
        if (this._child$1 != null) {
            this._child$1.set_parent(null);
        }
        this._child$1 = value;
        if (this._child$1 != null) {
            this._child$1.set_parent(this);
        }
        this.invalidateMeasure();
        this.onPropertyChanged('Child');
        return value;
    },
    
    _child$1: null
}


////////////////////////////////////////////////////////////////////////////////
// Jspf.DomUiElement

Jspf.DomUiElement = function Jspf_DomUiElement() {
    /// <field name="_isReal$1" type="Boolean">
    /// </field>
    /// <field name="_domContent$1" type="jQueryObject">
    /// </field>
    Jspf.DomUiElement.initializeBase(this);
}
Jspf.DomUiElement.prototype = {
    _isReal$1: false,
    
    get_domContent: function Jspf_DomUiElement$get_domContent() {
        /// <value type="Object" domElement="true"></value>
        return (ss.isNull(this._domContent$1)) ? null : this._domContent$1[0];
    },
    set_domContent: function Jspf_DomUiElement$set_domContent(value) {
        /// <value type="Object" domElement="true"></value>
        var asJq = null;
        if (!ss.isNull(value)) {
            asJq = $(value);
            if (asJq === this._domContent$1) {
                return;
            }
        }
        if (this._domContent$1 != null) {
            this._domContent$1.remove();
            this._domContent$1 = null;
        }
        this._isReal$1 = false;
        if (asJq != null) {
            this._domContent$1 = asJq;
        }
        this.invalidateMeasure();
        this.onPropertyChanged('DomContent');
        return value;
    },
    
    _domContent$1: null,
    
    get_parent: function Jspf_DomUiElement$get_parent() {
        /// <value type="Jspf.UiElement"></value>
        return Jspf.DomUiElement.callBaseMethod(this, 'get_parent');
    },
    set_parent: function Jspf_DomUiElement$set_parent(value) {
        /// <value type="Jspf.UiElement"></value>
        Jspf.DomUiElement.callBaseMethod(this, 'set_parent', [ value ]);
        if ((value == null) && (this._domContent$1 != null)) {
            this._domContent$1.remove();
            this._isReal$1 = false;
        }
        return value;
    },
    
    arrange: function Jspf_DomUiElement$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        Jspf.DomUiElement.callBaseMethod(this, 'arrange', [ x, y, hostElement ]);
        if (this._domContent$1 != null) {
            if (!this._isReal$1) {
                this._domContent$1.appendTo(hostElement);
            }
            this._domContent$1.css('position', 'absolute').css('left', x.position + 'px').css('top', y.position + 'px').css('width', x.length + 'px').css('height', y.length + 'px');
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
    /// <param name="descendant" type="Jspf.UiElement">
    /// </param>
    /// <returns type="Jspf.Region"></returns>
    while (descendant != null && !(Type.canCast(descendant, Jspf.Region))) {
        descendant = descendant.get_parent();
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
            var xaxis = this.arrangeAxis(this.get_child().get_xAxis(), this.get_child().get_measuredSize().width, c.width);
            var yaxis = this.arrangeAxis(this.get_child().get_yAxis(), this.get_child().get_measuredSize().height, c.height);
            this.get_child().arrange(xaxis, yaxis, this.host);
        }
    },
    
    measure: function Jspf_Region$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
        this.set_measuredSize(size.clone());
    },
    
    arrange: function Jspf_Region$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
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
// Jspf.UiElement

Jspf.UiElement = function Jspf_UiElement() {
    /// <field name="_parent" type="Jspf.UiElement">
    /// </field>
    /// <field name="_visualParent" type="Jspf.UiElement">
    /// </field>
    /// <field name="_templatedParent" type="Jspf.UiElement">
    /// </field>
    /// <field name="_xAxis" type="Jspf.Axis">
    /// </field>
    /// <field name="_yAxis" type="Jspf.Axis">
    /// </field>
    /// <field name="_measuredSize" type="Jspf.Size">
    /// </field>
    /// <field name="_yArrangement" type="Jspf.AxisArrangement">
    /// </field>
    /// <field name="_xArrangement" type="Jspf.AxisArrangement">
    /// </field>
    /// <field name="_isMeasureValid" type="Boolean">
    /// </field>
    /// <field name="_isArrangementValid" type="Boolean">
    /// </field>
    /// <field name="__propertyChanged" type="Jspf.PropertyChangedEventHandler">
    /// </field>
    this._xAxis = new Jspf.Axis();
    this._yAxis = new Jspf.Axis();
    this._measuredSize = new Jspf.Size(0, 0);
    this._yArrangement = new Jspf.AxisArrangement(0, 0);
    this._xArrangement = new Jspf.AxisArrangement(0, 0);
}
Jspf.UiElement.prototype = {
    
    get_parent: function Jspf_UiElement$get_parent() {
        /// <value type="Jspf.UiElement"></value>
        return this._parent;
    },
    set_parent: function Jspf_UiElement$set_parent(value) {
        /// <value type="Jspf.UiElement"></value>
        this._parent = value;
        return value;
    },
    
    _parent: null,
    
    get_visualParent: function Jspf_UiElement$get_visualParent() {
        /// <value type="Jspf.UiElement"></value>
        return this._visualParent;
    },
    set_visualParent: function Jspf_UiElement$set_visualParent(value) {
        /// <value type="Jspf.UiElement"></value>
        this._visualParent = value;
        return value;
    },
    
    _visualParent: null,
    
    get__templatedParent: function Jspf_UiElement$get__templatedParent() {
        /// <value type="Jspf.UiElement"></value>
        return this._templatedParent;
    },
    
    _templatedParent: null,
    
    get_xAxis: function Jspf_UiElement$get_xAxis() {
        /// <value type="Jspf.Axis"></value>
        return this._xAxis;
    },
    set_xAxis: function Jspf_UiElement$set_xAxis(value) {
        /// <value type="Jspf.Axis"></value>
        value = value || new Jspf.Axis();
        if (this._xAxis !== value) {
            this._xAxis = value;
            this.invalidateMeasure();
            this.onPropertyChanged('XAxis');
        }
        return value;
    },
    
    get_yAxis: function Jspf_UiElement$get_yAxis() {
        /// <value type="Jspf.Axis"></value>
        return this._yAxis;
    },
    set_yAxis: function Jspf_UiElement$set_yAxis(value) {
        /// <value type="Jspf.Axis"></value>
        value = value || new Jspf.Axis();
        if (this._yAxis !== value) {
            this._yAxis = value;
            this.invalidateMeasure();
            this.onPropertyChanged('YAxis');
        }
        return value;
    },
    
    get_measuredSize: function Jspf_UiElement$get_measuredSize() {
        /// <value type="Jspf.Size"></value>
        return this._measuredSize;
    },
    set_measuredSize: function Jspf_UiElement$set_measuredSize(value) {
        /// <value type="Jspf.Size"></value>
        value = value || new Jspf.Size(0, 0);
        if (this._measuredSize !== value) {
            this._measuredSize = value;
            this.onPropertyChanged('MeasuredSize');
        }
        return value;
    },
    
    get_yArrangement: function Jspf_UiElement$get_yArrangement() {
        /// <value type="Jspf.AxisArrangement"></value>
        return this._yArrangement;
    },
    set_yArrangement: function Jspf_UiElement$set_yArrangement(value) {
        /// <value type="Jspf.AxisArrangement"></value>
        value = value || new Jspf.AxisArrangement(0, 0);
        if (this._yArrangement !== value) {
            this._yArrangement = value;
            this.onPropertyChanged('YArrangement');
        }
        return value;
    },
    
    get_xArrangement: function Jspf_UiElement$get_xArrangement() {
        /// <value type="Jspf.AxisArrangement"></value>
        return this._xArrangement;
    },
    set_xArrangement: function Jspf_UiElement$set_xArrangement(value) {
        /// <value type="Jspf.AxisArrangement"></value>
        value = value || new Jspf.AxisArrangement(0, 0);
        if (this._xArrangement !== value) {
            this._xArrangement = value;
            this.onPropertyChanged('XArrangement');
        }
        return value;
    },
    
    get_isMeasureValid: function Jspf_UiElement$get_isMeasureValid() {
        /// <value type="Boolean"></value>
        return this._isMeasureValid;
    },
    
    _isMeasureValid: false,
    
    invalidateMeasure: function Jspf_UiElement$invalidateMeasure() {
        if (!this._isMeasureValid) {
        }
        this._isMeasureValid = false;
    },
    
    measure: function Jspf_UiElement$measure(size) {
        /// <param name="size" type="Jspf.Size">
        /// </param>
        var width = this.get_xAxis().effectiveLength();
        var height = this.get_yAxis().effectiveLength();
        this.set_measuredSize(new Jspf.Size(width, height));
    },
    
    get_isArrangementValid: function Jspf_UiElement$get_isArrangementValid() {
        /// <value type="Boolean"></value>
        return this._isArrangementValid;
    },
    
    _isArrangementValid: false,
    
    invalidateArrangement: function Jspf_UiElement$invalidateArrangement() {
        if (!this._isArrangementValid) {
        }
        this._isArrangementValid = false;
    },
    
    arrange: function Jspf_UiElement$arrange(x, y, hostElement) {
        /// <param name="x" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="y" type="Jspf.AxisArrangement">
        /// </param>
        /// <param name="hostElement" type="Object" domElement="true">
        /// </param>
        this.set_yArrangement(y.clone());
        this.set_xArrangement(x.clone());
    },
    
    arrangeAxis: function Jspf_UiElement$arrangeAxis(axis, measured, available) {
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
    },
    
    _render: function Jspf_UiElement$_render() {
        this.onRender();
    },
    
    onRender: function Jspf_UiElement$onRender() {
    },
    
    _unrender: function Jspf_UiElement$_unrender() {
        this.onUnrender();
    },
    
    onUnrender: function Jspf_UiElement$onUnrender() {
    },
    
    add_propertyChanged: function Jspf_UiElement$add_propertyChanged(value) {
        /// <param name="value" type="Function" />
        this.__propertyChanged = ss.Delegate.combine(this.__propertyChanged, value);
    },
    remove_propertyChanged: function Jspf_UiElement$remove_propertyChanged(value) {
        /// <param name="value" type="Function" />
        this.__propertyChanged = ss.Delegate.remove(this.__propertyChanged, value);
    },
    
    __propertyChanged: null,
    
    onPropertyChanged: function Jspf_UiElement$onPropertyChanged(name) {
        /// <param name="name" type="String">
        /// </param>
        if (!ss.isNull(this.__propertyChanged)) {
            this.__propertyChanged.invoke(this, name);
        }
    }
}


Jspf.Axis.registerClass('Jspf.Axis');
Jspf.AxisArrangement.registerClass('Jspf.AxisArrangement');
Jspf.UiElement.registerClass('Jspf.UiElement', null, Jspf.INotifyPropertyChanged);
Jspf.Control.registerClass('Jspf.Control', Jspf.UiElement);
Jspf.ItemsControl.registerClass('Jspf.ItemsControl', Jspf.Control);
Jspf.ItemsSelectorControl.registerClass('Jspf.ItemsSelectorControl', Jspf.ItemsControl);
Jspf.TableItem.registerClass('Jspf.TableItem');
Jspf.TableItemContainerGenerator.registerClass('Jspf.TableItemContainerGenerator', null, Jspf.IItemContainerGenerator);
Jspf.SortedSetItemContainerGenerator.registerClass('Jspf.SortedSetItemContainerGenerator', null, Jspf.IItemContainerGenerator);
Jspf.ColumnTemplate.registerClass('Jspf.ColumnTemplate');
Constants.registerClass('Constants');
Jspf.ScrollBar.registerClass('Jspf.ScrollBar', Jspf.Control);
Jspf.SortedSet.registerClass('Jspf.SortedSet', null, Jspf.ISortedSet);
Jspf.Table.registerClass('Jspf.Table', Jspf.ItemsSelectorControl);
Jspf._generation.registerClass('Jspf._generation');
Jspf.OldListItemContainerGenerator.registerClass('Jspf.OldListItemContainerGenerator', null, Jspf.IItemContainerGenerator);
Jspf.Util.registerClass('Jspf.Util');
Jspf.VirtualStackPanel.registerClass('Jspf.VirtualStackPanel', Jspf.UiElement, Jspf.IScrollableAxis);
Jspf._listItem.registerClass('Jspf._listItem', null, Jspf.IListItem);
Jspf.ListBox.registerClass('Jspf.ListBox', Jspf.ItemsSelectorControl);
Jspf.Decorator.registerClass('Jspf.Decorator', Jspf.UiElement);
Jspf.DomUiElement.registerClass('Jspf.DomUiElement', Jspf.UiElement);
Jspf.Rect.registerClass('Jspf.Rect');
Jspf.Region.registerClass('Jspf.Region', Jspf.Decorator);
Jspf.Size.registerClass('Jspf.Size');
Constants.maX_INT = Math.pow(2, 31) - 1;
Jspf.SortedSet.empty = new Jspf.SortedSet(Jspf.SortedSet._emptyCompare, null, true);

}
ss.loader.registerScript('Jspf', [], executeScript);
})();

//! This script was generated using Script# v0.6.3.0
