using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using Odo.Core.Design;

namespace Odo.Core.Semantics
{
    public abstract class Select : Semantic
    {
        public Binding From { get; protected set; }
        public Binding Current { get; protected set; }
        public Binding Categories { get; protected set; }
        public Binding ActiveCategory { get; protected set; } // this is ergonomic, not semantic...FIX IT
        public Binding<int> AtLeast { get; protected set; }
        public Binding<int> AtMost { get; protected set; }
        public string CaptureId { get; internal set; }
        public Expression CaptureKey { get; internal set; }
    }

    public class Select<T,TCat> : Select
    {
        public new Binding<IEnumerable<T>> From
        {
            get { return (Binding<IEnumerable<T>>)base.From; }
            set { base.From = value; }
        }

        public new Binding<IEnumerable<T>> Current
        {
            get { return (Binding<IEnumerable<T>>)base.Current; }
            set { base.Current = value; }
        }

        public new Binding<IEnumerable<TCat>> Categories
        {
            get { return (Binding<IEnumerable<TCat>>)base.Categories; }
            set { base.Categories = value; }
        }

        public new Binding<IEnumerable<TCat>> ActiveCategory
        {
            get { return (Binding<IEnumerable<TCat>>)base.ActiveCategory; }
            set { base.ActiveCategory = value; }
        }
    }
}
