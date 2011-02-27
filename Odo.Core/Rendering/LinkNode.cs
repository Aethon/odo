using System.Linq.Expressions;

namespace Odo.Core.Rendering
{
    public class LinkNode : RenderNode
    {
        public LambdaExpression Expression 
        {
            get { return _instanceOverride ?? (Instance as LambdaExpression) ?? (Instance as Binding).BindingLambda; } // TODO: use Maybe
            set { _instanceOverride = value; }
        }
        private LambdaExpression _instanceOverride;

        public LinkNode(object instance, uint id) : base(instance, id)
        {}

        public override string ToString()
        {
            return
                string.Format(
                    "LinkItem #{0} [ {1}->i->{2} ] = {3}{4}",
                    Id, Dependents.Count, Dependencies.Count,
                    _instanceOverride != null ? ("!! ") : string.Empty,
                    Expression);
        }
    }
}