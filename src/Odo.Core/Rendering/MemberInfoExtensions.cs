using System;
using System.Reflection;

namespace Odo.Core.Rendering
{
    public static class MemberInfoExtensions
    {
        public static object GetValue(this MemberInfo @this, object obj, object[] index)
        {
            if (@this is PropertyInfo)
                return ((PropertyInfo) @this).GetValue(obj, index);
            if (@this is FieldInfo)
                return ((FieldInfo) @this).GetValue(obj);
            throw new InvalidOperationException(string.Format("Cannot get a value using '{0}'.", @this.GetType().Name));
        }
    }

}
