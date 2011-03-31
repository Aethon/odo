// Decorator.cs
//

using System;
using System.Collections;

namespace Jspf
{
    public class Decorator : UiElement
    {
        #region Heirarchy

        public UiElement Child
        {
            get { return _child; }   
            set
            {
                if (_child != null)
                {
                    _child.Parent = null;
                }
                _child = value;
                if (_child != null)
                {
                    _child.Parent = this;
                }
                InvalidateMeasure();
                OnPropertyChanged("Child");
            }
        }
        private UiElement _child;

        #endregion
    }
}
