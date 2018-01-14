/**
 * @Author : MILES .
 * @Create : 2018/1/11.
 * @Module : 提示信息
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
        .directive('tipBar', function(){
            return {
                template:'<span class="pt-5 set_tip_bar">'+
                            '<a href="javascript:;" class="tip_bar_warn" ng-mouseenter="showTip($event)" ng-mouseleave ="hideTip($event)"></a>'+
                            '<span class="pd-5 tip_bar_info" >{{tipBarInfo}}</span>'+
                         '</span>',
                link: function(scope, ele, attrs, c){
                    scope.tipBarInfo = attrs["tipBar"];
                    scope.showTip = showTip ;
                    scope.hideTip = hideTip ;
                    //提示文字
                    function showTip(ev){
                        ev = ev || window.event ;
                        $(ev.target).addClass("on").next("span").css("display","inline-block");
                    }
                    function hideTip(ev){
                        ev = ev || window.event ;
                        $(ev.target).removeClass("on").next("span").css("display","none");
                    }
                }
            }
        });
};