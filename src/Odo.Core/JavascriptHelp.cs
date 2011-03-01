using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Odo.Core
{
    public static class JavascriptHelp
    {
        // Source: _JavaScript: The Good Parts_, Douglas Crockford, 2008.
        private static readonly string[] ReservedWords = {
                                              "abstract",
                                              "boolean", "break", "byte",
                                              "case", "catch", "char", "class", "const", "continue",
                                              "debugger", "default", "delete", "do", "double",
                                              "else", "enum", "export", "extends",
                                              "false", "final", "finally", "float", "for", "function",
                                              "goto",
                                              "if", "implements", "import", "in", "instanceof", "int", "interface",
                                              "long",
                                              "native", "new", "null",
                                              "package", "private", "protected", "public",
                                              "return",
                                              "short", "static", "super", "switch", "synchronized",
                                              "this", "throw", "throws", "transient", "true", "try", "typeof",
                                              "var", "volatile", "void",
                                              "while", "with"
                                          };

        public static string ToSingleQuotedJsString(this object @this)
        {
            return string.Format("'{0}'", @this.ToString().Replace(@"\", @"\\").Replace("'", @"\'"));
        }

        public static string ToDoubleQuotedJsString(this object @this)
        {
            return string.Format("\"{0}\"", @this.ToString().Replace(@"\", @"\\").Replace("\"", "\\\""));
        }

        public static readonly Regex NameRegex = new Regex("^[a-zA-Z_][a-zA-Z0-9_]*$", RegexOptions.Singleline);

        public static string ToJsName(this string @this)
        {
            if (!NameRegex.IsMatch(@this))
                throw new ArgumentException(string.Format("'{0}' cannot be transformed into a unique JavaScript name.", @this));

            if (ReservedWords.Contains(@this))
                return "$" + @this; // since C# cannot use the dollar mark, we can use it to mangle names without worrying about collisions

            return @this;
        }
    }
}
