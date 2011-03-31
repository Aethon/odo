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
                UiElement c = new UiElement();
                QUnit.equals(Region.GetRegion(c), null, "should return null");
            });

            QUnit.test("Region.GetRegion succeeds with parented control", delegate
            {
                Region r = new Region();
                UiElement c = new UiElement();
                r.Child = c;

                QUnit.ok(Region.GetRegion(c) == r, "should return the region");
            });

            QUnit.test("Region.GetRegion succeeds with parented control chain", delegate
            {
                Region r = new Region();
                Decorator d = new Decorator();
                UiElement c = new UiElement();
                d.Child = c;
                r.Child = d;

                QUnit.ok(Region.GetRegion(c) == r, "should return the region");
            });
        }
    }
}
