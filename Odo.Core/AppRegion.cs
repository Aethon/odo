using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Odo.Core.Design;
using Odo.Core.Semantics;
using System.Diagnostics.Contracts;

namespace Odo.Core
{
    // represents a visual unit of user-interaction (e.g., a dialog, a login creds area)
    public class AppRegion
    {
        public string Name { get; private set; }
        public object Semantics { get; private set; }
        public DesignTemplate Template { get; private set; }

        private readonly static Regex NameValidation = new Regex("^[a-zA-Z_][a-zA-Z0-9_]*$");

        private AppRegion(string name, object semantics, DesignTemplate template)
        {
            Contract.Assert(NameValidation.IsMatch(name));
            Contract.Assert(semantics != null);
            Contract.Assert(template != null);
            Name = name;
            Semantics = semantics;
            Template = template;
        }

        // enforce type safety on creation...
        public static AppRegion Create<T>(string name, T semantics, DesignTemplate template) where T:class
        {
            Contract.Assert(NameValidation.IsMatch(name));
            Contract.Assert(semantics != null);
            Contract.Assert(template != null);

            return new AppRegion(name, semantics, template);
        }
    }
}
