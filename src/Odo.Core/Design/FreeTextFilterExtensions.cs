using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Odo.Core.Semantics;

namespace Odo.Core.Design
{
    //public static class FreeTextFilterExtensions
    //{
    //    public static Designer<TParentContext> FreeTextFilter<TParentContext, T>(this Designer<TParentContext> @this,
    //                                                                             Expression<Func<TParentContext, TParentContext>> context,
    //                                                                             Expression<Func<T, string, IEnumerable<T>>> filterExpression,
    //                                                                             string name = null,
    //                                                                             Expression<Func<TParentContext, string>> style = null)
    //    {
    //        var contextBinding = Binding.Create(context);
    //        var styleBinding = (style == null) ? Binding.Create((Select<T> x) => (string)new Style[0]) : contextBinding.Compose(style);
    //        return new Designer<TParentContext>(@this.Components, new FreeTextFilter(contextBinding, name, styleBinding, filterExpression));
    //    }
    //}
}