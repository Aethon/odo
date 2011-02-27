using System.Web.Mvc;

namespace Odo.Mvc
{
    public class UsesOdoAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // place an AppAgent in the view data to be populated along the way...
            filterContext.Controller.ViewData[MvcExtensions.AgentViewDataKey] = new AppAgent();
            base.OnActionExecuting(filterContext);
        }
    }
}
