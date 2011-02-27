using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Odo.Core.Semantics;

namespace Odo.Core.Design
{
    public static class TextExtensions
    {
        public static Designer<TParentContext> Text<TParentContext, T>(this Designer<TParentContext> @this,
                                                                       Expression<Func<TParentContext, T>> context,
                                                                       string name = null,
                                                                       Expression<Func<T, string>> style = null,
                                                                       Expression<Func<T, string>> content = null)
        {
            var contextBinding = Binding.Create(context);
            var styleBinding = (style == null) ? Binding.Create((Semantic x) => string.Empty) : contextBinding.Compose(style);
            var contentBinding = Binding.Create(content ?? ((T t) => string.Empty));
            return new Designer<TParentContext>(@this.Components, new Text(contextBinding, name, styleBinding, contentBinding));
        }
    }
}