using System.Collections.Generic;
using System.Web.UI;

#region odo Resources
[assembly: WebResource("Odo.Html.Scripts.odo.html.js", "text/javascript")]
[assembly: WebResource("Odo.Html.Scripts.odo.html.min.js", "text/javascript")]
#endregion

#region odo Dependencies
[assembly: WebResource("Odo.Html.Scripts.Dependencies.knockout-1.1.1.js", "text/javascript")]
[assembly: WebResource("Odo.Html.Scripts.Dependencies.knockout-1.1.1.debug.js", "text/javascript")]
#endregion

namespace odo.Html
{
    public static class PageExtensions
    {
        // This dictionary should map the resource name the client uses to the partial
        //  name (starting below the script location) of the actual embedded resource.
        // Do not include version numbers, as the name are meant to always point to the
        //  version that odo is tested against.
        // DON'T FORGET to include each entry as a WebResource (above) and mark it as
        //  "Embedded Resource".
        private static readonly Dictionary<string, string> Resources =
            new Dictionary<string, string>
                {
                    { "odo.html", "odo.html.js" },
                    { "odo.html.min", "odo.html.min.js" },
                    { "knockout", "Dependencies.knockout-1.1.1.debug.js" },
                    { "knockout.min", "Dependencies.knockout-1.1.1.js" }
                };

        public const string ResourceLocation = "Odo.Html.Scripts";

        public static string GetOdoResourceUrl(this Page @this, string name)
        {
            var resource = string.Format("{0}.{1}", ResourceLocation, Resources[name.ToLower()]);
            return @this.ClientScript.GetWebResourceUrl(typeof(PageExtensions), resource);
        }
    }
}