using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public delegate Control Template(object context);

    public class Control
    {
        // layout
        public Axis Horizontal
        {
            get { return _horizontal; }
            set { _horizontal = value ?? new Axis(); }
        }
        private Axis _horizontal = new Axis();

        public Axis Vertical
        {
            get { return _vertical; }
            set { _vertical = value ?? new Axis(); }
        }
        private Axis _vertical = new Axis();

        public Size MeasuredSize;

        public AxisArrangement VerticalArrangement;
        public AxisArrangement HorizontalArrangement;

        public Control GetParent()
        {
            return _parent;
        }
        internal virtual void SetParent(Control parent)
        {
            _parent = parent;
        }
        private Control _parent = null;

        /*
        this.setProperties = function(props) {
            var type;

            if (props) {
                for (var x in props) {
                    if (x.charAt(0) !== '_') {
                        type = typeof this[x];
                        if (type !== 'undefined' && type !== 'function') {
                            this[x] = props[x];
                        }
                    }
                }
            }
            return this;
        };
        */

        public virtual void Measure(Size size)
        {
            // default measurement
            int width = Horizontal.EffectiveLength();
            int height = Vertical.EffectiveLength();

            MeasuredSize = new Size(width, height);
        }

        public virtual void Arrange(AxisArrangement horizontal, AxisArrangement vertical, Element hostElement)
        {
            VerticalArrangement = vertical.Clone();
            HorizontalArrangement = horizontal.Clone();
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
    }
}
