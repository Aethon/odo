namespace Jspf
{
    public class Size
    {
        public int Width;
        public int Height;

        public Size(int width, int height)
        {
            Width = width;
            Height = height;
        }

        public Size Clone()
        {
            return new Size(Width, Height);
        }
    }
}