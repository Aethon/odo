using System;
using System.Linq.Expressions;
using Odo.Core.Conversation;

namespace Odo.Core.Design
{
    public static class SelectorExtensions
    {
        public static Designer<TParentContext> Selector<TParentContext, T, TCat>(this Designer<TParentContext> @this,
                                                                           Expression<Func<TParentContext, Select<T, TCat>>> context,
                                                                           Func<SelectorBuilder<TParentContext, T, TCat>, Selector<T, TCat>> build)
        {
            var contextBinding = Binding.Create(context);
            return new Designer<TParentContext>(@this.Components, build(new SelectorBuilder<TParentContext, T, TCat>(contextBinding)));
        }
    }
}