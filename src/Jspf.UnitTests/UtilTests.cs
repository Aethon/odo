using System;
using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Html;
using System.Testing;
using jQueryApi;
using QUnit4SS;

namespace Jspf.UnitTests
{
    public static class UtilTests
    {
        static int CompareNumber(object left, object right)
        {
            return (int)left - (int)right;
        }

        private readonly static int[] TestSortedArray = {1, 2, 3, 4, 5};
        private readonly static int[] TestUnsortedArray = { 5, 2, 1, 4, 3, 0 };

        static UtilTests()
        {
            QUnit.module("Util tests");

            QUnit.test("BinarySearch and BinarySearchForInsert succeeds", delegate
            {
                for (int len = 1; len < 9; len++)
                {
                    ArrayList subjectAsList = new ArrayList();
                    for (int i = 0; i < len; i++)
                    {
                        subjectAsList.Add(i*2);
                    }
                    Array subject = (Array) (object) subjectAsList;

                    for (int i = 0; i < len; i++)
                    {
                        QUnit.equals(Util.BinarySearch(subject, i * 2 - 1, CompareNumber), -1, "With " + len + " even numbers, should not find " + (i * 2 - 1));
                        QUnit.equals(Util.BinarySearch(subject, i * 2 + 1, CompareNumber), -1, "With " + len + " even numbers, should not find " + (i * 2 + 1));
                        QUnit.equals(Util.BinarySearch(subject, i * 2, CompareNumber), i, "With " + len + " even numbers, should find " + (i * 2) + " at " + i);

                        QUnit.equals(Util.BinarySearchForInsert(subject, i * 2 - 1, CompareNumber), i, "With " + len + " even numbers, should suggest index " + i + " for " + (i * 2 - 1));
                        QUnit.equals(Util.BinarySearchForInsert(subject, i * 2 + 1, CompareNumber), i + 1, "With " + len + " even numbers, should suggest index " + (i + 1) + " for " + (i * 2 + 1));
                        QUnit.equals(Util.BinarySearchForInsert(subject, i * 2, CompareNumber), i, "With " + len + " even numbers, should suggest index " + i + " for " + (i * 2));
                    }
                }
            });
        }
    }
}
