using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Odo.Core.Design
{
    public class Text : DesignComponent
    {
        public Binding<string> Content { get; protected set; }

        internal Text(Binding context,
            string name,
            Binding<string> style,
            Binding<string> content)
            : base(context, name, style)
        {
            Content = content;
        }
    
        protected override void GetEffectiveLinks(List<object> links)
        {
            base.GetEffectiveLinks(links);
            links.Add(Content);
        }
    }
    /*
    public class Text<T> : Text
    {
        internal Text(Binding context,
            string name,
            Binding<string> style,
            Binding<string> content)
            : base(context, name, style, content)
        {
        }
    }
    */
}
