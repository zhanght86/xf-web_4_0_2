
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$timeout",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$timeout ) {
        $state.go("custServScenaOverview.manage",{userPermission:$stateParams.userPermission});
        var applicationId = getCookie("applicationId")

        $scope.vm = {
            applicationId : getCookie("applicationId"),
            //editName : editName
            //getCreatBot : getCreatBot,
            creatBot : [],
            frameCategoryId : "",
            knowledgeBotVal: "",
            knowledgeBot : knowledgeBot,
            botRoot : null,

            type : true
        };
var n = 1;

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        //{
        //    "categoryApplicationId": "360619411498860544",
        //    "categoryPid": "root"
        //}
        getBotRoot();
        //    getDimensions();
        //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": applicationId,
                "categoryPid": "root"
            },function(data){
                console.log(data);
                $scope.vm.botRoot = data.data;
                $scope.$apply()
            },function(){
                alert("err or err")
            });
        }
        //点击更改bot value
        $(".aside-nav").on("click","span",function(){
            alert()
            var value = $(this).html();
            $scope.vm.frameCategoryId = $(this).prev().attr("data-option");
            $scope.vm.knowledgeBotVal = value;
            //if($scope.vm.knowledgeBotVal.indexOf(value)){
            //    $scope.vm.knowledgeBotVal.push($(this).html());
            $scope.$apply();
            //}
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-nav").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                //that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":applicationId,
                    "categoryPid": id
                },function(data){
                    //console.log(data)
                    if(data.data){
                        //type true +   false 》
                        //无叶节点
                        // 加号 跟 箭头 区别开
                        if($scope.vm.type){
                            var  html = '<ul class="menus_1 ">';
                            angular.forEach(data.data,function(item){
                                //1  存在叶节点   >
                                if(item.categoryLeaf){
                                    html+= '<li class="leafHover" data-option="'+item.categoryId+'">' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                        //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                        '<span>'+item.categoryName+'</span><i class="icon-r icon-jt"></i>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }else{
                                    //不存在叶节点
                                    html+= '<li>' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                        //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                        '<span>'+item.categoryName+'</span>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }
                            });
                        }else{
                            //1  存在叶节点
                            if(item.categoryLeaf){
                                html+= '<li>' +
                                    '<div class="slide-a">'+
                                    ' <a class="ellipsis" href="javascript:;">'+
                                        '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                    '<span>'+item.categoryName+'</span>'+
                                    '</a>' +
                                    '</div>' +
                                    '</li>'
                            }else{
                                //不存在叶节点
                                html+= '<li>' +
                                    '<div class="slide-a">'+
                                    ' <a class="ellipsis" href="javascript:;">'+
                                        //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                    '<span>'+item.categoryName+'</span>'+
                                    '</a>' +
                                    '</div>' +
                                    '</li>'
                            }
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        $timeout(function(){
                            that.parent().parent().next().slideDown()
                        },2000)
                        $scope.vm.type = !$scope.vm.type;

                    }
                },function(err){
                    alert(err)
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%");
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        });

        //第二种  箭头添加 hover
        $(".aside-nav").on("mouseenter",'.leafHover',function(){
            var id = $(this).attr("data-option");
            //alert(id);
            var that = $(this);
            //if(!that.parent().parent().siblings().length){
            //    that.css("backgroundPosition","0% 100%");
            if($(that).children().length==1){
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":applicationId,
                    "categoryPid": id
                },function(data){
                    //console.log(data)
                    if(data.data){
                            n+=1;
                            //type true +   false 》
                            //无叶节点
                            // 加号 跟 箭头 区别开
                            if($scope.vm.type){
                                console.log($scope.vm.type);
                                var  html = '<ul class="pas-menu_1 leaf'+n+'">';
                                angular.forEach(data.data,function(item){
                                    //1  存在叶节点
                                    if(item.categoryLeaf){
                                        console.log(1111);
                                        html+= '<li data-option="'+item.categoryId+'">' +
                                            '<div class="slide-a">'+
                                            ' <a class="ellipsis" href="javascript:;">'+
                                                '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                            '<span>'+item.categoryName+'</span></i>'+
                                            '</a>' +
                                            '</div>' +
                                            '</li>'
                                    }else{
                                        //不存在叶节点
                                        html+= '<li data-option="'+item.categoryId+'">' +
                                            '<div class="slide-a">'+
                                            ' <a class="ellipsis" href="javascript:;">'+
                                                //'<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                            '<span>'+item.categoryName+'</span>'+
                                            '</a>' +
                                            '</div>' +
                                            '</li>'
                                    }
                                });
                            }else{
                                //1  存在叶节点
                                if(item.categoryLeaf){
                                    html+= '<li>' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                        '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                        '<span>'+item.categoryName+'</span>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }else{
                                    //不存在叶节点
                                    html+= '<li>' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                            //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                        '<span>'+item.categoryName+'</span>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }
                            }
                            html+="</ul>";
                            $(html).appendTo((that));
                            console.log( $(html).css("display"));
                            console.log(  $(".leaf"+n));
                            $(".leaf"+n).show();
                        }

                },function(err){
                    alert(err)
                });

        }else{
             $(that).children().eq(1).show()}
        });
        $(".aside-nav").on("mouseleave",'.leafHover',function(){
            var that = $(this);
            if($(that).children().length==2){
                $(that).children().eq(1).hide();
            }
            //$(".leaf"+n).remove();
        });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////





    }
]);