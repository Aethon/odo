// TempBridgeItems.cs
//

using System;
using System.Collections;
using System.Runtime.CompilerServices;
using jQueryApi;

namespace Jspf
{
    public delegate ArrayList KoObservableArray();

    public delegate int UniqueSortCompare(object left, object right);

    internal class Generation
    {
        public Control Container;
        public object Item;

        public Generation(object item, Control container)
        {
            Container = container;
            Item = item;
        }
    }

    public class OldListItemContainerGenerator : IItemContainerGenerator
    {
        private readonly ArrayList _generations = new ArrayList();

        public UniqueSortCompare Comparer
        {
            get { return _comparer; }
            set { _comparer = value; }
        }
        private UniqueSortCompare _comparer;

        public KoObservableArray AllItems
        {
            get { return _allItems; }
            set
            {
                _allItems = value;
                if (_allItems != null)
                {
                    ((KoSubscribable) (object) _allItems).Subscribe(delegate
                                                                        {
                                                                            if (Changed != null)
                                                                                Changed();
                                                                        });
                }
            }
        }
        private KoObservableArray _allItems;

        public int Count()
        {
            return _allItems == null ? 0 : _allItems().Count;
        }

        public Template ItemTemplate
        {
            get { return _itemTemplate; }
            set { _itemTemplate = value; }
        }

        private Template _itemTemplate;


        public Control GenerateContainer(int index)
        {
            Control result = GetContainerForIndex(index);
            if (result == null)
            {
                object item = _allItems()[index];
                result = _itemTemplate(item);
                _generations.Add(new Generation(item, result));
            }
            return result;
        }

        public Control GetContainerForIndex(int index)
        {
            object item = _allItems()[index];
            return GetContainerForItem(item);
        }

        public Control GetContainerForItem(object item)
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

        public object GetItemForContainer(Control container)
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

        public int GetIndexForContainer(Control container)
        {
            object item = GetItemForContainer(container);
            if (item == null)
                return -1;

            return ((ArrayListExt) (object) _allItems()).BinarySearch(item, _comparer);
        }

        public void ReleaseContainer(Control container)
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

    public delegate void ActionObject(object value);

    [Imported]
    public class KoSubscribable
    {
        public Action Subscribe(ActionObject handler)
        {
            return null;
        }
    }
}

namespace System
{
    [Imported]
    public class ArrayListExt
    {
        public int BinarySearch(object item, Jspf.UniqueSortCompare compare) { return 0; }
    }
}