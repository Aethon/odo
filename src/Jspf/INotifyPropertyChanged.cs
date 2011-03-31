using System;
using System.Collections;

namespace Jspf
{
    public delegate void PropertyChangedEventHandler(object sender, string name);
    public interface INotifyPropertyChanged
    {
        event PropertyChangedEventHandler PropertyChanged;
    }
}
