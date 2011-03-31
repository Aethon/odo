using System;
using System.Html;
using jQueryApi;

namespace Jspf
{
    public class Region : Decorator
    {
        public Element Host;

        public static Region GetRegion(UiElement descendant)
        {
            while (descendant != null && !(descendant is Region))
            {
                descendant = descendant.Parent;
            }
            return (Region)descendant;
        }

        // recursively lays out the region
        public void LayOut()
        {
            Size c;

            if (Host == null || Host.TagName != "DIV")
                throw new Exception("Host must be a div element");

            jQueryObject div = jQuery.FromElement(Host);
            div.CSS("padding", "0px");

            int width = div.GetInnerWidth();
            int height = div.GetInnerHeight();
            if (width == 0 && height == 0)
            {
                width = int.Parse(div.GetCSS("width"));
                height = int.Parse(div.GetCSS("height"));
            }
            c = new Size(width, height);

            if (Child != null) {
                Child.Measure(c);
                AxisArrangement xaxis = ArrangeAxis(Child.XAxis, Child.MeasuredSize.Width, c.Width);
                AxisArrangement yaxis = ArrangeAxis(Child.YAxis, Child.MeasuredSize.Height, c.Height);
                Child.Arrange(xaxis, yaxis, Host);
            }
        }

        public override void Measure(Size size)
        {
            // do not call base; this control does not measure itself, instead it uses the host's dimensions
            MeasuredSize = size.Clone();
        }

        public override void Arrange(AxisArrangement x, AxisArrangement y, Element hostElement)
        {
            // do nothing; this control has no physical representation.
        }
    }
}
