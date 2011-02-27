using System.Collections.Generic;

namespace Odo.Core.Rendering
{
    public abstract class RenderNode
    {
        public readonly object Instance;
        public readonly uint Id;
        public readonly HashSet<RenderNode> Dependents = new HashSet<RenderNode>();
        public readonly HashSet<RenderNode> Dependencies = new HashSet<RenderNode>();

        protected RenderNode(object instance, uint id)
        {
            Instance = instance;
            Id = id;
        }
    }
}