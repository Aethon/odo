using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;

namespace Odo.Core.Design
{
    public class DisplayGroup : DesignComponent
    {
        public IList<DesignComponent> Members { get; private set; }

        internal DisplayGroup(Binding context,
            string name,
            Binding<string> style,
            IEnumerable<DesignComponent> members) : base(context, name, style)
        {
            Check.NotNull(members);
            Members = new ReadOnlyCollection<DesignComponent>(new List<DesignComponent>(members));
        }
 
        protected override void GetEffectiveLinks(List<object> links)
        {
            base.GetEffectiveLinks(links);
            foreach(var m in Members)
                links.AddRange(m.GetEffectiveLinks());
        }
    }
}
