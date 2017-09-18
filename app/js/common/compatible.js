/**
 * Created by mileS on 2017/5/23.
 */

//        <!-- 数组重复判断 -->
Array.prototype.S=String.fromCharCode(2);
Array.prototype.inArray=function(e){
    for(var i = 0; i < this.length; i++){
        if(this[i] == e){return true;}
    }
    return false;
    //var r=new RegExp(this.S+e+this.S);
    //return (r.test(this.S+this.join(this.S)+this.S));
};
//        <!-- 增加数组 remove方法-->
Array.prototype.indexOf = function (val) {
    for(var i = 0; i < this.length; i++){
        if(this[i] == val){return i;}
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if(index > -1){this.splice(index,1);}
};

/*IE8兼容start*/
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item, i) {
        //alert("prototyping...");
        i || (i = 0);
        var length = this.length;
        if (i < 0) i = length + i;
        for (; i < length; i++)
            if (this[i] === item) return i;
        return -1;
    };
}
if (!window.WebSocket) {
    window.WebSocket = function () { };
    window.WebSocket.prototype = {
        onmessage: function () { },
        onclose: function () { },
        onopen: function () { },
        close: function(){}
    }
}
if (!String.prototype.trim) {
    String.prototype.trim=function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
}
//forEach 問題
if ( !Array.prototype.forEach ) {

    Array.prototype.forEach = function forEach( callback, thisArg ) {

        var T, k;

        if ( this == null ) {

            throw new TypeError("this is null or not defined" );

        }

        var O = Object(this);

        var len = O.length >>> 0;

        if ( typeof callback !== "function" ) {

            throw new TypeError( callback +" is not a function" );

        }

        if ( arguments.length > 1 ) {

            T = thisArg;

        }

        k = 0;

        while( k < len ) {

            var kValue;

            if ( k in O ) {

                kValue = O[ k ];

                callback.call( T, kValue, k, O );

            }

            k++;

        }

    };

}

//bind 方法
//Function.prototype.bind = function (oThis) {
//    if (typeof this !== "function") {
//        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
//    }
//    var aArgs = Array.prototype.slice.call(arguments, 1),
//        fToBind = this,
//        fNOP = function () {},
//        fBound = function () {
//            return fToBind.apply(
//                this instanceof fNOP && oThis ? this : oThis || window,
//                aArgs.concat(Array.prototype.slice.call(arguments))
//            );
//        };
//    fNOP.prototype = this.prototype;
//    fBound.prototype = new fNOP();

    //return fBound;
//};
Function.prototype.testBind = function(that){
    var _this = this,
        slice = Array.prototype.slice,
        args = slice.apply(arguments,[1]),
        fNOP = function () {},
        bound = function(){
            //这里的this指的是调用时候的环境
            return _this.apply(this instanceof  fNOP ?　this : that||window,
                args.concat(Array.prototype.slice.apply(arguments,[0]))
            )
        }
    fNOP.prototype = _this.prototype;

    bound.prototype = new fNOP();

    return bound;
}
/*IE8兼容end*/