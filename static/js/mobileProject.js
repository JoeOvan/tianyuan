let centerTemple = {};
centerTemple.list = '<div class="item-bids-wrap"><a href="${link}" class="col-item-wrap"><span class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${description}</p></span></a></div>';

$(function() {

    function setCurrentSlide(ele, index) {
        $(".swiper1 .swiper-slide").removeClass("active");
        ele.addClass("active");
        $('.tab-content .col-item-content').eq(index).show().siblings().hide();
        // swiper1.initialSlide=index;
    }


    swiper1 = new Swiper('.swiper1', {
        slidesPerView: 2.5,
        paginationClickable: true,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        spaceBetween: 0,//slide之间的距离（单位px）。
        freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
        loop: false,//是否可循环
        disableScroll:true,
        onTab: function (swiper) {
            var n = swiper1.clickedIndex;
        }
    });


    swiper1.slides.each(function() {
        var ele = $(this);
        var index = $(this).index()
        // console.log($(this).index());
        ele.on("click", function() {
            console.log(index);
            setCurrentSlide(ele, index);
            // swiper2.slideTo(index, 500, false);
            //mySwiper.initialSlide=index;
        });
    });

    // debugger
    // getUserInfo();
    // loginStatus();

    getBidRecords();
    getBidRecords(1);
    getBidRecords(2);
    getBidRecords(3);


});

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
    // debugger
    $.ajax({
        url: URL.getBidRecordsList,
        type: "POST",
        data: json,
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            if (data.code == 0) {

                var bidRecords = data.data;
                // console.log(bidRecords);
                let html = "";
                for (var i = 0; i < bidRecords.length; i++) {
                    let item = bidRecords[i];
                    let bidInvitation = bidRecords[i].bidInvitation;
                    let imgUrl = baseUrl + bidInvitation.imgUrl;
                    let date = item.createTime.split(" ")[0];
                    let link = URL.bidsDetailUrl + "?id=" + bidInvitation.id;
                    let itemHtml = centerTemple.list.replace("${imgUrl}", imgUrl).replace("${description}", bidInvitation.description)
                        .replace("${title}", bidInvitation.title).replace('${link}', link);
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
        error: function (message) {
            console.log(message);
        }
    })
}
