using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Odo.Core
{
    public interface IValueSubject<T> : IObservable<T>
    {
        T Value { get; set; }
        IObservable<T> Source { get; set; } // TODO IQbservable
    }

    public sealed class ValueSubject<T> : IValueSubject<T>
    {
        public T Value { get; set; }
        public IObservable<T> Source { get; set; } // TODO IQbservable

        public IDisposable Subscribe(IObserver<T> observer)
        {
            throw new InvalidOperationException("This implementation of ValueSubject is declarative only and should never be subscribed to.");
        }
    }
}
