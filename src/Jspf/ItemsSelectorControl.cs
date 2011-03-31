using System;
using System.Collections;

namespace Jspf
{
    public class ItemsSelectorControl : ItemsControl
    {
        public ISortedSet Selection;

        private object _selectionBase;
        private object _selectionFocus;

        public void SelectAll()
        {
            Selection = new SortedSet(Source.Compare, Source.GetAllItems(), true);
        }

        public void Select(object item, bool ctrlKey, bool shiftKey)
        {
            if ((!(shiftKey || ctrlKey)) || (shiftKey && _selectionBase == null))
            {
                Selection = new SortedSet(Source.Compare, (Array)Script.Literal("[item]"), true);
                _selectionBase = item;
                _selectionFocus = item;
            }
            else if (shiftKey)
            {
                int first = Source.IndexOf(_selectionBase);
                int last = Source.IndexOf(item);
                if (first > last)
                {
                    int x = first;
                    first = last;
                    last = x;
                }
                Selection = new SortedSet(Source.Compare, Source.GetItems(first, last - first + 1), true);
                _selectionFocus = item;
            }
            else
            {
                Array newSel = Selection.GetAllItems();
                int ins = Util.BinarySearchForInsert(newSel, item, Selection.Compare);
                ((ArrayList)(object)newSel).Insert(ins, item);
                Selection = new SortedSet(Selection.Compare, newSel, true);
                _selectionBase = item;
                _selectionFocus = item;
            }
            // TODO this.triggerItemFocused();
        }

        public void Move(int distance, bool ctrlKey, bool shiftKey) // this should be in the panel implementation
        {
            int from;
            if (ctrlKey)
            {
                from = ItemsPanel.GetViewportPos();
            }
            else if (_selectionFocus == null)
            {
                from = 0;
            }
            else
            {
                from = Source.IndexOf(_selectionFocus);
            }

            int to = Math.Min(Math.Max(0, from + distance), Source.Count - 1);
            if (to >= 0)
            {
                if (!ctrlKey)
                {
                    Select(Source.GetItem(to), false, shiftKey);
                    ItemsPanel.ScrollIntoViewport(to);
                }
                else
                {
                    ItemsPanel.MoveToPos(to);
                }
            }
            // reassert keyboard focus for IE
            // TODO this.element[0].focus();
        }
    }
}