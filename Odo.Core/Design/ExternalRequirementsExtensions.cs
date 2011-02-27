using System.Linq.Expressions;

namespace Odo.Core.Design
{
    public static class ExternalRequirementsExtensions
    {
        public static Designer<TParentContext> ExternalRequirements<TParentContext>(this Designer<TParentContext> @this,
                                                                                    params Expression[] links)
        {
            var contextBinding = Binding.Create((TParentContext pctx) => pctx);
            return new Designer<TParentContext>(@this.Components, new ExternalRequirements(contextBinding, links));
        }
    }
}