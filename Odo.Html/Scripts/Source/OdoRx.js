(function () {
    odo.Rx = {};

    if (ko !== undefined) {
        odo.Rx.KoToObservable = function (koObservable) {
            var observable = Rx.Observable.Create(function (observer) {
                if (observer) {
                    var sub = koObservable.subscribe(function (newValue) {
                        observer.OnNext(newValue);
                    });
                }
                return Rx.Disposable.Create(function () {
                    sub.dispose();
                });
            });
            return observable;
        };
    }

    Array.prototype.binarySearch = function (find, compare) {
        var low = 0;
        var high = this.length - 1;
        var i;
        var comparison;
        while (low <= high) {
            i = Math.floor((low + high) / 2);
            comparison = compare(this[i], find);
            if (!comparison) {
                return i;
            }
            if (comparison < 0) {
                low = i + 1;
            }
            else {
                high = i - 1;
            }
        }
        return -1;
    }

    var QueueTimeout = 1;
    var _notificationQueue = [];

    var _primeNotificationQueue = function () {
     //   if (_notificationQueue.length > 0) {
     //       setTimeout(_processNotificationQueue, QueueTimeout);
      //  }
    }

    var _processNotificationQueue = function () {
        if (_notificationQueue.length > 0) {
            var fn = _notificationQueue.pop();
            fn();
            _primeNotificationQueue();
        }
    };

    var _queueNotificationList = function (observerList, value) {
        var dispatchList = observerList.ToArray();
     //   _notificationQueue.unshift(function () {
            var count = dispatchList.length;
            for (var i = 0; i < count; i++) {
                try {
                    dispatchList[i].OnNext(value);
                }
                catch (x) {
                    // suppressed, we are not in a context to propagate.
                    // future: send to some exception sink
                }
            }
       // });
        _primeNotificationQueue();
    };

    var _queueNotification = function (observer, value) {
   //     _notificationQueue.unshift(function () {
            try {
                observer.OnNext(value);
            }
            catch (x) {
                // suppressed, we are not in a context to propagate.
                // future: send to some exception sink
            }
        //});
        _primeNotificationQueue();
    };

    odo.Rx.CreateValueSubject = function (defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = null;
        }

        var _value = null;
        var _source = null;
        var _default = null;
        var _observers = new Rx.List();
        var _subscription = null;
        var _observer = null;

        var vs = Rx.Observable.Create(function (observer) {
            if (observer) {
                _observers.Add(observer);
                _queueNotification(observer, vs.Value());
            }
            return Rx.Disposable.Create(function () {
                _observers.Remove(observer);
            });
        });

        vs.Value = function (newValue) {
            if (newValue === undefined) {
                return _value;
            }

            if (newValue === null) {
                if (typeof defaultValue === 'function') {
                    newValue = defaultValue();
                } else {
                    newValue = defaultValue || null;
                }
            }

            _value = newValue;
            _queueNotificationList(_observers, _value);

            return vs;
        };

        vs.Source = function (newSource) {
            if (newSource === undefined) {
                return _source;
            }

            if (newSource !== _source) {
                if (_subscription) {
                    _subscription.Dispose();
                    _subscription = null;
                }
                _source = newSource;
                if (_source) {
                    _subscription = _source.Subscribe(_observer);
                }
            }
            return vs;
        };

        vs.Default = function (defaultValue) {
            if (defaultValue === undefined) {
                return _defaultValue;
            }

            _defaultValue = defaultValue;
            if (_value === null) {
                vs.Value(null);
            }
            return vs;
        };

        _observer = new Rx.Observer(function (value) {
            vs.Value(value);
        },
        function (exception) {
            vs.Source(null);
        },
        function () {
            vs.Source(null);
        });

        vs.Default(defaultValue);

        return vs;
    };

    /*
    odo.Rx.CreateTwoWayBinding = function (sub1, sub2) {
    var binding = {};

    sub1.Subscribe(sub2);
    sub2.Subscribe(sub1);
    return binding;
    }
    */
})();

