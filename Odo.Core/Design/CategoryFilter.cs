using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Design
{
    public class CategoryFilter : DesignComponent
    {
        public DesignTemplate DisplayTemplate { get; protected set; }
        public Expression GetItemCategories { get; protected set;}
        public Expression GetCategoryKey { get; protected set;}
        public Expression CompareCategories { get; protected set; }
        public Binding Categories { get; internal set; }
        public Binding Category { get; internal set; }

        internal CategoryFilter(Binding context,
                                string name,
                                Binding<string> style,
                                Binding categories,
                                Binding category,
                                Expression getItemCategories,
            Expression getCategoryKey,
            Expression compareCategories)
            : base(context, name, style)
        {
            GetItemCategories = getItemCategories;
            GetCategoryKey = getCategoryKey;
            CompareCategories = compareCategories;
            Categories = categories;
            Category = category;
        }

        protected override void GetEffectiveLinks(List<object> links)
        {
            base.GetEffectiveLinks(links);

            if (GetItemCategories != null)
                links.Add(GetItemCategories);
            if (GetCategoryKey != null)
                links.Add(GetCategoryKey);
            if (CompareCategories != null)
                links.Add(CompareCategories);
            if (Categories != null)
                links.Add(Categories);
            if (Category != null)
                links.Add(Category);
        }
    }
}