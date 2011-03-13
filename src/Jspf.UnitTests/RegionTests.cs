using System;
using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Html;
using System.Testing;
using jQueryApi;
using QUnit4SS;

namespace Jspf.UnitTests
{
    public static class RegionTests
    {
        static RegionTests()
        {
            QUnit.module("Region tests");

            QUnit.test("Region.GetRegion succeeds with null", delegate
            {
                QUnit.equals(Region.GetRegion(null), null, "should return null");
            });

            QUnit.test("Region.GetRegion succeeds with unparented control", delegate
            {
                Control c = new Control();
                QUnit.equals(Region.GetRegion(c), null, "should return null");
            });

            QUnit.test("Region.GetRegion succeeds with parented control", delegate
            {
                Region r = new Region();
                Control c = new Control();
                r.Child = c;

                QUnit.ok(Region.GetRegion(c) == r, "should return the region");
            });

            QUnit.test("Region.GetRegion succeeds with parented control chain", delegate
            {
                Region r = new Region();
                Decorator d = new Decorator();
                Control c = new Control();
                d.Child = c;
                r.Child = d;

                QUnit.ok(Region.GetRegion(c) == r, "should return the region");
            });
        }
    }
}
