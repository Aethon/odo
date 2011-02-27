using System;
using System.Linq.Expressions;

namespace Odo.Core.Semantics
{
    public static class ProjectExtensions
    {
        public static TSview Project<TSview, TSource, TData, T>(this TSview @this, Expression<Func<TSview, Project<TSource, TData, T>>> member,
                                                         Func<ProjectBuilder<TSview, TSource, TData, T>, ProjectBuilder<TSview, TSource, TData, T>> builder)
        {
            Project<TSource, TData, T> project = builder(new ProjectBuilder<TSview, TSource, TData, T>());

            // use the member binding to initialize the select
            if (member.Body.NodeType == ExpressionType.MemberAccess)
            {
                var param = Expression.Parameter(typeof(Project<TSource, TData, T>));
                var x = Expression.Lambda<Action<TSview, Project<TSource, TData, T>>>(Expression.Assign(member.Body, param), member.Parameters[0], param);
                var cx = x.Compile();
                cx(@this, project);
            }

            return @this;
        }
    }
}