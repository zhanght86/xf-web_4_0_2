/**
 * Created by Administrator on 2016/12/12.
 */

knowledge_static_web.directive("gatewayMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                $('.popup_span').show();
                if (attrs.gatewayMenu == 'file')
                    $(".import_from_txt").css('visibility', 'visible');
                else if (attrs.gatewayMenu == 'single')
                    $(".add_single_popup").css('visibility', 'visible');
                else if (attrs.gatewayMenu == 'adapter')
                    $(".jr_Agent").show();
            })
        }
    }
});

knowledge_static_web.directive('plupload', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {
            var uploader = new plupload.Uploader({
                runtimes: 'html4,html5,flash,silverlight',
                browse_button: 'pickfiles',
                url: 'noturl',
                //container: document.getElementById('filelist'),
                //container: $('#filelist'),
                multi_selection: true,
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{
                        title: "Know File",
                        extensions: "doc,docx,txt,pdf,xls,xlsx,html,ppt,pptx"
                    }]
                },
                flash_swf_url: '/plupload/Moxie.swf',
                silverlight_xap_url: '/plupload/Moxie.xap',
                init: {
                    PostInit: function () {
                        //document.getElementById('uploadfiles').onclick = function() {
                        $('#uploadfiles').click(function () {
                            var params = {
                                //这里设置上传参数
                                //ontologys: $scope.classifyId,
                                //fregStyle: 2, //碎片化加工
                                templateId:$scope.targetId,
                                requestId:"String",
                                //设置用户信息
                                userId:"testuser"

                            };
                            if ($scope.processMethod == true) {
                                if (!$scope.targetId || $scope.targetId == null) {
                                    alert("请选择加工模板");
                                    return;
                                }
                                //params.targetId = $scope.targetId;
                            }
                            uploader.setOption('multipart_params', params);
                            uploader.setOption('url', '/api/knowledgeDocumentation/createDocumentation');
                            uploader.start();
                            return false;
                        });

                        $('#reset').click(function () {
                            if (uploader.files.length > 0) {
                                for (var i = uploader.files.length; i > 0; i--) {
                                    uploader.removeFile(uploader.files[i - 1]);
                                }
                            }
                            $scope.$apply($scope.resetUploadPOJO());
                        })
                    },

                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            //document.getElementById('file_container').innerHTML += '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> (' + plupload.formatSize(file.size) + ') </span></div>';
                            $('#file_container').append('<div class="file_con" id="' + file.id + '"style="overflow:hidden;padding: 0px;">' +
                                                            '<span  class="name">' + file.name + '</span>' +
                                                            '<b class="progress" style="font-size: 14px;line-height: 33px;margin-left: 15px; height: inherit; width: 40px;">0%</b>' +
                                                            '<span class="size"> (' + plupload.formatSize(file.size) + ') </span>' +
                                                        '</div>');
                        });
                    },

                    FilesRemoved: function (up, files) {
                        plupload.each(files, function (file) {
                            if (up.files.length <= 0) {
                                //document.getElementById('file_container').innerHTML = '';
                                $('#file_container').html('');
                            }
                        });
                    },

                    UploadProgress: function (up, file) {
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
                    },

                    Error: function (up, err) {
                        console.log("Error #" + err.code + ": " + err.message);
                    },

                    UploadComplete: function (uploader, files) {

                    },

                    FileUploaded: function (uploader, files, res) {
                        $scope.queryKnowDocList();
                        $('#file_container').html('');
                        $scope.resetUploadPOJO();
                        $('.template_inpt').val("");
                        if (res.status == 200){
                            $('.popup_wrap').hide();
                            $('.popup_span').hide();
                            $(".import_from_txt").css('visibility', 'hidden');
                            $(".add_single_popup").css('visibility', 'hidden');
                        }
                    }
                }
            });
            uploader.init();
        }
    };
}]);

knowledge_static_web.directive('tempPlupload', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {
            var uploader = new plupload.Uploader({
                runtimes: 'html4,html5,flash,silverlight',
                browse_button: 'tempickfile',
                url:'/api/template/createTemplate',

                //container: 'temcontainer',
                max_file_count: 1,
                multi_selection: false,
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{
                        title: "Know File",
                        extensions: "doc,docx"
                    }]
                },
                flash_swf_url: '/plupload/Moxie.swf',
                silverlight_xap_url: '/plupload/Moxie.xap',
                init: {
                    PostInit: function () {
                        $('#temupload').click(function () {
                            if ($scope.temName == null || $scope.temName == '' || !$scope.temName) {
                                alert("请输入模板名称");
                                return;
                            }
                            if ($scope.temName.length > 50) {
                                alert("模板名称不能大于50字");
                                return;
                            }
                            if (!$scope.temNameChecked) {
                                alert("模板名校验失败");
                                return;
                            }
                            if (uploader.files.length <= 0) {
                                alert("请选择上传文件");
                                return;
                            }
                            uploader.setOption('multipart_params', {
                                type: $scope.temType,
                                "templateName": $scope.temName,
                                "requestId":"String",
                                //此处设置上传用户信息
                                "userId":"testUser"
                            });
                            uploader.start();
                            return false;
                        });

                        //document.getElementById('temreset').onclick = function(){
                        $('#temreset').click(function () {
                            if (uploader.files.length > 0) {
                                for (var i = uploader.files.length; i > 0; i--) {
                                    uploader.removeFile(uploader.files[i - 1]);
                                }
                            }
                        })
                    },

                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            //document.getElementById('temcontainer').innerHTML = '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></div>';
                            $('#temcontainer').html('<div class="file_con" id="' + file.id + '"style="overflow:hidden;padding: 0px;">' +
                                                        '<span  class="name">' + file.name + '</span>' +
                                                        '<b class="progress" style="font-size: 14px;line-height: 33px;margin-left: 15px; height: inherit; width: 40px;">0%</b>' +
                                                        '<span class="size"> </span>' +
                                                    '</div>');
                            if (up.files.length <= 1) {
                                return;
                            }
                            up.removeFile(file);
                        });
                    },

                    FilesRemoved: function (up, files) {
                        plupload.each(files, function (file) {
                            if (up.files.length <= 0) {
                                //document.getElementById('temcontainer').innerHTML = '未选择文件';
                                $('#temcontainer').html('未选择文件');
                            }
                        });
                    },

                    UploadProgress: function (up, file) {
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
                    },

                    Error: function (up, err) {
                        console.log("Error #" + err.code + ": " + err.message);
                    },

                    UploadComplete: function (uploader, files) {

                    },

                    FileUploaded: function (uploader, files, res) {
                        if (res.status == 200) {
                            //var res = res.replace(/<.*?>/ig,"")
                            var response = JSON.parse(res.response.replace(/<.*?>/ig,""));
                            if (response.status == 200) {
                                alert("模板文件上传成功，请添加规则");
                                $scope.$apply(function () {
                                    $scope.temId = response.data.templateId;
                                    $scope.storeParams($scope.temId);
                                })
                            } else {
                                alert("模板文件上传失败");
                            }
                        }
                    }
                }
            });
            uploader.init();
        }
    };
}]);

// knowledge_static_web.directive('sinPlupload', ['$timeout', function ($timeout) {
//     return {
//         restrict: 'A',
//         link: function ($scope, iElm, iAttrs, controller) {
//             var uploader = new plupload.Uploader({
//                 runtimes: 'html4,html5,flash,silverlight',
//                 browse_button: 'sinpickfile',
//                 url: '/back/knowaccess/docimport/docmanager/singleImport',
//                 // container: 'test',
//                 max_file_count: 1,
//                 multi_selection: false,
//                 filters: {
//                     max_file_size: '10mb',
//                     mime_types: [{
//                         title: "Know File",
//                         extensions: "doc,docx"
//                     }]
//                 },
//                 // flash_swf_url: '/plupload/Moxie.swf',
//                 // silverlight_xap_url: '/plupload/Moxie.xap',
//                 init: {
//                     PostInit: function () {
//                         //document.getElementById('sinupload').onclick = function() {
//                         $('#sinupload').click(function () {
//                             if (!$scope.sinKnowItemTitle || $scope.sinKnowItemTitle == '' || $scope.sinKnowItemTitle == null) {
//                                 alert("知识条目标题不能为空");
//                                 return;
//                             }
//                             if (!$scope.sinKnowItemContent || $scope.sinKnowItemContent == '' || $scope.sinKnowItemContent == null) {
//                                 alert("知识条目内容不能为空");
//                                 return;
//                             }
//                             uploader.setOption('multipart_params', {
//                                 title: $scope.sinKnowItemTitle,
//                                 content: $scope.sinKnowItemContent,
//                                 libraryId: $scope.uploadLibraryId,
//                                 ontologys: $scope.classifyId
//                             });
//                             if (uploader.files.length > 0) {
//                                 uploader.start();
//                             } else {
//                                 $scope.noFileSinUpload();
//                             }
//                             return false;
//                         });
//
//                         //document.getElementById('sinreset').onclick = function(){
//                         $('#sinreset').click(function () {
//                             if (uploader.files.length > 0) {
//                                 for (var i = uploader.files.length; i > 0; i--) {
//                                     uploader.removeFile(uploader.files[i - 1]);
//                                 }
//                             }
//                             $scope.$apply($scope.resetSinPOJO());
//                         })
//                     },
//
//                     FilesAdded: function (up, files) {
//                         plupload.each(files, function (file) {
//                             //document.getElementById('sincontainer').innerHTML = '<div class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></div>';
//                             $('#sincontainer').html('<span class="file_con" id="' + file.id + '"style="overflow:hidden"><span  class="name">' + file.name + '</span><b class="progress">0%</b><span class="size"> </span></span>');
//                             if (up.files.length <= 1) {
//                                 return;
//                             }
//                             up.removeFile(file);
//                         });
//                     },
//
//                     FilesRemoved: function (up, files) {
//                         plupload.each(files, function (file) {
//                             if (up.files.length <= 0) {
//                                 //document.getElementById('sincontainer').innerHTML = '';
//                                 $('#sincontainer').html('');
//                             }
//                         });
//                     },
//
//                     UploadProgress: function (up, file) {
//                         //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
//                         $('#' + file.id).find('b').html('<span>' + file.percent + '%</span>');
//                     },
//
//                     Error: function (up, err) {
//                         console.log("Error #" + err.code + ": " + err.message);
//                     },
//
//                     UploadComplete: function (uploader, files) {
//
//                     },
//
//                     FileUploaded: function (uploader, files, res) {
//                         if (res.status == 200) {
//                             $('.popup_wrap').hide();
//                             $('.popup_span').hide();
//                             $(".import_from_txt").css('visibility', 'hidden');
//                             $(".add_single_popup").css('visibility', 'hidden');
//
//                             $scope.queryKnowDocList();
//                             //document.getElementById('sincontainer').innerHTML = '';
//                             $('#sincontainer').html('');
//                             $scope.resetSinPOJO();
//                         }
//                     }
//                 }
//             });
//             uploader.init();
//         }
//     };
// }]);

knowledge_static_web.directive("advanceMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var e = e || window.event;
                e.stopPropagation();
                if ($('.advan_search_div').is(':hidden')) {
                    $('.advan_search_div').show();
                    $('.advan_search').addClass('on');
                } else {
                    $('.advan_search_div').hide();
                    $('.advan_search').removeClass('on');
                }
            });
        }
    }
});

knowledge_static_web.directive("advansearchdiv", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var e = e || window.event;

                $(this).show();
                e.stopPropagation();
            });
            $(document).click(function () {
                elem.hide();
            })
        }
    }
});

knowledge_static_web.directive("processMethodMenu", function () {
    return {
        restrict: "AE",
        link: function ($scope, elem, attrs) {
            var pFun = attrs.processMethodMenu;
            elem.click(function () {
                if ($scope.processMethod == false) {
                    $('#modelSelect').show();
                    $('#modelAdd').show();
                    $scope.queryTemplate();
                } else {
                    $('#modelSelect').hide();
                    $('#modelAdd').hide();
                }
            })
        }
    }
});

knowledge_static_web.directive("templateInput", function () {
    return {
        restrict: "AE",
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var ev = e || window.event;
                $('.template_con').show();
                ev.stopPropagation();
            })

            $(document).click(function () {
                $('.template_con').hide();
            })
        }
    }
});

knowledge_static_web.directive("templateCon", function () {
    return {
        restrict: "AE",
        // scope:{
        //     targetId:"=targetId"
        // },
        link: function ($scope, elem, attrs) {
            elem.click(function (e) {
                var ev = e || window.event;
                ev.stopPropagation();
            })

            $scope.$on('onRenderFinish', function (event) {
                $('.template_con tbody tr').click(function () {
                    var value = $(this).find('td').eq(1).html();
                    var id = $(this).find('td').eq(3).html();
                    $('.template_inpt').val(value);
                    $scope.$parent.targetId = $scope.targetId = id;
                    $(this).parents('.template_con').hide();
                })
            });

        }
    }
});


knowledge_static_web.directive("mouldShowMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.change(function () {
                if ($(this).val() == "模板加工") {
                    $(this).next().show();
                }
            })
        }
    }
});

knowledge_static_web.directive("closeMenu", function () {
    return {
        restrict: "AE",
        scope: {},
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                $('.popup_wrap').hide();
                $('.popup_span').hide();
                $(".import_from_txt").css('visibility', 'hidden');
                $(".add_single_popup").css('visibility', 'hidden');
            });
        }
    }
});

knowledge_static_web.directive("onOff", function () {
    return {
        restrict: "AE",
        scope: {
            updateAdStatus: '&upfunction'
        },
        link: function ($scope, elem, attrs) {
            // var att = attrs.onOff.split(",");
            // var status = att[0];
            // var id = att[1]

            elem.click(function () {
                if ($(this).hasClass('on_off_active')) {
                    $(this).removeClass("on_off_active")
                } else {
                    $(this).addClass("on_off_active")
                }
                $scope.updateAdStatus();

            })
        }
    }
});


/**
 * ztree下拉树控件,文档上传，单条添加
 */
knowledge_static_web.directive("dropDownMenuByZtree", function () {
    return {
        restrict: "AE",
        scope: {
            // updoctype:'='
        },
        link: function ($scope, elem, attrs) {
            var setting = {
                check: {
                    enable: true,
                    chkboxType: {"Y": "", "N": ""}
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck
                }
            };

            // alert(attrs.dropDownMenuByZtree);
            var split = attrs.dropDownMenuByZtree;
            var arr = split.split(",");
            var citySel = arr[0];
            var menuContent = arr[1];
            var treeDemo = arr[2];

            function beforeClick(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo);
                zTree.checkNode(treeNode, !treeNode.checked, null, true);
                return false;
            }

            function onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo);
                var nodes = zTree.getCheckedNodes(true);
                var selectLocation = '';
                //获取父节点-------------------------------------
                if (nodes != null && nodes != undefined && nodes.length > 0) {
                    for (var m = 0; m < nodes.length; m++) {
                        var curLocation = "";//当前位置
                        var allNode = nodes[m]['name'];//获取当前选中节点
                        var node = nodes[m].getParentNode();
                        getParentNodes(node, allNode);

                        var location = "";
                        var nodeArrs = curLocation.split("->");
                        for (var i = nodeArrs.length - 1; i >= 0; i--) {
                            location += nodeArrs[i] + "->";
                        }
                        location = location.substring(0, location.lastIndexOf("->"));
                        // alert(location);
                        selectLocation += location + ",";
                    }

                } else {
                    selectLocation = '';
                    $scope.$parent.classifyId = '';
                }

                function getParentNodes(node, allNode) {
                    if (node != null) {
                        allNode += "->" + node['name'];
                        var curNode = node.getParentNode();
                        getParentNodes(curNode, allNode);
                    } else {
                        //根节点
                        curLocation = allNode;
                    }
                };

                if (selectLocation.length > 0) selectLocation = selectLocation.substring(0, selectLocation.length - 1);

                if ($.trim(selectLocation) != '' && selectLocation != null) {
                    $scope.$parent.classifyId = selectLocation;
                }
                // console.log($scope.$parent.classifyId);
                //---------------------------------------

                var v = "";
                // var nodeId = "";
                for (var i = 0, l = nodes.length; i < l; i++) {
                    v += nodes[i].name + ",";
                    // nodeId += nodes[i].id + ",";
                }
                if (v.length > 0) v = v.substring(0, v.length - 1);
                // if (nodeId.length > 0 ) nodeId= nodeId.substring(0, nodeId.length-1);//节点id（oec的分类id）
                //文档导入
                var cityObj = $("#" + citySel);
                cityObj.attr("value", v);
                // if(nodeId.length > 0){
                //     $scope.$parent.classifyId = nodeId;
                //     console.log($scope.$parent.classifyId);
                // }

            }

            //展开节点(暂未使用）
            function expandNode(e) {
                var zTree = $.fn.zTree.getZTreeObj(treeDemo),
                    type = e.data.type,
                    nodes = zTree.getSelectedNodes();
                if (type.indexOf("All") < 0 && nodes.length == 0) {
                    alert("请先选择一个父节点");
                }

                if (type == "expandAll") {
                    zTree.expandAll(true);
                } else if (type == "collapseAll") {
                    zTree.expandAll(false);
                } else {
                    var callbackFlag = $("#callbackTrigger").attr("checked");
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        zTree.setting.view.fontCss = {};
                        if (type == "expand") {
                            zTree.expandNode(nodes[i], true, null, null, callbackFlag);
                        } else if (type == "collapse") {
                            zTree.expandNode(nodes[i], false, null, null, callbackFlag);
                        } else if (type == "toggle") {
                            zTree.expandNode(nodes[i], null, null, null, callbackFlag);
                        } else if (type == "expandSon") {
                            zTree.expandNode(nodes[i], true, true, null, callbackFlag);
                        } else if (type == "collapseSon") {
                            zTree.expandNode(nodes[i], false, true, null, callbackFlag);
                        }
                    }
                }
            }

            elem.click(function () {
                // var cityObj = $("#"+citySel);
                // var cityOffset = $("#"+citySel).offset();
                $("#" + menuContent).css({left: "130px", top: "143px"}).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            });

            function hideMenu() {
                $("#" + menuContent).fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                if (!(event.target.id == "menuBtn" || event.target.id == citySel || event.target.id == menuContent || $(event.target).parents("#" + menuContent).length > 0)) {
                    hideMenu();
                }

            }

            // $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            //向控制器发送消息，进行菜单数据的获取
            $scope.$emit("menu", attrs["value"]);//此处attrs["value"]为ul中的value值，此处作为标记使用
            //接受控制器返回的菜单的消息
            $scope.$on("menuData", function (event, data) {
                $.fn.zTree.init($("#" + treeDemo), setting, data);//进行初始化树形菜单
                // $.fn.zTree.init($("#treeDemo2"), setting, data);//进行初始化树形菜单
                // $("#treeDemo_1_switch").bind("click", {type:"toggle"}, expandNode);
                // $("#collapseBtn").bind("click", {type:"collapse"}, expandNode);
            });
        }
    }
});


