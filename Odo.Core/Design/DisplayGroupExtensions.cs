using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Design
{
    public static class DisplayGroupExtensions
    {
        public static Designer<TParentContext> Group<TParentContext, TContext>(this Designer<TParentContext> @this,
                                                                               Expression<Func<TParentContext, TContext>> context,
                                                                               string name = null,
                                                                               Expression<Func<TContext, string>> style = null,
                                                                               Func<Designer<TContext>, Designer<TContext>> members = null)
        {
            var contextBinding = Binding.Create(context);
            var styleBinding = (style == null) ? Binding.Create((TContext x) => string.Empty) : contextBinding.Compose(style);
            var designer = Designer<TContext>.Empty;
            if (members != null)
                designer = members(designer);

            return new Designer<TParentContext>(@this.Components,
                                                new DisplayGroup(contextBinding, name, styleBinding, designer.Components));
        }
    }
}