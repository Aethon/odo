using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Odo.Core.Design
{
    public static class WellKnownHelpers
    {
        public static int CompareForIncrementalSearch(string search, string candidate)
        {
            var comp = string.Compare(search, candidate, true);
            if (comp >= 0)
                return comp;
            return candidate.StartsWith(search, true, null) ? 0 : -1;
        }
    }
}
