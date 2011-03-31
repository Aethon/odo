using System.Collections;

namespace Jspf
{
    public class Table : ItemsSelectorControl
    {
        public ColumnTemplate[] ColumnTemplates
        {
            get { return _columnTemplates; }
            set { _columnTemplates = value; }
        }

        private ColumnTemplate[] _columnTemplates;

        public Table()
        {
            _itemContainerGenerator = new TableItemContainerGenerator();
        }

        private void RefreshFromSelection()
        {
            ArrayList active = ItemContainerGenerator.GetActiveItems();
            for (int i = active.Count - 1; i >= 0; i--)
            {
                object item = active[i];
                UiElement container = ItemContainerGenerator.GetContainerForItem(item); // TODO: must be able to get intermediate item as well
                if (container != null)
                {
                   //TODO ((TableItem)container).Selected = Selection.IndexOf(item) >= 0;
                }
            }
        }

    }
}
