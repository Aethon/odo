using System;
using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Html;
using System.Testing;
using jQueryApi;
using QUnit4SS;

namespace Jspf.UnitTests
{
    public static class DecoratorTests
    {
        static DecoratorTests()
        {
            QUnit.module("Decorator tests");

            QUnit.test("Set Decorator.Child succeeds with null", delegate
            {
                Decorator d = new Decorator();
                d.Child = null;
            });

            QUnit.test("Set Decorator.Child succeeds with Control", delegate
            {
                Decorator d = new Decorator();
                Control c = new Control();
                d.Child = c;

                QUnit.ok(d.Child == c, "child should be the control");
                QUnit.ok(c.GetParent() == d, "parent should be the decorator");
            });
        
            QUnit.test("Reset Decorator.Child clears child's parent", delegate
            {
                Decorator d = new Decorator();
                Control c = new Control();
                d.Child = c;

                d.Child = null;

                QUnit.ok(d.Child == null, "child should be null");
                QUnit.ok(c.GetParent() == null, "parent should be null");
            });
        }
    }
}
