using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Design
{
    public abstract class DesignComponentBuilder<TSemantic, TBuilder>
        where TBuilder : DesignComponentBuilder<TSemantic, TBuilder>
    {
        protected Binding<TSemantic> ContextBinding;
        protected string CurrentName;
        protected Binding<string> CurrentStyle;

        public TBuilder Name(string name)
        {
            var newBuilder = BuildNew((TBuilder)this);
            newBuilder.CurrentName = name;

            return newBuilder;
        }

        public TBuilder Style(Expression<Func<TSemantic, string>> style)
        {
            var newBuilder = BuildNew((TBuilder)this);

            newBuilder.CurrentStyle = ContextBinding.Compose(style);
            return newBuilder;
        }

        protected abstract TBuilder BuildNew(TBuilder existing);
    }
}