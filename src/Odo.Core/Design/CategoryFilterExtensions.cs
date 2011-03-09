using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Odo.Core.Conversation;

namespace Odo.Core.Design
{
    public static class CategoryFilterExtensions
    {
        public static Designer<Select<T, TCat>> CategoryFilter<T, TCat>(this Designer<Select<T, TCat>> @this,
            Expression<Func<T, IEnumerable<TCat>>> getItemCategories,
            Expression<Func<TCat, string>> getCategoryKey,
            Expression<Func<TCat, TCat, int>> compareCategories,
            string name = null,
            Expression<Func<Select<T, TCat>, string>> style = null)
        {
            var contextBinding = Binding.Create<Select<T, TCat>, Select<T, TCat>>(p => p);
            var styleBinding = (style == null) ? Binding.Create((Select<T, TCat> x) => string.Empty) : contextBinding.Compose(style);
            var categoriesBinding = contextBinding.Compose(s => s.Categories.GetValue(s));
            var categoryBinding = contextBinding.Compose(s => s.ActiveCategory.GetValue(s));
            return new Designer<Select<T, TCat>>(@this.Components, new CategoryFilter(contextBinding, name, styleBinding, categoriesBinding, categoryBinding, getItemCategories,
                getCategoryKey, compareCategories));
        }
    }
}