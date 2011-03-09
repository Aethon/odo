using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Odo.Core.Semantics
{
    public interface IAcceptConstraint<in T>
    {
        IEnumerable<string> GetDeviations(T model);
    }
}
