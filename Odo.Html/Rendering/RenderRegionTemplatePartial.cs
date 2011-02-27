using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Odo.Core.Design;

namespace Odo.Html.Rendering
{
    public partial class RenderRegionTemplate
    {
        private static readonly Regex TextSplitRegex = new Regex(@"\r\n|\r|\n");

        protected string TextToJavascriptString(string text)
        {
            return "'" +
                   string.Join("' +\n'",
                               TextSplitRegex.Split(text).Select(s => s.Replace(@"\", @"\\").Replace("'", @"\'"))) +
                   "'";
        }
    }
}
