using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;

namespace Odo.Core.Design
{
    public class Designer<T>
    {
        public static readonly Designer<T> Empty = new Designer<T>(new List<DesignComponent>());

        public IEnumerable<DesignComponent> Components { get; private set; }

        public Designer(IEnumerable<DesignComponent> existingComponents, params DesignComponent[] newComponents)
        {
            Contract.Assert(existingComponents != null);
            Components = existingComponents.Union(newComponents).ToList();
        }
    }
}
