using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using Odo.Core;
using Odo.Core.Design;

namespace Odo.Html.Rendering
{
    internal class FreeTextFilterRenderer
    {
        public string RenderTemplate(Text subject, HtmlRenderContext context)
        {
            return
                "function(svm) { var $dom = $('<input type=\"text\"/>').change(function () { viewModel.filter($filterText.val());}).filterbox();";
        }
    }
}
