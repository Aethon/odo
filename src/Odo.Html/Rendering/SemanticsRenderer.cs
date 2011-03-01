using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using Odo.Core;
using Odo.Core.Rendering;

namespace Odo.Html.Rendering
{
    internal class SemanticsRenderer
    {
        public string Render(HtmlRenderContext ctx)
        {
            using (var swriter = new StringWriter())
            {
                ctx.Serializer = new KoSerializer(swriter);
                ctx.Serializer.Serialize(new RegionAnalyzer(new RegionAnalysisStrategy()).Analyze(ctx.Region), ctx.Region);
                return swriter.GetStringBuilder().ToString();
            }
        }
    }
}