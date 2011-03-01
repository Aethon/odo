using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Odo.Core.Design
{
    public abstract class DesignTemplate
    {
        public DesignComponent Tree { get; private set; }

        protected DesignTemplate(DesignComponent tree)
        {
            Contract.Assert(tree != null);
            Tree = tree;
        }
    }

    public class DesignTemplate<T> : DesignTemplate
    {
        internal DesignTemplate(DesignComponent tree) : base(tree)
        {}

        // force this method for creation => get type safety
        public static DesignTemplate<T> Create(Func<Designer<T>, Designer<T>> tree)
        {
            Contract.Assert(tree != null);
            var designer = tree(Designer<T>.Empty);
            var count = designer.Components.Count();
            Contract.Assert(count == 1, string.Format("Design template must have exactly one semantic member at its root; this template returned {0}.", count));
            return new DesignTemplate<T>(designer.Components.Single());
        }
    }
}
