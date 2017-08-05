/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('deepLearningConController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$interval",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$interval) {
        $state.go("deepLearning.deepLearningCon");
        $scope.vm = {
            showProcess :showProcess ,
            samples:'',
            name:'',
            epoches:'',
            checkpoint:'',
            train:train,
            listName : "",
            modelName:modelName,
            trainTerminal:trainTerminal,
            trainProcess:trainProcess,
            showAttenuation:showAttenuation,
            showCharts:showCharts,
            isDeeplearnTrain:isDeeplearnTrain,
            isDisabled:"false",
        };
        $scope.vm.isDeeplearnTrain();
        $scope.vm.trainProcess();
        var timeout_upd= $interval($scope.vm.trainProcess,5000);
        $scope.$on('$destroy',function(){
            $interval.cancel(timeout_upd);
        })
        //bar
        var dataX = [];
        var dataDian = [];
        var a="#c23531";
        var b="#dfdfdf";
        var w="410px";
        var h="15px";
        var div=$(".bar_div");//进度条要插入的地方
        var barb=function(){
            div.each(function(){
                var width=$(this).attr('w');
                var barbox='<dl class="barbox" style="width:410px;"><dd class="barline" ><div w="'+width+'" class="charts" style="width:0px"><d></d></div></dd></dl>';
                $(this).append(barbox);
            })
        }

        var amimeat=function(){
            $(".charts").each(function(i,item){
                var wi=parseInt($(this).attr("w"));
                $(item).animate({width: wi+"%"},1000,function(){//一天内走完
                    $(this).children('d').html(wi+"%");
                });
            });
        }
        var barbCss=function(a,b){
            $(".barbox").css({
                "height":h,
                "line-height":h,
                "text-align":"center",
                "color":"#fff",
            })
            $(".barbox>dd").css({
                "float":"left"
            })
            $(".barline").css({
                "width":w,
                "background":b,
                "height":h,
                "overflow":"hidden",
                "display":"inline",
                "position":"relative",
                "border-radius":"8px",
            })
            $(".barline>d").css({
                "position":"absolute",
                "top":"0px",
            })
            $(".charts").css({
                "background":a,
                "height":h,
                "width":"0px",
                "overflow":"hidden",
                "border-radius":"8px"
            })
        }
        barb();
        amimeat();
        barbCss(a,b);

        //启动训练
        function train(){
            if($scope.vm.isDisabled == true){
                return;
            }
            var cell;
            var activation;
            var regularization;
            var regularizationRate;
            var layers;
            var neurons;
            var learningRate;
            var maxGradient;
            var dropout;
            var batchSize;
            //根据名字查询配置文件
            var request = new Object();
            request.name=$scope.vm.name;
            if($scope.vm.name == ""||$scope.vm.name==null){

                layer.msg("请选择一个模型！", {time:3000}) ;
                return;
            }
            request.index=0;
            request.pageSize=5;
            httpRequestPost("/sprider/deeplearn/queryByName",request,function(data){
                if (data.status == 200) {
                    var list =data.data.objs;
                    for(var i=0;i<list.length;i++)
                    {
                        cell = list[i].name;
                        activation = list[i].activation;
                        regularization = list[i].regularization;
                        regularizationRate = list[i].regularizationRate;
                        layers = list[i].layers;
                        neurons = list[i].neurons;
                        learningRate = list[i].learningRate;
                        maxGradient = list[i].maxGradient;
                        dropout = list[i].dropout;
                        batchSize = list[i].batchSize;
                    }

                    //解析结果参数
                    var request = new Object();
                    request.cell=cell;
                    request.activation=activation;
                    request.regularization=regularization;
                    request.regularizationRate=regularizationRate;
                    request.layers=layers;
                    request.neurons=neurons;
                    request.learningRate=learningRate;
                    request.maxGradient=maxGradient;
                    request.dropout=dropout;
                    request.batchSize=batchSize;
                    if($scope.vm.samples == null || $scope.vm.samples==""){
                        request.samplesPerEpoch = "1024";
                    }
                    else{
                        request.samplesPerEpoch = $scope.vm.samples;
                    }
                    if($scope.vm.epoches == null ||$scope.vm.epoches ==""){
                        request.epoches = "10";
                    }
                    else{
                        request.epoches = $scope.vm.epoches;
                    }
                    if($scope.vm.checkpoint == null||$scope.vm.checkpoint ==""){
                        request.checkpointInterval = "10";
                    }
                    else{
                        request.checkpointInterval = $scope.vm.checkpoint;
                    }
                    httpRequestPost("/sprider/deeplearn/deeplearnTrain",request,function(data){
                        if (data.status == 200) {
                            if(data.data == 1)
                            {
                                layer.msg("已启动深度学习，请不要重复操作！", {time:3000}) ;
                            }
                            else
                            {
                                layer.msg("启动深度学习成功！", {time:3000}) ;
                                $scope.vm.isDisabled=true;
                                $('#train').css('background','#eee');
                                $scope.vm.trainProcess();
                            }
                        }
                        else {
                            layer.msg("启动训练失败，请联系管理员！", {time:2000}) ;
                        }
                    });
                } else {
                    layer.msg(data.info, {time:2000}) ;
                }
            });
        }

        //查模型名称
        void function queryName(){
            var request = new Object();
            request.index=0;
            request.pageSize=50;
            httpRequestPost("/sprider/deeplearn/queryByPage",request,function(data){
                if (data.status == 200) {
                    $scope.$apply(function(){
                        $scope.vm.listName = data.data.objs;
                    })
                } else {
                    layer.msg(data.info, {time:2000}) ;
                }
            });
        }()

        //查询模型名称
        function modelName(){
            //解析结果参数
            var request = new Object();
            httpRequestPost("/sprider/deeplearn/query",request,function(data){
                if (data.status == 200) {
                    var list =data.data.list;
                    for(var i=0;i<list.length;i++){
                        var name = list[i].name;
                    }
                } else {
                    layer.msg(data.info, {time:2000});
                }
            }, function() {
                layer.msg("请求失败", {time:2000});
            });
        }

        //终止训练
        function trainTerminal(){
            //解析结果参数

            var request = new Object();
            httpRequestPost("/sprider/deeplearn/deeplearnTrainTerminate",request,function(data){
                if(data.status==200){
                    $scope.vm.isDisabled=false;
                    $('#train').css('background','rgb(82, 159, 246)');
                    layer.msg(data.info, {time:2000});
                    $scope.vm.trainProcess();
                }
                else{
                    layer.msg("终止请求失败", {time:2000});
                }

            });
        }

        //训练进度
        function trainProcess(){
            //解析结果参数
            var request = new Object();
            httpRequestPost("/sprider/deeplearn/deeplearnTrainProcess",request,function(data){
                if (data.status == 200) {
                    $scope.vm.showProcess(data);
                    $scope.vm.showAttenuation(data);
                } else {
                    layer.msg(data.info, {time:2000});
                }
            });
        }
        //显示百分比
        function showProcess(data){
            $(".charts").each(function(i,item){
                var all = data.data.progressBarAll;
                var now = data.data.progressBarNow*100;
                var ElapsedTime = data.data.useTime;
                if(now == "0" && $scope.vm.isDisabled == true)
                {
                    $('.use_time').html("");
                    $('.use_time').empty();
                    var str = "<div>模型构建中，请稍等<span class='dotting'></span></div>"
                    $('.use_time').append(str);
                }
                else
                {
                    $('.use_time').html(ElapsedTime);
                }
                //進度百分比
                var process = parseInt(now/all);
                if(now==0 && all==0){
                    var wi=0;
                }else{
                    var wi=process;
                }

                $(item).animate({width: wi+"%"},1000,function(){//一天内走完
                    $(this).children('d').html(wi+"%");
                });
                //刻度
                var checkPoints =data.data.checkPoints;
                var point = checkPoints.split(",");
                var scale =410/all;
                var str="";
                $('#scale').empty();
                for(var i=0;i<point.length;i++){
                    var left = point[i]*scale;
                    str +="<div style='left:"+left+"px;'><em></em><span>"+point[i]+"</span></div>"

                }
                $('#scale').append(str);
            });
        }

        //显示衰减
        function showAttenuation(data){
            dataX = data.data.x.split(",");
            dataDian = data.data.date.split(",");
            var myChart2 = echarts.init(document.getElementById('access_echart_div2'));
            myChart2.setOption(showCharts(dataX,dataDian)) ;
        }
        function showCharts(dataX,dataDian){
            return {
                title: {
                    textStyle: {
                        color: '#75777b',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontFamily: 'sans-serif',
                        fontSize: 14,
                    },
                    text: 'Training Loss'
                },
                tooltip: {
                    trigger: 'axis'
                },
                animation:false,
                grid: {
                    left: '3%',
                    right: '10%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                },
                xAxis: {
                    name: 'Epoches',
                    type: 'category',
                    boundaryGap: false,
                    data: dataX
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'',
                        type:'line',
                        stack: '总量',
                        data:dataDian
                    }
                ]
            }
        }
        //判断有没有在进行的深度学习训练
        function isDeeplearnTrain(){
            console.log($scope.vm.isDisabled);
            var request = new Object();
            httpRequestPost("/sprider/deeplearn/isDeeplearnTrain",request,function(data){
                if (data.status == 200) {
                    if(data.data == 1)
                    {
                        $scope.vm.isDisabled = true;
                        $('#train').css('background','#eee');
                        //train按钮变为灰色，不可点击
                    }
                    else
                    {
                        $scope.vm.isDisabled = false;//train按钮正常，可点击
                    }
                } else {
                    layer.msg("查询训练状态失败", {time:2000}) ;
                }
            });
        }
    }
]);

