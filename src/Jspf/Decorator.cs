// Decorator.cs
//

using System;
using System.Collections;

namespace Jspf
{
    public class Decorator : Control
    {
        public Control Child
        {
            get { return _child; }   
            set
            {
                if (_child != null)
                {
                    _child.SetParent(null);
                }
                _child = value;
                if (_child != null)
                {
                    _child.SetParent(this);
                }
            }
        }
        private Control _child;
    }
}
