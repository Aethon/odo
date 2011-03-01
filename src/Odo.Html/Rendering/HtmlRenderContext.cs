using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.IO;
using System.Linq;
using System.Text;
using Odo.Core;
using Odo.Core.Design;

namespace Odo.Html.Rendering
{
    internal class HtmlRenderContext
    {
        private const string SemanticsName = "semantics";

        public KoSerializer Serializer { get; set; }

        public AppRegion Region { get; private set; }
        public string SemanticsVarName { get { return SemanticsName; } }

        private readonly Dictionary<DesignComponent, string> _componentIds = new Dictionary<DesignComponent, string>();
        private int _nextComponentId = 1;

        public HtmlRenderContext(AppRegion region)
        {
            Contract.Assert(region != null);
            Region = region;
        }

        public string GetComponentId(DesignComponent component)
        {
            string id;
            if (!_componentIds.TryGetValue(component, out id))
            {
                if (component.Name != null)
                    id = null;
                else
                    id = string.Format("comp_{0}", _nextComponentId++);

                _componentIds[component] = id;
            }
            return id;
        }

        public string RenderTemplate(DesignComponent component)
        {
            // TODO: better way of dispatching the render
            if (component is Selector)
            {
                return new SelectorRenderer().RenderTemplate(component as Selector, this);
            }
            if (component is DisplayGroup)
            {
                return new GroupRenderer().RenderTemplate(component as DisplayGroup, this);
            }
            if (component is Text)
            {
                return new TextRenderer().RenderTemplate(component as Text, this);
            }
            if (component is ExternalRequirements)
            {
                return new ExternalRequirementsRenderer().RenderTemplate(component as ExternalRequirements, this);
            }
            return RenderUnknownComponentTemplate(component);
        }

        private static string RenderUnknownComponentTemplate(DesignComponent component)
        {
            return string.Format("function(svm) {{ return $(\"<div style='border: 1px solid black'>(unrenderable {0})</div>\"); }}", component.GetType().Name);
        }
    }
}
