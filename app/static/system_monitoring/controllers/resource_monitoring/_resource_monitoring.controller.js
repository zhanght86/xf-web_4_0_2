/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

module.exports = systemMonitoringModule =>{
    systemMonitoringModule
    .controller('ResourceMonitoringController', [
    '$scope',"$state","SystemServer", "$cookieStore","$interval","$window","$location",
    ($scope,$state,SystemServer,$cookieStore,$interval,$window,$location)=> {
        //$state.go("SisM.resource");
        $scope.vm = {
            applicationId : APPLICATION_ID,
            serviceMemory:[],                     //服务内存
            cpuOccupancy :[],                     //cpu占有率
            xAxis:[],
            linuxIp:"",                           //IP地址
            memory :"",                           //内存占用
            cpu:"",                               //cpu占用
            responseStatus:"",                     //服务状态
            getData : getData,
            refreshPage : refreshPage              //刷新

        };

        var serviceMemory = echarts.init(document.getElementById('main'));
        var cpuOccupancy = echarts.init(document.getElementById('mainCpu'));

        getData();
        /**
        *** 获取
        **/
        function getData(){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:1000});
            SystemServer.getData.save({

            },function(response){
                layer.close(i);
                console.log(response);
                if(response.status==200){
                    $scope.vm.linuxIp=response.data.linuxIp;
                    var result = response.data.data;
                    var len=result.length;
                    for(var i=0;i<len;i++){
                        $scope.vm.serviceMemory.push(result[i].memory);
                        $scope.vm.cpuOccupancy.push(result[i].cpu);
                        $scope.vm.xAxis.push(result[i].date);
                    }
                    $scope.vm.cpu = result[len-1].cpu;
                    $scope.vm.memory = result[len-1].memory;
                    $scope.vm.responseStatus = result[len-1].responseStatus;

                    serviceMemory.setOption(setTimerChartOption($scope.vm.xAxis,$scope.vm.serviceMemory,'使用内存','#E87C25','{value}MB'));
                    cpuOccupancy.setOption(setTimerChartOption($scope.vm.xAxis,$scope.vm.cpuOccupancy,'CPU占用率','#26C0C0','{value}%'));

                }

            },function(err){
                layer.close(i);
                console.log(err);
            });
        }
        /**
        *** 刷新
        **/
        function refreshPage(){
            $window.location.reload();
        }
        var timer=$interval($scope.vm.refreshPage,300000);
        /**
        ******图形请求列表
         **/
        function setTimerChartOption(xData,yData,dataName,color,formatter){
            return {
                tooltip: {
                    trigger: 'axis',
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    left: '2%',
                    right: '4%',
                    bottom: '3%',
                    top:'60',
                    containLabel: true
                },
                calculable : false,//是否启用拖拽重计算特性,默认关闭
                animation : true,//是否开启动画，默认开启
                //折线或柱状图的颜色
                color:[color],
                xAxis : [  //x轴的属性
                    {
                        type : 'category', //坐标轴类型，横轴默认为类目型'category'，纵轴默认为数值型'value'
                        boundaryGap : false,//坐标轴起始和结束两端空白
                        data : xData,//数据
                        axisLine : {    // 轴线
                            show: true,
                            lineStyle: { //坐标轴样式
                                color: '#989898',
                                type: 'solid',
                                width: 2
                            }
                        },
                        axisTick : {    // 轴标记
                            show:true,
                            length: 5,
                            lineStyle: {
                                color: '#989898',
                                type: 'solid',
                                width: 2
                            }
                        },
                        axisLabel : { /*坐标轴值得样式*/
                            show:true,
                            interval: 0,    // {number}     //设置为0，可以显示全x轴数据
                            rotate: 0,
                            margin: 4,
                            formatter: '{value}',
                            textStyle: {
                                color: '#444444',
                                fontFamily: 'Microsoft YaHei',
                                fontSize: 15,
                                fontStyle: 'normal',
                                fontWeight: 'bold'
                            }
                        },
                    }
                ],
                yAxis : [
                    {
                        name : "",
                        type : 'value',
                        axisLine : {    // 轴线
                            show: true,
                            lineStyle: {
                                color: '#989898',
                                type: 'solid',
                                width: 2
                            }
                        },
                        axisTick : {    // 轴标记
                            show:false,
                            length: 1,
                            lineStyle: {
                                color: '#989898',
                                type: 'solid',
                                width: 2
                            }
                        },
                        axisLabel : {
                            show:true,
                            interval: 'auto',    // {number}  //设置为0，可以显示全x轴数据
                            rotate: 0,
                            margin: 8,
                            formatter: formatter,
                            textStyle: {
                                color: '#444444',
                                fontFamily: 'Microsoft YaHei',
                                fontSize: 15,
                                fontStyle: 'normal',
                                fontWeight: 'bold'
                            }
                        },

                    }
                ],
                series: [
                    {
                        name:dataName,
                        type:'line',
                        symbol:'emptyCircle',//节点形状
                        smooth : false,//平滑的曲线，默认是直线
                        data:yData,
                        //itemStyle: {normal: {areaStyle: {type: 'default'}}},/*这里是折线面积*/
                        markPoint : { /*/!*折线上的小汽包*!/*/
                            symbolSize: 60,
                            data : [
                                {type : 'max',name:'最大值'},
                                {type : 'min',name:'最小值'}
                            ],
                        },

                    }
                ]
            };
        }


    }
])};