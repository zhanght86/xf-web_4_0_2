/**
 * @Author : MILES .
 * @Create : 2017/9/19.
 * @Module :  登录
 */
    function reset_tip(inner){
        $("error-tip").innerHTML = inner?inner:"" ;
    }
   function change_random_number(){
       var rnd="";
       for(var i=0;i<4;i++){
           rnd+=Math.floor(Math.random()*10);
       }
       $("#random").value = rnd ;
   }
   function login_system(e){
        var userLoginName = $("#login-user-name").value ;
        var userPassword = $("#login-password").value ;
       if(e){ // 键盘登录
           var srcObj = e.srcElement ? e.srcElement : e.target;
           var keycode = window.event?e.keyCode:e.which;
           if(keycode!=13){//回车
               reset_tip() ;
               return ;
           }
       }
       login(userLoginName,userPassword) ;
   }
    function login(userLoginName,userPassword){
        ajax.post({
            url : "/api/user/userLogin",
            data : {
                "userLoginName":userLoginName,
                "userPassword":userPassword
            },
            success : function(response){
                if(response.status===10006){
                    setCookie("userId" , response.data.userId);
                    setCookie("userLoginName" , userLoginName);
                    setCookie("userName" , response.data.userName);
                    self.location = "xf.html" ;
                }else if(response.status==10007){
                    reset_tip("用户名或密码错误") ;
                }else if(response.status == 10002){
                    reset_tip("该用户已停用!") ;
                }
            },
            error : function(error){
                console.log(error);
            }
        })
}