using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using NUnit.Framework;
using Odo.Core;
using Odo.Core.Rendering;

namespace Odo.UnitTests
{
    [TestFixture]
    public class ExpressionExtensionTests
    {
        private abstract class X
        {
            public readonly Y TheY = null;
            public readonly Y[] TheYs = null;
        }

        private abstract class Y
        {
            public readonly string N = null;
        }

        [Test]
        public void ComposeWithNullInstanceThrows()
        {
            Expression<Func<X, Y>> xtoy = null;
            Expression<Func<Y, Y>> atoa = a => a;
            Assert.Throws<ArgumentNullException>(() => xtoy.Compose(atoa));
        }

        [Test]
        public void ComposeWithNullChildThrows()
        {
            Expression<Func<X, Y>> xtoy = x => x.TheY;
            Expression<Func<Y, Y>> atoa = null;
            Assert.Throws<ArgumentNullException>(() => xtoy.Compose(atoa));
        }

        [Test]
        public void ComposeXtoYwithIdentityisXtoY()
        {
            Expression<Func<X, Y>> xtoy = x => x.TheY;
            Expression<Func<Y, Y>> atoa = a => a;

            var result = xtoy.Compose(atoa);

            Assert.AreEqual(xtoy.ToString(), result.ToString());
        }

        [Test]
        public void ComposeXtoYwithYtoNisXtoN()
        {
            Expression<Func<X, Y>> xtoy = x => x.TheY;
            Expression<Func<Y, string>> yton = y => y.N;

            var result = xtoy.Compose(yton);

            Expression<Func<X, string>> expected = x => x.TheY.N;
            Assert.AreEqual(expected.ToString(), result.ToString());
        }

        [Test]
        public void ApplyWithNullInstanceThrows()
        {
            Expression<Func<Func<X, IEnumerable<Y>>, Func<IEnumerable<X>, IEnumerable<Y>>>> xtoyviaz = null;
            Expression<Func<X, IEnumerable<Y>>> ztoy = g => g.TheYs;
            Assert.Throws<ArgumentNullException>(() => xtoyviaz.Apply(ztoy));
        }

        [Test]
        public void ApplyWithNullChildThrows()
        {
            Expression<Func<Func<X, IEnumerable<Y>>, Func<IEnumerable<X>, IEnumerable<Y>>>> xtoyviaz = g => h => h.SelectMany(g);
            Expression<Func<X, IEnumerable<Y>>> ztoy = null;
            Assert.Throws<ArgumentNullException>(() => xtoyviaz.Apply(ztoy));
        }

        
        [Test]
        public void ApplyApplies()
        {
            Expression<Func<Func<X, IEnumerable<Y>>, Func<IEnumerable<X>, IEnumerable<Y>>>> xtoyviaz = g => h => h.SelectMany(g);
            Expression<Func<X, IEnumerable<Y>>> ztoy = g => g.TheYs;

            var result = xtoyviaz.Apply(ztoy);

            Expression<Func<IEnumerable<X>, IEnumerable<Y>>> expected = h => h.SelectMany(g => g.TheYs);

            Assert.AreEqual(expected.ToString(), result.ToString());
        }
    }
}
