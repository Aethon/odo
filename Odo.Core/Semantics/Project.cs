using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using Odo.Core.Design;

namespace Odo.Core.Semantics
{
    public abstract class Project : Semantic
    {
        public Binding From { get; protected set; }
        public Binding With { get; protected set; }
        public Expression Through { get; protected set; }
    }

    public class Project<TIn,TData,TOut> : Project
    {
//        private static readonly Expression<Func<Func<TSource, IEnumerable<T>>,
//                Func<IEnumerable<TSource>, IEnumerable<T>>>> SelectManyExpression = g => e => e.SelectMany(i => g(i));

        public new Binding<IEnumerable<TIn>> From { get { return (Binding<IEnumerable<TIn>>)base.From; } }
        public new Binding<IEnumerable<TData>> With { get { return (Binding<IEnumerable<TData>>)base.With; } }
        public new Expression<Func<TIn, TData, IEnumerable<TOut>>> Through { get { return (Expression<Func<TIn, TData, IEnumerable<TOut>>>)base.Through; } }

        public Binding<IEnumerable<TOut>> Current { get; private set; }

        internal Project(Binding<IEnumerable<TIn>> from, Expression<Func<TIn, TData, IEnumerable<TOut>>> through, Binding<IEnumerable<TData>> with)
        {
            base.From = from;
            base.Through = through;
            base.With = with;

            //         Current = from.Compose(SelectManyExpression.Apply(through));
        }
    }
    /*

    public abstract class Project : Semantic
    {
        public Binding From { get; protected set; }
        public Expression Through { get; protected set; }
        public Binding With { get; protected set; }
    }

    public class Project<TSource, TInput, TOutput> : Project
    {
        private static readonly Expression<Func<Func<TSource, IEnumerable<T>>,
                Func<IEnumerable<TSource>, IEnumerable<T>>>> SelectManyExpression = g => e => e.SelectMany(i => g(i));

        public new Binding<IEnumerable<TSource>> From { get { return (Binding<IEnumerable<TSource>>)base.From; } }
        public new Expression<Func<TSource, IEnumerable<T>>> Through { get { return (Expression<Func<TSource, IEnumerable<T>>>)base.Through; } }

        public Binding<IEnumerable<T>> Current { get; private set; }

        internal Project(Binding<IEnumerable<TSource>> from, Expression<Func<TSource, IEnumerable<T>>> through)
        {
            base.From = from;
            base.Through = through;
            Current = from.Compose(SelectManyExpression.Apply(through));
        }
    }
     */
}
