using System.Collections.Generic;
using System.Reflection;
using iSynaptic.Commons.Data;

namespace Odo.Core.Rendering
{
    public class ObjectOrValueNode : RenderNode
    {
        public readonly Dictionary<MemberInfo, RenderNode> Members = new Dictionary<MemberInfo, RenderNode>();
        public readonly Dictionary<MetadataInfo, RenderNode> Metadata = new Dictionary<MetadataInfo, RenderNode>();
        public readonly bool TreatAsValue;

        public ObjectOrValueNode(object instance, uint id, bool treatAsValue) : base(instance, id)
        {
            TreatAsValue = treatAsValue;
        }

        public override string ToString()
        {
            return
                string.Format(
                    "Item #{0} [ {1}m {2}^d {3}->i->{4} ] = {5}",
                    Id, Members.Count, Metadata.Count, Dependents.Count, Dependencies.Count,
                    Instance);
        }
    }
}