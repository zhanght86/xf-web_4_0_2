// JavaScript Document
$(function () {
   
  

    //客服场景新增
    function tab(obj1, obj2) {
        $(obj1).click(function () {
            $(this).addClass('cur').siblings().removeClass();
            $(obj2).children('div').eq($(this).index()).attr('class', 'db').siblings().attr('class', 'dn');
        });
    }
    
    tab('.tab_tit span', '.tab_con');
    tab('.tab_tit2 a', '.tab_con2');


   

   

    

    
    
   

    


});











	

	
	
	
	