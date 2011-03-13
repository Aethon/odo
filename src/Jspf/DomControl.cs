using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public class DomControl : Control
    {
        private bool _isReal = false;

        public Element DomContent
        {
            get { return _domContent != null ? _domContent[0] : null;  }
            set
            {
                if (_domContent != null)
                {
                    _domContent.Remove();
                    _domContent = null;
                }
                _isReal = false;
                if (value != null)
                {
                    _domContent = jQuery.FromElement(value);
                }
                // TODO: call for layout
            }
        }

        private jQueryObject _domContent = null;

        internal override void SetParent(Control parent)
        {
            base.SetParent(parent);

            if ((parent == null) && (_domContent != null))
            {
                _domContent.Remove();
                _isReal = false;
            }
        }

        public override void Arrange(AxisArrangement horizontal, AxisArrangement vertical, Element hostElement)
        {
            base.Arrange(horizontal, vertical, hostElement);

            if (_domContent != null)
            {
                if (!_isReal)
                {
                    _domContent.AppendTo(hostElement);
                }
                _domContent.CSS("position", "absolute")
                    .CSS("left", horizontal.Position + "px")
                    .CSS("top", vertical.Position + "px")
                    .CSS("width", horizontal.Length + "px")
                    .CSS("height", vertical.Length + "px");
            }
        }
    }
}
