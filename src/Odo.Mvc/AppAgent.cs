using System.Collections.Generic;
using System.Threading;
using Odo.Core;

namespace Odo.Mvc
{
    class AppAgent
    {
        private int _nextId;
        internal string GetRegionName()
        {
            return string.Format("region{0}", Interlocked.Increment(ref _nextId));
        }
        internal readonly List<AppRegion> Regions = new List<AppRegion>();
    }
}