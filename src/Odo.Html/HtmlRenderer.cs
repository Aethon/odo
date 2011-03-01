using System.Collections.Generic;
using System.IO;
using Odo.Core;
using Odo.Core.Rendering;
using Odo.Html.Rendering;

namespace Odo.Html
{
    internal class HtmlRenderData
    {
        public HtmlRenderContext RenderContext;
        public string SemanticsScript;
        public string TemplateScript;
    }

    public sealed class HtmlRenderer
    {
        public string Place(AppRegion region)
        {
            var rctx = new HtmlRenderContext(region);
            var tt = new PlaceRegionTemplate { Session = new Dictionary<string, object> {{"Context", rctx}} };
            tt.Initialize();
            return tt.TransformText();
        }

        public string Render(AppRegion region)
        {
            var rctx = new HtmlRenderContext(region);

            var data = new HtmlRenderData
                            {
                                RenderContext = rctx,
                                SemanticsScript = new SemanticsRenderer().Render(rctx),
                                TemplateScript = rctx.RenderTemplate(rctx.Region.Template.Tree)
                            };

            var tt = new RenderRegionTemplate { Session = new Dictionary<string, object> {{"Data", data }} };
            tt.Initialize();
            return tt.TransformText();
        }
    }
}
