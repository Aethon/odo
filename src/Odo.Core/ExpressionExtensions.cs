using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Odo.Core
{
    public static class ExpressionExtensions
    {
        // compose two expressions: A(TContext) => TResult, B(TResult) => TNewResult
        //  to return N(TContext) => TNewResult.
        public static Expression<Func<TContext, TNewResult>> Compose<TContext, TResult, TNewResult>(this Expression<Func<TContext, TResult>> @this,
            Expression<Func<TResult,TNewResult>> childExpression)
        {
            Check.NotNull(@this);
            Check.NotNull(childExpression);
            return Expression.Lambda<Func<TContext, TNewResult>>(new ComposeVisitor(childExpression.Parameters[0], @this.Body).Visit(childExpression.Body), @this.Parameters);
        }

        // apply an argument to a curried expression: A(B(TIn) => TMid) => (C(TIn) => TOut)
        //  to return N(TIn) => TOut
        public static Expression<Func<TIn, TOut>> Apply<TMid, TIn, TOut>(this Expression<Func<Func<TMid, TOut>, Func<TIn, TOut>>> @this,
            Expression<Func<TMid, TOut>> argument)
        {
            Check.NotNull(@this);
            Check.NotNull(argument);
            return (Expression<Func<TIn, TOut>>)new ComposeVisitor(@this.Parameters[0], argument).Visit(@this.Body);
        }

        private class ComposeVisitor : ExpressionVisitor
        {
            private readonly Expression _replacement;
            private readonly ParameterExpression _parameter;

            public ComposeVisitor(ParameterExpression parameter, Expression replacement)
            {
                _replacement = Check.NotNull(replacement);
                _parameter = Check.NotNull(parameter);
            }

            protected override Expression VisitParameter(ParameterExpression node)
            {
                if (node == _parameter)
                    return _replacement;
                return node;
            }
        }
    }
}
