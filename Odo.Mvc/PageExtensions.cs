using System;
using System.Linq.Expressions;
using System.Web.Mvc;
using Odo.Core;
using Odo.Core.Design;

namespace Odo.Mvc
{
    public static class PageExtensions
    {
        public static string Discuss<TModel>(this ViewPage<TModel> @this, Func<Designer<TModel>, Designer<TModel>> tree, string name=null) where TModel : class
        {
            Check.NotNull(tree);

            return Discuss(@this, x => x, DesignTemplate<TModel>.Create(tree), name);
        }
        
        public static string Discuss<TModel>(this ViewPage<TModel> @this, DesignTemplate<TModel> template, string name = null) where TModel : class
        {
            return Discuss(@this, x => x, template, name);
        }

        public static string Discuss<TModel, T>(this ViewPage<TModel> @this, Expression<Func<TModel, T>> subject, Func<Designer<T>, Designer<T>> tree, string name=null)
            where TModel : class
            where T : class
        {
            Check.NotNull(tree);

            return Discuss(@this, subject, DesignTemplate<T>.Create(tree), name);
        }

        public static string Discuss<TModel, T>(this ViewPage<TModel> @this, Expression<Func<TModel,T>> subject, DesignTemplate<T> template, string name=null) where T : class
        {
            Check.NotNull(@this);
            Check.NotNull(template);
            Check.NotNull(subject);

            object agentObj;
            if (!@this.ViewData.TryGetValue(MvcExtensions.AgentViewDataKey, out agentObj))
            {
                throw new InvalidOperationException("The controller or action that calls this view must be marked as 'UsesOdo'.");
            }

            return MvcExtensions.Discuss((AppAgent)agentObj, @this.Model, subject, template, name);
        }

        public static string RenderAgent(this ViewPage @this)
        {
            Check.NotNull(@this);

            object agentObj;
            @this.ViewData.TryGetValue(MvcExtensions.AgentViewDataKey, out agentObj);
            return MvcExtensions.RenderAgent((AppAgent)agentObj);
        }

        public static string RenderAgent(this ViewMasterPage @this)
        {
            Check.NotNull(@this);

            object agentObj;
            @this.ViewData.TryGetValue(MvcExtensions.AgentViewDataKey, out agentObj);
            return MvcExtensions.RenderAgent((AppAgent) agentObj);
        }
    }
}
