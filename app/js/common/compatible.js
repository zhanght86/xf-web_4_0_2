/**
 * Created by mileS on 2017/5/23.
 */

//        <!-- 数组重复判断 -->
Array.prototype.S=String.fromCharCode(2);
Array.prototype.inArray=function(e){
    var r=new RegExp(this.S+e+this.S);
    return (r.test(this.S+this.join(this.S)+this.S));
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
/*IE8兼容end*/