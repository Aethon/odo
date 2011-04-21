using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public interface IScrollableAxis
    {
        int GetExtentLength();
        int GetViewportPos();
        int GetViewportLength();

        event Action Changed;

        void MoveLineNear();
        void MoveLineFar();
        void MovePageNear();
        void MovePageFar();
        void MoveToPos(int position);
        void ScrollIntoViewport(int line);
    }

#if NO
    public class ScrollableAxis : IScrollableAxis
    {
        public int ExtentLength
        {
            get { return _extentLength; }
            set
            {
                if (value != _extentLength)
                {
                    _extentLength = value;
                    OnChanged();
                }
            }
        }
        private int _extentLength = 0;

        public int ViewportPos
        {
            get { return _pos; }
            set
            {
                if (value != _pos)
                {
                    _pos = value;
                    OnChanged();
                }
            }
        }
        private int _pos = 0;

        public int ViewportLength
        {
            get { return _length; }
            set
            {
                if (value != _length)
                {
                    _length = value;
                    OnChanged();
                }
            }
        }
        private int _length = 0;

        public event Action Changed;

        private void OnChanged()
        {
            if (Changed != null)
            {
                Changed();
            }
        }


        public void MoveLineNear()
        {
            throw new global::System.NotImplementedException();
        }

        public void MoveLineFar()
        {
            throw new global::System.NotImplementedException();
        }

        public void MovePageNear()
        {
            throw new global::System.NotImplementedException();
        }

        public void MovePageFar()
        {
            throw new global::System.NotImplementedException();
        }

        public void MoveToPos(int position)
        {
            throw new global::System.NotImplementedException();
        }
    }
#endif

    public class VirtualStackPanel : Control, IScrollableAxis
    {
        public IItemContainerGenerator ItemContainerGenerator
        {
            get { return _itemContainerGenerator; }
            set {
                _itemContainerGenerator = value;
                if (_itemContainerGenerator != null)
                {
                    _itemContainerGenerator.Changed += delegate { Synchronize(true); };
                }
                Synchronize(true);
            }
        }
        private IItemContainerGenerator _itemContainerGenerator;

        public int FixedItemHeight
        {
            get { return _fixedItemHeight; }
            set { _fixedItemHeight = value;
                Synchronize(true);
            }
        }
        private int _fixedItemHeight = 15;

        public Element FocusElement
        {
            get { return _focusElement; }
            set { _focusElement = value; }
        }
        private Element _focusElement = null;

        // this is the index the element that is desired to be first in the visible area
        private int _desiredFirstItem = 0;
        
        // these are the indexes of the first and last visible items
        private int _firstItem = -1;
        private Control _firstItemContainer = null;
        private int _lastItem = -1;

        // number of whole items displayed at a time
        private int _viewportLines = 0;

        // these are the indices are the first and last realized items
        private int _firstRealizedItem = -1;
        private int _lastRealizedItem = -1;

        private readonly ArrayList _realizedItems = new ArrayList();

        private jQueryObject _scroller = null;
        private jQueryObject _content = null;
        private ScrollBar _scrollbar = null;

        private int GetAvailableItemCount()
        {
            return _itemContainerGenerator != null ? _itemContainerGenerator.Count() : 0;
        }

        private void Synchronize(bool clear)
        {
            int available = GetAvailableItemCount();
            bool changed = false;

            if (_scroller != null)
            {
                if (clear || (available == 0))
                {
                    if (_itemContainerGenerator != null)
                    {
                        _desiredFirstItem = _itemContainerGenerator.GetIndexForContainer(_firstItemContainer);
                        if (_desiredFirstItem < 0)
                        {
                            _desiredFirstItem = _firstItem;
                        }
                    }
                    for (int i = Math.Max(_firstRealizedItem, 0); i <= _lastRealizedItem; i++)
                    {
                        ReleaseContainer(i);
                        changed = true;
                    }
                    _firstItem = -1;
                    _firstItemContainer = null;
                    _lastItem = -1;
                    _firstRealizedItem = -1;
                    _lastRealizedItem = -1;
                }

                if (available > 0)
                {
                    _content.Height(available*_fixedItemHeight);

                    _desiredFirstItem = Math.Max(0, Math.Min(_desiredFirstItem, GetAvailableItemCount()));

                    if (_desiredFirstItem != _firstItem)
                    {
                        changed = true;
                    }

                    int firstRequired = _desiredFirstItem;
                    int viewSize = _scroller.GetInnerHeight();
                    double buffer = viewSize / (double)_fixedItemHeight;
                    int usableBuffer = Math.Floor(buffer);
                    int lastRequired = firstRequired + usableBuffer - 1;
                    if (lastRequired > available - 1)
                    {
                        int overshot = lastRequired - available + 1;
                        firstRequired = Math.Max(firstRequired - overshot, 0);
                        lastRequired = available - 1;
                    }
                    int firstAllowed = firstRequired - 2;
                    int lastAllowed = lastRequired + 2;

                    _firstItem = firstRequired;
                    _desiredFirstItem = _firstItem;
                    _firstItemContainer = _itemContainerGenerator.GetContainerForIndex(_firstItem);
                    _lastItem = lastRequired;
                    if (buffer - usableBuffer > 0)
                    {
                        lastRequired = Math.Min(lastRequired + 1, available - 1);
                    }

                    ShowScrollbar((_firstItem > 0) || (_viewportLines < available));

                    int layoutWidth = _content.GetInnerWidth();

                    // add any missing elements
                    for (int i = firstRequired; i <= lastRequired; i++)
                    {
                        if (_realizedItems[i] == null)
                        {
                            changed = true;
                            Control item = _itemContainerGenerator.GenerateContainer(i);
                            _realizedItems[i] = item;
                            item.SetParent(this);

                            item.Measure(new Size(layoutWidth, _fixedItemHeight));

                            AxisArrangement v = ArrangeAxis(item.Vertical, item.MeasuredSize.Height, _fixedItemHeight);
                            v.Position += i * _fixedItemHeight;
 
                            item.Arrange(ArrangeAxis(item.Horizontal, item.MeasuredSize.Width, _content.GetInnerWidth()),
                                v, _content[0]);
                        }
                    }
                    
                    // show the new items
                    _content.CSS("top", (-firstRequired * _fixedItemHeight) + "px");

                    // remove any unnecessary elements)
                    bool itemRemoved = false;
                    for (int i = Math.Max(_firstRealizedItem, 0); i < firstAllowed; i++)
                    {
                        ReleaseContainer(i);
                        itemRemoved = true;
                    }
                    for (int i = lastAllowed + 1; i <= _lastRealizedItem; i++)
                    {
                        ReleaseContainer(i);
                        itemRemoved = true;
                    }
                    _firstRealizedItem = Math.Min(firstRequired, Math.Max(firstAllowed, _firstRealizedItem));
                    _lastRealizedItem = Math.Max(lastRequired, Math.Min(lastAllowed, _lastRealizedItem));
                    if (itemRemoved && !Script.IsNull(FocusElement))
                    {
                        try
                        {
                            FocusElement.Focus();
                        }
                        catch (Exception)
                        {
                            // nothing to do, prolly running IE
                        }
                    }
                }
                else
                {
                    ShowScrollbar(false);
                }
            }

            if (changed && Changed != null)
            {
                Changed();
            }
        }

        private void ShowScrollbar(bool show)
        {
            _scrollbar.Show(show);
        }

        private void ReleaseContainer(int index)
        {
            Control loser = (Control)_realizedItems[index];
            if (loser != null)
            {
                _realizedItems[index] = null;
                loser.SetParent(null);
                _itemContainerGenerator.ReleaseContainer(loser);
            }
        }

        public override void Arrange(AxisArrangement horizontal, AxisArrangement vertical, Element hostElement)
        {
            base.Arrange(horizontal, vertical, hostElement);

            int scrollbarWidth = 18; // TODO: from scrollbar?

            if (_scroller == null)
            {
                _scroller = jQuery.FromHtml(
                    "<div style='overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute'></div>")
                    .AppendTo(hostElement);
                // TODO: somehow _scroller[0].onselectstart = delegate () { return false; }; // IE way of preventing text selection

                _content = jQuery.FromHtml("<div style='overflow: hidden; -khtml-user-select: none; -moz-user-select: none; position: absolute'></div>").AppendTo(_scroller);

                _scrollbar = new ScrollBar();
                _scrollbar.ScrollableAxis = this;
                _scrollbar.InputSource = _scroller[0];
            }

            _content.Width(horizontal.Length).Height(GetAvailableItemCount() * _fixedItemHeight);
            _scroller.Width(horizontal.Length).Height(vertical.Length)
                .CSS("top", vertical.Position + "px").CSS("left", horizontal.Position + "px");

            _viewportLines = Math.Floor(_scroller.GetInnerHeight() / (double)_fixedItemHeight);

            AxisArrangement h = horizontal.Clone();
            h.Position = h.Position + h.Length - scrollbarWidth;
            h.Length = scrollbarWidth;

            _scrollbar.Arrange(h, vertical, _scroller[0]);

            Synchronize(true);
        }

        private bool _needsSync = false;

        private void ScrollChanged()
        {
            _needsSync = true;
            Window.SetTimeout(OnDelayedScroll, 10);
        }

        private void OnDelayedScroll()
        {
            if (_needsSync)
            {
                _needsSync = false;
                Synchronize(false);
            }
        }

        #region IScrollableAxis

        public int GetExtentLength()
        {
            return GetAvailableItemCount();
        }

        public int GetViewportPos()
        {
            return _firstItem;
        }

        public int GetViewportLength()
        {
            return _viewportLines;
        }

        public event Action Changed;

        public void MoveLineNear()
        {
            _desiredFirstItem = _desiredFirstItem - 1;
            ScrollChanged();
        }

        public void MoveLineFar()
        {
            _desiredFirstItem = _desiredFirstItem + 1;
            ScrollChanged();
        }

        public void MovePageNear()
        {
            _desiredFirstItem = _desiredFirstItem - 10; // TODO
            ScrollChanged();
        }

        public void MovePageFar()
        {
            _desiredFirstItem = _desiredFirstItem + 10; // TODO
            ScrollChanged();
        }

        public void MoveToPos(int position)
        {
            _desiredFirstItem = Math.Floor(position);
            ScrollChanged();
        }

        #endregion


        public void ScrollIntoViewport(int line)
        {
            if (line < _firstItem)
            {
                _desiredFirstItem = line;
                ScrollChanged();
            }
            if (line > _lastItem)
            {
                _desiredFirstItem = line - GetViewportLength() + 1;
                ScrollChanged();
            }
        }
    }
}
