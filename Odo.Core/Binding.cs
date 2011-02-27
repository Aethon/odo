using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Odo.Core
{
    [Flags]
    public enum BindingOptions
    {
        None = 0,
        Unbound = 0x01
    }

    public abstract class Binding
    {
        public abstract LambdaExpression BindingLambda { get; }
        public abstract object GetUntypedValue(object context);
        public BindingOptions BindingOptions { get; private set; }
        public abstract Type Type { get; }

        protected Binding(BindingOptions options)
        {
            BindingOptions = options;
        }

        public static Binding<TResult> Create<TContext, TResult>(Expression<Func<TContext, TResult>> expression)
        {
            return new ContextualBinding<TContext, TResult>(expression);
        }

        public override string ToString()
        {
            return "Binding: " + BindingLambda;
        }
    }

    public abstract class Binding<TResult> : Binding
    {
        public TResult GetValue(object context)
        {
            return (TResult)GetUntypedValue(context);
        }

        public override Type Type
        {
            get { return typeof (TResult); }
        }

        protected Binding(BindingOptions options) : base(options)
        {
        }

        public abstract Binding<TNewResult> Compose<TNewResult>(Expression<Func<TResult, TNewResult>> childExpression);
    }
}
