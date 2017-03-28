// JavaScript Document


///**
// * Created by Administrator on 2017/3/13.
// */
//
////url 地址
////data  参数
////callback 回调
////请求方式
////needToken   true  false
//
////var Authorization = getCookie("Authorization");
//
function httpRequestPost(url, data, sucCallBack,falCallback, needToken, ajaxType) {
    ajaxType == "POST"? "POST" :ajaxType;
    //if(ajaxType === "post"){
    //阻塞线程  ie8 不支持
    //    jQuery.support.cors = true;
    //}
    //转换字符

    //if (typeof(data) == 'string') {
    //    data = JSON.parse(data);
    //}
    data = JSON.stringify(data);

    //验证是否需要加token
    var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    //设置默认需要  tooken
    if (!needToken) {
        //header.Authorization = getToken();
    }
    $.ajax(url, {
        dataType: 'json', //服务器返回json格式数据

        type: "POST", //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            falCallback(xhr, type, errorThrown);
        }
    })
}

//// tooken 获取
//function getToken() {
//    if () {
//        var user =;
//
//        return user.Token;
//    } else {
//        //这里应该是从webapp中获取token
//        return
//    }
//};
//// ****************************************   cookie   ****************************//
//
////JS操作cookies方法!
////写cookies
function setCookie(name,value,time)
{
    //if(time){
    //    var strsec = getsec(time);
    //    var exp = new Date();
    //    exp.setTime(exp.getTime() + strsec*1);
    //}
    document.cookie = name + "="+ escape (value)
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function getsec(str)
{
    alert(str);
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
////这是有设定过期时间的使用示例：
////s20是代表20秒
////h是指小时，如12小时则是：h12
////d是天数，30天则：d30
////setCookie("name","hayden","s20");
//
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    //var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

$(function () {
    //导航下拉
    $('.nav_menu ').mouseover(function () {
        $('.dropDown_menu').show();
        $('.nav_menu .menu_span').addClass('menu_span2');
    });
    $('.nav_menu').mouseout(function () {
        $('.dropDown_menu').hide();
        $('.nav_menu .menu_span').removeClass('menu_span2');
    });

    $('.admin_div ').mouseover(function () {
        $('.dropDown_menu2').show();
        $('.admin_div .admin_a').addClass('admin_a_hover');
    });
    $('.admin_div').mouseout(function () {
        $('.dropDown_menu2').hide();
        $('.admin_div .admin_a').removeClass('admin_a_hover');
    });
	
	$('.message').mouseover(function(){
		$(this).addClass('message_hover');
		$(this).children('ul').show();
	});
	$('.message').mouseout(function(){
		$(this).removeClass('message_hover');
		$(this).children('ul').hide();
	});


    //知识总览下拉

    $('#field_two p').click(function () {
        if ($(this).next().is(':hidden')) {
            $(this).next().show();
        } else {
            $(this).next().hide();
        }
    });
    $('#field_two ol li').click(function () {
        var oCon = $(this).html();
        $(this).parent().prev().html(oCon);
        $(this).parent().hide();
    });

    $('.advanc_search_div .btn_hollow').click(function () {
        if ($(this).next().is(':hidden')) {
            $(this).next().show();
        } else {
            $(this).next().hide();
        }
    });

    $('.lock_a').mouseover(function () {
        $(this).next().css('display', 'inline-block');
    });
    $('.lock_a').mouseout(function () {
        $(this).next().css('display', 'none');
    });

    //分类管理
    /*$('.classfic_ul li').click(function () {
        if ($(this).hasClass('li_on')) {
            $(this).removeClass('li_on');
        } else {
            $(this).addClass('li_on');
        }
    });*/

    //客服场景新增
    function tab(obj1, obj2) {
        $(obj1).click(function () {
            $(this).addClass('cur').siblings().removeClass();
            $(obj2).children('div').eq($(this).index()).attr('class', 'db').siblings().attr('class', 'dn');
        });
    }
    
    tab('.tab_tit span', '.tab_con');
    tab('.tab_tit2 a', '.tab_con2');


    // 达标重构
    tab('.tit span', '.tab_con');

    //搜索下拉
    $('#field_one p').click(function () {
        if ($(this).next().is(':hidden')) {
            $(this).next().show();
        } else {
            $(this).next().hide();
        }
    });
    $('#field_one ol li').click(function () {
        var oCon = $(this).html();
        $(this).parent().prev().html(oCon);
        $(this).parent().hide();
    });


    function switchOn(obj1, obj2) {
        var oDiv1 = document.getElementById(obj1);
        var oDiv2 = document.getElementById(obj2);
        if (oDiv2 && oDiv1) {
            oDiv2.onclick = function () {
                oDiv1.className = (oDiv1.className == 'close1') ? 'open1' : 'close1';
                oDiv2.className = (oDiv2.className == 'close2') ? 'open2' : 'close2';
            };
        }
    }

    switchOn('div1', 'div2');
    switchOn('div3', 'div4');
    switchOn('div5', 'div6');
    switchOn('div7', 'div8');
    switchOn('div9', 'div10');

    /*素材管理*/


    $('.pic_ul li').click(function () {
        $(this).addClass('current').siblings().removeClass();
    });

    //文档上传  12.5_add

    $('.upload_doc_p').click(function () {
        $(this).next().show();
    });
    $('.upload_doc_ul li').click(function () {
        var oCon = $(this).html();
        $(this).parent().prev('p').html(oCon);
        $(this).parent().hide();
    });

    /*$('.new_grouping').click(function () {
     $('.doc_lib_txt').css('display', 'inline-block');
     });*/


    $('.not_grouped li').click(function () {
        $(this).addClass('c_blue').siblings().removeClass();
    });


    //


    $('.add_toa').click(function () {

        //给个序号,判断know_con_top数量
        var num = $(".know_con_top").size() + 1;

        var oContent = '<div class="know_con_top pt-20 mt-20" style="border-top:1px dashed #eee;" id="content_' + num + '"><div class="cl mb-10"><div class="bd L mr-10" style="width:96%;"><div class="tab_tit2"><a href="javascript:;" class="cur" onclick="tabtab(this)"><i class="Hui-iconfont"> &#xe6ec;</i> 文字</a><a href="javascript:;" onclick="tabtab(this)"><i class="Hui-iconfont">&#xe612;</i> 图片</a><a href="javascript:;" onclick="tabtab(this)"><i class="Hui-iconfont">&#xe613;</i> 图文消息</a></div><div class="tab_con"> <div class="db"><textarea class="txta" id="content_text"></textarea> <div class="p10 pr cl"><a href="javascript:;" class="expression L"></a><span class="R">还可以输入597字</span></div></div><div class="dn"><div class="cl pt-20 pb-20 pl-30 pr-30"><dl class="L upload_dl mr-15"><dt class="tc pt50 mb-15"><a href="javascript:;" onclick="add_popup("添加图片","add_picture_tp.html","640","460")"><img src="../images/add_img2.png"></a></dt><dd class="tc c-999">从图片库中选择</dd></dl><dl class="L upload_dl"><dt class="tc pt50 mb-15"><a href="javascript:;"><img src="../images/add_img2.png"></a></dt><dd class="tc c-999">上传图片</dd></dl></div></div> <div class="dn"><div class="cl pt-20 pb-20 pl-30 pr-30"><dl class="L upload_dl mr-15"><dt class="tc pt50 mb-15"><a href="javascript:;" onclick="add_popup("选择素材","add_source_material.html","780","496")"><img src="../images/add_img2.png"></a></dt><dd class="tc c-999">从素材库中选择</dd></dl><dl class="L upload_dl"><dt class="tc pt50 mb-15"><a href="javascript:;"><img src="../images/add_img2.png"></a></dt><dd class="tc c-999">上传图片</dd></dl></div></div> </div></div><a href="javascript:;" class="L remove_a" onclick="delete_wrap(this);"><img src="../images/delete_img.png"></a></div><div><div class="pl50 pr mb-10" id="channel_div_' + num + '" style="height:25px;"><span class="pa" style="left:0;top:0;">渠道：</span></div><div class="pl50 pr mb-10" style="min-height:25px;"><span class="pa" style="left:0;top:4px;">维度：</span><div id="dimension_bar_' + num + '"></div></div></div></div>';
        $('#content_wrap').append(oContent);
        //绑定渠道
        $("#channel_div_" + num).append(window.channel_div);
        //绑定维度
        var widget = new AutoComplete('dimension_bar_' + num, window.dimension_arr);

    });


});

function tabtab(obj) {
    $(obj).addClass('cur').siblings().removeClass();
    $(obj).parent().next().children('div').eq($(obj).index()).attr('class', 'db').siblings().attr('class', 'dn');
}

function delete_wrap(obj) {
    $(obj).parent().parent().remove();
}

//客服场景新增-删除扩展问题
function rem(obj) {
    $(obj).parent().parent().remove();
}

//客服场景新增-添加扩展问题
function add_pro(obj) {
    var con2 = $(obj).parent().prev().html();
    var str = '<div class="row cl mb-10"><label class="form-label col-xs-4 col-sm-2 text-r">' + con2 + '</label><div class="formControls col-xs-8 col-sm-9"><select class="sel bd L"><option value="90020">普通</option><option value="90021">否定</option></select><input type="text" maxlength="50" disabled class="L input_text mr-10 " value="' + $.trim($(obj).val()) + '" style="width:250px;"><a href="javascript:;" class="remove_a" onclick="rem(this);"><img src="../images/delete_img.png" alt=""></a><div class="c-red " style="display:inline;"/></div></div>';
    $(obj).parent().parent().parent().append(str);
    $(obj).val('');

    var top = $(obj).parent().parent().parent();
    console.log(top.children().first());
    console.log(top.children().last().find("select option[value='" + top.children().first().find("select").val() + "']"));
    top.children().last().find("select option[value='" + top.children().first().find("select").val() + "']").attr("selected", "selected");
}
//聊天问法新增
function add_chat_question(obj) {
    chat_question_clear();
    if (xfIsEmpty($(obj).parent().find("input").val())) {
        $(obj).parent().find(".c-red").text("*" + "聊天问法标签不能为空！");
        $(obj).parent().find(".c-red").css("display", "inline");
    } else {
        //加入数组
        $(obj).parent().find(".c-red").text("");
        $(obj).parent().find(".c-red").css("display", "none");
        var con1 = $(obj).parent().prev().html();
        var con2 = $(obj).parent().find("input").val();
        console.log("$(obj).parent().find('input').val()===" + $(obj).parent().find("input").val());
        var str = '<div class="row cl mb-10"><label name="add" class="form-label col-xs-4 col-sm-2 text-r">' + con1 + '</label><div class="formControls col-xs-8 col-sm-9"><select class="sel bd L"><option value="1">普通</option><option value="2">否定</option></select><input type="text" class="L input_text mr-10 " name="chat_question_array" value="' + con2 + '" style="width:250px;"><a href="javascript:;" class="remove_a" onclick="rem(this);"><img src="../images/delete_img.png" alt=""></a><div class="c-red " style="display:inline;"/></div></div>';
        $(obj).parent().parent().parent().append(str);
        $(obj).parent().find("input").val('');

        var top = $(obj).parent().parent().parent();
        console.log(top.children().first());
        top.children().last().find("select option[value='" + top.children().first().find("select").val() + "']").attr("selected", "selected");
    }
}

//
function rem2(obj) {
    $(obj).parent().remove();
}
var i = 1;
function add_pro2() {

    i++;
    var str = '<div class="mb-10 "><span class="add_ele_span">期望回答' + i + '：</span> <div class="dib"><input type="text" class="input-text size_m" placeholder=""/></div> <a href="javascript:;" class="remove_a" onclick="rem2(this);"><img src="../images/delete_img.png" ></a></div>';
    $('.answer').append(str);
}
//
function add_pro3() {
    var str = '<div class="row cl mb-10"><label class="form-label col-xs-4 col-sm-2 text-r">触发动作：</label><div class="formControls col-xs-8 col-sm-9"> <select class="sel_big bd"><option value=""></option><option value=""></option></select> <a href="javascript:;" class="remove_a mr-10" onclick="rem(this)"><img src="../images/delete_img.png" alt=""></a> </div></div>';
    $('.action').append(str);

}

function add_pro5() {
    var con = $('.latitude').val();
    var str = '<div class="mb-10 "><span class="add_ele_span">纬度表示：</span> <div class="dib"><input type="text" class="input-text size_m" value="' + con + '"/></div> <a href="javascript:;" class="remove_a" onclick="rem2(this);"><img src="../images/delete_img.png" ></a></div>';
    $('.latit_repres_div').append(str);
    $('.latitude').val('');

}

function nextObj(obj) {
    var obj_cur = $(obj).parent().parent().parent();
    obj_cur.attr('class', 'dn');
    obj_cur.next().attr('class', 'db');
    $('.tab_tit_new span').eq(obj_cur.index() + 1).addClass('cur').siblings().removeClass();
}

function prevObj(obj) {
    var obj_cur = $(obj).parent().parent().parent();
    obj_cur.attr('class', 'dn');
    obj_cur.prev().attr('class', 'db');
    $('.tab_tit_new span').eq(obj_cur.index() - 1).addClass('cur').siblings().removeClass();
}



	

	
	
	
	