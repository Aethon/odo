using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using Odo.Core;

namespace Odo.Html.Rendering
{
    internal class PortExpressionVisitor : ExpressionVisitor
    {
        private readonly IDictionary<ParameterExpression, string> _replacements;

        private readonly List<RenderExpression> _renderers = new List<RenderExpression>(KoRenderers.GetMethodCallRenderers());

        private KoSerializer _serializer;

        public ExpressionPort PortedExpression { get; private set; }

        public PortExpressionVisitor(KoSerializer serializer, IDictionary<ParameterExpression, string> replacements = null)
        {
            _serializer = Check.NotNull(serializer);
            _replacements = replacements;
        }

        public RenderAction Render(Expression expression, RenderExpression render, out string renderedExpression)
        {
            Visit(expression);
            var pe = PopPortedExpression();
            renderedExpression = pe.PortedText;
            return pe.Action;
        }
            
        private ExpressionPort PopPortedExpression()
        {
            var result = PortedExpression;
            PortedExpression = ExpressionPort.None;
            return result;
        }

        private bool Failed { get { return PortedExpression.Action == RenderAction.Fail; } }

        private void Fail()
        {
            PortedExpression = ExpressionPort.Failed;
        }
            
        protected override Expression VisitConstant(ConstantExpression node)
        {
            PortedExpression = new ExpressionPort(_serializer.RenderInstance(node.Value));
            return node;
        }

        protected override Expression VisitLambda<T>(Expression<T> node)
        {
            Visit(node.Body);
            if (Failed)
                return node;

            var bodyPort = PopPortedExpression();

            var @return = (node.ReturnType == typeof(void)) ? string.Empty : " return";

            PortedExpression = new ExpressionPort(string.Format("function({0}){{{1} {2}; }}",
                string.Join(", ", node.Parameters.Select(p => p.Name)),
                @return,
                bodyPort.PortedText));

            return node;
        }

        protected override Expression VisitBinary(BinaryExpression node)
        {
            Visit(node.Left);
            if (Failed)
                return node;
            var leftPort = PopPortedExpression();
                
            Visit(node.Right);
            if (Failed)
                return node;
            var rightPort = PopPortedExpression();

            var template = "({0} {2} {1})";
            string op = null;
            switch (node.NodeType)
            {
                case ExpressionType.Add:
                case ExpressionType.AddChecked:
                    op = "+";
                    break;
                case ExpressionType.And:
                    op = "&";
                    break;
                case ExpressionType.AndAlso:
                    op = "&&";
                    break;
                case ExpressionType.ArrayIndex:
                    template = "{0}[{1}]";
                    break;
                case ExpressionType.Coalesce:
                    op = "||"; // the js || operator acts as a coalesence operator, w00t!
                    break;
                case ExpressionType.Divide:
                    op = "/";
                    break;
                case ExpressionType.Equal:
                    op = "==";
                    break;
                case ExpressionType.ExclusiveOr:
                    op = "^";
                    break;
                case ExpressionType.GreaterThan:
                    op = ">";
                    break;
                case ExpressionType.GreaterThanOrEqual:
                    op = ">=";
                    break;
                case ExpressionType.LeftShift:
                    op = "<<";
                    break;
                case ExpressionType.LessThan:
                    op = "<";
                    break;
                case ExpressionType.LessThanOrEqual:
                    op = "<=";
                    break;
                case ExpressionType.Modulo:
                    op = "%";
                    break;
                case ExpressionType.Multiply:
                case ExpressionType.MultiplyChecked:
                    op = "*";
                    break;
                case ExpressionType.NotEqual:
                    op = "!=";
                    break;
                case ExpressionType.Or:
                    op = "|";
                    break;
                case ExpressionType.OrElse:
                    op = "||";
                    break;
                case ExpressionType.Power:
                    template = "pow({0},{1})";
                    break;
                case ExpressionType.RightShift:
                    op = ">>"; // csharp defines right shift as sign-extended => replicate that in js
                    break;
                case ExpressionType.Subtract:
                case ExpressionType.SubtractChecked:
                    op = "-";
                    break;
            }

            PortedExpression = new ExpressionPort(string.Format(template,
                leftPort.PortedText,
                rightPort.PortedText,
                op));

            return node;
        }

        protected override Expression VisitConditional(ConditionalExpression node)
        {
            Visit(node.Test);
            if (Failed)
                return node;
            var testPort = PopPortedExpression();

            Visit(node.IfTrue);
            if (Failed)
                return node;
            var truePort = PopPortedExpression();

            Visit(node.IfFalse);
            if (Failed)
                return node;
            var falsePort = PopPortedExpression();

            PortedExpression = new ExpressionPort(string.Format("({0} ? {1} : {2})",
                testPort.PortedText,
                truePort.PortedText,
                falsePort.PortedText));

            return node;
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            var text = node.Name;
            if (_replacements != null)
            {
                if (!_replacements.TryGetValue(node, out text))
                    throw new ArgumentException(string.Format("No replacement was specified for Parameter '{0}'.", node.Name));
            }

            PortedExpression = new ExpressionPort(text);
            return node;
        }

        protected override Expression VisitMethodCall(MethodCallExpression node)
        {
            foreach (var r in _renderers)
            {
                string text;
                var action = r(node, Render, out text);
                if (action != RenderAction.None)
                {
                    PortedExpression = new ExpressionPort(text, action);
                    return node;
                }
            }

            Fail();
            return node;
        }

        protected override Expression VisitMember(MemberExpression node)
        {
            Visit(node.Expression);
            if (Failed)
                return node;

            var leftPort = PopPortedExpression();

            PortedExpression = new ExpressionPort(string.Format("{0}.{1}",
                leftPort.PortedText, node.Member.Name.ToJsName()));

            return node;
        }

    }

    public struct ExpressionPort
    {
        public readonly string PortedText;
        public readonly RenderAction Action;

        public ExpressionPort(string portedText, RenderAction action = RenderAction.Rendered)
        {
            PortedText = portedText;
            Action = action;
        }

        static ExpressionPort()
        {
            None = new ExpressionPort(null, RenderAction.None);
            Failed = new ExpressionPort(null, RenderAction.Fail);
        }

        public static ExpressionPort None { get; private set; }
        public static ExpressionPort Failed { get; private set; }
    }
}
