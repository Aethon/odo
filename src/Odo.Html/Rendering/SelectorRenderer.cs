using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using Odo.Core;
using Odo.Core.Conversation;
using Odo.Core.Design;

namespace Odo.Html.Rendering
{
    internal class SelectorRenderData
    {
        public Selector Selector;
        public HtmlRenderContext RenderContext;
        public string Comparison;
        public string Symbol;
        public string Tip;
        public string From;
        public string Current;
        public string AvailableTemplateScript;
        public string SelectedTemplateScript;

        public bool CategoryFilter;
        public string Category;
        public string Categories;
        public string GetItemCategories;
        public string GetCategoryKey;
        public string CompareCategories;

        public string CaptureId;
        public string CaptureKeyScript;

        public string IncrementalSearchScript;
    }

    internal class SelectorRenderer
    {
        public string RenderTemplate(Selector subject, HtmlRenderContext context)
        {
            var select = (Select)subject.Context.GetUntypedValue(context.Region.Semantics);

            var data = new SelectorRenderData
                           {
                               Selector = subject,
                               RenderContext = context,
                               Comparison = context.Serializer.RenderInstance(subject.ComparisonExpression),
                               Symbol = (subject.Symbol == null) ? null : context.Serializer.RenderInstance(subject.Symbol),
                               Tip = (subject.Tip == null) ? null : context.Serializer.RenderInstance(subject.Tip),
                               From = context.Serializer.RenderInstance(subject.AllItems),
                               Current = context.Serializer.RenderInstance(subject.SelectedItems),
                               AvailableTemplateScript = (subject.AvailableTemplate == null) ? null : context.RenderTemplate(subject.AvailableTemplate.Tree),
                               SelectedTemplateScript = (subject.SelectedTemplate == null) ? null : context.RenderTemplate(subject.SelectedTemplate.Tree),
                               CaptureId = select.CaptureId,
                               CaptureKeyScript = (select.CaptureKey == null) ? null : context.Serializer.RenderInstance(select.CaptureKey),
                               IncrementalSearchScript = (subject.IncrementalSearchExpression == null) ? null : context.Serializer.RenderInstance(subject.IncrementalSearchExpression)
                           };

            var cf = subject.Filter as CategoryFilter;
            if (cf != null)
            {
                data.CategoryFilter = true;
                data.Categories = context.Serializer.RenderInstance(cf.Categories);
                data.Category = context.Serializer.RenderInstance(cf.Category);
                data.CompareCategories = context.Serializer.RenderInstance(cf.CompareCategories);
                data.GetCategoryKey = context.Serializer.RenderInstance(cf.GetCategoryKey);
                data.GetItemCategories = context.Serializer.RenderInstance(cf.GetItemCategories);
            }

            var tt = new SelectorTemplate { Session = new Dictionary<string, object> {{ "Data", data }} };
            tt.Initialize();
            return tt.TransformText();
        }
    }
}
