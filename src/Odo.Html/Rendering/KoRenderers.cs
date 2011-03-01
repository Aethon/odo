using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using Odo.Core.Rendering;

namespace Odo.Html.Rendering
{
    public enum RenderAction
    {
        None,
        Rendered,
        Fail
    }

    public delegate RenderAction RenderExpression(Expression expression, RenderExpression render, out string renderedExpression);

    public static class KoRenderers
    {
        public static IEnumerable<RenderExpression> GetMethodCallRenderers()
        {
            // TODO: by reflection
            yield return RenderStringCompare;
            yield return RenderBindingGetValue;
            yield return IsMetadataDeclarationForMethod;
        }

        #region String.Compare

        public static RenderAction RenderStringCompare(Expression expression, RenderExpression render, out string renderedExpression)
        {
            renderedExpression = null;
            var exp = expression as MethodCallExpression;

            if (exp == null || exp.Method != StandardResolvers.StringCompareMethodInfo)
                return RenderAction.None;

            string left;
            string right;
            if (RenderAction.Fail == render(exp.Arguments[0], render, out left) ||
                RenderAction.Fail == render(exp.Arguments[1], render, out right))
                return RenderAction.Fail;
            
            renderedExpression = string.Format("{0}.localeCompare({1})", left, right);
            return RenderAction.Rendered;
        }

        #endregion

        #region Binding.GetValue

        public static RenderAction RenderBindingGetValue(Expression expression, RenderExpression render, out string renderedExpression)
        {
            renderedExpression = null;
            var exp = expression as MethodCallExpression;

            if (exp == null || !StandardResolvers.IsBindingGetValueMethod(exp.Method))
                return RenderAction.None;

            // TODO
            string arg;
            string obj;
            if (RenderAction.Fail == render(exp.Object, render, out obj) ||
                RenderAction.Fail == render(exp.Arguments[0], render, out arg))
                return RenderAction.Fail;

            renderedExpression = string.Format("({0})({1})", obj, arg);
            return RenderAction.Rendered;
        }

        #endregion

        #region MetadataDeclaration.For

        public static RenderAction IsMetadataDeclarationForMethod(Expression expression, RenderExpression render, out string renderedExpression)
        {
            renderedExpression = null;
            var exp = expression as MethodCallExpression;

            if (exp == null || !StandardResolvers.IsBindingGetValueMethod(exp.Method))
                return RenderAction.None;

            // TODO
            string arg;
            string name; // this is kloooge...fix it soon
            if (RenderAction.Fail == render(exp.Arguments[0], render, out arg) ||
                RenderAction.Fail == render(exp.Object, render, out name))
                return RenderAction.Fail;

            renderedExpression = string.Format("({0}).__md.{1}", arg, name);
            return RenderAction.Rendered;
        }

        #endregion
    }
}
