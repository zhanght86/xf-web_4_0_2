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
//function downloadFile(fileName, content){
//    var aLink = document.createElement('a');
//    var blob = new Blob([content]);
//    var evt = document.createEvent("HTMLEvents");
//    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
//    aLink.download = fileName;
//    aLink.href = URL.createObjectURL(blob);
//    aLink.dispatchEvent(evt);
//}
//提供keySearch 使用方法
function onput(e,updateCall,specialKeyCall,inputCall){
    /* 必写
    *   e
    *   updataCall  $scope.$apply(function(){
                         model = angular.element(self).val();
                    })
    * */
    //     {{ this  keycode  val }}    //
    //enter
    //输入更新
    //
    var  self = e.srcElement ? e.srcElement : e.target;
    var keycode = window.event?e.keyCode:e.which;
    var val  ;
    //chrome  兼容 输入汉字更新model问题
    angular.element(self).on({
        compositionend:function(value) {
            val = angular.element(self).val() ; //得到数值
            updateCall();                       //更新数值
            console.log(val) ;
            if (inputCall) {
                inputCall()
            }
            if (specialKeyCall) {
                specialKeyCall();
                //if(keycode==13){
                //    srcObj.blur();
                //    callback();
                //    //srcObj.focus()
                //}
            }
        }
    })
   };
function enterEvent(e,callback) {
    var  srcObj = e.srcElement ? e.srcElement : e.target;
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
        srcObj.blur();
        callback();
        //srcObj.focus()
    }
}
//请求方式
function httpRequestPost(url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall) {
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
        timeout: timeout?timeout:100000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            falCallback(xhr, type, errorThrown);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                //ajaxTimeoutTest.abort();
                //layer.msg("请求超时");
                console.log("请求超时");
            }
        }
    })
}
function httpRequestPostAsync(url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall) {
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
        async:false,
        type: "POST", //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            falCallback(xhr, type, errorThrown);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                //ajaxTimeoutTest.abort();
                //layer.msg("请求超时");
                console.log("请求超时");
            }
        }
    })
}
//获取 当前时间
function formsubmit() {
    var Today = new Date();
    var NowHour = Today.getHours();
    var NowMinute = Today.getMinutes();
    var NowSecond = Today.getSeconds();
    var today = {
        today: Today,
        hour: NowHour,
        minute: NowMinute,
        second: NowSecond
    } ;
    return today
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

    //tianjia   type
function milesAdd(item,arr,type){
    //验证  0  验证重复    1  不验证重复
    if(type){
        arr.push(item)
    }else{
        if(arr.indexOf(item)==-1){
            arr.push(item)
        }
    }
};
//
//function DownLoadFile(options) {
//    var config = $.extend(true, { method: 'post' }, options);
//    var $iframe = $('<iframe id="down-file-iframe" />');
//    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
//    $form.attr('action', config.url);
//    for (var key in config.data) {
//        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
//    }
//    $iframe.append($form);
//    $(document.body).append($iframe);
//    $form[0].submit();
//    $iframe.remove();
//}
//function milesRemove(item,arr){
//    arr.remove(item)
//}
/**
 * 为空判断 包括空字符串及回车换行符
 * @param value
 */
function nullCheck(value){
    if(value==null){
        return false;
    }
    if(value==""){
        return false;
    }
    if(value==undefined){
        return false;
    }
    var result = value.replace(/[ \r\n]/g,"");
    if(result==""){
        return false;
    }
    return true;
}
/**
 * 长度检测 包括边界
 * @param value
 * @param min
 * @param max
 */
function lengthCheck(value,min,max){
    if(nullCheck(value)==false){
        return false;
    }
    if(value.length<min){
        return false;
    }
    if(value.length>max){
        return false;
    }
    return true;
}

/**
 * 下载文件
 * @param fPath 路径
 * @param fName 文件名
 */
function downloadFile(url,filePath,fileName){
    if(nullCheck(url)==false){
        return;
    }
    if(nullCheck(fileName)==false){
        return;
    }
    var form = $("<form>");   //定义一个form表单
    form.attr('style', 'display:none');   //在form表单中添加查询参数
    form.attr('target', '');
    form.attr('method', 'get');
    form.attr('action', url);

    if(nullCheck(filePath)==true){
        var input1 = $('<input>');
        input1.attr('type', 'hidden');
        input1.attr('name', 'filePath');
        input1.attr('value', filePath);
        form.append(input1);   //将查询参数控件提交到表单上
    }

    var input2 = $('<input>');
    input2.attr('type', 'hidden');
    input2.attr('name', 'fileName');
    input2.attr('value', fileName);
    $('body').append(form);  //将表单放置在web中

    form.append(input2);   //将查询参数控件提交到表单上
    form.submit();
}

/**
 * 字符串截取
 * @param value
 * @param limit
 * @param tail
 * @returns {*}
 */
function subStringWithTail(value,limit,tail){
    if(nullCheck(value)==false){
        return "";
    }
    if(value.length<=limit){
        return value;
    }
    if(value.length>limit){
        return value.substring(0,limit)+tail;
    }
}
/**
 * 数组内容重复检测
 * @param arr
 * @returns {boolean}
 */
function arrayRepeatCheck(arr){
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]])
            return false;
        hash[arr[i]] = false;
    }
    return true;
}

function showElement(element) {
    var oldhtml = element.innerHTML;
    //创建新的input元素
    var newobj = document.createElement('input');
    //为新增元素添加类型
    newobj.type = 'text';
    //为新增元素添加value值
    newobj.value = oldhtml;
    //为新增元素添加光标离开事件
    newobj.onblur = function() {
        element.innerHTML = this.value == oldhtml ? oldhtml : this.value;
        //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
    }
    //设置该标签的子节点为空
    element.innerHTML = '';
    //添加该标签的子节点，input对象
    element.appendChild(newobj);
    //设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
    newobj.setSelectionRange(0, oldhtml.length);
    //设置获得光标
    newobj.focus();
}
/**
 * 替换所有空格回车
 * @param str
 * @returns {*}
 */
function trimStr(str){
    if(nullCheck(str)==false){
        return "";
    }
    return str.replace(/[ \r\n]/g,"");
}
/**
 * 填充空格为下划线
 * @param str
 * @returns {*}
 */
function fillWhiteSpace(str){
    if(nullCheck(str)==false){
        return "";
    }
    return str.replace(/[ \r\n]/g,"_");
}
/**
 * 下划线替换为空格
 * @param str
 * @returns {*}
 */
function underlineToWhiteSpace(str){
    if(nullCheck(str)==false){
        return "";
    }
    return str.replace(/[\_]/g," ");
}
/**
 * CategoryLibrary对象转换为JSON字符串
 * @param obj
 * @returns {*}
 */
function toCategoryLibraryString(obj){
    if(obj==null || obj==undefined){
        return "";
    }
    var str='{';
    str+='"categoryId":"'+obj.categoryId+'",';
    str+='"categoryTypeId":'+obj.categoryTypeId+',';
    str+='"categoryAttributeName":"'+obj.categoryAttributeName+'",';
    str+='"categoryName":"'+obj.categoryName+'",';
    str+='"categoryModifierId":"'+obj.categoryModifierId+'",';
    str+='"categoryModifyTime":'+obj.categoryModifyTime+',';
    str+='"categoryPid":"'+obj.categoryPid+'",';
    str+='"categorySceneId":'+obj.categorySceneId+',';
    str+='"categoryLeaf":'+obj.categoryLeaf+',';
    if(obj.categoryDescribe==null){
        str+='"categoryDescribe":null';
    }else{
        str+='"categoryDescribe":"'+fillWhiteSpace(obj.categoryDescribe)+'"';
    }
    str+='}';
    return str;
}
/**
 * Category对象转换为JSON字符串
 * @param obj
 * @returns {*}
 */
function toCategoryString(obj){
    if(obj==null || obj==undefined){
        return "";
    }
    var str='{';
    str+='"categoryId":"'+obj.categoryId+'",';
    str+='"categoryTypeId":'+obj.categoryTypeId+',';
    str+='"categoryAttributeName":"'+obj.categoryAttributeName+'",';
    str+='"categoryName":"'+obj.categoryName+'",';
    str+='"categoryModifierId":"'+obj.categoryModifierId+'",';
    str+='"categoryModifyTime":'+obj.categoryModifyTime+',';
    str+='"categoryPid":"'+obj.categoryPid+'",';
    str+='"categoryApplicationId":"'+obj.categoryApplicationId+'",';
    str+='"categorySceneId":'+obj.categorySceneId+',';
    str+='"categoryLeaf":'+obj.categoryLeaf+',';
    if(obj.categoryDescribe==null){
        str+='"categoryDescribe":null';
    }else{
        str+='"categoryDescribe":"'+fillWhiteSpace(obj.categoryDescribe)+'"';
    }
    str+='}';
    return str;
}
/**
 * Frame对象转换为JSON字符串
 * @param obj
 * @returns {*}
 */
function toFrameString(obj){
    if(obj==null || obj==undefined){
        return "";
    }
    var str='{';
    str+='"frameId":"'+obj.frameId+'",';
    str+='"frameTypeId":'+obj.frameTypeId+',';
    str+='"frameTitle":"'+obj.frameTitle+'",';
    str+='"frameModifierId":"'+obj.frameModifierId+'",';
    str+='"frameModifyTime":'+obj.frameModifyTime+',';
    str+='"frameCategoryId":"'+obj.frameCategoryId+'",';
    str+='"frameEnableStatusId":'+obj.frameEnableStatusId+',';
    if(obj.elements!=null && obj.elements != undefined && obj.elements.length>0){
        var strElement = "";
        for(var i=0;i<obj.elements.length;i++){
            if(i==obj.elements.length-1){
                strElement+=toElementString(obj.elements[i]);
            }else{
                strElement+=toElementString(obj.elements[i])+',';
            }
        }
        str+='"elements":['+strElement+']';
    }else{
        str+='"elements":[]';
    }
    str+='}';
    return str;
}
/**
 * Element对象转换为JSON字符串
 * @param obj
 * @returns {*}
 */
function toElementString(obj){
    if(obj==null || obj==undefined){
        return "";
    }
    var str='{';
    str+='"elementId":"'+obj.elementId+'",';
    str+='"elementTypeId":'+obj.elementTypeId+',';
    str+='"elementAttributeId":'+obj.elementAttributeId+',';
    str+='"elementContent":"'+obj.elementContent+'",';
    str+='"elementMiningTypeId":'+obj.elementMiningTypeId+',';
    str+='"elementAskContent":"'+obj.elementAskContent+'",';
    str+='"elementFrameId":"'+obj.elementFrameId+'",';
    str+='"elementRelateConcept":"'+obj.elementRelateConcept+'"';
    str+='}';
    return str;
}
/**
 * 校验是否含有html标签
 * @param str
 * @returns {boolean}
 */
function isHtmlLabel(str){
    var  reg = /<[^>]+>/g;
    if(nullCheck(str)==false){
        return false;
    }
    return reg.test(str);
}

function initUpload(url){
    (function ($) {
        $(function () {
            var layerFlag = true;
            var $wrap = $('#uploader'),
                $queue = $('<ul class="filelist"></ul>')
                    .appendTo($wrap.find('.queueList')),
                $statusBar = $wrap.find('.statusBar'),
                $info = $statusBar.find('.info'),
                $upload = $wrap.find('.uploadBtn'),
                $placeHolder = $wrap.find('.placeholder'),
                $progress = $statusBar.find('.progress').hide(),
                fileCount = 0,
                fileSize = 0,
                ratio = window.devicePixelRatio || 1,
                thumbnailWidth = 110 * ratio,
                thumbnailHeight = 110 * ratio,
                state = 'pedding',
                isSupportBase64 = (function () {
                    var data = new Image();
                    var support = true;
                    data.onload = data.onerror = function () {
                        if (this.width != 1 || this.height != 1) {
                            support = false;
                        }
                    }
                    data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                    return support;
                })(),
                flashVersion = (function () {
                    var version;

                    try {
                        version = navigator.plugins['Shockwave Flash'];
                        version = version.description;
                    } catch (ex) {
                        try {
                            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                .GetVariable('$version');
                        } catch (ex2) {
                            version = '0.0';
                        }
                    }
                    version = version.match(/\d+/g);
                    return parseFloat(version[0] + '.' + version[1], 10);
                })(),
                supportTransition = (function () {
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),
                uploader;
            if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {
                if (flashVersion) {
                    (function (container) {
                        window['expressinstallcallback'] = function (state) {
                            switch (state) {
                                case 'Download.Cancelled':
                                    console.log('您取消了更新！')
                                    break;

                                case 'Download.Failed':
                                    console.log('安装失败')
                                    break;

                                default:
                                    console.log('安装已成功，请刷新！');
                                    break;
                            }
                            delete window['expressinstallcallback'];
                        };

                        var swf = './expressInstall.swf';
                        var html = '<object type="application/' +
                            'x-shockwave-flash" data="' + swf + '" ';

                        if (WebUploader.browser.ie) {
                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                        }
                        html += 'width="100%" height="100%" style="outline:0">' +
                            '<param name="movie" value="' + swf + '" />' +
                            '<param name="wmode" value="transparent" />' +
                            '<param name="allowscriptaccess" value="always" />' +
                            '</object>';

                        container.html(html);
                    })($wrap);
                } else {
                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                }
                return;
            } else if (!WebUploader.Uploader.support()) {
                console.log('Web Uploader 不支持您的浏览器！');
                return;
            }
            uploader = WebUploader.create({
                pick: {
                    id: '#filePicker',
                    label: '点击选择文件'
                },
                dnd: '#dndArea',
                paste: '#uploader',
                swf: 'Uploader.swf',
                chunked: false,
                chunkSize: 512 * 1024,
                server: url,
                timeout: 0,
                accept: {
                    title: 'file',
                    extensions: 'xls,xlsx',
                    mimeTypes: 'file/*'
                },
                disableGlobalDnd: true,
                fileNumLimit: 300,
                fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
            });
            uploader.on('dndAccept', function (items) {
                var denied = false,
                    len = items.length,
                    i = 0,
                    unAllowed = 'text/plain;application/javascript ';
                for (; i < len; i++) {
                    if (~unAllowed.indexOf(items[i].type)) {
                        denied = true;
                        break;
                    }
                }
                return !denied;
            });
            uploader.addButton({
                id: '#filePicker2',
                label: '继续添加'
            });
            uploader.on('ready', function () {
                window.uploader = uploader;
            });
            uploader.on('uploadAccept', function (block, ret, fn) {
                console.log("====receive response====");
                if(ret && ret.info){
                    layerFlag = false;
                    layer.msg('您的文件上传'+ret.info+'，请关闭当前窗口！');
                }
            });
            function addFile(file) {
                var $li = $('<li id="' + file.id + '">' +
                        '<p class="title"></p>' +
                        '<p class="imgWrap"></p>' +
                        '<p class="progress"><span></span></p>' +
                        '</li>'),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span></div>').appendTo($li),
                    $wrap = $li.find('p.imgWrap'),
                    $info = $('<p class="progress"></p>'),

                    showError = function (code) {
                        switch (code) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '';
                                break;
                        }

                        $info.text(text).appendTo($li);
                    };

                if (file.getStatus() === 'invalid') {
                    showError(file.statusText);
                } else {
                    uploader.makeThumb(file, function (error, src) {
                        var img;
                        if (error) {
                            $wrap.html('<img src="../images/excel.png">');
                            return;
                        }
                        if (isSupportBase64) {
                            img = $('<img src="' + src + '">');
                            $wrap.empty().append(img);
                        } else {
                            $.ajax('../../server/preview.php', {
                                method: 'POST',
                                data: src,
                                dataType: 'json'
                            }).done(function (response) {
                                if (response.result) {
                                    img = $('<img src="' + response.result + '">');
                                    $wrap.empty().append(img);
                                } else {
                                    $wrap.text("预览出错");
                                }
                            });
                        }
                    }, thumbnailWidth, thumbnailHeight);
                    file.rotation = 0;
                }
                file.on('statuschange', function (cur, prev) {
                    if (prev === 'progress') {
                    } else if (prev === 'queued') {
                        $li.off('mouseenter mouseleave');
                        $btns.remove();
                    }

                    // 成功
                    if (cur === 'error' || cur === 'invalid') {
                        console.log(file.statusText);
                        showError(file.statusText);
                    } else if (cur === 'interrupt') {
                        showError('interrupt');
                    } else if (cur === 'queued') {
                    } else if (cur === 'progress') {
                        $info.remove();
                    } else if (cur === 'complete') {
                        $li.append('<span class="success"></span>');
                    }

                    $li.removeClass('state-' + prev).addClass('state-' + cur);
                });

                $li.on('mouseenter', function () {
                    $btns.stop().animate({height: 30});
                });

                $li.on('mouseleave', function () {
                    $btns.stop().animate({height: 0});
                });

                $btns.on('click', 'span', function () {
                    var index = $(this).index(),
                        deg;

                    switch (index) {
                        case 0:
                            uploader.removeFile(file);
                            return;

                        case 1:
                            file.rotation += 90;
                            break;

                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if (supportTransition) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    }
                });
                $li.appendTo($queue);
            }
            function removeFile(file) {
                var $li = $('#' + file.id);
                $li.off().find('.file-panel').off().end().remove();
            }

            function setState(val) {
                var file, stats;
                if (val === state) {
                    return;
                }
                $upload.removeClass('state-' + state);
                $upload.addClass('state-' + val);
                state = val;
                switch (state) {
                    case 'pedding':
                        $placeHolder.removeClass('element-invisible');
                        $queue.hide();
                        $statusBar.addClass('element-invisible');
                        uploader.refresh();
                        break;
                    case 'ready':
                        $placeHolder.addClass('element-invisible');
                        $('#filePicker2').removeClass('element-invisible');
                        $queue.show();
                        $statusBar.removeClass('element-invisible');
                        uploader.refresh();
                        break;
                    case 'uploading':
                        $('#filePicker2').addClass('element-invisible');
                        $upload.text('暂停上传');
                        break;
                    case 'paused':
                        $upload.text('继续上传');
                        break;
                    case 'confirm':
                        $('#filePicker2').removeClass('element-invisible');
                        $upload.text('开始上传');
                        stats = uploader.getStats();
                        setState('finish');
                        return;
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if(layerFlag){
                            layer.msg('您的文件正在上传，请关闭当前窗口！');
                        }
                        break;
                }
            }

            uploader.onFileQueued = function (file) {
                fileCount++;
                fileSize += file.size;
                if (fileCount === 1) {
                    $placeHolder.addClass('element-invisible');
                    $statusBar.show();
                }
                addFile(file);
                setState('ready');
            };

            uploader.onFileDequeued = function (file) {
                fileCount--;
                fileSize -= file.size;
                if (!fileCount) {
                    setState('pedding');
                }
                removeFile(file);
            };

            uploader.on('all', function (type) {
                var stats;
                switch (type) {
                    case 'uploadFinished':
                        setState('confirm');
                        break;

                    case 'startUpload':
                        setState('uploading');
                        break;

                    case 'stopUpload':
                        setState('paused');
                        break;
                }
            });

            uploader.onError = function (code) {
                console.log('错误: ' + code);
                switch (code){
                    case "Q_TYPE_DENIED":layer.msg('上传文件类型错误！');break;
                    case "Q_EXCEED_SIZE_LIMIT":layer.msg('超过限制大小！');break;
                    case "Q_EXCEED_NUM_LIMIT":layer.msg('超过上传数量！');break;
                }
            };

            $upload.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                if (state === 'ready') {
                    uploader.upload();
                } else if (state === 'paused') {
                    uploader.upload();
                } else if (state === 'uploading') {
                    uploader.stop();
                }
            });
            $info.on('click', '.retry', function () {
                uploader.retry();
            });
            $info.on('click', '.ignore', function () {
                console.log('todo');
            });
            $upload.addClass('state-' + state);
        });
    })(jQuery);
}
	
	
	