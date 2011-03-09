using System.Collections.Generic;

namespace Odo.Core.Conversation
{
    public interface IAcceptConstraint<in T>
    {
        IEnumerable<string> GetDeviations(T model);
    }
}
