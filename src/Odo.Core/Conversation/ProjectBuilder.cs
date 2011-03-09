using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Conversation
{
    public class ProjectBuilder<TSView, TSource, TData, T>
    {
        protected Binding<IEnumerable<TSource>> CurrentFrom;
        protected Expression<Func<TSource, TData, IEnumerable<T>>> CurrentThrough;
        protected Binding<IEnumerable<TData>> CurrentWith;

        internal ProjectBuilder()
        {}

        public ProjectBuilder<TSView, TSource, TData, T> From(Expression<Func<TSView, IEnumerable<TSource>>> from)
        {
            return new ProjectBuilder<TSView, TSource, TData, T>(this) { CurrentFrom = Binding.Create(from) };
        }

        public ProjectBuilder<TSView, TSource, TData, T> Through(Expression<Func<TSource, TData, IEnumerable<T>>> through)
        {
            return new ProjectBuilder<TSView, TSource, TData, T>(this) { CurrentThrough = through };
        }

        public ProjectBuilder<TSView, TSource, TData, T> With(Expression<Func<TSView, IEnumerable<TData>>> with)
        {
            return new ProjectBuilder<TSView, TSource, TData, T>(this) { CurrentWith = Binding.Create(with) };
        }
        
        internal ProjectBuilder(ProjectBuilder<TSView, TSource, TData, T> other)
        {
            CurrentFrom = other.CurrentFrom;
            CurrentThrough = other.CurrentThrough;
            CurrentWith = other.CurrentWith;
        }

        public static implicit operator Project<TSource, TData, T>(ProjectBuilder<TSView, TSource, TData, T> source)
        {
            return new Project<TSource, TData, T>(source.CurrentFrom, source.CurrentThrough, source.CurrentWith);
        }
    }
}