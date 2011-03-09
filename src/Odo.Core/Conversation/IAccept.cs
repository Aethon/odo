using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Conversation
{
    public interface IAccept<TSemantic, TSemanticMember>
    {
        Expression<Func<TSemantic, bool>> When { get; }

        Expression<Func<TSemanticMember, object>> Key { get; }
        IEnumerable<IAcceptConstraint<TSemanticMember>> Constraints { get; }
    }
}