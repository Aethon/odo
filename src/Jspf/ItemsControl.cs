using jQueryApi;

namespace Jspf
{
    public class ItemsControl : Control
    {
        public ISortedSet Source
        {
            get { return _source; }
            set
            {
                if (value != _source)
                {
                    _source = value ?? SortedSet.Empty;
                    InvalidateMeasure();
                    OnPropertyChanged("Source");
                }
            }
        }
        private ISortedSet _source = SortedSet.Empty;

        public Template ItemTemplate
        {
            get { return _itemTemplate; }
            set
            {
            //    if (value != _itemTemplate)
                {
                    _itemTemplate = value;
                    InvalidateMeasure();
                    OnPropertyChanged("ItemTemplate");
                }
            }
        }
        private Template _itemTemplate;

        public ControlTemplate ItemContainerTemplate
        {
            get { return _itemContainerTemplate; }
            set
            {
             //   if (value != _itemContainerTemplate)
                {
                    _itemContainerTemplate = value;
                    InvalidateMeasure();
                    OnPropertyChanged("ItemContainerTemplate");
                }

                _itemContainerTemplate = value;
            }
        }
        private ControlTemplate _itemContainerTemplate;

        public virtual IItemContainerGenerator ItemContainerGenerator { get { return _itemContainerGenerator; } }
        protected IItemContainerGenerator _itemContainerGenerator;
        /*
        public override void OnApplyTemplate()
        {
            _itemsPanel = this.GetTemplateElement("")    
        }
        */
        // TODO: replace with a base class (and find from template, please)
        protected VirtualStackPanel ItemsPanel { get { return _itemsPanel; } set { _itemsPanel = value; } }
        private VirtualStackPanel _itemsPanel;

        private static UiElement DefaultItemTemplate(object data)
        {
            DomUiElement result = new DomUiElement();
            result.DomContent = jQuery.FromHtml("<div style='height: 12px'>" + data + "</div>")[0];
            return result;
        }
    }
}