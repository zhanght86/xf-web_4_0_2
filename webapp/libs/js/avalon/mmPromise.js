/**
 * Created by Administrator on 2017/3/13.
 */
define(["avalon"], function (avalon) {
//chrome36��ԭ��Promise������һ��defer()��̬����������ͨ�����ξ�������Promiseʵ����
//������һ��chain(onSuccess, onFail)ԭ�ͷ��������岻��
//Ŀǰ��firefox24, opera19Ҳ֧��ԭ��Promise(chrome32��֧���ˣ�����Ҫ�򿪿��أ���36��ֱ�ӿ���)
//��ģ���ṩ��Promise����ʵ��ECMA262v6 ��Promise�淶
//2015.3.12 ֧��async����
    function ok(val) {
        return val
    }
    function ng(e) {
        throw e
    }

    function done(onSuccess) {//��ӳɹ��ص�
        return this.then(onSuccess, ng)
    }
    function fail(onFail) {//��ӳ���ص�
        return this.then(ok, onFail)
    }
    function defer() {
        var ret = {};
        ret.promise = new this(function (resolve, reject) {
            ret.resolve = resolve
            ret.reject = reject
        });
        return ret
    }
    var msPromise = function (executor) {
        this._callbacks = []
        var me = this
        if (typeof this !== "object")
            throw new TypeError("Promises must be constructed via new")
        if (typeof executor !== "function")
            throw new TypeError("not a function")

        executor(function (value) {
            _resolve(me, value)
        }, function (reason) {
            _reject(me, reason)
        })
    }
    function fireCallbacks(promise, fn) {
        if (typeof promise.async === "boolean") {
            var isAsync = promise.async
        } else {
            isAsync = promise.async = true
        }
        if (isAsync) {
            window.setTimeout(fn, 0)
        } else {
            fn()
        }
    }
//����һ���Ѿ�����`resolved`״̬��Promise����
    msPromise.resolve = function (value) {
        return new msPromise(function (resolve) {
            resolve(value)
        })
    }
//����һ���Ѿ�����`rejected`״̬��Promise����
    msPromise.reject = function (reason) {
        return new msPromise(function (resolve, reject) {
            reject(reason)
        })
    }

    msPromise.prototype = {
//һ��Promise����һ����3��״̬��
//- `pending`�������ڵȴ�״̬����û����ȷ���ս��
//- `resolved`�������Ѿ���ɣ����ڳɹ�״̬
//- `rejected`�������Ѿ���ɣ�����ʧ��״̬
        constructor: msPromise,
        _state: "pending",
        _fired: false, //�ж��Ƿ��Ѿ�������
        _fire: function (onSuccess, onFail) {
            if (this._state === "rejected") {
                if (typeof onFail === "function") {
                    onFail(this._value)
                } else {
                    throw this._value
                }
            } else {
                if (typeof onSuccess === "function") {
                    onSuccess(this._value)
                }
            }
        },
        _then: function (onSuccess, onFail) {
            if (this._fired) {//������Promise����ӻص�
                var me = this
                fireCallbacks(me, function () {
                    me._fire(onSuccess, onFail)
                });
            } else {
                this._callbacks.push({onSuccess: onSuccess, onFail: onFail})
            }
        },
        then: function (onSuccess, onFail) {
            onSuccess = typeof onSuccess === "function" ? onSuccess : ok
            onFail = typeof onFail === "function" ? onFail : ng
            var me = this//���µ�Promise����ӻص�
            var nextPromise = new msPromise(function (resolve, reject) {
                me._then(function (value) {
                    try {
                        value = onSuccess(value)
                    } catch (e) {
                        // https://promisesaplus.com/#point-55
                        reject(e)
                        return
                    }
                    resolve(value)
                }, function (value) {
                    try {
                        value = onFail(value)
                    } catch (e) {
                        reject(e)
                        return
                    }
                    resolve(value)
                })
            })
            for (var i in me) {
                if (!personal[i]) {
                    nextPromise[i] = me[i]
                }
            }
            return nextPromise
        },
        "done": done,
        "catch": fail,
        "fail": fail
    }
    var personal = {
        _state: 1,
        _fired: 1,
        _value: 1,
        _callbacks: 1
    }
    function _resolve(promise, value) {//�����ɹ��ص�
        if (promise._state !== "pending")
            return;
        if (value && typeof value.then === "function") {
//thenable����ʹ��then��Promiseʵ��ʹ��_then
            var method = value instanceof msPromise ? "_then" : "then"
            value[method](function (val) {
                _transmit(promise, val, true)
            }, function (reason) {
                _transmit(promise, reason, false)
            });
        } else {
            _transmit(promise, value, true);
        }
    }
    function _reject(promise, value) {//����ʧ�ܻص�
        if (promise._state !== "pending")
            return
        _transmit(promise, value, false)
    }
//�ı�Promise��_firedֵ���������û����Σ��������лص�
    function _transmit(promise, value, isResolved) {
        promise._fired = true;
        promise._value = value;
        promise._state = isResolved ? "fulfilled" : "rejected"
        fireCallbacks(promise, function () {
            promise._callbacks.forEach(function (data) {
                promise._fire(data.onSuccess, data.onFail);
            })
        })
    }
    function _some(any, iterable) {
        iterable = Array.isArray(iterable) ? iterable : []
        var n = 0, result = [], end
        return new msPromise(function (resolve, reject) {
            // ������ֱ��resolve
            if (!iterable.length)
                resolve(result)
            function loop(a, index) {
                a.then(function (ret) {
                    if (!end) {
                        result[index] = ret//��֤�ص���˳��
                        n++
                        if (any || n >= iterable.length) {
                            resolve(any ? ret : result)
                            end = true
                        }
                    }
                }, function (e) {
                    end = true
                    reject(e)
                })
            }
            for (var i = 0, l = iterable.length; i < l; i++) {
                loop(iterable[i], i)
            }
        })
    }

    msPromise.all = function (iterable) {
        return _some(false, iterable)
    }
    msPromise.race = function (iterable) {
        return _some(true, iterable)
    }
    msPromise.defer = defer



    avalon.Promise = msPromise
    var nativePromise = window.Promise
    if (/native code/.test(nativePromise)) {
        nativePromise.prototype.done = done
        nativePromise.prototype.fail = fail
        if (!nativePromise.defer) { //chromeʵ�ֵ�˽�з���
            nativePromise.defer = defer
        }
    }
    return window.Promise = nativePromise || msPromise

})
//https://github.com/ecomfe/er/blob/master/src/Deferred.js
//http://jser.info/post/77696682011/es6-promises
