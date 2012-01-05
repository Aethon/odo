using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Web.UI;
using iSynaptic.Commons;
using System.Linq;
using iSynaptic.Commons.Collections.Generic;
using iSynaptic.Commons.Linq;

// TODO: deprecate the use of WebResources
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
    [Flags]
    public enum ResourceOptions
    {
        None = 0,
        Debug = 0x01,
        Release = 0x02,
        Odo = 0x04,
        Dependency = 0x08
    }

    public static class PageExtensions
    {
        public const string ResourceLocation = "Odo.Html.Scripts";

        private static readonly Assembly ThisAssembly = Assembly.GetExecutingAssembly();
        private static readonly string Version = string.Format("-{0}", ThisAssembly.GetName().Version.ToString(4));

        private class Asset
        {
            public string ResourceName { get; private set; }
            public string FileName { get; private set; }
            public ResourceOptions Options { get; private set; }

            public Asset(string nameTemplate, ResourceOptions options)
            {
                Guard.NotNullOrWhiteSpace(nameTemplate, "nameTemplate");

                ResourceName = string.Format("{0}.{1}", ResourceLocation, string.Format(nameTemplate, string.Empty).Replace('/', '.'));
                FileName = string.Format(nameTemplate, Version);
                Options = options;
            }
        }

        // casing is significant, garrrghghh!
        private readonly static IEnumerable<Asset> RequiredAssets = new[]
            {
                new Asset("odo.html{0}.js", ResourceOptions.Odo | ResourceOptions.Debug), 
                new Asset("odo.html{0}.min.js", ResourceOptions.Odo | ResourceOptions.Release),
                new Asset("mscorlib.debug{0}.js", ResourceOptions.Odo | ResourceOptions.Debug), 
                new Asset("mscorlib{0}.js", ResourceOptions.Odo | ResourceOptions.Release),
                new Asset("Jspf.debug{0}.js", ResourceOptions.Odo | ResourceOptions.Debug), 
                new Asset("Jspf{0}.js", ResourceOptions.Odo | ResourceOptions.Release),
                new Asset("fixes{0}.js", ResourceOptions.Odo | ResourceOptions.Release | ResourceOptions.Debug)
            };

        public static void ExtractResources(string path)
        {
            // write all of the embedded resources out
            Directory.CreateDirectory(path);
            foreach (var asset in RequiredAssets)
            {
                using (var stream = ThisAssembly.GetManifestResourceStream(asset.ResourceName))
                {
                    var file = Path.Combine(path, asset.FileName);
                    var folder = Path.GetDirectoryName(file);
                    if (!string.IsNullOrWhiteSpace(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    using (var output = File.Open(file, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        stream.CopyTo(output);
                    }
                }
            }
        }

        public static IEnumerable<string> GetResources(ResourceOptions options = ResourceOptions.Release | ResourceOptions.Odo)
        {
            // write all of the embedded resources out
            return RequiredAssets.Where(x => x.Options.HasFlag(options)).Select(x => x.FileName);
        }

        public static string GetHtmlIncludes(string path, ResourceOptions options = ResourceOptions.Release | ResourceOptions.Odo)
        {
            return GetResources(options)
                    .Select(x => string.Format("<script type='text/javascript' src='{0}' ></script>", Path.Combine(path, x).Replace('\\', '/')))
                    .Delimit("\n");
        }


        // TODO deprecate everything below when scripts are structured appropriately

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


        public static string GetOdoResourceUrl(this Page @this, string name)
        {
            var resource = string.Format("{0}.{1}", ResourceLocation, Resources[name.ToLower()]);
            return @this.ClientScript.GetWebResourceUrl(typeof(PageExtensions), resource);
        }
    }
}