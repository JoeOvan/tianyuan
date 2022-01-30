let centerTemplate = {};
centerTemplate.creditInfo = '<strong class="title">${title}</strong><br/><span class="label">统一社会信用代码：${creditCode}</span>';


$(function () {


    //sidebar切换效果
    $('.sidebar-wrap .list').each(function (index) {
        $(this).click(function () {
            // let i = $(this).index();
            // console.log(index);

            $(this).addClass('current').siblings().removeClass('current');
            $('.content-wrap .item-content-wrap').eq(index).show().siblings().hide();

            if (index == 1) {
                $(this).find('.item-sub-wrap').show();
            }
        });

    });


    $('.item-sub-wrap li').each(function (index) {
        $(this).click(function () {

            $(this).addClass('active').siblings().removeClass('active');
            $('.item-content-project .col-content-project').eq(index).show().siblings().hide();


        });

        if (index == 0) {
            $(this).addClass('active').siblings().removeClass('active');
            $('.item-content-project .col-content-project').eq(0).show();
        }

    });

    //获取用户信息
    getUserInfo();

    /**
     * 渲染基本信息
     */
    getEnterPriseInfo();

    /**
     * 查询留言列表
     */
    getMsgReply();
});

/**
 * 查询企业信息
 */
function getEnterPriseInfo() {
    $.ajax({
        url: URL.enterpriseView,
        type: "GET",
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            // console.log(data);
            if (data.code == 0) {
                var enterprise = data.data;
                // console.log(enterprise);
                let html = "";

                if (enterprise.id != null) {
                    let name = enterprise.name;
                    let creditCode = enterprise.creditCode;
                    html = centerTemplate.creditInfo.replace("${title}", name).replace("${creditCode}",creditCode);
                    $("#contactName").text(enterprise.contactName);
                    $("#contactPhone").text(enterprise.contactPhone);
                    $(".credit-info-wrap h2").append(html);

                } else {

                    html = centerTemplate.creditInfo.replace("${title}", "未填写").replace("${creditCode}","未填写");
                    $("#contactName").text(enterprise.contactName);
                    $("#contactPhone").text(enterprise.contactPhone);
                    $(".credit-info-wrap h2").append(html);

                }


            } else if (data.code == 401) {
                layer.alert("登录失效，请重新登录", function () {
                    window.location.href = "index.html";
                })

            }
        },
    })
}



/**
 * 获取留言记录列表
 */
function getMsgReply() {
    $.ajax({
        url: URL.getMessageList,
        type: "GET",
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            // console.log(data);
            if (data.code == 0) {

                if(data.data.length==0) {

                    $("#msgList").hide();

                    return

                }
                let msgList = data.data;
                let html = "";
                for (let i = 0; i < msgList.length; i++) {
                    let item = msgList[i];
                    let msg = item.message;
                    let reply = item.replay;
                    let time = item.createTime;
                    let userName = JSON.parse(window.localStorage.getItem('user')).personName;
                    let itemHtml = centerTemple.msg.replace('${userName}', userName == null ? ' ' : userName).replace('${time}', time)
                        .replace("${msg}", msg);
                    if (reply != '' && reply != null) {
                        let replyHtml = centerTemple.replay.replace("${reply}", reply);
                        $(itemHtml).find(".comments-detail").html(replyHtml);
                        itemHtml = itemHtml.replace('${replyHtml}', replyHtml);
                    } else {
                        itemHtml = itemHtml.replace('${replyHtml}', '');
                    }
                    html = html.concat(itemHtml);
                }
                $("#msgList").empty().append(html);

            } else if (data.code == 401) {
                layer.alert("登录失效，请重新登录", function () {
                    // 清除缓存信息
                    window.localStorage.clear();
                    window.location.href = "index.html";
                })

            }
        },
    })
}
