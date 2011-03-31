using System;
using System.Collections;

namespace Jspf
{
    public static class Util
    {
        public static int BinarySearch(Array items, object item, Compare compare)
        {
            int low = 0;
            int high = items.Length - 1;
            int test;
            int comparison;
            while (low <= high)
            {
                test = (low + high) >> 1;
                comparison = compare(items[test], item);
                if (comparison == 0)
                {
                    return test;
                }
                if (comparison < 0)
                {
                    low = test + 1;
                }
                else
                {
                    high = test - 1;
                }
            }
            return -1;
        }

        public static int BinarySearchForInsert(Array items, object item, Compare compare)
        {
            int low = 0;
            int high = items.Length - 1;
            int test = -1;
            int comparison = 0;
            while (low <= high)
            {
                test = (low + high) >> 1;
                comparison = compare(items[test], item);
                if (comparison == 0)
                {
                    return test;
                }
                if (comparison < 0)
                {
                    low = test + 1;
                }
                else
                {
                    high = test - 1;
                }
            }
            return comparison < 0 ? test + 1 : test;
        }
    }
}
