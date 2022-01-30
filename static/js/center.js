let centerTemple = {};
centerTemple.list = '<a href="${link}" class="col-item-wrap"><span class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${description}</p><span class="time">${time}</span></span></a>';
centerTemple.msg = '<div class="comments-content"><div class="dialogue"><strong class="user-name">${userName}</strong><span class="time">${time}</span></div><div class="comments-detail">${msg}</div>${replyHtml}</div>';
centerTemple.replay = '<div class="comments-reply"><div class="col-reply-wrap"><strong class="user-name">回复：</strong><span class="detail">${reply}</span></div></div>';
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

    /**
     * 渲染基本信息
     */
    getEnterPriseInfo();

    /**
     * 渲染投标项目记录列表
     */
    getBidRecords(); // 全部
    getBidRecords(1); // 待审核
    getBidRecords(2); // 中标记录
    getBidRecords(3); // 未中标记录
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
                if (enterprise.id != null) {
                    $("#name").text(enterprise.name);
                    $("#creditCode").text(enterprise.creditCode);
                    $("#address").text(enterprise.address);
                    $("#contactName").text(enterprise.contactName);
                    $("#contactPhone").text(enterprise.contactPhone);
                    $("#certificationUrl").text(enterprise.certificationUrl);
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
 *
 * @param auditStatus 1.待审核 2.中标 3。未中标
 * @param $id
 */
function getBidRecords(auditStatus) {
    if(auditStatus) {
        var json = {
            auditStatus: auditStatus
        }
    }
    $.ajax({
        url: URL.getBidRecordsList,
        type: "POST",
        data: json,
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            // console.log(data);
            if (data.code == 0) {

                // console.log(data);
                var bidRecords = data.data;
                let html = "";
                for (var i = 0; i < bidRecords.length; i++) {
                    let item = bidRecords[i];
                    let bidInvitation = bidRecords[i].bidInvitation;
                    let imgUrl = baseUrl + bidInvitation.imgUrl;
                    let date = item.createTime.split(" ")[0];
                    let link = URL.bidsDetailUrl + "?id=" + bidInvitation.id;
                    let itemHtml = centerTemple.list.replace("${imgUrl}", imgUrl).replace("${description}", bidInvitation.description)
                        .replace("${title}", bidInvitation.title).replace("${time}", date).replace('${link}', link);
                    html = html.concat(itemHtml);
                }
                // 拼接
                if (auditStatus == 2) {
                    $("#auditList").empty().append(html);
                } else if (auditStatus == 3) {
                    $("#unAuditList").empty().append(html);
                } else if (auditStatus == 1) {
                    $("#auditingList").empty().append(html);
                } else {
                    $("#allAuditList").empty().append(html);
                }

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
            if (data.code == 0) {
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
