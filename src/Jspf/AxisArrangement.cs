namespace Jspf
{
    public class AxisArrangement
    {
        public int Position = 0;
        public int Length = 0;

        public AxisArrangement(int position, int length)
        {
            Position = position;
            Length = length;
        }

        public AxisArrangement Clone()
        {
            return new AxisArrangement(Position, Length);
        }
    }
}