using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using iSynaptic.Commons;
using iSynaptic.Commons.Data;
using Odo.Core.Design;

namespace Odo.Core.Rendering
{
    public interface IRequirementsBuilder
    {
        void NoteMetadataRequirement(MetadataInfo info);
    }

    // TODO: make value type
    public class MetadataInfo
    {
        public Type Type { get; private set; }
        public IExodataDeclaration Declaration { get; private set; }
        private MethodInfo Method { get;  set; }
        private Expression MemberExpression { get; set; }

        public MetadataInfo
            (Type type, IExodataDeclaration declaration, MethodInfo method, Expression memberExpression)
        {
            Type = type;
            Declaration = declaration;
            Method = method;
            MemberExpression = memberExpression;
        }

        public object GetValue(object subject)
        {
            switch (Method.GetParameters().Length)
            {
                case 1:
                    return Method.Invoke(Declaration, new[] {subject});
                case 2:
                    return Method.Invoke(Declaration, new[] {subject, MemberExpression});
                default:
                    throw new InvalidOperationException("An unrecognized signature for MetadataInfo was found");
            }
        }
    }

    public class RegionAnalyzer
    {
        
        private class FindRequirementsVisitor : ExpressionVisitor, IRequirementsBuilder
        {
            public readonly HashSet<MemberInfo> MemberRequirements = new HashSet<MemberInfo>();
            public readonly HashSet<MetadataInfo> MetadataRequirements = new HashSet<MetadataInfo>();
            public readonly HashSet<object> Constants = new HashSet<object>();
            public bool Modified { get; private set; }

            private readonly IRegionAnalysisStrategy _strategy;

            public FindRequirementsVisitor(IRegionAnalysisStrategy strategy)
            {
                _strategy = strategy;
            }

            protected override Expression VisitConstant(ConstantExpression node)
            {
                Constants.Add(node.Value);
                return base.VisitConstant(node);
            }

            protected override Expression VisitMember(MemberExpression node)
            {
                // node.Expression will be null when accessing static members.
                //  Static members are acquired immediately and treated as constants.
                if (node.Expression == null)
                {
                    Expression replacement;
                    switch (_strategy.ResolveStaticMember(node, out replacement))
                    {
                        case ExpressionAction.Retain:
                            return base.VisitMember(node);
                        case ExpressionAction.Replace:
                            Modified = true;
                            return base.Visit(replacement);
                        default:
                            throw new NotSupportedException(string.Format("Access of static member '{0}' is not supported.", node.Member.Name));
                    }
                }

                var memberInfo = node.Member;
                if (!(memberInfo is PropertyInfo || memberInfo is FieldInfo))
                    throw new InvalidOperationException(string.Format("Only property or field members may be accessed; '{0}' is not a property or field.", memberInfo.Name));
                MemberRequirements.Add(memberInfo);
                return base.VisitMember(node);
            }

            protected override Expression VisitMethodCall(MethodCallExpression node)
            {
                Expression replacement;
                switch (_strategy.ResolveMethodCall(node, this, out replacement))
                {
                    case ExpressionAction.Retain:
                        return base.VisitMethodCall(node);
                    case ExpressionAction.Replace:
                        Modified = true;
                        return base.Visit(replacement);
                    default:
                        throw new NotSupportedException(string.Format("Call of method '{0}' is not supported.", node.Method.Name));
                }
            }

            protected override Expression VisitUnary(UnaryExpression node)
            {
                switch (node.NodeType)
                {
                    case ExpressionType.Convert:
                        Expression replacement;
                        switch (_strategy.ResolveConversion(node, out replacement))
                        {
                            case ExpressionAction.Retain:
                                return base.VisitUnary(node);
                            case ExpressionAction.Replace:
                                Modified = true;
                                return base.Visit(replacement);
                            default:
                                throw new NotSupportedException(
                                    string.Format("Conversion expression '{0}' is not supported.", node));
                        }
                    default:
                        return base.VisitUnary(node);
                }
            }

            protected override Expression VisitNewArray(NewArrayExpression node)
            {
                Expression replacement;
                switch (_strategy.ResolveNewArray(node, out replacement))
                {
                    case ExpressionAction.Retain:
                        return base.VisitNewArray(node);
                    case ExpressionAction.Replace:
                        Modified = true;
                        return base.Visit(replacement);
                    default:
                        throw new NotSupportedException(string.Format("New array expression '{0}' is not supported.", node));
                }
            }

            public void NoteMetadataRequirement(MetadataInfo info)
            {
                MetadataRequirements.Add(info);
            }
        }

        private readonly Dictionary<Type, HashSet<MemberInfo>> _typeMemberRequirements = new Dictionary<Type, HashSet<MemberInfo>>();
        private readonly Dictionary<Type, HashSet<MetadataInfo>> _typeMetadataRequirements = new Dictionary<Type, HashSet<MetadataInfo>>();
        private readonly Dictionary<object, RenderNode> _items = new Dictionary<object, RenderNode>();
        private readonly Queue<RenderNode> _newItems = new Queue<RenderNode>();

        private uint _nextId = 1;

        private readonly IRegionAnalysisStrategy _strategy;

        public RegionAnalyzer(IRegionAnalysisStrategy strategy)
        {
            _strategy = Guard.NotNull(strategy, "strategy");
        }

        public IEnumerable<RenderNode> Analyze(AppRegion region)
        {
            return Analyze(region.Template.Tree.GetEffectiveLinks(), region.Semantics);
        }

        public IEnumerable<RenderNode> Analyze(IEnumerable<object> externalLinks, object semantics)
        {
            Guard.NotNull(externalLinks, "externalLinks");
            Guard.NotNull(semantics, "semantics");

            // prime with the "external" links and the semantics)
            foreach (var l in externalLinks)
                RegisterItem(l, null);
            RegisterItem(semantics, null);

            // analyze until all links and instances have been analyzed
            while (_newItems.Count > 0)
            {
                var item = _newItems.Dequeue();

                if (item is LinkNode)
                    AnalyzeLink((LinkNode)item);
                else if (item is ObjectOrValueNode)
                    AnalyzeItem((ObjectOrValueNode)item);
            }

            return _items.Values.ToList();
        }

        private void AnalyzeLink(LinkNode linkItem)
        {
            var v = new FindRequirementsVisitor(_strategy);
            Expression @override;
            if (linkItem.Instance is LambdaExpression)
            {
                @override = v.Visit((LambdaExpression) linkItem.Instance);
            }
            else if (linkItem.Instance is Binding)
            {
                @override = v.Visit(((Binding) linkItem.Instance).BindingLambda);
            }
            else
            {
                throw new Exception("bad");
            }

            if (v.Modified)
            {
                linkItem.Expression = (LambdaExpression)@override;
            }

            foreach (var x in v.MemberRequirements)
            {
                ApplyMemberRequirement(x);
            }

            foreach (var x in v.MetadataRequirements)
            {
                ApplyMetadataRequirement(x);
            }

            foreach (var x in v.Constants)
            {
                // add the constant as a dependent of this expression
                RegisterItem(x, linkItem);
            }
        }

        private void ApplyMemberRequirement(MemberInfo info)
        {
            HashSet<MemberInfo> members;
            if (!_typeMemberRequirements.TryGetValue(info.DeclaringType, out members))
            {
                members = new HashSet<MemberInfo>();
                _typeMemberRequirements[info.DeclaringType] = members;
            }
            if (!members.Contains(info))
            {
                members.Add(info);

                // while we are here, update any existing instances with this property
                foreach (
                    var i in
                        _items.Values.OfType<ObjectOrValueNode>().Where(
                            x =>
                            !x.Members.ContainsKey(info) && info.DeclaringType.IsAssignableFrom(x.Instance.GetType())).ToList())
                    UpdateItem(i, info);
            }
        }

        private void ApplyMetadataRequirement(MetadataInfo info)
        {
            HashSet<MetadataInfo> members;
            if (!_typeMetadataRequirements.TryGetValue(info.Type, out members))
            {
                members = new HashSet<MetadataInfo>();
                _typeMetadataRequirements[info.Type] = members;
            }
            if (!members.Contains(info))
            {
                members.Add(info);

                // while we are here, update any existing instances with this property
                foreach (
                    var i in
                        _items.Values.OfType<ObjectOrValueNode>().Where(
                            x =>
                            !x.Metadata.ContainsKey(info) && info.Type.IsAssignableFrom(x.Instance.GetType())).ToList())
                    UpdateItem(i, info);
            }
        }

        private void AnalyzeItem(ObjectOrValueNode node)
        {
            foreach (var p in _typeMemberRequirements.Where(p => p.Key.IsAssignableFrom(node.Instance.GetType())).SelectMany(v => v.Value))
            {
                UpdateItem(node, p);
            }
        }

        private void UpdateItem(ObjectOrValueNode node, MemberInfo info)
        {
            var newInstance = info.GetValue(node.Instance, null);
            if (newInstance == null)
            {
                node.Members[info] = null;
            }
            else
            {
                var newItem = RegisterItem(newInstance, node);
                node.Members[info] = newItem;
            }
        }

        private void UpdateItem(ObjectOrValueNode node, MetadataInfo info)
        {
            var newInstance = info.GetValue(node.Instance);

            if (newInstance == null)
            {
                node.Metadata[info] = null;
            }
            else
            {
                var newItem = RegisterItem(newInstance, node);
                node.Metadata[info] = newItem;
            }
        }

        private RenderNode RegisterItem(object instance, RenderNode dependent)
        {
            if (instance == null)
                return null;

            RenderNode result;
            if (!_items.TryGetValue(instance, out result))
            {
                IEnumerable<object> elements;
                switch (_strategy.ClassifyInstance(instance, out elements))
                {
                    case InstanceType.Object:
                        result = new ObjectOrValueNode(instance, _nextId++, false);
                        break;
                    case InstanceType.Value:
                        result = new ObjectOrValueNode(instance, _nextId++, true);
                        break;
                    case InstanceType.Link:
                        result = new LinkNode(instance, _nextId++);
                        break;
                    case InstanceType.Collection:
                        var collection = new CollectionNode(instance, _nextId++);
                        result = collection;
                        collection.Elements.AddRange(elements.Select(x => RegisterItem(x, result)));
                        break;
                }

                if (result != null)
                {
                    _items[instance] = result;
                    _newItems.Enqueue(result);
                }
            }
            if (result != null && dependent != null) // TODO: consider requiring non null
            {
                result.Dependents.Add(dependent);
                dependent.Dependencies.Add(result);
            }
            return result;
        }
    }
}
