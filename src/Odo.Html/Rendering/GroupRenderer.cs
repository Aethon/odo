using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using Odo.Core;
using Odo.Core.Design;

namespace Odo.Html.Rendering
{
    internal class GroupRenderData
    {
        public DisplayGroup Group;
        public HtmlRenderContext RenderContext;
        public string StyleScript;
    }

    internal class GroupRenderer
    {
        public string RenderTemplate(DisplayGroup subject, HtmlRenderContext context)
        {
           // var self = context.Serializer.PortAsExpression(subject.Context.BindingLambda, "svm");

            var data = new GroupRenderData
            {
                Group = subject,
                StyleScript = (subject.Style == null) ? "null" : context.Serializer.RenderInstance(subject.Style),
                RenderContext = context
            };

            var tt = new GroupTemplate
            {
                Session = new Dictionary<string, object> { { "Data", data } }
            };
            tt.Initialize();
            return tt.TransformText();
        }
    }
}
