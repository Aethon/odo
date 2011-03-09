using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using NUnit.Framework;
using Odo.Core;
using Odo.Core.Conversation;
using Odo.Core.Design;
using Odo.Core.Rendering;

namespace Odo.UnitTests
{
    public class TestType
    {
        public int X { get; set; }
        public int Y { get; set; }
    }

    public class TestTypeType
    {
        public TestType T1 { get; set; }
        public TestType T2 { get; set; }
    }

    public class TestSemantics : Semantic
    {
        public int IntProperty { get; set; }
    
        public Binding<IEnumerable<TestType>> StaticArrayBinding { get; private set; }
        public Binding<IEnumerable<TestType>> StaticArrayBindingBinding { get; private set; }

        public TestSemantics()
        {
//            var common = new TestTypeType {X = 1, Y = 1};
  //          var tt = new [] { common, common };

            IntProperty = 42;
       //     StaticArrayBinding = Binding.Create((TestSemantics t) => (IEnumerable<TestType>)tt);
       //   StaticArrayBindingBinding = Binding.Create((TestSemantics t) => Bind(t.StaticArrayBinding));
        }
    }

    public class TestElements
    {
        public static readonly string StaticShortString = "short";
        public static readonly string StaticLongString = "I am the very model of a modern major general";

        public static TestType[] StaticArray { get { return _staticArray; } }
        private static readonly TestType[] _staticArray = new[]
                                                        {
                                                            new TestType {X = 1, Y = 1},
                                                            new TestType {X = 2, Y = 2},
                                                            new TestType {X = 3, Y = 3}
                                                        };

        public static int PortableFunction()
        {
            return 0;
        }

        public static int NonportableFunction()
        {
            return 0;
        }

        public static IEnumerable<object> NoLinks = new object[0];
    }

    public abstract class BindingAnalysisTestBase<T> where T : Semantic
    {
        protected T Semantics { get; set; }
        protected List<RenderNode> Analysis { get; private set; }

        protected void Analyze(IEnumerable<object> externalLinks, T semantics)
        {
            Semantics = semantics;

            var analyzer = new RegionAnalyzer(new RegionAnalysisStrategy());
            Analysis = analyzer.Analyze(externalLinks, semantics).ToList();
        }

        protected RenderNode Instance(object instance)
        {
            return Analysis.Where(x => x.Instance.Equals(instance)).SingleOrDefault();
        }
    
        protected int InstanceDependencyCount(object instance)
        {
            return Analysis.Where(x => x.Instance.Equals(instance)).Single().Dependencies.Count;
        }

        protected int InstanceDependentCount(object instance)
        {
            return Analysis.Where(x => x.Instance.Equals(instance)).Single().Dependents.Count;
        }

        protected int InstanceMemberCount(object instance)
        {
            return Analysis.OfType<ObjectOrValueNode>().Where(x => x.Instance.Equals(instance)).Single().Members.Count;
        }
    
        protected int InstanceElementCount(object instance)
        {
            return Analysis.OfType<CollectionNode>().Where(x => x.Instance.Equals(instance)).Single().Elements.Count;
        }
    }

    [TestFixture]
    class BasicAnalysisTests
    {
        [Test]
        public void AnalyzeWithNullLinksThrows()
        {
            var analyzer = new RegionAnalyzer(new RegionAnalysisStrategy());
            Assert.Throws<ArgumentNullException>(() => analyzer.Analyze(null, new TestSemantics()));
        }

        [Test]
        public void AnalyzeWithNoLinksDoesNotThrow()
        {
            var analyzer = new RegionAnalyzer(new RegionAnalysisStrategy());
            Assert.DoesNotThrow(() => analyzer.Analyze(TestElements.NoLinks, new TestSemantics()));
        }

        [Test]
        public void AnalyzeWithNullSemanticThrows()
        {
            var analyzer = new RegionAnalyzer(new RegionAnalysisStrategy());
            Assert.Throws<ArgumentNullException>(() => analyzer.Analyze(TestElements.NoLinks, null));
        }
    }
    
    [TestFixture]
    class EmptyAnalysisTests : BindingAnalysisTestBase<TestSemantics>
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(TestElements.NoLinks, new TestSemantics());
        }

        [Test]
        public void HasOneItem() { Assert.AreEqual(1, Analysis.Count); }

        [Test]
        public void HasSemantics() { Assert.NotNull(Instance(Semantics)); }

        [Test]
        public void SemanticsHasNoDependency() { Assert.AreEqual(0, InstanceDependencyCount(Semantics)); }

        [Test]
        public void SemanticsHasNoDependents() { Assert.AreEqual(0, InstanceDependentCount(Semantics)); }

        [Test]
        public void SemanticsHasNoElements() { Assert.AreEqual(0, InstanceElementCount(Semantics)); }

        [Test]
        public void SemanticsHasNoMembers() { Assert.AreEqual(0, InstanceMemberCount(Semantics)); }
    }

    [TestFixture]
    class ConstantBindingTests : BindingAnalysisTestBase<TestSemantics>
    {
        private readonly Binding<int> _binding = Binding.Create((TestSemantics x) => 1);
        
        [SetUp]
        public void SetUp()
        {
            Analyze(new[] { _binding }, new TestSemantics());
        }

        [Test]
        public void HasThreeItems() { Assert.That(Analysis.Count == 3); }

        [Test]
        public void HasOriginalBinding() { Assert.NotNull(Instance(_binding)); }

        [Test]
        public void OriginalBindingHasOneDependency() { Assert.AreEqual(1, InstanceDependencyCount(_binding)); }

        [Test]
        public void OriginalBindingHasNoDependents() { Assert.AreEqual(0, InstanceDependentCount(_binding)); }

        [Test]
        public void OriginalBindingDependentsOnConstant() { Assert.That((int)Instance(_binding).Dependencies.First().Instance == 1); }

        [Test]
        public void HasSemantics() { Assert.NotNull(Instance(Semantics)); }

        [Test]
        public void SemanticsHasNoDependency() { Assert.AreEqual(0, InstanceDependencyCount(Semantics)); }

        [Test]
        public void SemanticsHasNoDependents() { Assert.AreEqual(0, InstanceDependentCount(Semantics)); }

        [Test]
        public void SemanticsHasNoElements() { Assert.AreEqual(0, InstanceElementCount(Semantics)); }

        [Test]
        public void SemanticsHasNoMembers() { Assert.AreEqual(0, InstanceMemberCount(Semantics)); }

        [Test]
        public void HasConstant() { Assert.NotNull(Instance(1)); }

        [Test]
        public void ConstantHasNoDependency() { Assert.AreEqual(0, InstanceDependencyCount(1)); }

        [Test]
        public void ConstantHasOneDependent() { Assert.AreEqual(1, InstanceDependentCount(1)); }

        [Test]
        public void ConstantHasNoElements() { Assert.AreEqual(0, InstanceElementCount(1)); }

        [Test]
        public void ConstantHasNoMembers() { Assert.AreEqual(0, InstanceMemberCount(1)); }
    }

    [TestFixture]
    class PropertyBindingTests : BindingAnalysisTestBase<TestSemantics>
    {
        private readonly Binding<int> _binding = Binding.Create((TestSemantics x) => x.IntProperty);

        [SetUp]
        public void SetUp()
        {
            Analyze(new[] { _binding }, new TestSemantics());
        }

        [Test]
        public void HasThreeItems() { Assert.That(Analysis.Count == 3); }

        [Test]
        public void HasOriginalBinding() { Assert.NotNull(Instance(_binding)); }

        [Test]
        public void OriginalBindingHasNoDependency() { Assert.AreEqual(0, InstanceDependencyCount(_binding)); }

        [Test]
        public void OriginalBindingHasNoDependents() { Assert.AreEqual(0, InstanceDependentCount(_binding)); }

        [Test]
        public void HasSemantics() { Assert.NotNull(Instance(Semantics)); }

        [Test]
        public void SemanticsHasOneDependency() { Assert.AreEqual(1, InstanceDependencyCount(Semantics)); }

        [Test]
        public void SemanticsDependsOnIntValue() { Assert.AreEqual(Semantics.IntProperty, Instance(Semantics).Dependencies.First().Instance); }

        [Test]
        public void SemanticsHasNoDependents() { Assert.AreEqual(0, InstanceDependentCount(Semantics)); }

        [Test]
        public void SemanticsHasNoElements() { Assert.AreEqual(0, InstanceElementCount(Semantics)); }

        [Test]
        public void SemanticsHasOneMember() { Assert.AreEqual(1, InstanceMemberCount(Semantics)); }

      //  [Test]
      //  public void SemanticsMemberIsIntValue() { Assert.AreEqual(Semantics.IntProperty, Instance(Semantics).Members.Values.First().Instance); }

        [Test]
        public void HasIntValue() { Assert.NotNull(Instance(Semantics.IntProperty)); }

        [Test]
        public void ConstantHasNoDependency() { Assert.AreEqual(0, InstanceDependencyCount(Semantics.IntProperty)); }

        [Test]
        public void ConstantHasOneDependent() { Assert.AreEqual(1, InstanceDependentCount(Semantics.IntProperty)); }

        [Test]
        public void ConstantDependentIsSemantics() { Assert.AreEqual(Instance(Semantics), Instance(Semantics.IntProperty).Dependents.First()); }

        [Test]
        public void ConstantHasNoElements() { Assert.AreEqual(0, InstanceElementCount(Semantics.IntProperty)); }

        [Test]
        public void ConstantHasNoMembers() { Assert.AreEqual(0, InstanceMemberCount(Semantics.IntProperty)); }
    }

    [TestFixture]
    class ReflexiveBindingAnalysisTests : BindingAnalysisTestBase<TestSemantics>
    {
        [SetUp]
        public void SetUp()
        {
            Analyze(new [] {Binding.Create((TestSemantics x) => x.StaticArrayBindingBinding) }, new TestSemantics());
        }

        [Test]
        public void True() { Assert.That(true); }
    }
#if NO
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
