using System;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using iSynaptic.Commons;
using iSynaptic.Commons.Collections.Generic;
using iSynaptic.Commons.Data;
using iSynaptic.Commons.Linq;
using Odo.Core;
using Odo.Core.Rendering;

namespace Odo.Html.Rendering
{
    public class KoNodeStatus
    {
        public readonly RenderNode Node;
        public readonly bool IsCommon;
        public string RenderName;
        public bool HasEmitted;
        public bool IsScheduled;

        public KoNodeStatus(RenderNode node, bool isCommon)
        {
            Node = node;
            IsCommon = isCommon;
        }
    }

    public class KoScheduler
    {
        private readonly Dictionary<object, KoNodeStatus> _map;

        public IEnumerable<RenderNode> TopLevelNodes { get; private set; }

        public KoScheduler(IEnumerable<RenderNode> nodes)
        {
            _map = nodes.ToDictionary(n => n.Instance, n => new KoNodeStatus(n, IsCommon(n)));

            var schedule = _map.Values.ToList();

            // sort into dependency order by selecting progressive tiers of independent items
            var common = schedule.Where(x => x.IsCommon).ToList();
            common.ForEach(x => { if (x.RenderName == null) x.RenderName = "c" + x.Node.Id; });

            var top = schedule.Where(x => x.Node.Dependents.Count == 0).ToList();
            top.ForEach(x => { if (x.RenderName == null) x.RenderName = "t" + x.Node.Id; });

            var safeOrder = new List<KoNodeStatus>();
            while (common.Count > 0)
            {
                var tier = common.Where(i => !HasCommonDependencies(i)).ToList();
                if (tier.Count == 0)
                    throw new Exception("Circular reference detected.");
                tier.ForEach(i =>
                                 {
                                     i.IsScheduled = true;
                                     common.Remove(i);
                });
                safeOrder.AddRange(tier);
            }
            safeOrder.AddRange(top);
            
            TopLevelNodes = safeOrder.Select(x => x.Node);
        }

        public KoNodeStatus GetStatus(RenderNode node)
        {
            return _map[node.Instance];
        }

        public KoNodeStatus GetStatus(object instance)
        {
            return _map[instance];
        }

        private IEnumerable<KoNodeStatus> Traverse(KoNodeStatus status)
        {
            yield return status;
            foreach (var i in TraverseChildren(status))
                yield return i;
        }

        private IEnumerable<KoNodeStatus> TraverseChildren(KoNodeStatus status)
        {
            return status.Node.Dependencies.SelectMany(x => Traverse(_map[x.Instance]));
        }

        private bool HasCommonDependencies(KoNodeStatus status)
        {
            return TraverseChildren(status).Any(x => x.IsCommon && !x.IsScheduled);
        }

        private static bool IsCommon(RenderNode node)
        {
            return
                !(node is ObjectOrValueNode && ((ObjectOrValueNode)node).TreatAsValue) &&
                (node.Dependents.Count > 1 || node.Dependents.Any(y => y is LinkNode));
        }
    }


    public class KoSerializer
    {
        protected TextWriter Writer;
        internal readonly PortExpressionVisitor Visitor;
        private Dictionary<object, string> _metadataNames = new Dictionary<object, string>();

        public KoSerializer(TextWriter writer)
        {
            Contract.Assert(writer != null);
            Writer = writer;
            Visitor = new PortExpressionVisitor(this);
        }

        private KoScheduler _renderSchedule;

        public void Serialize(IEnumerable<RenderNode> nodes, AppRegion region)
        {
            _renderSchedule = new KoScheduler(nodes);
            var semanticsStatus = _renderSchedule.GetStatus(region.Semantics);
            semanticsStatus.RenderName = "semantics";

            foreach (var i in _renderSchedule.TopLevelNodes)
            {
                var status = _renderSchedule.GetStatus(i);
                Writer.WriteLine("var {0} = {1};", status.RenderName, RenderValue(i));
            }
        }

        public string Render(RenderNode node)
        {
            if (node == null)
                return "null";
            var status = _renderSchedule.GetStatus(node);
            if (status.IsCommon && status.HasEmitted)
                return status.RenderName;
            return RenderValue(node);
        }

        public string RenderInstance(object instance)
        {
            if (instance is ISymbol)
                return GetMetadataName((ISymbol)instance);

            if (instance == null)
                return "null"; 
            var status = _renderSchedule.GetStatus(instance);
            return Render(status.Node);
        }

        public string RenderValue(RenderNode node)
        {
            if (node is ObjectOrValueNode)
                return RenderValue((ObjectOrValueNode) node);
            if (node is LinkNode)
                return RenderValue((LinkNode) node);
            if (node is CollectionNode)
                return RenderValue((CollectionNode) node);
            throw new NotSupportedException();
        }

        protected string RenderValue(ObjectOrValueNode node)
        {
            var status = _renderSchedule.GetStatus(node);
            status.HasEmitted = true;

            var subject = node.Instance;

            if (subject is string)
            {
                return subject.ToSingleQuotedJsString();
            }
            if (subject is bool)
            {
                return ((bool) subject) ? "true" : "false";
            }
            if (subject is byte
                || subject is sbyte
                || subject is short
                || subject is ushort
                || subject is int
                || subject is uint
                || subject is long
                || subject is ulong
                || subject is float
                || subject is double
                || subject is decimal)
            {
                return subject.ToString();
            }
            if (subject is Enum)
            {
                return Convert.ChangeType(subject, Enum.GetUnderlyingType(subject.GetType())).ToString();
            }

            var memberlist = node.Members.Select(RenderMember).ToList();
            if (node.Metadata.Count > 0)
            {
                memberlist.Add(string.Format("__md: {{{0}}}", node.Metadata.Select(RenderMember)).Delimit(","));
            }
            return string.Format("{{{0}}}", memberlist.Delimit(","));
        }

        protected string RenderValue(LinkNode node)
        {
            var status = _renderSchedule.GetStatus(node);
            status.HasEmitted = true;

            var expression = node.Expression;
            return PortAsLambda(expression).PortedText;
        }

        protected string RenderValue(CollectionNode node)
        {
            var status = _renderSchedule.GetStatus(node);
            status.HasEmitted = true;

            return string.Format("ko.observableArray([{0}])", string.Join(",", node.Elements.Select(Render)));
        }

        protected string RenderMember(KeyValuePair<MemberInfo, RenderNode> member)
        {
            return string.Format("{0}:{1}", member.Key.Name.ToJsName(), Render(member.Value));
        }

        protected string RenderMember(KeyValuePair<MetadataInfo, RenderNode> metadata)
        {
            return string.Format("{0}:{1}", GetMetadataName(metadata.Key.Symbol), Render(metadata.Value));
        }

        private int _nextMetadataName = 1;
        private string GetMetadataName(ISymbol info)
        {
            string name;
            if (!_metadataNames.TryGetValue(info, out name))
            {
                name = string.Format("md{0}", _nextMetadataName++);
                _metadataNames[info] = name;
            }
            return name;
        }

#if NO
        protected void Serialize(KoNodeStatus status)
        {
            if (status.Node is ObjectOrValueNode)
            {
                var ovi = (ObjectOrValueNode) status.Node;
                var subject = ovi.Instance;
                if (ovi.TreatAsValue)
                {
                    // always emit by value in this case
                    if (subject is string)
                    {
                        Writer.Write(subject.ToSingleQuotedJsString());
                    }
                    else if (subject is bool)
                    {
                        Writer.Write(((bool) subject) ? "'true'" : "'false'");
                    }
                    else if (subject is byte
                             || subject is sbyte
                             || subject is short
                             || subject is ushort
                             || subject is int
                             || subject is uint
                             || subject is long
                             || subject is ulong
                             || subject is float
                             || subject is double
                             || subject is decimal)
                    {
                        Writer.Write(subject.ToString());
                    }
                    else
                    {
                        EmitObject(status);
                    }
                }
                else
                {
                    if (status.IsCommon && !status.HasEmitted)
                    {
                        EmitObject(status);
                        status.HasEmitted = true;
                    }
                    else
                    {
                        Writer.Write(status.RenderName);
                    }
                }
            }
            else if (status.Node is LinkNode)
            {
                var li = (LinkNode) status.Node;
                var subject = li.Instance;
                if (subject is Expression)
                {
                    Writer.Write(PortAsLambda((Expression) subject).PortedText);
                }
                else if (subject is Binding)
                {
                    Writer.Write(PortAsLambda(((Binding) subject).BindingLambda).PortedText);
                }
                else
                {
                    throw new NotSupportedException(
                        string.Format("Serialization of links of type '{0}' is not supported",
                                      subject.GetType().Name));
                }
            }
            else if (status.Node is CollectionNode)
            {
                using (Writer.CodeBlock("ko.observableArray([\n", "\n])"))
                using (Writer.List(",\n"))
                {
                    foreach (var p in status.Elements)
                    {
                        Writer.StartListItem();
                        SerializeElement(p);
                    }
                }
            }
            else
            {
                Writer.Write("null");
            }
        }

        protected void EmitObject(KoNodeStatus status)
        {
            var node = (ObjectOrValueNode) status.Node;

            if (node.Instance is string)
                Writer.Write(node.Instance.ToSingleQuotedJsString());
            else
                using (Writer.CodeBlock("{\n", "\n}"))
                using (Writer.List(",\n"))
                {
                    foreach (var p in node.Members)
                    {
                        Writer.StartListItem();
                        SerializeMember(p);
                    }
                }
            status.HasEmitted = true;
        }

        protected void SerializeMember(KeyValuePair<PropertyInfo, RenderNode> member, bool withName = true)
        {
            if (withName)
                Writer.Write("{0}: ", member.Key.Name.ToJsName());
            if (member.Value == null)
            {
                Writer.Write("null");
            }
            else
            {
                SerializeElement(member.Value);
            }
        }

        protected void SerializeElement(RenderNode element)
        {
            if (element.Dependents.Count > 1)
            {
                Writer.Write(string.Format("{0}", element.RenderedName));
            }
            else
            {
                Serialize(element);
            }
        }
#endif
        
        public ExpressionPort PortAsLambda(Expression expression)
        {
            Visitor.Visit(expression);
            return Visitor.PortedExpression;
        }
        /*
        public ExpressionPort PortAsExpression(Expression expression, params string[] args)
        {
            IDictionary<ParameterExpression, string> replacements = null;
            if (expression is LambdaExpression)
            {
                var lambda = (LambdaExpression)expression;
                expression = lambda.Body;
                replacements = lambda.Parameters
                    .Zip(args, (p, a) => new { Parameter = p, Argument = a })
                    .ToDictionary(e => e.Parameter, e => e.Argument);
            }
            var visitor = new PortExpressionVisitor(this,replacements);
            visitor.Visit(expression);
            return visitor.PortedExpression;
        }
         * */
    }
}
