let detailTemplate = {};
detailTemplate.title = '<h1 class="title"><div>${title}</div><p class="createTime">发布时间：${createTime}</p></h1>';

$(function () {
    //处理登录栏
    loginStatus();

    //请求文章内容
    let id = GetQueryString("id");
    getContent(id);


    //获取网站信息
    getWebInfo();

});


function getContent(id) {
    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url + id,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            let curr = data.data.curr;
            let item = curr;
            let itemTitle = item.title;
            let itemTime = new Date(item.createTime.replace(/-/g, "/"));
            let date = itemTime.getFullYear() + "年" + (itemTime.getMonth() + 1) + "月" + itemTime.getDate() + "日";
            let title = detailTemplate.title.replace('${title}', itemTitle).replace('${createTime}', date);

            $('#content').append(title).append(item.content);

            let prev = data.data.prev;
            let next = data.data.next;
            if (prev.id != null) {
                let id = prev.id;
                let title = prev.title;
                let html = "<a href='detail.html?id=" + id + "'>上一篇:" + title + "</a>";
                $(".prev").append(html);
                let html2 = "<a href='detail.html?id=" + id + "'> < 上一篇 </a>";
                $(".left").append(html2);
            } else {
                $(".prev, .left").append("上一篇:(没有了)");
            }

            if (next.id != null) {
                let id = next.id;
                let title = next.title;
                let html = "<a href='detail.html?id=" + id + "'>下一篇:" + title + "</a>";
                $(".next").append(html);
                let html2 = "<a href='detail.html?id=" + id + "'>下一篇 > </a>";
                $(".right").append(html2);
            } else {
                $(".next, .right").append("下一篇:(没有了)");
            }
        },
        error: function (message) {
            console.log('请求失败！');
        }
    })
}


function sendResume() {
    //页面层

    let area = ['300px','500px'];
    if (($(window).width() > 480)) {
        area = ['800px', '600px'];
    }

    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: area, //宽高
        content: '<form class="layui-form layui-form-resume" id="form" onsubmit="return false" style="padding: 10px">\n' +
            '<input type="hidden" name="id" value="0">' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">姓名</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="name" placeholder="请输入姓名" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">性别</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="gender" placeholder="请输入性别" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">政治面貌</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="politicalStatus" placeholder="请输入政治面貌" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">最高学历</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="education" placeholder="请输入最高学历" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">专业</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="major" placeholder="请输入专业" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">移动电话</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" maxlength="11" name="mobile" placeholder="请输入移动电话" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">应聘职位</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="position" placeholder="请输入应聘职位" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '  <div class="layui-form-item">\n' +
            '    <label class="layui-form-label">电子邮箱</label>\n' +
            '    <div class="layui-input-block">\n' +
            '      <input type="text" name="email" placeholder="请输入电子邮箱" class="layui-input">\n' +
            '    </div>\n' +
            '  </div>' +
            '<button class="btn-send-resume" type="button" onclick="submitResume(event)">投递简历</button>' +
            '</form>'
    });

}


function submitResume(event) {

    event.preventDefault();

    var data = $("#form").serialize();


    if ($("input[name='name']").val() == '') {
        layer.msg("姓名不能为空");
        return;
    }
    if ($("input[name='gender']").val() == '') {
        layer.msg("性别不能为空");
        return;
    }
    if ($("input[name='politicalStatus']").val() == '') {
        layer.msg("政治面貌不能为空");
        return;
    }
    if ($("input[name='education']").val() == '') {
        layer.msg("最高学历不能为空");
        return;
    }
    if ($("input[name='major']").val() == '') {
        layer.msg("专业不能为空");
        return;
    }
    if ($("input[name='mobile']").val() == '') {
        layer.msg("移动电话不能为空");
        return;
    } else {
        //正则验证手机号码
        let reg_mobile = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);

        if(!reg_mobile.test($("input[name='mobile']").val())) {
            layer.alert('请正确填写您的手机号码');
            return;
        }
    }

    if ($("input[name='position']").val() == '') {
        layer.msg("应聘职位不能为空");
        return;
    }
    if ($("input[name='email']").val() == '') {
        layer.msg("电子邮箱不能为空");
        return;
    } else {

        let reg_email = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
        if (!reg_email.test($("input[name='email']").val())) {
            layer.alert('请正确填写您的电子邮箱');
            return;
        }
    }

    var url = URL.submitEmployForm;

    $.ajax({
        url: url,
        data: data,
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data.code === 0) {
                layer.alert("提交成功", function () {
                    window.location.reload();
                });
            } else {
                layer.alert(data.msg);
            }
        },
        error: function (error) {
            alert(error);
        }
    });

    return false;
}

