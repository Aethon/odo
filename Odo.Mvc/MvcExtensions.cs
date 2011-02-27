using System;
using System.Linq;
using System.Linq.Expressions;
using Odo.Core;
using Odo.Core.Design;
using Odo.Html;

namespace Odo.Mvc
{
    public static class MvcExtensions
    {
        internal const string AgentViewDataKey = "OdoAgent";

        internal static string Discuss<TModel, T>(AppAgent agent, TModel model, Expression<Func<TModel, T>> subject, DesignTemplate<T> template, string name = null) where T : class
        {
            Check.NotNull(agent);
            Check.NotNull(template);

            var semantics = subject.Compile().Invoke(model);

            var region = AppRegion.Create(name ?? agent.GetRegionName(), semantics, template);

            agent.Regions.Add(region);

            // TODO: use context information to find a renderer for this);
            return new HtmlRenderer().Place(region);
        }

        // FUTURE: this implementation (or the Odo base) should aggregate all regions into a single render source => more efficient && functional
        internal static string RenderAgent(AppAgent agent)
        {
            return agent != null ? string.Join("\n", agent.Regions.Select(x => new HtmlRenderer().Render(x))) : string.Empty;
        }
    }
}