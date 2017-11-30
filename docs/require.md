@4 使用：
   $timeout替代 setTimeout
   $interval instead of setInterval
   $window替代 window
   $document 替代 document
   $http替代 $.ajax

layer api
  //layer.load(0, {shade: false});
 //layer.confirm('您是如何看待前端开发？', {
        //    btn: ['重要','奇葩'] //按钮
        //}, function(){
        //    layer.msg('的确很重要', {icon: 3},1000);
        //}, function(){
        //    layer.msg('也可以这样', {
        //        time: 20000, //20s后自动关闭
        //        btn: ['明白了', '知道了']
        //    });
        //});
 绝对居中
        style{
                "position": "absolute",
                "top": 0,
                "left": 0,
                "right": 0, /* 高度的一半 */
                "bottom": 0, /* 宽度的一半 */
                 "margin":"auto"
        }