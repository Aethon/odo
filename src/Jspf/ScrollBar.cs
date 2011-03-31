using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public class ScrollBar : Control
    {
        public IScrollableAxis ScrollableAxis
        {
            get { return _scrollableAxis; }
            set
            {
                _scrollableAxis = value;
                _scrollableAxis.Changed += ScrollableAxisChanged;
            }
        }
        private IScrollableAxis _scrollableAxis;

        public Element InputSource
        {
            get { return _inputSource[0]; }
            set
            {
                _inputSource = jQuery.FromElement(value);
                _inputSource.Bind("mousewheel", Wheel);
            }
        }
        private jQueryObject _inputSource;

        private int _delayMilliseconds = 400;
        private int _repeatMilliseconds = 40;

        private bool _scrubbing = false;
        private bool auto;

        private jQueryObject _dom;
        private jQueryObject _near;
        private jQueryObject _far;
        private jQueryObject _track;
        private jQueryObject _thumb;

        private int _minThumbLength = 10;

        int _scrollTimer;
        int _grabPoint = 0;
        bool _disabled = false;


        public ScrollBar()
        {
            _stopScrollHandler = StopScroll;
            _dragHandler = Drag;
        }

        public void Show(bool show)
        {
            if (_dom != null)
            {
                if (show)
                    _dom.CSS("visibility", "visible");
                else
                    _dom.CSS("visibility", "hidden");
            }    
        }

        public override void Arrange(AxisArrangement x, AxisArrangement y, Element hostElement)
        {
            base.Arrange(x, y, hostElement);

            if (_dom == null)
            {
                _dom = jQuery.FromHtml("<div class='ui-vertical-scrollbar' style='position: absolute;'></div>").AppendTo(hostElement);
                _near = jQuery.FromHtml("<div class='ui-scroll-up-button'></div>").AppendTo(_dom).MouseDown(LineNear);
                _track = jQuery.FromHtml("<div class='ui-scroll-vertical-track'></div>").AppendTo(_dom).MouseDown(Page);
                _thumb = jQuery.FromHtml("<div class='ui-scroll-vertical-thumb' style='position: relative'></div>").AppendTo(_track).MouseDown(Scrub);
                _far = jQuery.FromHtml("<div class='ui-scroll-down-button'></div>").AppendTo(_dom).MouseDown(LineFar);
            }

            int buttonLength = (y.Length > 2*x.Length) ? x.Length : (int)Math.Floor(y.Length/2);
            int trackHeight = y.Length - 2*buttonLength;

            _minThumbLength = Math.Min(buttonLength, trackHeight);
            _dom.CSS("width", x.Length + "px").CSS("height", y.Length + "px").CSS("top", y.Position + "px").CSS("left", x.Position + "px");
            _near.CSS("width", x.Length + "px").CSS("height", buttonLength + "px");
            _far.CSS("width", x.Length + "px").CSS("height", buttonLength + "px");
            _track.CSS("width", x.Length + "px").CSS("height", trackHeight + "px");
            _thumb.CSS("width", x.Length + "px");
            
            ScrollableAxisChanged();
        }
 
        private void ScrollableAxisChanged()
        {
            if (!_scrubbing)
            {
                int logicalLength = _scrollableAxis.GetExtentLength() - _scrollableAxis.GetViewportLength();
                int thumbLength = Math.Max(Math.Floor(_track.GetHeight() / (double)_scrollableAxis.GetExtentLength() *
                               _scrollableAxis.GetViewportLength()), _minThumbLength);
                int physicalLength = _track.GetHeight() - thumbLength;
                int thumbPos = 0;
                if (logicalLength > 0 && physicalLength > 0)
                {
                    double ratio = physicalLength/(double) logicalLength;
                    thumbPos = Math.Round(_scrollableAxis.GetViewportPos()*ratio);
                }
                else
                {
                    // TODO
                }
                _thumb.CSS("top", thumbPos + "px").CSS("height", thumbLength + "px");
            }
        }

#if NO
        public void Reset()
        {
            /*
            //Arguments that were passed
            this._src = s;
            this.auto = a ? a : false;
            this.eventHandler = ev ? ev : function () { };
        
           
            //Height and position properties
            _trackTop = findOffsetTop(this._yTrack);
            _trackHeight = _yTrack.offsetHeight;
            _handleHeight = _yHandle.offsetHeight;
            _x = 0;
            _y = 0;

            //Misc. variables
            _scrollDist = 5;
            _scrollTimer = null;
            _selectFunc = null;
            _grabPoint = null;
            _tempTarget = null;
            _tempDistX = 0;
            _tempDistY = 0;
            _disabled = false;
            _ratio  = (_src.Extent - _src.ViewPortLength) / (_trackHeight - _handleHeight);

            
            _yHandle.Bind("dragstart",  delegate { return false; });
            _yHandle.MouseDown(delegate { return false; });


           // TODO this._addEvent(this._src.content, "mousewheel", this._scrollbarWheel);
            // TODO this._removeEvent(this._parent, "mousedown", this._scrollbarClick);
            // TODO this._addEvent(this._parent, "mousedown", this._scrollbarClick);

            _src.ViewportPos = 0;
           // with (this._yHandle.style) {
           //     top = "0px";
           //     left = "0px";
           // }
           // _moveContent();

            if (_src.Extent < _src.ViewPortLength) {
                _disabled = true;
                _yHandle.CSS("visibility", "hidden");
                //if (auto) this._parent.style.visibility = "hidden";
            } else {
                _disabled = false;
                _yHandle.CSS("visibility", "visible");
                //this._parent.style.visibility = "visible";
            }
             * */
        }

        private bool OnMousdown(jQueryEvent e) {
            if (_disabled)
                return false;

            _tempTarget = e.Target;
            string className = _tempTarget.ClassName;
            if (className.IndexOf("Scrollbar-Up") > -1) StartScroll(-_scrollDist);
            else if (className.IndexOf("Scrollbar-Down") > -1) StartScroll(_scrollDist);
            else if (className.IndexOf("Scrollbar-Track") > -1) Track(e);
            else if (className.IndexOf("Scrollbar-Handle") > -1) _scrollHandle(e);

            //self._selectFunc = document.onselectstart;
            //document.onselectstart = function () { return false; };

            // ? self.eventHandler(e.target, "mousedown");
            jQuery.Document.MouseUp(StopScroll);

            return false;
        }
#endif

        private void LineNear(jQueryEvent e)
        {
            if (!_disabled)
                StartScroll(_scrollableAxis.MoveLineNear);
            e.PreventDefault();
            e.StopPropagation();
        }

        private void LineFar(jQueryEvent e)
        {
            if (!_disabled)
                StartScroll(_scrollableAxis.MoveLineFar);
            e.PreventDefault();
            e.StopPropagation();
        }

        private void Page(jQueryEvent e)
        {
            if (!_disabled)
            {
                int curY = e.PageY;
                int thumbTop = _thumb.GetOffset().Top;
                if (curY <= thumbTop)
                {
                    StartScroll(_scrollableAxis.MovePageNear);
                }
                else
                {
                    StartScroll(_scrollableAxis.MovePageFar);
                }
            }
            e.PreventDefault();
            e.StopPropagation();
        }

        private void Scrub(jQueryEvent e)
        {
            if (!_disabled)
            {
                _scrubbing = true;
                int curY = e.PageY;
                _grabPoint = curY - _thumb.GetOffset().Top;
                jQuery.Document.MouseMove(_dragHandler);
                jQuery.Document.MouseUp(_stopScrollHandler);
            }
            e.PreventDefault();
            e.StopPropagation();
        }

        private readonly jQueryEventHandler _dragHandler;

        private void Drag(jQueryEvent e)
        {
            if (!_disabled)
            {
                int thumbPos = (e.PageY - _grabPoint);
                int physicalPos = thumbPos - _track.GetOffset().Top;
                int physicalLength = _track.GetHeight();
                int logicalLength = _scrollableAxis.GetExtentLength();
                _scrollableAxis.MoveToPos(physicalPos * logicalLength / physicalLength);

                // while scrubbing, pin the thumb to the cursor => feels more responsive
                thumbPos = Math.Max(0, Math.Min(physicalLength - _thumb.GetHeight(), physicalPos));
                _thumb.CSS("top", thumbPos + "px");
            }
        }
 
        private void Wheel(jQueryEvent e)
        {
            jQueryEventExtras ee = (jQueryEventExtras) (object) e;
            if (ee.WheelDelta >= 120)
                _scrollableAxis.MovePageNear();
            else if (ee.WheelDelta <= -120)
                _scrollableAxis.MovePageFar();

            e.StopPropagation();
            e.PreventDefault();
        }
 
        private void StartScroll(Action action)
        {
            action();
            _scrollTimer = Window.SetInterval(delegate
                                   {
                                       if (_scrollTimer > 0)
                                       {
                                           Window.ClearInterval(_scrollTimer);
                                           _scrollTimer = Window.SetInterval(delegate { action(); }, _repeatMilliseconds);
                                           action();
                                       }
                                   }, 
                                   _delayMilliseconds);
            jQuery.Document.MouseUp(_stopScrollHandler);
        }

        private readonly jQueryEventHandler _stopScrollHandler;

        private void StopScroll(jQueryEvent e)
        {
            jQuery.Document.Unbind("mouseup", _stopScrollHandler);
            jQuery.Document.Unbind("mousemove", _dragHandler);
            if (_scrubbing)
            {
                _scrubbing = false;
                ScrollableAxisChanged();
            }
            if (_scrollTimer > 0) Window.ClearInterval(_scrollTimer);
        }
    }
}
