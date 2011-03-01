using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using Odo.Core.Semantics;

namespace Odo.Core.Design
{
    public abstract class DesignComponent
    {
        public Binding<string> Style { get; private set; }
        public Binding Context { get; private set; }
        public string Name { get; private set; }

        protected DesignComponent(Binding context, string name, Binding<string> style)
        {
            Context = Check.NotNull(context);
            Style = style;
            Name = name;
        }
        
        public IEnumerable<object> GetEffectiveLinks()
        {
            var result = new List<object>();
            GetEffectiveLinks(result);
            return result.Where(x => x != null);
        }

        protected virtual void GetEffectiveLinks(List<object> links)
        {
            links.Add(Style);
        }
    }
}
