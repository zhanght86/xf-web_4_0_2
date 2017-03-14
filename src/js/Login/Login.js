/**
 * Created by Administrator on 2017/3/13.
 */
require("../../css/Login/login.css");
import api from "../../../libs/js/common.js";

avalon.define({
    $id : "login",
    userName:"",
    passWord:"",
    randomNumber:randomNumber(4),
    randomNumberVal:"",
    randomNumberChange:function(){
        this.randomNumber = randomNumber(4)
    },
    login : function(){
        if(this.randomNumberVal.length==0){
            alert("验证码不能为空")
        }else if(this.randomNumberVal!=this.randomNumber){
            alert("验证码错误")
        }else{
            api.httpRequest("../../users/userLogin",{},function(data){
                console.log(data)
            },function(err){
                console.log(err)
            });
        }
    }
});

//  随机产生四位验证码
function randomNumber(number){
        var rnd="";
        for(var i=0;i<number;i++)
            rnd+=Math.floor(Math.random()*10);
         return rnd
}