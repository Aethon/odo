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
        UiElement GenerateContainer(int index);
        UiElement GetContainerForIndex(int index);
        UiElement GetContainerForItem(object item);
        object GetItemForContainer(UiElement container);
        int GetIndexForContainer(UiElement container);
        void ReleaseContainer(UiElement container);

        ArrayList GetActiveItems();

        event Action Changed;
    }

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

    public class ListBox : ItemsSelectorControl
    {
        public int FixedItemHeight // TODO: need to remove the need for this
        {
            get { return _fixedItemHeight; }
            set { _fixedItemHeight = value; }
        }

        private int _fixedItemHeight = 14;

        public override void Measure(Size size)
        {
            /* TODO
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
             */
        }

        public override void Arrange(AxisArrangement x, AxisArrangement y, Element hostElement)
        {
            base.Arrange(x, y, hostElement);
            /* TODO
            if (_stackPanel != null)
            {
                _stackPanel.Arrange(horizontal, vertical, hostElement);
            }
             */
        }
    }
}
