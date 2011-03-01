using System.Collections.Generic;

namespace Odo.Core.Rendering
{
    public class CollectionNode : RenderNode
    {
        public readonly List<RenderNode> Elements = new List<RenderNode>();

        public CollectionNode(object instance, uint id) : base(instance, id)
        {}

        public override string ToString()
        {
            return
                string.Format(
                    "CollectionItem #{0} [ {1}e {2}->i->{3} ] = {4}",
                    Id, Elements.Count, Dependents.Count, Dependencies.Count,
                    Instance.GetType().Name);
        }
    }
}