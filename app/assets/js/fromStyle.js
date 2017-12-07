$(function(){
		
		/*单选*/
		$('.my-radio label').click(function(){
			$(this).parent().find('label').not(this).removeClass('my-radio-on');
			$(this).addClass('my-radio-on');
			});
		/*多选*/
     	var evTimeStamp = 0;
		$('.my-checkbox label').click(function(e){
			 var now = +new Date();
			 if (now - evTimeStamp < 100) {
				 return;
			 }
			 evTimeStamp = now;
			 console.log(2);
			if($(this).hasClass('my-checkbox-on')==true){
				$(this).removeClass('my-checkbox-on');
				}
			else {
				$(this).addClass('my-checkbox-on');
				}
			});
		/*图片上传-删除操作*/
		$('.up-img-lst li').hover(function(){
			$(this).find('.up-img-b').show();
			},function(){
				$(this).find('.up-img-b').hide();
			})

})
	

//下拉组件
var baseSelect =
{
    resetSelect: function (e) {
        if (e == undefined) {
            //模拟下拉框
            $(".my-select").unbind("click").click(function () {
                if (!$(this).find(".my-option").is(":visible")) {
                    hideSelect($(".my-select"));
                    selectHander($(this));
                } else {
                    hideSelect($(".my-select"));
                    $(this).removeClass('my-on-select');
                }
            });
            //失去焦点时隐藏list
            $(document).click(function () {
                hideSelect($(".my-select"));
                $(".my-select").removeClass('my-on-select');
            })
            //阻止冒泡事件
            $(".my-select").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });
            $(".my-option dd").unbind("click").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });

//          //鼠标hover效果
//          $(".my-option dd").hover(function () {
//              $(this).css({color: "#eb8b00" });
//          }, function () {
//              $(this).css({color: "#2a3336" });
//          });

            //鼠标点击效果
            $(".my-option dd").click(function () {
                hideSelect($(".my-select"));
                setValue($(this));
            });

        } else {
            //模拟下拉框
            $(e + " .my-select").unbind("click").click(function () {
                if (!$(this).find(".my-option").is(":visible")) {
                    hideSelect($(e + " .my-select"));
                    selectHander($(this));
                } else {
                    hideSelect($(e + " .my-select"));
                    $(this).removeClass('my-on-select');
                }
            });
            //失去焦点时隐藏list
            $(document).click(function () {
                hideSelect($(e + " .my-select"));
                $(e + " .my-select").removeClass('my-on-select');
            })
            //阻止冒泡事件
            $(e + " .my-select").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });
            $(e + " .my-option dd").unbind("click").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });

            //鼠标hover效果
            $(e + " .my-option dd").hover(function () {
                $(this).css({color: "#eb8b00" });
            }, function () {
                $(this).css({color: "#2a3336" });
            });

            //鼠标点击效果
            $(e + " .my-option dd").click(function () {
                hideSelect($(e + " .my-select"));
                setValue($(this));
            });

        }
    },
    resetSelect1: function (e) {
        if (e == undefined) {
            //模拟下拉框
            $(".my-select").unbind("click").click(function () {
                if (!$(this).find(".my-option").is(":visible")) {
                    hideSelect($(".my-select"));
                    selectHander($(this));
                } else {
                    hideSelect($(".my-select"));
                    $(this).removeClass('my-on-select');
                }
            });
            //失去焦点时隐藏list
            $(document).click(function () {
                hideSelect($(".my-select"));
                $(".my-select").removeClass('my-on-select');

            })
            //阻止冒泡事件
            $(".my-select").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });
            $(".my-option dd").unbind("click").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });

            //鼠标hover效果
            $(".my-option dd").hover(function () {
                $(this).css({color: "#eb8b00" });
            }, function () {
                $(this).css({color: "#2a3336" });
            });

            //鼠标点击效果
            $(".my-option dd").click(function () {
                hideSelect($(".my-select"));
                setValue1($(this));
            });
        } else {
            //模拟下拉框
            $(e + " .my-select").unbind("click").click(function () {
                if (!$(this).find(".my-option").is(":visible")) {
                    hideSelect($(e + " .my-select"));
                    selectHander($(this));
                } else {
                    hideSelect($(e + " .my-select"));
                    $(this).removeClass('my-on-select');
                }
            });
            //失去焦点时隐藏list
            $(document).click(function () {
                hideSelect($(e + " .my-select"));
                $(e + " .my-select").css({ zIndex: "1" });
            })
            //阻止冒泡事件
            $(e + " .my-select").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });
            $(e + " .my-option dd").unbind("click").click(function (e) {
                e ? e.stopPropagation() : event.cancelBubble = true;
            });

            //鼠标hover效果
            $(e + " .my-option dd").hover(function () {
                $(this).css({color: "#eb8b00" });
            }, function () {
                $(this).css({color: "#2a3336" });
            });

            //鼠标点击效果
            $(e + " .my-option dd").click(function () {
                hideSelect($(e + " .my-select"));
                setValue1($(this));
            });
        }
    }
}

$(function () {
    baseSelect.resetSelect();
});

function hideSelect(val) {
    $('.my-option>dl').height('');
    val.find(".my-option").hide();
    $(".my-select").removeClass('my-on-select');
}

function selectHander(tar) {
    tar.find(".my-option").show();
    if (tar.find(".my-option dl").height() > 184) {
        tar.find(".my-option dl").height(184);
    }
    tar.addClass('my-on-select');
    //ie6下宽度-2像素
}

function setValue(e) {
    var txt = e.text();
    var label = e.parents(".my-select").find("label");
    var input = e.parents(".my-select").find("input");

    if (input.length == 0) {
        label.text(txt);
        var val = e.attr("val");
        label.attr("val", val);
    } else {
        input.val(txt);
    }


}
