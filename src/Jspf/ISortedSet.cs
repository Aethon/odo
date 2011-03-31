using System;
using System.Collections;

namespace Jspf
{
    public delegate int Compare(object left, object right);

    public interface ISortedSet
    {
        int Count { get; }
        Compare Compare { get; }
        int IndexOf(object item);
        object GetItem(int index);
        Array GetItems(int index, int count);
        Array GetAllItems();
    }
}
