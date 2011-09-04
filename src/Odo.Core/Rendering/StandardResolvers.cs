using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading;
using iSynaptic.Commons;
using iSynaptic.Commons.Data;
using Odo.Core.Design;

namespace Odo.Core.Rendering
{
    public static class StandardResolvers
    {
            public static IEnumerable<ResolveMethodCall> GetMethodCallResolvers()
        {
            // TODO: by reflection
            yield return ResolveStringCompare;
            yield return ResolveWellKnownHelpersCompareForIncrementalSearch;
            yield return ResolveBindingGetValue;
            yield return ResolveMetadataDeclarationFor;
        }

        #region string.Compare

        public static readonly MethodInfo StringCompareMethodInfo = typeof(string).GetMethod("Compare", new[] { typeof(string), typeof(string) });

        public static ExpressionAction ResolveStringCompare(MethodCallExpression expression, IRequirementsBuilder requirementsBuiler,
            out Expression replacement)
        {
            replacement = null;
            if (expression.Method != StringCompareMethodInfo)
                return ExpressionAction.None;

            return ExpressionAction.Retain;
        }

        #endregion

        #region WellKnownHelpers.CompareForIncrementalSearch

        public static readonly MethodInfo ResolveWellKnownHelpersCompareForIncrementalSearchMethodInfo = typeof(WellKnownHelpers).GetMethod("CompareForIncrementalSearch", new[] { typeof(string), typeof(string) });

        public static ExpressionAction ResolveWellKnownHelpersCompareForIncrementalSearch(MethodCallExpression expression, IRequirementsBuilder requirementsBuiler,
            out Expression replacement)
        {
            replacement = null;
            if (expression.Method != ResolveWellKnownHelpersCompareForIncrementalSearchMethodInfo)
                return ExpressionAction.None;

            return ExpressionAction.Retain;
        }

        #endregion

        #region Binding.GetValue

        public static bool IsBindingGetValueMethod(MethodInfo info)
        {
            return (info.Name == "GetValue" && typeof (Binding).IsAssignableFrom(info.DeclaringType));
        }

        public static ExpressionAction ResolveBindingGetValue(MethodCallExpression expression, IRequirementsBuilder requirementsBuiler, out Expression replacement)
        {
            replacement = null;
            if (!IsBindingGetValueMethod(expression.Method))
                return ExpressionAction.None;

            return ExpressionAction.Retain;
        }

        #endregion

        #region MetadataDeclaration<T>.For

        public static bool IsMetadataDeclarationForMethod(MethodInfo info)
        {
            if (!info.DeclaringType.IsGenericType)
                return false;

            Type genericDeclaringType = info.DeclaringType.GetGenericTypeDefinition();
            if (genericDeclaringType != typeof(ExodataDeclaration<>))
                return false;

            if (info.Name != "For")
                return false;

            return true;
        }

        public static ExpressionAction ResolveMetadataDeclarationFor(MethodCallExpression expression, IRequirementsBuilder requirementsBuiler, out Expression replacement)
        {
            replacement = null;
            if (!IsMetadataDeclarationForMethod(expression.Method))
                return ExpressionAction.None;

            if (expression.Arguments.Count == 0 || typeof(Expression).IsAssignableFrom(expression.Arguments[0].Type))
                return ExpressionAction.None;

            // if any parameters are referenced, fail the expression (cannot port, cannot invoke)
            if (RegionAnalysisStrategy.GetReferencedParameters(expression.Object).Count() > 0)
                return ExpressionAction.Fail;

            // if object is a constant, set a metadata requirement and continue
            if (expression.Object == null)
                throw new ArgumentNullException();
            if (expression.Object is ConstantExpression)
            {
                var constexp = (ConstantExpression) expression.Object;
                requirementsBuiler.NoteMetadataRequirement(new MetadataInfo(expression.Arguments[0].Type, (ISymbol)constexp.Value, expression.Method,
                    (expression.Arguments.Count == 2) ? expression.Arguments[1] : null));
                return ExpressionAction.Retain;
            }

            // otherwise, attempt to convert the constant expression to a constant
            var constval = (ISymbol)Expression.Lambda(expression.Object).Compile().DynamicInvoke();
            var objectValue = Expression.Constant(constval);

            replacement = Expression.Call(objectValue, expression.Method, expression.Arguments);
            return ExpressionAction.Replace;
        }

        #endregion
    
    }
}
