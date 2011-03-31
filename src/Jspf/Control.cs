using System;
using System.Collections;
using jQueryApi;

namespace Jspf
{
    public delegate UiElement ControlTemplate(Control control);

    public abstract class Control : UiElement
    {
        public ControlTemplate Template
        {
            get { return _template; }
            set { _template = value; }
        }
        private ControlTemplate _template;

        protected UiElement VisualTree
        {
            get { return _visualTree; }
        }
        private UiElement _visualTree;

        public UiElement GetTemplateElement(string elementName)
        {
            // TODO:
            return null;
        }

        protected void ApplyTemplate()
        {
            ReleaseVisualTree();
            ControlTemplate template = Template ?? DefaultControlTemplate;
            _visualTree = template(this);
            // TODO: OnApplyTemplate
        }

        protected void ReleaseVisualTree()
        {
            // TODO
            _visualTree = null;
        }

        private static UiElement DefaultControlTemplate(Control control)
        {
            DomUiElement result = new DomUiElement();
            result.DomContent = jQuery.FromHtml("<div style='background: red;></div>").GetElement(0);
            return result;
        }
    }
}
