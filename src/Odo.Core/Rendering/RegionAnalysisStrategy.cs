using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using Odo.Core.Semantics;

namespace Odo.Core.Rendering
{
    public delegate ExpressionAction ResolveMethodCall(MethodCallExpression expression, IRequirementsBuilder requirementsBuilder, out Expression replacement);

    public enum InstanceType
    {
        None,
        Object,
        Value,
        Collection,
        Link
    }

    public enum ExpressionAction
    {
        None,
        Retain,
        Replace,
        Fail
    }

    public class RegionAnalysisStrategy : IRegionAnalysisStrategy
    {
        public const int MaxValueStringLength = 10;

        private readonly List<ResolveMethodCall> _methodCallResolvers = new List<ResolveMethodCall>(StandardResolvers.GetMethodCallResolvers());

        #region GetReferencedParameters helper

        private class FindParametersVisitor : ExpressionVisitor
        {
            private readonly HashSet<ParameterExpression> _parameters = new HashSet<ParameterExpression>();
            public IEnumerable<ParameterExpression> Parameters { get { return _parameters; } }

            private readonly HashSet<ParameterExpression> _excludedParameters = new HashSet<ParameterExpression>();

            protected override Expression VisitParameter(ParameterExpression node)
            {
                if (!_excludedParameters.Contains(node))
                    _parameters.Add(node);
                return base.VisitParameter(node);
            }

            protected override Expression VisitLambda<T>(Expression<T> node)
            {
                foreach (var p in node.Parameters)
                    _excludedParameters.Add(p);
                return base.VisitLambda(node);
            }
        }

        public static IEnumerable<ParameterExpression> GetReferencedParameters(Expression expression)
        {
            var v = new FindParametersVisitor();
            if (expression is LambdaExpression)
                v.Visit(((LambdaExpression) expression).Body);
            else
                v.Visit(expression);
            return v.Parameters;
        }

        #endregion

        public virtual InstanceType ClassifyInstance(object instance, out IEnumerable<object> elements)
        {
            elements = null;
            if (instance == null)
            {
                return InstanceType.None;
            }
            if (instance is string)
            {
                var s = (string) instance;
                return (s.Length > MaxValueStringLength) ? InstanceType.Object : InstanceType.Value;
            }
            if (instance is bool
                || instance is byte
                || instance is sbyte
                || instance is short
                || instance is ushort
                || instance is int
                || instance is uint
                || instance is long
                || instance is ulong
                || instance is float
                || instance is double
                || instance is decimal)
            {
                return InstanceType.Value;
            }
            if (instance is Expression || instance is Binding)
            {
                return InstanceType.Link;
            }
            if (instance is IEnumerable)
            {
                elements = ((IEnumerable) instance).OfType<object>();
                return InstanceType.Collection;
            }
            return InstanceType.Object;
        }

        public virtual ExpressionAction ResolveStaticMember(MemberExpression expression, out Expression replacement)
        {
            replacement = Expression.Constant(expression.Member.GetValue(null, null));
            return ExpressionAction.Replace;
        }

        public virtual ExpressionAction ResolveMethodCall(MethodCallExpression expression, IRequirementsBuilder requirementsBuilder, out Expression replacement)
        {
            replacement = null;

            foreach (var r in _methodCallResolvers)
            {
                var action = r(expression, requirementsBuilder, out replacement);
                if (action != ExpressionAction.None)
                    return action;
            }

            // if any parameters are referenced, fail the expression (cannot port, cannot invoke)
            if (GetReferencedParameters(expression).Count() > 0)
                return ExpressionAction.Fail;

            // invoke and store as constant
            replacement = Expression.Constant(Expression.Lambda(expression).Compile().DynamicInvoke());
            return ExpressionAction.Replace;
        }


        public ExpressionAction ResolveConversion(UnaryExpression expression, out Expression replacement)
        {
            replacement = null;
            return ExpressionAction.Retain;
        }

        public ExpressionAction ResolveNewArray(NewArrayExpression expression, out Expression replacement)
        {
            replacement = null;

            // if any parameters are referenced, fail the expression (cannot port, cannot invoke)
            if (GetReferencedParameters(expression).Count() > 0)
                return ExpressionAction.Fail;

            // invoke and store as constant
            replacement = Expression.Constant(Expression.Lambda(expression).Compile().DynamicInvoke());
            return ExpressionAction.Replace;
        }
    }
}
