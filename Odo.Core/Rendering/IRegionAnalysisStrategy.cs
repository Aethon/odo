using System.Collections.Generic;
using System.Linq.Expressions;

namespace Odo.Core.Rendering
{
    public interface IRegionAnalysisStrategy
    {
        InstanceType ClassifyInstance(object instance, out IEnumerable<object> elements);
        ExpressionAction ResolveStaticMember(MemberExpression expression, out Expression replacement);
        ExpressionAction ResolveMethodCall(MethodCallExpression expression, IRequirementsBuilder requirementsBuilder, out Expression replacement);
        ExpressionAction ResolveConversion(UnaryExpression expression, out Expression replacement);
        ExpressionAction ResolveNewArray(NewArrayExpression expression, out Expression replacement);
    }
}