namespace Jspf
{
    public class TableItem
    {
        public object Item;
        public int Index;
        public bool IsSelected;

        public TableItem(object item, int index)
        {
            Item = item;
            Index = index;
        }
    }
}