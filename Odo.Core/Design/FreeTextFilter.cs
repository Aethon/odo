using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Odo.Core.Design
{
    public class FreeTextFilter : DesignComponent
    {
        public Expression FilterExpression { get; protected set; }

        internal FreeTextFilter(Binding context,
            string name,
            Binding<string> style,
            Expression filterExpression)
            : base(context, name, style)
        {
            FilterExpression = filterExpression;
        }
    }
}
