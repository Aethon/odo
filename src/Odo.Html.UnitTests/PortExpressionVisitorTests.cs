using System;
using System.Linq.Expressions;
using Microsoft.JScript;
using Microsoft.JScript.Vsa;
using NUnit.Framework;
using Odo.Core;
using Odo.Core.Design;
using Odo.Core.Semantics;
using Odo.Html.Rendering;

namespace Odo.Html.UnitTests
{
    [TestFixture]
    public class PortExpressionVisitorTests
    {
#pragma warning disable 0618
        public static VsaEngine Engine = VsaEngine.CreateEngine();
#pragma warning restore 0618
        /*
        public static JavaScriptExpressionPorter CreatePorter()
        {
            var sview = new TestSemanticView();
            return new JavaScriptExpressionPorter(AppRegion.Create("testRegion", sview, DesignTemplate<TestSemanticView>.Create(d => d.Selector(s => s.Select1, b => b))));
        }

        public static TResult EvaluateJavascriptFunction<TResult>(string script, params object[] args)
        {
            var closure = (Closure)Eval.JScriptEvaluate("(" + script + ")", Engine);
            return (TResult)closure.Invoke(closure, args);
        }

        private static ExpressionPort LogAndPort(JavaScriptExpressionPorter porter, Expression exp)
        {
            Console.WriteLine("Checking port correctness for: {0}", exp);
            var result = porter.PortAsLambda(exp);
            Console.WriteLine("Resulting port: {0}", result.PortedText);
            return result;
        }

        private static void AssertFuncPortIsCorrect<TResult>(JavaScriptExpressionPorter porter, Expression<Func<TResult>> exp)
        {
            var port = LogAndPort(porter, exp);
            var fn = exp.Compile();
            var csResult = fn();
            var jsResult = EvaluateJavascriptFunction<TResult>(port.PortedText);
            Assert.AreEqual(csResult, jsResult, "Ported code did not evaluate the same as the native code.");
        }

        private static void AssertFuncPortIsCorrect<T1, TResult>(JavaScriptExpressionPorter porter, Expression<Func<T1, TResult>> exp, T1 arg1)
        {
            var port = LogAndPort(porter, exp);
            var fn = exp.Compile();
            var csResult = fn(arg1);
            var jsResult = EvaluateJavascriptFunction<TResult>(port.PortedText, arg1);
            Assert.AreEqual(csResult, jsResult, "Ported code did not evaluate the same as the native code.");
        }

        [Test]
        public void ExpressionVisitorVisits()
        {
            Expression<Func<int, int>> exp = i => i * 2 + 6 * i * i;
            AssertFuncPortIsCorrect(CreatePorter(), exp, 4);
        }

        [Test]
        public void ExpressionVisitorVisits1()
        {
            Expression<Func<string>> exp = () => @"I am 'the very model of a \modern major general\.'";
            AssertFuncPortIsCorrect(CreatePorter(), exp);
        }
         * */
    }
}
