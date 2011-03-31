using System;
using System.Collections;
using System.Diagnostics.CodeAnalysis;
using System.Html;
using System.Testing;
using jQueryApi;
using QUnit4SS;

namespace Jspf.UnitTests
{
    public static class LayoutTests
    {
        static LayoutTests()
        {
            QUnit.module("Control tests");

            QUnit.test("create Control succeeds", delegate 
            {
                UiElement c = new UiElement();
            });

            QUnit.test("Control.GetParent() succeeds and is null", delegate
            {
                UiElement c = new UiElement();
                QUnit.ok(c.Parent == null, "should be null");
            });

            QUnit.module("Region layout tests");

            QUnit.test("Region.layOut succeeds with no root", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];
                
                r.LayOut();
            });

            QUnit.test("Region.layOut succeeds with exact space available", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 20;
                c.YAxis.Length = 20;
                c.XAxis.Alignment = AxisAlignment.Near;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 20);
                QUnit.equals(c.MeasuredSize.Height, 20);
                QUnit.equals(c.YArrangement.Length, 20);
                QUnit.equals(c.XArrangement.Length, 20);
                QUnit.equals(c.YArrangement.Position, 0);
                QUnit.equals(c.XArrangement.Position, 0);
            });

            QUnit.test("Region.layOut clips width", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 30;
                c.YAxis.Length = 10;
                c.XAxis.Alignment = AxisAlignment.Near;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 30);
                QUnit.equals(c.XArrangement.Length, 20);
            });

            QUnit.test("Region.layOut does not clip minWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 30;
                c.XAxis.MinLength = 25;
                c.YAxis.Length = 10;
                c.XAxis.Alignment = AxisAlignment.Near;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 30);
                QUnit.equals(c.XArrangement.Length, 25);
            });

            QUnit.test("Region.layOut stretches width", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 10;
                c.YAxis.Length = 10;
                c.XAxis.Alignment = AxisAlignment.Stretch;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 10);
                QUnit.equals(c.XArrangement.Length, 20);
            });

            QUnit.test("Region.layOut stretches width, respects maxWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 10;
                c.XAxis.MaxLength = 15;
                c.YAxis.Length = 10;
                c.XAxis.Alignment = AxisAlignment.Stretch;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 10);
                QUnit.equals(c.XArrangement.Length, 15);
            });

            QUnit.test("Region.layOut clips height", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 10;
                c.YAxis.Length = 30;
                c.XAxis.Alignment = AxisAlignment.Near;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 30);
                QUnit.equals(c.YArrangement.Length, 20);
            });

            QUnit.test("Region.layOut does not clip minMinHeight", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.YAxis.Length = 30;
                c.YAxis.MinLength = 25;
                c.XAxis.Length = 10;
                c.XAxis.Alignment = AxisAlignment.Near;
                c.YAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 30);
                QUnit.equals(c.YArrangement.Length, 25);
            });

            QUnit.test("Region.layOut stretches height", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.XAxis.Length = 10;
                c.YAxis.Length = 10;
                c.YAxis.Alignment = AxisAlignment.Stretch;
                c.XAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 10);
                QUnit.equals(c.YArrangement.Length, 20);
            });

            QUnit.test("Region.layOut stretches width, respects maxWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                UiElement c = new UiElement();
                c.YAxis.Length = 10;
                c.YAxis.MaxLength = 15;
                c.XAxis.Length = 10;
                c.YAxis.Alignment = AxisAlignment.Stretch;
                c.XAxis.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 10);
                QUnit.equals(c.YArrangement.Length, 15);
            });
        }
    }
}
