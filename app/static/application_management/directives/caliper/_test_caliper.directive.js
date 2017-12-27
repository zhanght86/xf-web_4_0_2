/**
 * @Author : MILES .
 * @Create : 2017/12/26.
 * @Module : 游标卡尺
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
        .directive('caliper', function($timeout){
            return {
                restrict:'A',
                // require : "ngModel" ,
                template :require("./caliper.html"),
                replace:true,
                link: function($scope, ele, attrs, c){
                    let scale = function (btn,bar,title){
                        this.btn = $(btn);
                        this.bar = $(bar);
                        this.title = $(title);
                        this.step = this.bar.find("div").eq(0);
                        this.init = function (){
                            var f=this,g=document,b=window,m=Math;
                            f.btn.onmousedown=function (e){
                                var x=(e||b.event).clientX;
                                var l=this.offsetLeft;
                                var max=f.bar.offsetWidth-this.offsetWidth;
                                g.onmousemove=function (e){
                                    var thisX=(e||b.event).clientX;
                                    var to=m.min(max,m.max(-2,l+(thisX-x)));
                                    f.btn.style.left=to+'px';
                                    f.ondrag(m.round(m.max(0,to/max)*100),to);
                                    b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                                };
                                g.onmouseup=new Function('this.onmousemove=null');
                            };
                        };
                        this.ondrag = function (pos,x){
                            this.step.style.width=Math.max(0,x)+'px';
                            this.title.innerHTML=pos+'%';
                        };
                        this.init();
                    };
                    // scale(".calipers .caliper","btn" ,"")
                }


                // var scale = function (btn,bar,title){
                //     this.btn = document.getElementById(btn);
                //     this.bar = document.getElementById(bar);
                //     this.title = document.getElementById(title);
                //     this.step = this.bar.getElementsByTagName("div")[0];
                //     this.init = function (){
                //         var f=this,g=document,b=window,m=Math;
                //         f.btn.onmousedown=function (e){
                //             var x=(e||b.event).clientX;
                //             var l=this.offsetLeft;
                //             var max=f.bar.offsetWidth-this.offsetWidth;
                //             g.onmousemove=function (e){
                //                 var thisX=(e||b.event).clientX;
                //                 var to=m.min(max,m.max(-2,l+(thisX-x)));
                //                 f.btn.style.left=to+'px';
                //                 f.ondrag(m.round(m.max(0,to/max)*100),to);
                //                 b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                //             };
                //             g.onmouseup=new Function('this.onmousemove=null');
                //         };
                //     };
                //     this.ondrag = function (pos,x){
                //         this.step.style.width=Math.max(0,x)+'px';
                //         this.title.innerHTML=pos+'%';
                //     };
                //     this.init();
                // }
                // new scale('btn','bar','title'); //实例化一个拖拽
            }
        })
} ;