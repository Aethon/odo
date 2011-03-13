using System;
using System.Collections;
using System.Runtime.CompilerServices;

namespace QUnit4SS
{
    [Imported]
    [IgnoreNamespace]
    public static class QUnit
    {
        [ScriptAlias("module")]
        public static void module(string name)
        {
        }

        [ScriptAlias("test")]
        public static void test(string name, Action test)
        {
        }

        [ScriptAlias("ok")]
        public static void ok(bool assertion)
        {
        }

        [ScriptAlias("ok")]
        public static void ok(bool assertion, string message)
        {
        }

        [ScriptAlias("equals")]
        public static void equals(object value, object expected)
        {
        }

        [ScriptAlias("equals")]
        public static void equals(object value, object expected, string message)
        {
        }
    }
}
