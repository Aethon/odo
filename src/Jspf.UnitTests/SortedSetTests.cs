using System;
using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Html;
using System.Testing;
using jQueryApi;
using QUnit4SS;

namespace Jspf.UnitTests
{
    public static class SortedSetTests
    {
        static int CompareNumber(object left, object right)
        {
            return (int)left - (int)right;
        }

        private readonly static int[] TestSortedArray = {1, 2, 3, 4, 5};
        private readonly static int[] TestUnsortedArray = { 5, 2, 1, 4, 3, 0 };

        static SortedSetTests()
        {
            QUnit.module("SortedSet tests");

            QUnit.test("new SortedSet fails with null compare", delegate
            {
                QUnit.raises(delegate { new SortedSet(null, new Array(), true); }, "should throw an exception");
            });

            QUnit.test("new SortedSet succeeds with null array (sorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, new Array(), true);
                QUnit.equals(s.Count, 0, "count should be zero");
            });

            QUnit.test("new SortedSet succeeds with null array (unsorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, new Array(), true);
                QUnit.equals(s.Count, 0, "count should be zero");
            });

            QUnit.test("new SortedSet succeeds (empty, sorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, new Array(), true);
                QUnit.equals(s.Count, 0, "count should be zero");
            });

            QUnit.test("new SortedSet succeeds (empty, not sorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, new Array(), false);
                QUnit.equals(s.Count, 0, "count should be zero");
            });

            QUnit.test("new SortedSet succeeds (non empty, sorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, TestSortedArray, true);
                QUnit.equals(s.Count, TestSortedArray.Length, "count should be zero");
            });
            
            QUnit.test("new SortedSet succeeds (not empty, unsorted)", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, TestUnsortedArray, false);
                QUnit.equals(s.Count, TestUnsortedArray.Length, "count should be zero");
            });

            QUnit.test("SortedSet.GetItems succeeds", delegate
            {
                SortedSet s = new SortedSet(CompareNumber, TestUnsortedArray, false);
                QUnit.equals(s.IndexOf(0), 0, "should find 0");
                QUnit.equals(s.IndexOf(1), 1, "should find 1");
                QUnit.equals(s.IndexOf(2), 2, "should find 2");
                QUnit.equals(s.IndexOf(3), 3, "should find 3");
                QUnit.equals(s.IndexOf(4), 4, "should find 4");
                QUnit.equals(s.IndexOf(5), 5, "should find 5");
                QUnit.equals(s.IndexOf(6), -1, "should not find 6");
            });
        }
    }
}
