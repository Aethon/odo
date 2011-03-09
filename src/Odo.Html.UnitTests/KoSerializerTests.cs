using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using NUnit.Framework;
using Odo.Core.Rendering;
using Odo.Html.Rendering;

namespace Odo.Html.UnitTests
{
    [TestFixture]
    public class KoSerializerTests
    {
        [Test]
        public void Serializes()
        {
            using (var sw = new StringWriter())
            using (var writer = new IndentedTextWriter(sw, "    "))
            {
              //  new KoSerializer(writer).Serialize("viewModel", new TestSemanticView());
                writer.Flush();
                Console.WriteLine(sw.GetStringBuilder().ToString());
            }
        }



        [Test]
        public void Test()
        {
            /*
            var sv = new TestSemanticView();

            //var infos = new List<TypeSerializationInfo>();
            //infos.Add(new TypeSerializationInfo(typeof(TestSemanticView), new[] { "Statement", "Type", "AltType", "Select1" }));
            //infos.Add(new TypeSerializationInfo(typeof(TestValueType), new[] { "Name" }));
            //infos.Add(new TypeSerializationInfo(typeof(Select<TestValueType>), new[] { "From", "Result" }));

            var a = new RegionAnalyzer().Analyze(sv, new Expression<Func<TestSemanticView,object>>[] {t => t.Select1.From});

            var s = new SerializationScheduler().Schedule(sv, "viewModel", a);

            using (var sw = new StringWriter())
            using (var writer = new StructuredCodeWriter(sw, "    "))
            {
                new KoSerializer(writer).Serialize(s);
                writer.Flush();
                Console.WriteLine(sw.GetStringBuilder().ToString());
            }*/
        }
        
        [Test]
        public void Junk()
        {
            var exp = Getfn(6);

            var fn = exp.Compile();

            var x = fn();

            //int r = new Random().Next();

            //var ps = new Dictionary<string, object> {{"r", r}};

            //var fn2 = new ApplyParametersExpressionVisitor(ps).Visit(fn.Body);
        }

        private static Expression<Func<int>> Getfn(int k)
        {
            var r = new Random().Next();
            return () => r * 4 + k;
        }
        
    }
}
