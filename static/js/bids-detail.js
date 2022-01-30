let detailTemplate = {};
detailTemplate.title = '<h1 class="title">${title}<p class="createTime">发布时间：${createTime}</p></h1>';


var invitationId;
$(function () {
    //请求文章内容
    invitationId = GetQueryString("id");
    //处理登录栏
    getUserInfo();

    init();

    getContent();

    //获取网站信息
    getWebInfo();

    if($(window).width() > 480) {
        upload();
    } else {
        $('#upload').click(function () {
            layer.msg("请在电脑上进行文件上传！");
        });
        $('#push').click(function () {
            layer.msg("请在电脑上进行文件上传！");
        });
    }
});


/**
 * //请求招标内容
 * @param id
 */
function getContent() {
    let url = URL.getBidInvitation;
    $.ajax({
        type: "GET",
        url: url + invitationId,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            let item = data.data.curr;
            let itemTitle = item.title;
            let itemTime = new Date(item.createTime.replace(/-/g, "/"));
            let date = itemTime.getFullYear()+"年"+ (itemTime.getMonth() + 1)+ "月"+ itemTime.getDate()+ "日";
            let title = detailTemplate.title.replace('${title}',itemTitle).replace('${createTime}', date);

            $('#content').append(title).append(item.content);
            let fileName = item.fileName;
            let filUrl = baseUrl + item.fileUrl;
            let attachHtml = '<a href="${fileUrl}" download="${fileName}">${fileName}</a>';
            attachHtml = attachHtml.replace("${fileUrl}",filUrl ).replace(/\$\{fileName\}/g, fileName);
            $('#bidsDocument').append(attachHtml);

            let prev = data.data.prev;
            let next = data.data.next;
            if (prev.id != null) {
                let id = prev.id;
                let title = prev.title;
                let html = "<a href='bids-detail.html?id=" + id + "'>上一篇:" + title + "</a>";
                $(".prev").append(html);
            } else {
                $(".prev").append("上一篇:(没有了)");
            }

            if (next.id != null) {
                let id = next.id;
                let title = next.title;
                let html = "<a href='bids-detail.html?id=" + id + "'>下一篇:" + title + "</a>";
                $(".next").append(html);
            } else {
                $(".next").append("下一篇:(没有了)");
            }
        },
        error: function (message) {
            console.log('请求失败！');
        }
    })
}




function init() {
    let token = window.localStorage.getItem('token');
    if (token == null) {
        let html = "<span class=\"shoo\" >企业注册后可上传投标文件</span>"
        $(".layui-upload").html(html);
    } else {
        //请求投标文件
        getBidsDocument();
    }
}


function submit() {
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
    // var url = "http://localhost:8083/admin/api/enterPrise/save";
    $.ajax({
        url: url,
        data: data,
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        type: "POST",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            if (data.code == 0) {
                layer.alert("提交成功");
            } else if (data.code == 401){
                layer.confirm("请先登录", function () {
                    window.location.href= "index.html";
                })
            }else {
                layer.alert(data.msg)
            }
        },
    })
}


/**
 * 获取招标文件
 * @param id
 */
function getBidsDocument() {

    // console.log(id);
    $.ajax({
        url: URL.getBidsDocument + invitationId,
        type: "GET",
        headers: {'X-Winzkj-Token': window.localStorage.getItem('token')},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            // 投标后
            if (data.code == 0 && data.data) {
                let html = '<span class="shoo">已投标，查看投标文件：<a href="${fileUrl}" download="${fileName}">${fileName}</a></span>';
                html = html.replace('${fileUrl}', baseUrl + data.data.fileUrl).replace(/\$\{fileName\}/g, data.data.fileName);
                $(".layui-upload").html(html);
            }

        },
        error: function (message) {
            console.log(message);
        }
    })
}

function upload() {
    var data = {
        fileName: function (){
            return $("input[name='fileName']").val();
        },
        invitationId: invitationId
    };
    var upload = layui.upload;
    upload.render({
        elem: '#upload'
        , url: URL.uploadBidFile
        , auto: false //选择文件后不自动上传
        , bindAction: '#push' //指向一个按钮触发上传
        , accept: 'file'
        , headers: {'X-Winzkj-Token': window.localStorage.getItem('token')}
        , data: data
        , choose: function (obj) {
            //将每次选择的文件追加到文件队列
            var files = obj.pushFile();
            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
            obj.preview(function (index, file, result) {
                // console.log(index); //得到文件索引
                // console.log(file); //得到文件对象
                // console.log(result); //得到文件base64编码，比如图片
                let filename = file.name;
                $(".upload-name").text(filename).show();
                $("input[name='fileName']").val(filename);
            });
        }
        , done: function (data) {
            if (data.code == 0) {
                layer.alert("上传成功");
            } else if (data.code == 401){
                layer.confirm("请先登录", function (index) {
                    $(window).scrollTop(0);
                    layer.close(index);
                })
            } else {
                layer.alert("投标失败，请检查是否已企业认证");
            }
        }
    });

}
