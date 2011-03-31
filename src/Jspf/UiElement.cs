using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public delegate UiElement Template(object context);

    public class UiElement : INotifyPropertyChanged
    {
        #region Heirarchy 

        public virtual UiElement Parent
        {
            get { return _parent; }
            internal set { _parent = value; }
        }
        private UiElement _parent;

        public virtual UiElement VisualParent
        {
            get { return _visualParent; }
            internal set { _visualParent = value; }
        }
        private UiElement _visualParent;

        internal UiElement TemplatedParent { get { return _templatedParent; } }
        private UiElement _templatedParent;

        #endregion

        #region Layout definition

        public Axis XAxis
        {
            get { return _xAxis; }
            set
            {
                value = value ?? new Axis();
                if (_xAxis != value)
                {
                    _xAxis = value;
                    InvalidateMeasure();
                    OnPropertyChanged("XAxis");
                };
            }
        }
        private Axis _xAxis = new Axis();

        public Axis YAxis
        {
            get { return _yAxis; }
            set
            {
                value = value ?? new Axis();
                if (_yAxis != value)
                {
                    _yAxis = value;
                    InvalidateMeasure();
                    OnPropertyChanged("YAxis");
                }
            }
        }
        private Axis _yAxis = new Axis();

        public Size MeasuredSize
        {
            get { return _measuredSize; }
            internal set
            {
                value = value ?? new Size(0, 0);
                if (_measuredSize != value)
                {
                    _measuredSize = value;
                    OnPropertyChanged("MeasuredSize");
                }
            }
        }
        private Size _measuredSize = new Size(0, 0);

        public AxisArrangement YArrangement
        {
            get { return _yArrangement; }
            internal set
            {
                value = value ?? new AxisArrangement(0, 0);
                if (_yArrangement != value)
                {
                    _yArrangement = value;
                    OnPropertyChanged("YArrangement");
                }
            }
        }
        private AxisArrangement _yArrangement = new AxisArrangement(0, 0);

        public AxisArrangement XArrangement
        {
            get { return _xArrangement; }
            internal set
            {
                value = value ?? new AxisArrangement(0, 0);
                if (_xArrangement != value)
                {
                    _xArrangement = value;
                    OnPropertyChanged("XArrangement");
                }
            }
        }
        private AxisArrangement _xArrangement = new AxisArrangement(0, 0);

        #endregion

        #region Layout management

        #region Measure

        public bool IsMeasureValid
        {
            get { return _isMeasureValid; }
        }
        private bool _isMeasureValid;

        protected void InvalidateMeasure()
        {
            if (!_isMeasureValid)
            {
                // TODO: schedule layout pass with region
            }
            _isMeasureValid = false;
        }

        public virtual void Measure(Size size)
        {
            // default measurement
            int width = XAxis.EffectiveLength();
            int height = YAxis.EffectiveLength();

            MeasuredSize = new Size(width, height);
        }

        #endregion

        #region Arrange

        public bool IsArrangementValid
        {
            get { return _isArrangementValid; }
        }
        private bool _isArrangementValid;

        protected void InvalidateArrangement()
        {
            if (!_isArrangementValid)
            {
                // TODO: schedule layout pass with region
            }
            _isArrangementValid = false;
        }

        public virtual void Arrange(AxisArrangement x, AxisArrangement y, Element hostElement)
        {
            YArrangement = y.Clone();
            XArrangement = x.Clone();
        }

        protected virtual AxisArrangement ArrangeAxis(Axis axis, int measured, int available)
        {
            int length = 0;
            int pos = 0;
            int totalNeeded = 0;

            if (axis.Alignment == AxisAlignment.Stretch) {
                length = Math.Min(available, axis.EffectiveMaxLength());
            } else {
                length = Math.Min(available, measured);
            }

            length = Math.Max(axis.EffectiveMinLength(), length - axis.NearMargin - axis.FarMargin);

            switch (axis.Alignment) {
                case AxisAlignment.Near:
                    pos = axis.NearMargin;
                    break;
                case AxisAlignment.Far:
                    pos = available - axis.FarMargin - length;
                    break;
                case AxisAlignment.Center:
                case AxisAlignment.Stretch:
                    totalNeeded = axis.FarMargin + axis.NearMargin + length;
                    if (totalNeeded != available) {
                        pos = Math.Floor((available - totalNeeded) / 2);
                    }
                    break;
                default:
                    throw new Exception("Unknown axis alignment specified");
            }

            return new AxisArrangement(pos, length);
        }

        #endregion

        #region Render

        internal void Render()
        {
            OnRender();
        }

        protected virtual void OnRender()
        {
            // override this method to render the element into the DOM
        }

        internal void Unrender()
        {
            OnUnrender();
        }

        protected virtual void OnUnrender()
        {
            // override this element to remove this element from the DOM (if required)
        }

        #endregion

        #endregion

        #region Property change notification

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string name)
        {
            if (!Script.IsNull(PropertyChanged))
            {
                PropertyChanged(this, name);
            }
        }

        #endregion
    }
}
