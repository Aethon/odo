// ColumnListItemContainerGenerator.cs
//

using System;
using System.Collections;
using jQueryApi;

namespace Jspf
{
    public class TableItemContainerGenerator : IItemContainerGenerator
    {
        private readonly ArrayList _generations = new ArrayList();

        public ISortedSet AllItems // TODO?: need to be able to bind this
        {
            get { return _allItems; }
            set
            {
                _allItems = value;
                if (Changed != null)
                    Changed();
            }
        }
        private ISortedSet _allItems;

        public int Count()
        {
            return _allItems == null ? 0 : _allItems.Count;
        }

        public Template ItemTemplate
        {
            get { return _itemTemplate; }
            set { _itemTemplate = value; }
        }

        private Template _itemTemplate;


        public UiElement GenerateContainer(int index)
        {
            UiElement result = GetContainerForIndex(index);
            if (result == null)
            {
                object item = _allItems.GetItem(index);
                result = _itemTemplate(new TableItem(item, index));
                _generations.Add(new Generation(item, result));
            }
            return result;
        }

        public UiElement GetContainerForIndex(int index)
        {
            object item = _allItems.GetItem(index);
            return GetContainerForItem(item);
        }

        public UiElement GetContainerForItem(object item)
        {
            for (int i = _generations.Count - 1; i >= 0; i--)
            {
                Generation g = (Generation)_generations[i];
                if (g.Item == item)
                {
                    return g.Container;
                }
            }
            return null;
        }

        public object GetItemForContainer(UiElement container)
        {
            for (int i = _generations.Count - 1; i >= 0; i--)
            {
                Generation g = (Generation)_generations[i];
                if (g.Container == container)
                {
                    return g.Item;
                }
            }
            return null;
        }

        public int GetIndexForContainer(UiElement container)
        {
            object item = GetItemForContainer(container);
            if (item == null)
                return -1;

            return _allItems.IndexOf(item);
        }

        public void ReleaseContainer(UiElement container)
        {
            for (int i = _generations.Count - 1; i >= 0; i--)
            {
                if (((Generation)_generations[i]).Container == container)
                {
                    _generations.RemoveAt(i);
                    break;
                }
            }
        }

        public event Action Changed;

        public ArrayList GetActiveItems()
        {
            return (ArrayList)(object)jQuery.Map((Array)(object)_generations, delegate(object element, int index) { return ((Generation) element).Item; });
        }
    }
}
