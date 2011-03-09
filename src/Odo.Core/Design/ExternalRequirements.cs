using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using iSynaptic.Commons;

namespace Odo.Core.Design
{
    // This is really not the best idea...
    public class ExternalRequirements : DesignComponent
    {
        public IList<Expression> Links { get; private set; }

        internal ExternalRequirements(Binding context,
            IEnumerable<Expression> links)
            : base(context, null, null)
        {
            Guard.NotNull(links, "links");
            Links = new ReadOnlyCollection<Expression>(new List<Expression>(links));
        }

        protected override void GetEffectiveLinks(List<object> links)
        {
            base.GetEffectiveLinks(links);
            links.AddRange(Links);
        }
    }
}
