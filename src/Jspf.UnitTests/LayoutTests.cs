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
                Control c = new Control();
            });

            QUnit.test("Control.GetParent() succeeds and is null", delegate
            {
                Control c = new Control();
                QUnit.ok(c.GetParent() == null, "should be null");
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

                Control c = new Control();
                c.Horizontal.Length = 20;
                c.Vertical.Length = 20;
                c.Horizontal.Alignment = AxisAlignment.Near;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 20);
                QUnit.equals(c.MeasuredSize.Height, 20);
                QUnit.equals(c.VerticalArrangement.Length, 20);
                QUnit.equals(c.HorizontalArrangement.Length, 20);
                QUnit.equals(c.VerticalArrangement.Position, 0);
                QUnit.equals(c.HorizontalArrangement.Position, 0);
            });

            QUnit.test("Region.layOut clips width", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 30;
                c.Vertical.Length = 10;
                c.Horizontal.Alignment = AxisAlignment.Near;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 30);
                QUnit.equals(c.HorizontalArrangement.Length, 20);
            });

            QUnit.test("Region.layOut does not clip minWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 30;
                c.Horizontal.MinLength = 25;
                c.Vertical.Length = 10;
                c.Horizontal.Alignment = AxisAlignment.Near;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 30);
                QUnit.equals(c.HorizontalArrangement.Length, 25);
            });

            QUnit.test("Region.layOut stretches width", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 10;
                c.Vertical.Length = 10;
                c.Horizontal.Alignment = AxisAlignment.Stretch;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 10);
                QUnit.equals(c.HorizontalArrangement.Length, 20);
            });

            QUnit.test("Region.layOut stretches width, respects maxWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 10;
                c.Horizontal.MaxLength = 15;
                c.Vertical.Length = 10;
                c.Horizontal.Alignment = AxisAlignment.Stretch;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Width, 10);
                QUnit.equals(c.HorizontalArrangement.Length, 15);
            });

            QUnit.test("Region.layOut clips height", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 10;
                c.Vertical.Length = 30;
                c.Horizontal.Alignment = AxisAlignment.Near;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 30);
                QUnit.equals(c.VerticalArrangement.Length, 20);
            });

            QUnit.test("Region.layOut does not clip minMinHeight", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Vertical.Length = 30;
                c.Vertical.MinLength = 25;
                c.Horizontal.Length = 10;
                c.Horizontal.Alignment = AxisAlignment.Near;
                c.Vertical.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 30);
                QUnit.equals(c.VerticalArrangement.Length, 25);
            });

            QUnit.test("Region.layOut stretches height", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Horizontal.Length = 10;
                c.Vertical.Length = 10;
                c.Vertical.Alignment = AxisAlignment.Stretch;
                c.Horizontal.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 10);
                QUnit.equals(c.VerticalArrangement.Length, 20);
            });

            QUnit.test("Region.layOut stretches width, respects maxWidth", delegate
            {
                jQueryObject host = jQuery.FromHtml("<div style='width: 20px; height: 20px'>");
                jQuery.FromHtml("#qunit-fixture").Append(host);

                Region r = new Region();
                r.Host = host[0];

                Control c = new Control();
                c.Vertical.Length = 10;
                c.Vertical.MaxLength = 15;
                c.Horizontal.Length = 10;
                c.Vertical.Alignment = AxisAlignment.Stretch;
                c.Horizontal.Alignment = AxisAlignment.Near;

                r.Child = c;

                r.LayOut();

                QUnit.equals(c.MeasuredSize.Height, 10);
                QUnit.equals(c.VerticalArrangement.Length, 15);
            });
        }
    }
}
