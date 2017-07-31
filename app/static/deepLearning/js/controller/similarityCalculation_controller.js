/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('similarityCalculationController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("deepLearning.similarityCalculation");
        $scope.vm = {
            similarityCalculation:similarityCalculation,
            getResult:getResult,
            change:change,
            algorithm:'1',
            embedding:'1',
            sentence1:'',
            sentence2:'',
            words:'',
            top:'',
            result:''
        };
        //
        function getResult(){
            var words = $scope.vm.words;

            if($scope.vm.top == null ||$scope.vm.top==undefined ||$scope.vm.top==""){
                var top = "10";
            }
            else{
                var top = $scope.vm.top;
            }
            var request = new Object();
            request.words=words;
            request.top=top;
            httpRequestPost("/sprider/deeplearn/similarityWords",request,function(data){
                if (data.status == 200) {
                    if(data.data =='')

                    {
                        layer.msg("没有Similar Words", {time:2000}) ;
                    }
                    else
                    {
                        $scope.$apply(function(){
                            $scope.vm.result =data.data;
                        })
                    }
                } else {
                    layer.msg("请求失败，请重试或联系管理员！", {time:2000}) ;
                }
            });
        }

        //计算相似度
        function similarityCalculation(){
            var algorithm = $scope.vm.algorithm;
            var embedding = $scope.vm.embedding;
            var sentence1 = $scope.vm.sentence1;
            var sentence2 = $scope.vm.sentence2;
            var request = new Object();
            request.algorithm=algorithm;
            request.embedding=embedding;
            request.sentence1=sentence1;
            request.sentence2=sentence2;
            httpRequestPost("/sprider/deeplearn/similarityCalculation",request,function(data){
                if (data.status == 200) {
                    if(algorithm != "4") {
                        showTable(data);
                    } else {
                        showLines(data);
                    }
                } else {
                    layer.msg("请求失败，请重试或联系管理员！", {time:2000}) ;
                }
            });
        }

        function showLines(data){
            $("#tableWords").html("");
            var score="";
            score += "<em class='bold'>Score: </em><em>"+data.data.score+"</em>";
            $("#score").empty();
            $("#score").append(score);
            var xWords = data.data.wordHorizontal;
            var yWords = data.data.wordVertical;

            var xWord = xWords.split(',');
            var str='<tr>';
            str += "<td>"+"Matched Item(Q)"+"</td>";
            str += "<td style='text-align: left'>";
            for(var i =0;i<xWord.length;i++)
            {
                if(i%2 == 0)
                {
                    str +="<span class='p5'>"+xWord[i]+"</span>";
                }else{
                    str +="<span style='color:#CD2626' class='p5'>"+xWord[i]+"</span>";
                }
                str += " ";
            }
            str += "</td>";

            str+='</tr>';
            str+='<tr>';

            var yWord = yWords.split(',');
            str += "<td>"+"Matched Item(A)"+"</td>";
            str += "<td style='text-align: left'>";
            for(var i =0;i<yWord.length;i++)
            {
                if(i%2 == 0)
                {
                    str +="<span class='p5'>"+yWord[i]+"</span>";
                }else{
                    str +="<span style='color:#CD2626' class='p5'>"+yWord[i]+"</span>";
                }
                str += " ";
            }
            str += "</td>";
            str+='</tr>';

            var xxWords = data.data.wordsXX;
            var yyWords = data.data.wordsYY;
            var xxWordsSplit = xxWords.split(",");
            str+='<tr>';
            str += "<td>"+"Unmatched Item(A)"+"</td>";
            str += "<td style='text-align: left'>";
            for(var i =0;i<xxWordsSplit.length;i++)
            {
                if(i%2 == 0)
                {
                    str +="<span class='p5'>"+xxWordsSplit[i]+"</span>";
                }else{
                    str +="<span style='color:#CD2626' class='p5'>"+xxWordsSplit[i]+"</span>";
                }
                str += " ";
            }
            str += "</td>";
            str+='</tr>';
            var yyWordsSplit = yyWords.split(",");
            str+='<tr>';
            str += "<td>"+"Unmatched Item(Q)"+"</td>";
            str += "<td style='text-align: left'>";
            for(var i =0;i<yyWordsSplit.length;i++)
            {
                if(i%2 == 0)
                {
                    str +="<span class='p5'>"+yyWordsSplit[i]+"</span>";
                }else{
                    str +="<span style='color:#CD2626' class='p5'>"+yyWordsSplit[i]+"</span>";
                }
                str += " ";
            }
            str += "</td>";
            str+='</tr>';
            $("#tableWords").append(str);
        }

        //显示表格
        function showTable(data){
            $("#tableWords").html("");
            var score="";
            score += "<em class='bold'>Score: </em><em>"+data.data.score+"</em>";
            $("#score").empty();
            $("#score").append(score);
            var xWords =data.data.wordVertical ;
            var yWords =data.data.wordHorizontal;
            var xWord = xWords.split(",");

            //第一行
            var str='<tr>';
            str += "<td>"+" "+"</td>";
            for(var i=0;i<xWord.length;i++)
            {
                str += "<td>"+xWord[i]+"</td>";
            }
            str+='</tr>';

             //计算因子值
            var nums=data.data.boxValue;
            var mnums =[];
            for(var ii=0;ii<nums.length;ii++){
                var num=nums[ii].split(',');
                for (var jj=0;jj<num.length;jj++){
                    if(num[jj]<0){
                        num[jj]= Math.ceil(num[jj]);
                    }
                    mnums.push(num[jj]);
                }
            }
            var max=Math.max.apply(null, mnums);
            console.log(max);
            //第一行后面的行
            var yWord = yWords.split(",");
            for(var i=0;i<yWord.length;i++)
            {
                var boxs = data.data.boxValue[i];

                var box = boxs.split(",");
                str+='<tr>';
                str += "<td>"+yWord[i]+"</td>";
                for(var m=0;m<box.length;m++) {
                    var fac=Math.round(255- box[m]*Math.floor(255/max));
                    console.log(fac);
                    // str += "<td class='numdis' style='background-color: rgb(255,25,255)'>" + box[m] + "</td>";
                    str += "<td class='numdis' style='background-color:rgb("+fac+','+fac+','+fac+")'></td>"
                    // "+ box[m] +"
                }
                str+='</tr>';
            }

            $("#tableWords").append(str);
        }

        //根据最大值计算因子值
        function factors(nums) {
            var mnums =[];
            for(var ii=0;ii<nums.length;ii++){
                var num=nums[ii].split(',');
                for (var jj=0;jj<num.length;jj++){
                    mnums.push(num[jj]);
                }
            }
            var max=Math.max.apply(null, mnums);
            return max;
        }
        function change(){
            var temp = $scope.vm.sentence1;
            $scope.vm.sentence1 = $scope.vm.sentence2;
            $scope.vm.sentence2=temp;
        }
    }
]);

