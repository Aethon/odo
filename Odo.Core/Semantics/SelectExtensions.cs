using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Semantics
{
    public static class SelectExtensions
    {
        public static TSview Select<TSview, T, TCat>(this TSview @this, Expression<Func<TSview, Select<T, TCat>>> member,
                                               Expression<Func<TSview, IEnumerable<T>>> from = null,
                                               Expression<Func<TSview, IEnumerable<T>>> current = null,
                                               Expression<Func<TSview, IEnumerable<TCat>>> categories = null,
                                               Expression<Func<TSview, IEnumerable<TCat>>> activeCategory = null,
                                                string captureId = null,
                                                Expression<Func<T, string>> captureKey= null
            )
        {
            var select = new Select<T, TCat>();

            // use the member binding to initialize the select
            if (member.Body.NodeType == ExpressionType.MemberAccess)
            {
                var param = Expression.Parameter(typeof(Select<T, TCat>));
                var x = Expression.Lambda<Action<TSview, Select<T, TCat>>>(Expression.Assign(member.Body, param), member.Parameters[0], param);
                var cx = x.Compile();
                cx(@this, select);
            }

            if (from != null)
                select.From = Binding.Create(from);
            select.Current = Binding.Create(current ?? ((TSview s) => new T[0]));
            if (activeCategory != null)
                select.ActiveCategory = Binding.Create(activeCategory);
            if (categories != null)
                select.Categories = Binding.Create(categories);

            select.CaptureId = captureId;
            select.CaptureKey = captureKey;

            return @this;
        }
    }
}