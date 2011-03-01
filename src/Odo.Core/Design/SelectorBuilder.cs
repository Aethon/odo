using System;
using System.Linq;
using System.Linq.Expressions;
using Odo.Core.Semantics;

namespace Odo.Core.Design
{
    public class SelectorBuilder<TParentContext, T, TCat> : DesignComponentBuilder<Select<T, TCat>, SelectorBuilder<TParentContext, T, TCat>>
    {
        protected DesignTemplate CurrentAvailableTemplate;
        protected DesignTemplate CurrentSelectedTemplate;
        protected Expression<Func<T, T, int>> CurrentComparison;
        protected Expression<Func<T, string>> CurrentSymbol;
        protected Expression<Func<T, string>> CurrentTip;
        protected SelectorMode CurrentMode;
        protected DesignComponent CurrentFilter;

        public SelectorBuilder(Binding<Select<T, TCat>> contextBinding)
        {
            ContextBinding = contextBinding;
        }

        public SelectorBuilder<TParentContext, T, TCat> AvailableItemTemplate(DesignTemplate availableTemplate)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentAvailableTemplate = availableTemplate };
        }

        public SelectorBuilder<TParentContext, T, TCat> SelectedItemTemplate(DesignTemplate selectedTemplate)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentSelectedTemplate = selectedTemplate };
        }

        public SelectorBuilder<TParentContext, T, TCat> Comparison(Expression<Func<T, T, int>> comparison)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentComparison = comparison };
        }

        public SelectorBuilder<TParentContext, T, TCat> Symbol(Expression<Func<T, string>> symbol)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentSymbol = symbol };
        }

        public SelectorBuilder<TParentContext, T, TCat> Tip(Expression<Func<T, string>> tip)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentTip = tip };
        }

        public SelectorBuilder<TParentContext, T, TCat> Mode(SelectorMode mode)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this) { CurrentMode = mode };
        }

        public SelectorBuilder<TParentContext, T, TCat> WithFilter(Func<Designer<Select<T, TCat>>, Designer<Select<T, TCat>>> builder)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this)
                       {
                           CurrentFilter = builder(Designer<Select<T, TCat>>.Empty).Components.Single()
                       };
        }

        protected override SelectorBuilder<TParentContext, T, TCat> BuildNew(SelectorBuilder<TParentContext, T, TCat> existing)
        {
            return new SelectorBuilder<TParentContext, T, TCat>(this);
        }

        protected SelectorBuilder(SelectorBuilder<TParentContext, T, TCat> other)
        {
            ContextBinding = other.ContextBinding;
            CurrentName = other.CurrentName;
            CurrentStyle = other.CurrentStyle;
            CurrentAvailableTemplate = other.CurrentAvailableTemplate;
            CurrentSelectedTemplate = other.CurrentSelectedTemplate;
            CurrentComparison = other.CurrentComparison;
            CurrentSymbol = other.CurrentSymbol;
            CurrentTip = other.CurrentTip;
            CurrentMode = other.CurrentMode;
            CurrentFilter = other.CurrentFilter;
        }

        public static implicit operator Selector<T, TCat>(SelectorBuilder<TParentContext, T, TCat> source)
        {
            return new Selector<T, TCat>(source.ContextBinding,
                                   source.CurrentName,
                                   source.CurrentStyle,
                                   source.CurrentComparison,
                                   source.CurrentSymbol,
                                   source.CurrentTip,
                                   source.CurrentAvailableTemplate,
                                   source.CurrentSelectedTemplate,
                                   source.CurrentMode,
                                   source.CurrentFilter);
        }
    }
}