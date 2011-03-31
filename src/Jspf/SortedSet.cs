using System;

namespace Jspf
{
    public class SortedSet : ISortedSet
    {
        private static int EmptyCompare(object left, object right) { return 0; }
        public static readonly SortedSet Empty = new SortedSet(EmptyCompare , null, true);

        public int Count { get { return _items.Length; } }

        public Compare Compare { get { return _compare; } }
        private readonly Compare _compare;

        private readonly Array _items;

        public SortedSet(Compare compare, Array items, bool alreadySorted)
        {
            if (compare == null)
                throw new Exception("compare must be provided");
            _compare = compare;
            _items = items ?? new Array();
            if (!alreadySorted)
                _items.Sort((CompareCallback)(object)_compare);
        }


        public int IndexOf(object item)
        {
            return Util.BinarySearch(_items, item, _compare);
        }

        public object GetItem(int index)
        {
            return _items[index];
        }

        public Array GetItems(int index, int count)
        {
            Array result = new Array();
            int max = Math.Min(index + count, _items.Length);
            for (int i = index; i < max; i++)
            {
                result[i - index] = _items[i];
            }
            return result;
        }

        public Array GetAllItems()
        {
            return _items.Clone();
        }
    }
}