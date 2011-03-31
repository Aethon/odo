using System;
using System.Collections;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public class DomUiElement : UiElement
    {
        private bool _isReal;

        public Element DomContent
        {
            get { return Script.IsNull(_domContent) ? null : _domContent[0];  }
            set
            {
                jQueryObject asJq = null;
                if (!Script.IsNull(value))
                {
                    asJq = jQuery.FromElement(value);
                    if (asJq == _domContent)
                    {
                        return;
                    }
                }

                if (_domContent != null)
                {
                    _domContent.Remove();
                    _domContent = null;
                }
                _isReal = false;
                if (asJq != null)
                {
                    _domContent = asJq;
                }
                InvalidateMeasure();
                OnPropertyChanged("DomContent");
            }
        }
        private jQueryObject _domContent;

        public override UiElement Parent
        {
            get { return base.Parent; }
            internal set
            {
                base.Parent = value;

                if ((value == null) && (_domContent != null))
                {
                    _domContent.Remove();
                    _isReal = false;
                }
            }
        }

        public override void Arrange(AxisArrangement x, AxisArrangement y, Element hostElement)
        {
            base.Arrange(x, y, hostElement);

            if (_domContent != null)
            {
                if (!_isReal)
                {
                    _domContent.AppendTo(hostElement);
                }
                _domContent.CSS("position", "absolute")
                    .CSS("left", x.Position + "px")
                    .CSS("top", y.Position + "px")
                    .CSS("width", x.Length + "px")
                    .CSS("height", y.Length + "px");
            }
        }
    }
}
