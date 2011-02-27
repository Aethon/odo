using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Odo.Core
{
    public static class Check
    {
        public static T NotNull<T>(T value, string name = null, string message = null) where T : class
        {
            if (value == null)
                throw new ArgumentNullException(name, message);
            return value;
        }

        public static T NotNull<T>(T? value, string name = null, string message = null) where T : struct
        {
            if (!value.HasValue)
                throw new ArgumentNullException(name, message);
            return value.Value;
        }

        public static string Matches(string value, Regex validation, string name = null, string message = null)
        {
            if (!validation.IsMatch(value))
                throw new ArgumentException(name, message);
            return value;
        }

        internal static T Null<T>(T value, string name = null, string message = null) where T : class
        {
            if (value != null)
                throw new ArgumentException(message, name);
            return null;
        }
    }
}
