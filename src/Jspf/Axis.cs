using System;

namespace Jspf
{
    public class Axis
    {
        public int Length = -1;
        public int MinLength = -1;
        public int MaxLength = -1;
        public int NearMargin = 0;
        public int FarMargin = 0;
        public AxisAlignment Alignment = AxisAlignment.Stretch;

        public int EffectiveMaxLength()
        {
            return (MaxLength < 0) ?  Constants.MAX_INT : MaxLength; 
        }

        public int EffectiveMinLength()
        {
            return Math.Max(MinLength, 0);
        }

        public int EffectiveLength()
        {
            return Math.Min(EffectiveMaxLength(), Math.Max(EffectiveMinLength(), Length));
        }
    }
}