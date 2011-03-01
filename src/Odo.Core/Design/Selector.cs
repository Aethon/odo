using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using Odo.Core.Semantics;

namespace Odo.Core.Design
{
    public enum SelectorMode
    {
        Auto,
        Expert,
        Diva,
        ReverseDiva,
        FilteredReverseDiva,
        FilteredUniqueReverseDiva
    }

    public abstract class Selector : DesignComponent
    {
        public Expression ComparisonExpression { get; protected set; }
        public Expression AllItems { get; protected set; }
        public Expression SelectedItems { get; protected set; }
        public Expression Symbol { get; protected set; }
        public Expression Tip { get; protected set; }

        public string Label { get; private set; }

        public DesignTemplate SelectedTemplate { get; protected set; }
        public DesignTemplate AvailableTemplate { get; protected set; }

        public DesignComponent Filter { get; protected set; }

        public SelectorMode Mode { get; protected set; }

        protected Binding CaptureKeyBinding { get; set; }
        protected Selector(Binding context,
            string name,
            Binding<string> style,
            SelectorMode mode,
            DesignComponent filter)
            : base(context, name, style)
        {
            Mode = mode;
            Filter = filter;
            Label = "TEMP LABEL";
        }

        protected override void GetEffectiveLinks(List<object> links)
        {
            base.GetEffectiveLinks(links);

            if (ComparisonExpression != null)
                links.Add(ComparisonExpression);
            if (AllItems != null)
                links.Add(AllItems);
            if (SelectedItems != null)
                links.Add(SelectedItems);
            if (Symbol != null)
                links.Add(Symbol);
            if (Tip != null)
                links.Add(Tip);

            if (SelectedTemplate != null)
                links.AddRange(SelectedTemplate.Tree.GetEffectiveLinks());
            if (AvailableTemplate != null)
                links.AddRange(AvailableTemplate.Tree.GetEffectiveLinks());
            if (Filter != null)
            {
                links.AddRange(Filter.GetEffectiveLinks());
            }
            links.Add(CaptureKeyBinding);
        }
    }

    public class Selector<T, TCat> : Selector
    {
        public new Expression<Func<T, T, int>> ComparisonExpression { get { return (Expression<Func<T, T, int>>)base.ComparisonExpression; } }

        public Selector(Binding<Select<T, TCat>> context,
            string name,
            Binding<string> style,
            Expression<Func<T, T, int>> comparison,
            Expression<Func<T, string>> symbol,
            Expression<Func<T, string>> tip,
            DesignTemplate availableTemplate,
            DesignTemplate selectedTemplate,
            SelectorMode mode,
            DesignComponent filter)
            : base(context, name, style, mode, filter)
        {
            base.AvailableTemplate = Check.NotNull(availableTemplate);
            base.SelectedTemplate = selectedTemplate;
            base.ComparisonExpression = comparison;
            base.AllItems = context.Compose(s => s.From.GetValue(s)).BindingLambda;
            base.SelectedItems = context.Compose(s => s.Current.GetValue(s)).BindingLambda;
            base.Symbol = symbol;
            base.Tip = tip;

            CategoryFilter cf = Filter as CategoryFilter;
            if (cf != null)
            {
                if (cf.Categories != null)
                    cf.Categories = context.Compose((Expression<Func<Select<T, TCat>, IEnumerable<TCat>>>)cf.Categories.BindingLambda);
                if (cf.Category != null)
                    cf.Category = context.Compose((Expression<Func<Select<T, TCat>, IEnumerable<TCat>>>)cf.Category.BindingLambda);
            }

            base.CaptureKeyBinding = context.Compose(x => x.CaptureKey);
        }
    }
}
