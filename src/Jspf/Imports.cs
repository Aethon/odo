using System;
using System.Collections;
using System.Runtime.CompilerServices;

namespace Jspf
{
    [Imported]
    public class jQueryEventExtras
    {
        public int WheelDelta;
        public int ClientY;
    }

    [Imported]
    public class ArrayListExt
    {
        public ArrayList Slice(int start, int end)
        {
            return null;
        }

        public ArrayList Slice(int start)
        {
            return null;
        }

        public int BinarySearch(object item, Jspf.UniqueSortCompare compare) { return 0; }
    }
}
