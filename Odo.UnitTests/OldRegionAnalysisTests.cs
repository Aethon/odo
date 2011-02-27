using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using NUnit.Framework;
using Odo.Core;
using Odo.Core.Rendering;
using Odo.Core.Semantics;

namespace Odo.UnitTests
{
#if NO
    abstract class BindingAnalysisTestBase
    {
        protected class MockPortabilityTester : IPortabilityTester
        {
            private static readonly MethodInfo PortableFunctionMethodInfo =
                typeof (BindingAnalysisTestBase).GetMethod("PortableFunction", Type.EmptyTypes);

            public bool IsPortable(MethodInfo method)
            {
                // this test just assumes one known portable function
                return PortableFunctionMethodInfo == method;
            }
        }

        public static readonly string StaticMember = "";

        public static int PortableFunction()
        {
            return 0;
        }

        public static int NonportableFunction()
        {
            return 0;
        }

        protected class TestType
        {
            public int X { get; set; }
            public int Y { get; set; }
        }

        protected class TestSemantics : Semantic
        {
            public Select<int> SelectNumber;

            public Select<int>[] Selects;

            public TestSemantics()
            {
                this.Select(s => s.SelectNumber, s => new[] { 1, 2, 3, 4 });

                Selects = new [] { SelectNumber };
            }
        }

        protected LinkAnalysis Analysis { get; private set; }

        protected void Analyze(Binding binding, object context)
        {
            var analyzer = new LinkAnalyzer(new MockPortabilityTester());
            Analysis = analyzer.Analyze(binding.BindingLambda, context);
        }

        protected void Analyze(LambdaExpression expression)
        {
            var analyzer = new LinkAnalyzer(new MockPortabilityTester());
            Analysis = analyzer.Analyze(expression, null);
        }

        protected bool IsClosureType(Type type)
        {
            return type.Name.StartsWith("<>");
        }
    }

    [TestFixture]
    class ReflexiveBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => x), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void UsesContext() { Assert.That(Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasNoDependencies() { Assert.That(Analysis.Dependencies.Count == 0); }
    }

    [TestFixture]
    class ConstantBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => 1), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasOneConstant() { Assert.That(Analysis.Constants.Count == 1); }

        [Test]
        public void ConstantIs1() { Assert.That(((int) Analysis.Constants[0]) == 1); }

        [Test]
        public void HasNoDependencies() { Assert.That(Analysis.Dependencies.Count == 0); }
    }

    [TestFixture]
    class StaticMemberBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => StaticMember), new TestSemantics());
        }

        [Test]
        public void IsNotPortable() { Assert.That(!Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasNoDependencies() { Assert.That(Analysis.Dependencies.Count == 0); }
    }

    [TestFixture]
    class PortableFunctionBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => PortableFunction()), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasNoDependencies() { Assert.That(Analysis.Dependencies.Count == 0); }
    }

    [TestFixture]
    class NonportableFunctionBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => NonportableFunction()), new TestSemantics());
        }

        [Test]
        public void IsNotPortable() { Assert.That(!Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasNoDependencies() { Assert.That(Analysis.Dependencies.Count == 0); }
    }

    [TestFixture]
    class ClosureBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            var local = 1;
            Analyze(Binding.Create((TestSemantics x) => local), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasOneConstant() { Assert.That(Analysis.Constants.Count == 1); }

        [Test]
        public void ConstantIsClosure() { Assert.That(IsClosureType(Analysis.Constants[0].GetType())); }

        [Test]
        public void HasOneDependency() { Assert.That(Analysis.Dependencies.Count == 1); }

        [Test]
        public void DependencyIsMemberOfClosure() { Assert.That(IsClosureType(Analysis.Dependencies[0].Member.DeclaringType)); }

        [Test]
        public void DependencyIsNamedlocal() { Assert.That(Analysis.Dependencies[0].Member.Name == "local"); }

        [Test]
        public void DependencyHasNoInstance() { Assert.That(Analysis.Dependencies[0].Instance == null); }
    }

    class ContextMemberBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => x.SelectNumber), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void UsesContext() { Assert.That(Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasOneDependency() { Assert.That(Analysis.Dependencies.Count == 1); }

        [Test]
        public void DependencyIsMemberOfContext() { Assert.That(Analysis.Dependencies[0].Member.DeclaringType == typeof(TestSemantics)); }

        [Test]
        public void DependencyIsNamedSelectNumber() { Assert.That(Analysis.Dependencies[0].Member.Name == "SelectNumber"); }

        [Test]
        public void DependencyHasInstance() { Assert.That(Analysis.Dependencies[0].Instance != null); }
    }

    class ContextMemberChainBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestSemantics x) => x.SelectNumber.From), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void UsesContext() { Assert.That(Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasTwoDependencies() { Assert.That(Analysis.Dependencies.Count == 2); }

        [Test]
        public void OneDependencyIsMemberOfContext() { Assert.That(Analysis.Dependencies.Count(d => d.Member.DeclaringType == typeof(TestSemantics) && d.Member.Name == "SelectNumber") == 1); }

        [Test]
        public void OneDependencyIsMemberOfSelect() { Assert.That(Analysis.Dependencies.Count(d => typeof(Select).IsAssignableFrom(d.Member.DeclaringType) && d.Member.Name == "From") == 1); }

        [Test]
        public void DependenciesHaveInstances() { Assert.That(Analysis.Dependencies.Count(d => d.Instance != null) == 2); }
    }

    class InterruptedContextMemberChainBindingAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            var local = 0;
            Analyze(Binding.Create((TestSemantics x) => x.Selects[local].From), new TestSemantics());
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void UsesContext() { Assert.That(Analysis.UsesContext); }

        [Test]
        public void HasOneConstant() { Assert.That(Analysis.Constants.Count == 1); }

        [Test]
        public void ConstantIsClosure() { Assert.That(IsClosureType(Analysis.Constants[0].GetType())); }

        [Test]
        public void HasThreeDependencies() { Assert.That(Analysis.Dependencies.Count == 3); }

        [Test]
        public void OneDependencyIsMemberOfContext() { Assert.That(Analysis.Dependencies.Count(d => d.Member.DeclaringType == typeof(TestSemantics) && d.Member.Name == "Selects") == 1); }

        [Test]
        public void OneDependencyIsMemberOfSelect() { Assert.That(Analysis.Dependencies.Count(d => typeof(Select).IsAssignableFrom(d.Member.DeclaringType) && d.Member.Name == "From") == 1); }

        [Test]
        public void OneDependencyIsMemberOfClosure() { Assert.That(Analysis.Dependencies.Count(d => IsClosureType(d.Member.DeclaringType) && d.Member.Name == "local") == 1); }
    }

    class MemberExpressionAnalysisTests : BindingAnalysisTestBase
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(Binding.Create((TestType t) => t.X + t.Y).BindingLambda);
        }

        [Test]
        public void IsPortable() { Assert.That(Analysis.IsPortable); }

        [Test]
        public void DoesNotUseContext() { Assert.That(!Analysis.UsesContext); }

        [Test]
        public void HasNoConstants() { Assert.That(Analysis.Constants.Count == 0); }

        [Test]
        public void HasTwoDependencies() { Assert.That(Analysis.Dependencies.Count == 2); }

        [Test]
        public void OneDependencyIsX() { Assert.That(Analysis.Dependencies.Count(d => d.Member.DeclaringType == typeof(TestType) && d.Member.Name == "X") == 1); }

        [Test]
        public void OneDependencyIsY() { Assert.That(Analysis.Dependencies.Count(d => d.Member.DeclaringType == typeof(TestType) && d.Member.Name == "Y") == 1); }
    }
#endif
}
