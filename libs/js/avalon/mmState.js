/**
 * Created by Administrator on 2017/3/13.
 */
/**
 * verson 0.9
 */
define(["./mmPromise", "./mmRouter"], function () {
//��дmmRouter�е�route����
    avalon.router.route = function (method, path, query, options) {
        path = path.trim()
        var states = this.routingTable[method]
        for (var i = 0, el; el = states[i++]; ) {//elΪһ����״̬����״̬�����callback���Ƿ���һ��Promise
            var args = path.match(el.regexp)
            if (args && el.abstract !== true) {//�����ǳ���״̬
                var newParams = {params: {}}
                avalon.mix(newParams.params, el.params)
                newParams.keys = el.keys
                newParams.params.query = query || {}
                args.shift()
                if (el.keys.length) {
                    this._parseArgs(args, newParams)
                }
                if (el.stateName) {
                    mmState.transitionTo(mmState.currentState, el, newParams.params, options)
                } else {
                    el.callback.apply(el, args)
                }
                return
            }
        }
        if (this.errorback) {
            this.errorback()
        }
    }
    var _root, undefine, _controllers = {}, _states = {}
    /*
     *  @interface avalon.router.go ��ת��һ���Ѷ���״̬�ϣ�params�Բ�������
     *  @param toName ״̬name
     *  @param params ���Ӳ���
     *  @param params.query ��hash���渽�ӵ�����search�Ĳ�����
     *  @param options ��չ����
     *  @param options.reload trueǿ��reload������url��������δ�����仯
     *  @param options.replace true�滻history����������һ���µ���ʷ��¼
     *  @param options.confirmed true������onBeforeUnload,$onBeforeUnload,onBeforeExit
     */
    avalon.router.go = function (toName, params, options) {
        var from = mmState.currentState,
            to = StateModel.is(toName) ? toName : getStateByName(toName),
            params = params || {}
        var params = avalon.mix(true, {}, to.params, params)
        if (to) {
            mmState.transitionTo(from, to, params, options)
        }
    }
    // �¼�������
    var Event = window.$eventManager = avalon.define("$eventManager", function (vm) {
        vm.$flag = 0;
        vm.uiqKey = function () {
            vm.$flag++
            return "flag" + vm.$flag++
        }
    })
    function removeOld() {
        var nodes = mmState.oldNodes
        while (nodes.length) {
            var i = nodes.length - 1,
                node = nodes[i]
            node.parentNode && node.parentNode.removeChild(node)
            nodes.splice(i, 1)
            node = null
        }
    }
    Event.$watch("onAbort", removeOld)
    var mmState = window.mmState = {
        prevState: NaN,
        currentState: NaN, // ��ǰ״̬�����ܻ�δ�л�����״̬
        activeState: NaN, // ��ǰʵ�ʴ��ڵ�״̬
        oldNodes: [],
        query: {}, // ������currentState
        popOne: function (chain, params, callback, notConfirmed) {
            if (mmState._toParams !== params)
                return callback(false, {type: "abort"})
            var cur = chain.pop(), me = this
            if (!cur)
                return callback()
            // ��ֹ�˳�
            if (notConfirmed && cur.onBeforeExit() === false)
                return callback(false)
            me.activeState = cur.parentState || _root
            cur.done = function (success) {
                cur._pending = false
                cur.done = null
                cur._local = null
                if (success !== false) {
                    if (me.activeState)
                        return me.popOne(chain, params, callback, notConfirmed)
                }
                return callback(success)
            }
            var success = cur.onExit()
            if (!cur._pending && cur.done)
                cur.done(success)
        },
        pushOne: function (chain, params, callback, _local, toLocals) {
            if (mmState._toParams !== params)
                return callback(false, {type: "abort"})
            var cur = chain.shift(), me = this
            // �˳�
            if (!cur) {
                chain = null
                return callback()
            }
            cur.syncParams(params)
            // ��ֹ�����״̬
            if (cur.onBeforeEnter() === false) {
                // �ָ�params
                cur.syncParams(cur.oldParams)
                return callback(false)
            }
            var _local = inherit(_local)
            me.activeState = cur // ���µ�ǰʵ�ʴ��ڵ�״̬
            cur.done = function (success) {
                // ��ֹasync�������Ѿ����ٵ�done
                if (!cur.done)
                    return
                cur._pending = false
                cur.done = null
                cur.visited = true
                // �˳�
                if (success === false) {
                    // ��������һ�� - ȥ��
                    // cur.callback.apply(cur, [params, _local])
                    return callback(success)
                }
                var resolved = cur.callback.apply(cur, [params, _local])
                resolved.$then(function (res) {
                    // sync params to oldParams
                    avalon.mix(true, cur.oldParams, cur.params)
                    // ����״̬��
                    me.pushOne(chain, params, callback, _local)
                })
            }
            // һ��������ص���׼������
            var args = []
            avalon.each(cur.keys, function (index, item) {
                var key = item.name
                args.push(cur.params[key])
            })
            cur._onEnter.apply(cur, args)
            if (!cur._pending && cur.done)
                cur.done()
        },
        transitionTo: function (fromState, toState, toParams, options) {
            var toParams = toParams || toState.params, fromAbort
            // state machine on transition
            if (this.activeState && (this.activeState != this.currentState)) {
                avalon.log("navigating to [" +
                    this.currentState.stateName +
                    "] will be stopped, redirect to [" +
                    toState.stateName + "] now")
                this.activeState.done && this.activeState.done(!"stopped")
                fromState = this.activeState // ����ʵ�ʵ�fromState
                fromAbort = true
            }
            mmState.oldNodes = []
            var info = avalon.router.urlFormate(toState.url, toParams, toParams.query),
                me = this,
                options = options || {},
            // �Ƿ�ǿ��reload������angular�����ʱ��ᴥ������ҳ����ˢ
                reload = options.reload,
                over,
                fromChain = fromState && fromState.chain || [],
                toChain = toState.chain,
                i = 0,
                changeType, // ��params�仯��query�仯����������������������Ƿ�������ͼˢ���߼�
                state = toChain[i],
                _local = _root.sourceLocal,
                toLocals = []
            if (!reload) {
                // �ҵ����и�״̬chain��paramsδ�仯
                while (state && state === fromChain[i] && !state.paramsChanged(toParams)) {
                    _local = toLocals[i] = state._local
                    i++
                    state = toChain[i]
                }
            }
            var exitChain = fromChain.slice(i), // ��Ҫ�˳���chain
                enterChain = toChain.slice(i), // ��Ҫ�����chain
                commonLocal = _local
            // ����toLocals������������Щview�ᱻ�滻
            while (state = toChain[i]) {
                _local = toLocals[i] = inherit(_local, state.sourceLocal)
                i++
            }
            mmState._local = _local
            done = function (success, e) {
                if (over)
                    return
                over = true
                me.currentState = me.activeState
                enterChain = exitChain = commonLocal = _local = toParams = null
                mmState.oldNodes = []
                if (success !== false) {
                    mmState.lastLocal = mmState.currentState._local
                    _root.fire("updateview", me.currentState, changeType)
                    avalon.log("transitionTo " + toState.stateName + " success")
                    callStateFunc("onLoad", me, fromState, toState)
                } else {
                    return callStateFunc("onError", me, {
                        type: "transition",
                        message: "transitionTo " + toState.stateName + " faild",
                        error: e,
                        fromState: fromState,
                        toState: toState,
                        params: toParams
                    }, me.currentState)
                }
            }
            toState.path = ("/" + info.path).replace(/^[\/]{2,}/g, "/")
            if (!reload && fromState === toState) {
                changeType = toState.paramsChanged(toParams)
                if (!changeType) {
                    // redirect��Ŀ��״̬ == this.activeState && abort
                    if (toState == this.activeState && fromAbort)
                        return done()
                    // �ظ����ֱ��return
                    return
                }
            }

            mmState.query = avalon.mix({}, toParams.query)

            // onBeforeUnload check
            if (options && !options.confirmed && (callStateFunc("onBeforeUnload", this, fromState, toState) === false || broadCastBeforeUnload(exitChain, enterChain, fromState, toState) === false)) {
                return callStateFunc("onAbort", this, fromState, toState)
            }
            if (over === true) {
                return
            }
            avalon.log("begin transitionTo " + toState.stateName + " from " + (fromState && fromState.stateName || "unknown"))
            callStateFunc("onUnload", this, fromState, toState)
            this.currentState = toState
            this.prevState = fromState
            mmState._toParams = toParams
            if (info && avalon.history) {
                if (avalon.history.updateLocation) {
                    avalon.history.updateLocation(info.path + info.query,
                        avalon.mix({silent: true}, options), !fromState && location.hash)
                } else {
                    avalon.history.navigate(info.path + info.query,
                        avalon.mix({silent: true}, options))
                }
            }
            callStateFunc("onBegin", this, fromState, toState)
            this.popOne(exitChain, toParams, function (success) {
                // �ж�
                if (success === false)
                    return done(success)
                me.pushOne(enterChain, toParams, done, commonLocal, toLocals)
            }, !(options && options.confirmed))
        }
    }
    //��template,templateUrl,templateProvider�����Դ�opts���󿽱��������ɵ�view�����ϵ�
    function copyTemplateProperty(newObj, oldObj, name) {
        if (name in oldObj) {
            newObj[name] = oldObj[name]
            delete  oldObj[name]
        }
    }
    function getCacheContainer() {
        return document.getElementsByTagName("avalon")[0]
    }
    var templateCache = {},
        cacheContainer = getCacheContainer()
    function loadCache(name) {
        var fragment = document.createDocumentFragment(),
            divPlaceHolder = document.getElementById(name),
            f,
            eles = divPlaceHolder.eles,
            i = 0
        if (divPlaceHolder) {
            while (f = eles[i]) {
                fragment.appendChild(f)
                i++
            }
        }
        return fragment
    }
    function setCache(name, element) {
        var fragment = document.createDocumentFragment(),
            divPlaceHolder = document.getElementById(name),
            f
        if (!divPlaceHolder) {
            divPlaceHolder = document.createElement("div")
            divPlaceHolder.id = name
            cacheContainer.appendChild(divPlaceHolder)
        }
        // ����
        if (divPlaceHolder.eles) {
            avalon.each(divPlaceHolder.eles, function (index, ele) {
                fragment.appendChild(ele)
            })
        } else {
            divPlaceHolder.eles = []
            while (f = element.firstChild) {
                fragment.appendChild(f)
                divPlaceHolder.eles.push(f)
            }
            templateCache[name] = true
        }
        divPlaceHolder.appendChild(fragment)
    }
    function broadCastBeforeUnload(exitChain, enterChain, fromState, toState) {
        var lastLocal = mmState.lastLocal
        if (!lastLocal || !enterChain[0] && !exitChain[0])
            return
        var newLocal = mmState._local,
            cacheQueue = []
        for (var i in lastLocal) {
            var local = lastLocal[i]
            // ���б����µ�view
            if (!(i in newLocal) || newLocal[i] != local) {
                if (local.$ctrl && ("$onBeforeUnload" in local.$ctrl)) {
                    if (local.$ctrl.$onBeforeUnload(fromState, toState) === false)
                        return false
                }
                if (local.element && (exitChain[0] != enterChain[0]))
                    cacheQueue.push(local)
            }
        }
        avalon.each(cacheQueue, function (index, local) {
            var ele = local.element,
                name = avalon(ele).data("currentCache")
            if (name) {
                setCache(name, ele)
            }
        })
        cacheQueue = null
    }
    // ���׵Ľ������
    avalon.bindingHandlers.view = function (data) {
        var vmodels = data.vmodels || arguments[1]
        var currentState = mmState.currentState,
            element = data.element,
            $element = avalon(element),
            viewname = data.value || data.expr || "",
            comment = document.createComment("ms-view:" + viewname),
            par = element.parentNode,
            defaultHTML = element.innerHTML,
            statename = $element.data("statename") || "",
            parentState = getStateByName(statename) || _root,
            currentLocal = {},
            oldElement = element,
            tpl = element.outerHTML
        element.removeAttribute("ms-view") // remove right now
        par.insertBefore(comment, element)
        function update(firsttime, currentState, changeType) {
            // node removed, remove callback
            if (!document.contains(comment)) {
                data = vmodels = element = par = comment = $element = oldElement = update = null
                return !"delete from watch"
            }
            var definedParentStateName = $element.data("statename") || "",
                parentState = getStateByName(definedParentStateName) || _root,
                _local
            if (viewname.indexOf("@") < 0)
                viewname += "@" + parentState.stateName
            _local = mmState.currentState._local && mmState.currentState._local[viewname]
            if (firsttime && !_local || currentLocal === _local)
                return
            currentLocal = _local
            _currentState = _local && _local.state
            // ���棬�������dom�ϣ�����ȫ�����ã����template�����Կ�һ����������
            var cacheTpl = $element.data("viewCache"),
                lastCache = $element.data("currentCache")
            if (_local) {
                cacheTpl = (_local.viewCache === false ? false : _local.viewCache || cacheTpl) && (viewname + "@" + _currentState.stateName)
            } else if (cacheTpl) {
                cacheTpl = viewname + "@__default__"
            }
            // stateB->stateB�������˲����仯������dom
            if (_local && _currentState === currentState && _local.ignoreChange && _local.ignoreChange(changeType, viewname))
                return
            // ��Ҫload��ʹ�õ�cache��һ��
            if (cacheTpl && cacheTpl === lastCache)
                return
            compileNode(tpl, element, $element, _currentState)
            var html = _local ? _local.template : defaultHTML,
                fragment
            if (cacheTpl) {
                if (_local) {
                    _local.element = element
                } else {
                    mmState.currentState._local[viewname] = {
                        state: mmState.currentState,
                        template: defaultHTML,
                        element: element
                    }
                }
            }
            avalon.clearHTML(element)
            // oldElement = element
            element.removeAttribute("ms-view")
            element.setAttribute("ui-view", data.value || data.expr || "")
            // ���θ��µ�dom��Ҫ�û���
            if (cacheTpl) {
                // �ѻ���
                if (templateCache[cacheTpl]) {
                    fragment = loadCache(cacheTpl)
                    // δ����
                } else {
                    fragment = avalon.parseHTML(html)
                }
                element.appendChild(fragment)
                // ��������ʹ�õ�cache����
                $element.data("currentCache", cacheTpl)
                if (templateCache[cacheTpl])
                    return
            } else {
                element.innerHTML = html
                $element.data("currentCache", false)
            }
            // default
            if (!_local && cacheTpl)
                $element.data("currentCache", cacheTpl)
            avalon.each(getViewNodes(element), function (i, node) {
                avalon(node).data("statename", _currentState && _currentState.stateName || "")
            })
            // merge������vmodels + controllerָ����vmodels
            avalon.scan(element, (_local && _local.vmodels || []).concat(vmodels || []))
            // ������ͼ�󶨵�controller���¼�
            if (_local && _local.$ctrl) {
                _local.$ctrl.$onRendered && _local.$ctrl.$onRendered.apply(element, [_local])
            }
        }
        update("firsttime")
        _root.watch("updateview", function (state, changeType) {
            return update.call(this, undefine, state, changeType)
        })
    }
    if (avalon.directives) {
        avalon.directive("view", {
            init: avalon.bindingHandlers.view
        })
    }
    function compileNode(tpl, element, $element, _currentState) {
        if ($element.hasClass("oni-mmRouter-slide")) {
            // ����һ������
            var copy = element.cloneNode(true)
            copy.setAttribute("ms-skip", "true")
            avalon(copy).removeClass("oni-mmRouter-enter").addClass("oni-mmRouter-leave")
            avalon(element).addClass("oni-mmRouter-enter")
            element.parentNode.insertBefore(copy, element)
            mmState.oldNodes.push(copy)
            callStateFunc("onViewEnter", _currentState, element, copy)
        }
        return element
    }

    function inherit(parent, extra) {
        return avalon.mix(new (avalon.mix(function () {
        }, {prototype: parent}))(), extra);
    }

    /*
     * @interface avalon.state ��avalon.router.get �������·�װ������һ��״̬����
     * @param stateName ָ����ǰ״̬��
     * @param opts ����
     * @param opts.url  ��ǰ״̬��Ӧ��·������������״̬�����һ��������ƥ�����
     * @param {Function} opts.ignoreChange ��mmState.currentState == thisʱ��������ͼ��ʱ����øú�����return true mmRouter�򲻻�ȥ��д��ͼ��scan����ȷ������ͼ���õ�������û�зŵ�avalon vmodel $skipArray��
     * @param opts.controller �����дviews����,��Ĭ��viewΪ""��ΪĬ�ϵ�viewָ��һ���������������û�ֱ����Ϊavalon.controller�Ĳ�������һ��$ctrl����
     * @param opts.controllerUrl ָ��Ĭ��view��������·����������ģ�黯��������������Ĭ��ͨ��avalon.controller.loaderȥ����һ������amd�淶��������һ��avalon.controller����Ķ��󣬴���opts.params������
     * @param opts.controllerProvider ָ��Ĭ��view���������ṩ�ߣ���������һ��Promise��Ҳ����Ϊһ������������opts.params������
     @param opts.viewCache �Ƿ񻺴����ģ�����ɵ�dom�����ûḲ��domԪ���ϵ�data-view-cache��Ҳ���Էֱ����õ�views��ÿ��������view��
     * @param opts.views: �����дviews����,��Ĭ��view��ms-view=""��Ϊ""��Ҳ����ͨ��ָ��һ��viewname���������á�ms-view="viewname"�����Զ��[ms-view]�������д���,ÿ������Ӧӵ��template, templateUrl, templateProvider�����Ը�ÿ���������һ��controller||controllerUrl||controllerProvider����
     *     views�ĽṹΪ
     *<pre>
     *     {
     *        "": {template: "xxx"}
     *        "aaa": {template: "xxx"}
     *        "bbb@": {template: "xxx"}
     *     }
     *</pre>
     *     views��ÿ������(keyname)�ĽṹΪviewname@statename��
     *         ������ֲ�����@����viewnameֱ��Ϊkeyname��statenameΪopts.stateName
     *         ������ִ���@, viewnameΪmatch[0], statenameΪmatch[1]
     * @param opts.views.{viewname}.template ָ����ǰģ�壬Ҳ����Ϊһ������������opts.params��������* @param opts.views.viewname.cacheController �Ƿ񻺴�view�Ŀ�������Ĭ��true
     * @param opts.views.{viewname}.templateUrl ָ����ǰģ���·����Ҳ����Ϊһ������������opts.params������
     * @param opts.views.{viewname}.templateProvider ָ����ǰģ����ṩ�ߣ���������һ��Promise��Ҳ����Ϊһ������������opts.params������
     * @param opts.views.{viewname}.ignoreChange �÷�ͬstate.ignoreChange��ֻ����Ե����ȸ�ϸһЩ����Ե������view
     * @param {Function} opts.onBeforeEnter ����ĳ��state֮ǰ������thisָ���Ӧ��state�����return false����жϲ��˳�����״̬��
     * @param {Function} opts.onEnter ����״̬���������Է���false�������ⲻΪtrue�Ĵ�����Ϣ��һ��promise�����÷�����ͼ��$onEnterһ��
     * @param {Function} onEnter.params ��ͼ������state�Ĳ���
     * @param {Function} onEnter.resolve $onEnter return false��ʱ�򣬽���ͬ���ȴ���ֱ���ֶ�����resolve
     * @param {Function} onEnter.reject ���ݼ���ʧ�ܣ�����
     * @param {Function} opts.onBeforeExit state�˳�ǰ������thisָ���Ӧ��state�����return false����жϲ��˳�����״̬��
     * @param {Function} opts.onExit �˳��󴥷���thisָ���Ӧ��state
     * @param opts.ignoreChange.changeType ֵΪ"param"����ʾparams�仯��ֵΪ"query"����ʾquery�仯
     * @param opts.ignoreChange.viewname ������ms-view name
     * @param opts.abstract  ��ʾ��������ƥ�䣬thisָ���Ӧ��state
     * @param {private} opts.parentState ��״̬���󣨿���ڲ����ɣ�
     */
    avalon.state = function (stateName, opts) {
        var state = StateModel(stateName, opts)
        avalon.router.get(state.url, function (params, _local) {
            var me = this, promises = [], _resovle, _reject, _data = [], _callbacks = []
            state.resolved = getPromise(function (rs, rj) {
                _resovle = rs
                _reject = rj
            })
            avalon.each(state.views, function (name, view) {
                var params = me.params,
                    reason = {
                        type: "view",
                        name: name,
                        params: params,
                        state: state,
                        view: view
                    },
                    viewLocal = _local[name] = {
                        name: name,
                        state: state,
                        params: state.filterParams(params),
                        ignoreChange: "ignoreChange" in view ? view.ignoreChange : me.ignoreChange,
                        viewCache: "viewCache" in view ? view.viewCache : me.viewCache
                    },
                    promise = fromPromise(view, params, reason)
                promises.push(promise)
                // template����cache
                promise.then(function (s) {
                    viewLocal.template = s
                }, avalon.noop) // ����ģ�屨��
                var prom,
                    callback = function ($ctrl) {
                        viewLocal.vmodels = $ctrl.$vmodels
                        view.$controller = viewLocal.$ctrl = $ctrl
                        resolveData()
                    },
                    resolveData = function () {
                        var $onEnter = view.$controller && view.$controller.$onEnter
                        if ($onEnter) {
                            var innerProm = getPromise(function (rs, rj) {
                                var reason = {
                                        type: "data",
                                        state: state,
                                        params: params
                                    },
                                    res = $onEnter(params, rs, function (message) {
                                        reason.message = message
                                        rj(reason)
                                    })
                                // if promise
                                if (res && res.then) {
                                    _data.push(res)
                                    res.then(function () {
                                        rs(res)
                                    })
                                    // error msg
                                } else if (res && res !== true) {
                                    reason.message = res
                                    rj(reason)
                                } else if (res === undefine) {
                                    rs()
                                }
                                // res === false will pause here
                            })
                            innerProm = innerProm.then(function (cb) {
                                avalon.isFunction(cb) && _callbacks.push(cb)
                            })
                            _data.push(innerProm)
                        }
                    }
                // controller�ƺ����Ի�����
                if (view.$controller && view.cacheController !== false) {
                    return callback(view.$controller)
                }
                // ����controllerģ��
                if (view.controller) {
                    prom = promise.then(function () {
                        callback(avalon.controller(view.controller))
                    })
                } else if (view.controllerUrl) {
                    prom = getPromise(function (rs, rj) {
                        var url = avalon.isFunction(view.controllerUrl) ? view.controllerUrl(params) : view.controllerUrl
                        url = url instanceof Array ? url : [url]
                        avalon.controller.loader(url, function ($ctrl) {
                            promise.then(function () {
                                callback($ctrl)
                                rs()
                            })
                        })
                    })
                } else if (view.controllerProvider) {
                    var res = avalon.isFunction(view.controllerProvider) ? view.controllerProvider(params) : view.controllerProvider
                    prom = getPromise(function (rs, rj) {
                        // if promise
                        if (res && res.then) {
                            _data.push(res)
                            res.then(function (r) {
                                promise.then(function () {
                                    callback(r)
                                    rs()
                                })
                            }, function (e) {
                                reason.message = e
                                rj(reason)
                            })
                            // error msg
                        } else {
                            promise.then(function () {
                                callback(res)
                                rs()
                            })
                        }
                    })
                }
                // is promise
                if (prom && prom.then) {
                    promises.push(prom)
                }
            })
            // ģ���controller����
            getPromise(promises).$then(function (values) {
                state._local = _local
                // ���ݾ���
                getPromise(_data).$then(function () {
                    avalon.each(_callbacks, function (i, func) {
                        func()
                    })
                    promises = _data = _callbacks = null
                    _resovle()
                })
            })
            return state.resolved

        }, state)

        return this
    }

    function isError(e) {
        return e instanceof Error
    }

    // �����е�promise error���䵽������
    function promiseError(e) {
        if (isError(e)) {
            throw e
        } else {
            callStateFunc("onError", mmState, e, e && e.state)
        }
    }

    function getPromise(excutor) {
        var prom = avalon.isFunction(excutor) ? new Promise(excutor) : Promise.all(excutor)
        return prom
    }
    Promise.prototype.$then = function (onFulfilled, onRejected) {
        var prom = this.then(onFulfilled, onRejected)
        prom["catch"](promiseError)
        return prom
    }
    avalon.state.onViewEntered = function (newNode, oldNode) {
        if (newNode != oldNode)
            oldNode.parentNode.removeChild(oldNode)
    }
    /*
     *  @interface avalon.state.config ȫ������
     *  @param {Object} config ���ö���
     *  @param {Function} config.onBeforeUnload ��ʼ��ǰ�Ļص���thisָ��router���󣬵�һ��������fromState���ڶ���������toState��return false����������ֹ�л�����
     *  @param {Function} config.onAbort onBeforeUnload return false֮�󣬴����Ļص���thisָ��mmState���󣬲���ͬonBeforeUnload
     *  @param {Function} config.onUnload url�л�ʱ�򴥷���thisָ��mmState���󣬲���ͬonBeforeUnload
     *  @param {Function} config.onBegin  ��ʼ�л��Ļص���thisָ��mmState���󣬲���ͬonBeforeUnload�����������onBegin�������begin
     *  @param {Function} config.onLoad �л���ɲ��ɹ���thisָ��mmState���󣬲���ͬonBeforeUnload
     *  @param {Function} config.onViewEnter ��ͼ���붯����������һ��Ĭ��Ч��
     *  @param {Node} config.onViewEnter.arguments[0] ����ͼ�ڵ�
     *  @param {Node} config.onViewEnter.arguments[1] �ɵĽڵ�
     *  @param {Function} config.onError ����Ļص���thisָ���Ӧ��state����һ��������һ��object��object.type��ʾ��������ͣ�����view��ʾ���س���object.name���Ӧ�����view name��object.xhr���ǵ�ʹ��Ĭ��ģ���������ʱ���httpRequest���󣬵ڶ��������Ƕ�Ӧ��state
     */
    avalon.state.config = function (config) {
        avalon.mix(avalon.state, config || {})
        return avalon
    }
    function callStateFunc(name, state) {
        Event.$fire.apply(Event, arguments)
        return avalon.state[name] ? avalon.state[name].apply(state || mmState.currentState, [].slice.call(arguments, 2)) : 0
    }
    // ״̬ԭ�ͣ����е�״̬��Ҫ�̳����ԭ��
    function StateModel(stateName, options) {
        if (this instanceof StateModel) {
            this.stateName = stateName
            this.formate(options)
        } else {
            var state = _states[stateName] = new StateModel(stateName, options || {})
            return state
        }
    }
    StateModel.is = function (state) {
        return state instanceof StateModel
    }
    StateModel.prototype = {
        formate: function (options) {
            avalon.mix(true, this, options)
            var stateName = this.stateName,
                me = this,
                chain = stateName.split("."),
                len = chain.length - 1,
                sourceLocal = me.sourceLocal = {}
            this.chain = []
            avalon.each(chain, function (key, name) {
                if (key == len) {
                    me.chain.push(me)
                } else {
                    var n = chain.slice(0, key + 1).join("."),
                        state = getStateByName(n)
                    if (!state)
                        throw new Error("�����ȶ���" + n)
                    me.chain.push(state)
                }
            })
            if (this.url === void 0) {
                this.abstract = true
            }
            var parent = this.chain[len - 1] || _root
            if (parent) {
                this.url = parent.url + (this.url || "")
                this.parentState = parent
            }
            if (!this.views && stateName != "") {
                var view = {}
                "template,templateUrl,templateProvider,controller,controllerUrl,controllerProvider,viewCache".replace(/\w+/g, function (prop) {
                    copyTemplateProperty(view, me, prop)
                })
                var viewname = "viewname" in this ? this.viewname : ""
                this.views = {}
                this.views[viewname] = view
            }
            var views = {},
                viewsIsArray = this.views instanceof Array // �����һ������

            avalon.each(this.views, function (maybeName, view) {
                var name = viewsIsArray ? view.name || "" : maybeName // Ĭ��ȱʡ
                if (name.indexOf("@") < 0) {
                    name += "@" + (parent ? parent.stateName || "" : "")
                }
                views[name] = view
                sourceLocal[name] = {}
            })
            this.views = views
            this._self = options
            this._pending = false
            this.visited = false
            this.params = inherit(parent && parent.params || {})
            this.oldParams = {}
            this.keys = []

            this.events = {}
        },
        watch: function (eventName, func) {
            var events = this.events[eventName] || []
            this.events[eventName] = events
            events.push(func)
            return func
        },
        fire: function (eventName, state) {
            var events = this.events[eventName] || [], i = 0
            while (events[i]) {
                var res = events[i].apply(this, [].slice.call(arguments, 1))
                if (res === false) {
                    events.splice(i, 1)
                } else {
                    i++
                }
            }
        },
        unwatch: function (eventName, func) {
            var events = this.events[eventName]
            if (!events)
                return
            var i = 0
            while (events[i]) {
                if (events[i] == func)
                    return events.splice(i, 1)
                i++
            }
        },
        paramsChanged: function (toParams) {
            var changed = false, keys = this.keys, me = this, params = this.params
            avalon.each(keys, function (index, item) {
                var key = item.name
                if (params[key] != toParams[key])
                    changed = "param"
            })
            // query
            if (!changed && mmState.currentState === this) {
                changed = !objectCompare(toParams.query, mmState.query) && "query"
            }
            return changed
        },
        filterParams: function (toParams) {
            var params = avalon.mix(true, {}, this.params), keys = this.keys
            avalon.each(keys, function (index, item) {
                params[item.name] = toParams[item.name]
            })
            return params
        },
        syncParams: function (toParams) {
            var me = this
            avalon.each(this.keys, function (index, item) {
                var key = item.name
                if (key in toParams)
                    me.params[key] = toParams[key]
            })
        },
        _onEnter: function () {
            this.query = this.getQuery()
            var me = this,
                arg = Array.prototype.slice.call(arguments),
                done = me._async(),
                prom = getPromise(function (rs, rj) {
                    var reason = {
                            type: "data",
                            state: me,
                            params: me.params
                        },
                        _reject = function (message) {
                            reason.message = message
                            done.apply(me, [false])
                            rj(reason)
                        },
                        _resovle = function () {
                            done.apply(me)
                            rs()
                        },
                        res = me.onEnter.apply(me, arg.concat([_resovle, _reject]))
                    // if promise
                    if (res && res.then) {
                        res.then(_resovle)["catch"](promiseError)
                        // error msg
                    } else if (res && res !== true) {
                        _reject(res)
                    } else if (res === undefine) {
                        _resovle()
                    }
                    // res === false will pause here
                })
        },
        /*
         * @interface state.getQuery ��ȡstate��query���ȼ���state.query
         *<pre>
         *  onEnter: function() {
         *      var query = this.getQuery()
         *      or
         *      this.query
         *  }
         *</pre>
         */
        getQuery: function () {
            return mmState.query
        },
        /*
         * @interface state.getParams ��ȡstate��params���ȼ���state.params
         *<pre>
         *  onEnter: function() {
         *      var params = this.getParams()
         *      or
         *      this.params
         *  }
         *</pre>
         */
        getParams: function () {
            return this.params
        },
        _async: function () {
            // û��done�ص���ʱ�򣬷�ֹ����
            if (this.done)
                this._pending = true
            return this.done || avalon.noop
        },
        onBeforeEnter: avalon.noop, // ����ĳ��state֮ǰ����
        onEnter: avalon.noop, // ���봥��
        onBeforeExit: avalon.noop, // state�˳�ǰ����
        onExit: avalon.noop // �˳��󴥷�
    }

    _root = StateModel("", {
        url: "",
        views: null,
        "abstract": true
    })

    /*
     * @interface avalon.controller ��avalon.state��ͼ�������ÿ�����
     * @param name ����������
     * @param {Function} factory ����������������һ���ڲ����ɵĿ�����������Ϊ����
     * @param {Object} factory.arguments[0] $ctrl �������ĵ�һ��������ʵ�����ɵĿ���������
     * @param {Object} $ctrl.$vmodels ����ͼָ��һ��scan��vmodels���飬ʵ��scan��ʱ��$vmodels.concat(dom�������ļ̳е�vmodels)
     * @param {Function} $ctrl.$onBeforeUnload ����ͼ��ж��ǰ������return false������ֹ��ͼж�أ�����ֹ��ת
     * @param {Function} $ctrl.$onEnter ������ͼ�������ݣ����Է���false�������ⲻΪtrue�Ĵ�����Ϣ��һ��promise���󣬴���3������
     * @param {Object} $ctrl.$onEnter.arguments[0] params��һ����������ͼ������state�Ĳ���
     * @param {Function} $ctrl.$onEnter.arguments[1] resolve $onEnter �ڶ���������return false��ʱ�򣬽���ͬ���ȴ���ֱ���ֶ�����resolve
     * @param {Function} $ctrl.$onEnter.arguments[2] reject ���������������ݼ���ʧ�ܣ�����
     * @param {Function} $ctrl.$onRendered ��ͼԪ��scan���֮�󣬵���
     */
    avalon.controller = function () {
        var first = arguments[0],
            second = arguments[1]
        if (first && (first instanceof _controller))
            return first
        var $ctrl = _controller()
        if (avalon.isFunction(first)) {
            first($ctrl)
        } else if (avalon.isFunction(second)) {
            $ctrl.name = first
            second($ctrl)
        } else if (typeof first == "string" || typeof first == "object") {
            first = first instanceof Array ? first : Array.prototype.slice.call(arguments)
            avalon.each(first, function (index, item) {
                if (typeof item == "string") {
                    first[index] = avalon.vmodels[item]
                }
                item = first[index]
                if ("$onRendered" in item)
                    $ctrl.$onRendered = item["$onRendered"]
                if ("$onEnter" in  item)
                    $ctrl.$onEnter = item["$onEnter"]
            })
            $ctrl.$vmodels = first
        } else {
            throw new Error("��������" + arguments)
        }
        return $ctrl
    }
    /*
     *  @interface avalon.controller.loader avalon.controller�첽����ģ��ļ�������Ĭ����ͨ��avalon.require����
     */
    avalon.controller.loader = function (url, callback) {
        // û�д���ص�...
        function wrapper($ctrl) {
            callback && callback($ctrl)
        }
        if (window.requirejs) {
            requirejs([url], wrapper)
        } else if (typeof require === "function" && require.ensure) {
            require.ensure([url], wrapper)
        } else if (avalon.require) {
            avalon.require([url], wrapper)
        }
    }

    function _controller() {
        if (!(this instanceof _controller))
            return new _controller
        this.$vmodels = []
    }
    _controller.prototype = {
    }

    function objectCompare(objA, objB) {
        for (var i in objA) {
            if (!(i in objB) || objA[i] !== objB[i])
                return false
        }
        for (var i in objB) {
            if (!(i in objA) || objA[i] !== objB[i])
                return false
        }
        return true
    }

    //��avalon.state���ĸ���������ȷ�����ص��Ǻ���
    function getFn(object, name) {
        return typeof object[name] === "function" ? object[name] : avalon.noop
    }

    function getStateByName(stateName) {
        return _states[stateName]
    }
    function getViewNodes(node, query) {
        var nodes, query = query || "ms-view"
        if (node.querySelectorAll) {
            nodes = node.querySelectorAll("[" + query + "]")
        } else {
            nodes = Array.prototype.filter.call(node.getElementsByTagName("*"), function (node) {
                return typeof node.getAttribute(query) === "string"
            })
        }
        return nodes
    }

    // ��avalon.state���ĸ���������opts.template�Ĵ�����
    function fromString(template, params, reason) {
        var promise = getPromise(function (resolve, reject) {
            var str = typeof template === "function" ? template(params) : template
            if (typeof str == "string") {
                resolve(str)
            } else {
                reason.message = "template�����Ӧһ���ַ�����һ�������ַ����ĺ���"
                reject(reason)
            }
        })
        return promise
    }
    // ��fromUrl���ĸ����������õ�һ��XMLHttpRequest����
    var getXHR = function () {
        return new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP")
    }/*
     *  @interface avalon.state.templateLoader ͨ��url�첽����ģ��ĺ�����Ĭ����ͨ�����õ�httpRequestȥ���أ�������node-webkit�����ǲ�work�ģ���˿�����������ã������Զ���urlģ�������������һ��promiseʵ��������������ȥ����ģ��
     *  @param url ģ���ַ
     *  @param resolve ���سɹ��������Ҫ����ģ�壬�����<br>
     resolve(avalon.templateCache[url] = templateString)<br>
     ���������<br>
     resolve(templateString)<br>
     *  @param reject ����ʧ�ܣ������reject(reason)
     *  @param reason ����ʧ��ԭ��Ķ���
     */
    avalon.state.templateLoader = function (url, resolve, reject, reason) {
        var xhr = getXHR()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var status = xhr.status;
                if (status > 399 && status < 600) {
                    reason.message = "templateUrl��Ӧ��Դ�����ڻ�û�п��� CORS"
                    reason.status = status
                    reason.xhr = xhr
                    reject(reason)
                } else {
                    resolve(avalon.templateCache[url] = xhr.responseText)
                }
            }
        }
        xhr.open("GET", url, true)
        if ("withCredentials" in xhr) {
            xhr.withCredentials = true
        }
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        xhr.send()
    }
    // ��avalon.state���ĸ���������opts.templateUrl�Ĵ�����
    function fromUrl(url, params, reason) {
        var promise = getPromise(function (resolve, reject) {
            if (typeof url === "function") {
                url = url(params)
            }
            if (typeof url !== "string") {
                reason.message = "templateUrl�����Ӧһ��URL"
                return reject(reason)
            }
            if (avalon.templateCache[url]) {
                return  resolve(avalon.templateCache[url])
            }
            avalon.state.templateLoader(url, resolve, reject, reason)
        })
        return promise
    }
    // ��avalon.state���ĸ���������opts.templateProvider�Ĵ�����
    function fromProvider(fn, params, reason) {
        var promise = getPromise(function (resolve, reject) {
            if (typeof fn === "function") {
                var ret = fn(params)
                if (ret && ret.then || typeof ret == "string") {
                    resolve(ret)
                } else {
                    reason.message = "templateProviderΪ����ʱӦ�÷���һ��Promise��thenable������ַ���"
                    reject(reason)
                }
            } else if (fn && fn.then) {
                resolve(fn)
            } else {
                reason.message = "templateProvider��Ϊ����ʱӦ�ö�Ӧһ��Promise��thenable����"
                reject(reason)
            }
        })
        return promise
    }
    // ��avalon.state���ĸ�����������template��templateUrl��templateProviderת��Ϊ���õ�Promise����
    function fromPromise(config, params, reason) {
        return config.template ? fromString(config.template, params, reason) :
            config.templateUrl ? fromUrl(config.templateUrl, params, reason) :
                config.templateProvider ? fromProvider(config.templateProvider, params, reason) :
                    getPromise(function (resolve, reject) {
                        reason.message = "�������template, templateUrl, templateProvider�е�һ��"
                        reject(reason)
                    })
    }
})
