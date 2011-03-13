using System.Runtime.CompilerServices;

namespace Jspf
{
    [Imported] // because SS generates invalid code
    public enum AxisAlignment
    {
        Stretch = 0,
        Near = -1,
        Far = 1,
        Center = 2
    }
}