using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Odo.Core.Semantics;

namespace Odo.Html.UnitTests
{
    public class TestValueType
    {
        public string Name { get; set; }
    }

    public class TestSemanticView : Semantic
    {
        public string Statement { get; set; }

        public TestValueType Type { get; set; }

        public TestValueType AltType { get; set; }

        public Select<TestValueType,TestValueType> Select1 { get; private set; }

        public TestSemanticView()
        {
            var testValues = new[]
                                 {
                                     new TestValueType() {Name = "One"},
                                     new TestValueType() {Name = "Two"},
                                     new TestValueType() {Name = "Three"}
                                 };
            var selectedValues = new[] {testValues[1]};

            this.Select(t => t.Select1, t => testValues, t => selectedValues);

            Statement = "I am the very model";
            Type  = new TestValueType() { Name = "modern major general"};
            AltType = Type;
        }
    }
}
