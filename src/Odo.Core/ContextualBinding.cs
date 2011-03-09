using System;
using System.Linq.Expressions;
using iSynaptic.Commons;

namespace Odo.Core
{
    public class ContextualBinding<TContext, TResult> : Binding<TResult>
    {
        public override LambdaExpression BindingLambda { get { return _bindingLambda; } }
        private readonly Expression<Func<TContext, TResult>> _bindingLambda;

        private Func<TContext, TResult> _fn;

        internal ContextualBinding(Expression<Func<TContext, TResult>> bindingLambda, BindingOptions options = BindingOptions.None) : base(options)
        {
            _bindingLambda = Guard.NotNull(bindingLambda, "bindingLambda");
        }

        public override object GetUntypedValue(object context)
        {
            if (context is TContext)
                return GetValue((TContext)context);
            throw new ArgumentException(string.Format("A binding that required a '{0}' as its context was presented with '{1}' instead.", typeof(TContext).Name, context.GetType().Name));
        }

        public TResult GetValue(TContext context)
        {
            if (_fn == null)
                _fn = _bindingLambda.Compile();
            return _fn(context);
        }

        public override Binding<TNewResult> Compose<TNewResult>(Expression<Func<TResult, TNewResult>> childExpression)
        {
            return new ContextualBinding<TContext, TNewResult>(_bindingLambda.Compose(childExpression));
        }
    }
}