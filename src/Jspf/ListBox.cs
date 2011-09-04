using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public interface IListItem
    {
        object Data { get; set; }
        bool IsSelected { get; set; }
        bool IsEnabled { get; set; }
    }

    public interface IItemContainerGenerator
    {
        int Count();
        Control GenerateContainer(int index);
        Control GetContainerForIndex(int index);
        Control GetContainerForItem(object item);
        object GetItemForContainer(Control container);
        int GetIndexForContainer(Control container);
        void ReleaseContainer(Control container);

        ArrayList GetActiveItems();

        event Action Changed;
    }

#if NO
    internal class ListItemContainerGenerator : IItemContainerGenerator
    {
        private readonly ArrayList _selected = new ArrayList();

        private readonly ArrayList _realizedItems = new ArrayList();

        private ArrayList _allItems = new ArrayList();

        public int Count()
        {
            return _allItems.Count;
        }

        public Control GetContainerForIndex(int index)
        {
            ListItem context = new ListItem(_selected, index);
            context.Data = _allItems[index];
            return _itemTemplate(index);
        }

        public Template ItemTemplate
        {
            get { return _itemTemplate; }
            set
            {
                _itemTemplate = value ?? DefaultTemplate;
            }
        }
        private Template _itemTemplate = DefaultTemplate;

        private static Control DefaultTemplate(object data)
        {
            DomControl result = new DomControl();
            result.DomContent =
                jQuery.FromHtml(
                    "<li role='listitem' class='ui-list-item' style='cursor: default; position: absolute'><div style='height: 12px; font-size:11px'>" +
                    data + "</div></li>")[0];
            return result;
        }

        public void ReleaseContainer(int index)
        {
            _realizedItems[index] = null;
        }

        public ListItemContainerGenerator()
        {
            for (int i = 0; i < 50000; i++)
            {
                _allItems[i] = i;
            }
        }
    }
#endif

    internal class ListItem : IListItem
    {
        private ArrayList _selected;
        private int _index;

        public bool IsSelected
        {
            get { return _selected.Contains(_data); }
            set { _selected[_index] = value; }
        }

        public bool IsEnabled
        {
            get { return true; }
            set { }
        }

        public object Data
        {
            get { return _data; }
            set { _data = value; }
        }

        private object _data = null;

        public ListItem(ArrayList selected, int index)
        {
            _selected = selected;
            _index = index;
        }
    }
    
    public class ListBox : Control
    {
        public IItemContainerGenerator ItemContainerGenerator
        {
            get { return _itemContainerGenerator; }
            set { _itemContainerGenerator = value;
                //Synchronize(true);
            }
        }

        private IItemContainerGenerator _itemContainerGenerator; // = new ListItemContainerGenerator();

        public int FixedItemHeight
        {
            get { return _fixedItemHeight; }
            set { _fixedItemHeight = value;
                //Synchronize(true);
            }
        }

        private int _fixedItemHeight = 14;

        public Template ItemTemplate
        {
            get { return _itemTemplate; }
            set
            {
                _itemTemplate = value ?? DefaultTemplate;
                //Synchronize(true);
            }
        }

        private Template _itemTemplate = DefaultTemplate;

        public Template ItemContainerTemplate
        {
            get { return _itemContainerTemplate; }
            set
            {
                _itemContainerTemplate = value ?? DefaultTemplate;
                //Synchronize(true);
            }
        }

        private Template _itemContainerTemplate = DefaultTemplate;

        private VirtualStackPanel _stackPanel = null;

        private int GetAvailableItemCount()
        {
            return _itemContainerGenerator != null ? _itemContainerGenerator.Count() : 0;
        }

        public override void Measure(Size size)
        {
            if (_stackPanel == null)
            {
                _stackPanel = new VirtualStackPanel();
                _stackPanel.SetParent(this);
                _stackPanel.Horizontal = Horizontal;
                _stackPanel.Vertical = Vertical;
                _stackPanel.FixedItemHeight = FixedItemHeight;
                _stackPanel.ItemContainerGenerator = ItemContainerGenerator;
            }
            _stackPanel.Measure(size);
            MeasuredSize = _stackPanel.MeasuredSize;
        }

        public override void Arrange(AxisArrangement horizontal, AxisArrangement vertical, Element hostElement)
        {
            base.Arrange(horizontal, vertical, hostElement);
            if (_stackPanel != null)
            {
                _stackPanel.Arrange(horizontal, vertical, hostElement);
            }
        }

        private static Control DefaultTemplate(object data)
        {
            DomControl result = new DomControl();
            result.DomContent = jQuery.FromHtml("<div style='height: 12px'>" + data + "</div>")[0];
            return result;
        }


        private int _selectionFocus = 0;
        //private int _selectionBase = 0;
        private void SetSelectionFocus(int index) {
            //           if (_selectionFocus) {
            //               _selectionFocus.removeClass("ui-list-focus");
            //           }
            //           if ($item) {
            //               $item.addClass("ui-list-focus");
            //           }
            _selectionFocus = index;
        }

        public static bool IsScrolledIntoView(jQueryObject host, jQueryObject subject)
        {
            int docViewTop = host.GetOffset().Top;
            int docViewBottom = docViewTop + host.GetHeight();

            int elemTop = subject.GetOffset().Top;
            int elemBottom = elemTop + subject.GetHeight();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
                    && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
        /*
        private void SelectAll()
        {
            Selected.Value($.merge([], self.Source.Value()));
        }

        private void Select(int index, bool ctrlKey, bool shiftKey) {
            IListItem source = (IListItem)_itemGenerator.GetItem(index);
            if ((!(shiftKey || ctrlKey)) || (shiftKey && _selectionBase < 0))
            {
                source.IsSelected = true;
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
         * */


        public ArrayList Source {
            get { return _source; } 
            set { _source = value ?? new ArrayList(); }
        }
        private ArrayList _source = new ArrayList();

        public ArrayList Selected
        {
            get { return _selected; }
            set { _selected = value ?? new ArrayList(); }
        }
        private ArrayList _selected = new ArrayList();

        /*
        // use a combinator: public object UniqueSortKeySelector = null;
        public object Focus
        {
            get { return _focus; }
            set { / * ha ha * / }
        }
        private object _focus;
        */
#if NO
        private jQueryObject _selectionFocus = null;
        private var _selectionBase = null;
        private void SetSelectionFocus(jQueryObject item) {
            //           if (_selectionFocus) {
            //               _selectionFocus.removeClass("ui-list-focus");
            //           }
            //           if ($item) {
            //               $item.addClass("ui-list-focus");
            //           }
            _selectionFocus = item;
        }

        private IEnumerable<Element> _getElements() {
            return self.element.children("li").toArray();
        }

        private void _clearElements() {
            self.element.empty();
        }

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

#endif
    }
}
