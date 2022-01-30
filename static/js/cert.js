layui.use('upload', function () {
    var $ = layui.jquery
        , upload = layui.upload;
    var url = URL.uploadUrl;
    //普通图片上传
    var uploadInst = upload.render({
        elem: '#demo1'
        , url: url //改成您自己的上传接口\
        // , headers:{token: window.localStorage.getItem("token")}
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg(res.msg);
            }
            //上传成功
            var fileName = res.fileName;
            $("input[name='licenseUrl']").val(fileName);
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
});


layui.use('upload', function () {
    var $ = layui.jquery
        , upload = layui.upload;
    var url = URL.uploadUrl;
    //普通图片上传
    var uploadInst = upload.render({
        elem: '#demo2'
        , url: url //改成您自己的上传接口\
        // , headers:{token: window.localStorage.getItem("token")}
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo2').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //如果上传失败
            if (res.code > 0) {
                return layer.msg(res.msg);
            }
            //上传成功
            var fileName = res.fileName;
            $("input[name='certificationUrl']").val(fileName);
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
});
var disabled = false;

$(function () {
    // 初始化时请求获取企业认证资料
    var url = URL.enterpriseView;
    $.ajax({
        url: url,
        type: "GET",
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            if (data.code == 0) {
                var enterprise = data.data;
                console.log(enterprise);
                if (enterprise.id != null) {
                    $("input[name='id']").val(enterprise.id);
                    $("input[name='name']").val(enterprise.name);
                    $("input[name='creditCode']").val(enterprise.creditCode);
                    $("input[name='address']").val(enterprise.address);
                    $("input[name='contactName']").val(enterprise.contactName);
                    $("input[name='contactPhone']").val(enterprise.contactPhone);
                    $("input[name='licenseUrl']").val(enterprise.licenseUrl);
                    $("input[name='certificationUrl']").val(enterprise.certificationUrl);
                    let imgLicenseUrl = baseUrl + enterprise.licenseUrl;
                    let imgCertificationUrl = baseUrl + enterprise.certificationUrl;
                    $("#demo1").attr("src", imgLicenseUrl);
                    $("#demo2").attr("src", imgCertificationUrl);
                    if (enterprise.auditStatus == 3) {
                        var msg = "审核未通过，理由：" + (enterprise.auditMsg == null? '': enterprise.auditMsg);
                        $("#failedSpan").text(msg);
                        $("#failedSpan").show();
                        $('.submit-wrap').html('<div type="button" class="layui-btn layui-btn-normal btn-submit layui-btn-danger">审核未通过</div>');
                    }
                    if (enterprise.auditStatus == 1) {
                        $("input[name='id']").attr("disabled","disabled");
                        $("input[name='name']").attr("disabled","readonly");
                        $("input[name='creditCode']").attr("disabled","readonly");
                        $("input[name='address']").attr("disabled","readonly");
                        $("input[name='contactName']").attr("disabled","disabled");
                        $("input[name='contactPhone']").attr("disabled","disabled");
                        $("input[name='licenseUrl']").attr("disabled","disabled");
                        $("input[name='certificationUrl']").attr("disabled","disabled");
                        $("input.layui-upload-file").attr("disabled","disabled");
                        $("#failedSpan").text("正在审核中");
                        $("#failedSpan").show();
                        $('.submit-wrap').html('<div type="button" class="layui-btn layui-btn-normal btn-submit layui-disabled">待审核</div>');
                        // 禁止提交
                        disabled = true;
                    }
                    if(enterprise.auditStatus == 2) {
                        $('.submit-wrap').html('<div type="button" class="layui-btn layui-btn-normal btn-submit layui-disabled">审核通过</div>');
                        disabled = true;
                    }
                }
            } else if (data.code == 401) {
                layer.alert("登录失效，请重新登录", function () {
                    window.localStorage.clear();
                    window.location.href = "index.html";
                })

            }
        },
    })
})

function submit() {
    if (disabled) {
        layer.alert("正在审核中，请勿重复提交");
        return;
    }
    var data = $("#form").serialize();
    var url = URL.enterpriseSave;
    if ($("input[name='name']").val() == '') {
        layer.msg("公司名称不能为空");
        return;
    }
    if ($("input[name='creditCode']").val() == '') {
        layer.msg("统一社会信用代码不能为空");
        return;
    }
    if ($("input[name='contactName']").val() == '') {
        layer.msg("负责人姓名不能为空");
        return;
    }
    if ($("input[name='contactPhone']").val() == '') {
        layer.msg("负责人联系方式不能为空");
        return;
    }
    if ($("input[name='certificationUrl']").val() == '') {
        layer.msg("请上传营业执照/企业证书");
        return;
    }

    $.ajax({
        url: url,
        data: data,
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        type: "POST",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            if (data.code === 0) {
                layer.alert("提交成功", function () {
                    window.location.reload();
                });
            } else {
                layer.alert(data.msg);
            }
        },
    })
}
