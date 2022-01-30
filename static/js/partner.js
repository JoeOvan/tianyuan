let partnerTemplate = {};
partnerTemplate.tabbarList = '<a href="javascript:0;" data-catogoryid="${id}" data-detailid="${detailId}" class="swiper-slide tab-item">${title}</a>';
partnerTemplate.contentList = '<div class="swiper-slide swiper-no-swiping col-content-item" id="companyList_${id}"></div>';
partnerTemplate.updateHtml = "<img src='../../assets/images/update.png' alt='' style='margin: 30px 0;'>";
partnerTemplate.title = '<h1 class="title-wrap"><span class="block">${title}</span><span class="line"></span><span class="left-line"></span><span class="right-line"></span></h1>';

$(function() {




    //请求tabber数据
    tabbarList();

    // 处理登录状态
    loginStatus();

    //获取网站信息
    getWebInfo();


});


//截取url数据方法
function getParam(QueryString,name) {
    var search = QueryString;
    // console.log(search);
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    // console.log(matcher);
    var items = null;
    if (null != matcher) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
}


function init() {

    let slidesCount = 5;
    if($(window).width() < 480) {
        slidesCount = 2.5;
    }

    var swiper = new Swiper('.swiper1', {
        // loop: true,
        speed: 2500,
        slidesPerView: slidesCount,
        spaceBetween: 0,
        // centeredSlides : true,
        watchSlidesProgress : true,
        on: {
            setTranslate: function(){
                slides = this.slides
                for(i=0; i< slides.length; i++){
                    slide = slides.eq(i)
                    progress = slides[i].progress
                    //slide.html(progress.toFixed(2)); 看清楚progress是怎么变化的
                    slide.css({'opacity': '','background': ''});slide.transform('');//清除样式

                }
            },
            setTransition: function(transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });


    $("#tabbarList").on('click', ".tab-item", function(event) {
        let catogoryid = $(this).data("catogoryid");
        let detailId = $(this).data("detailid");

        let index = $(this).index();
        $(".tab-item").removeClass("current");
        $(this).addClass("current");
        $('.col-content-wrap .col-content-item').eq(index).show().siblings().hide();

        getContent(detailId,index);

        swiper.slideTo(index-1, 1000, false)//切换到对应的slide，速度为1秒

    });

    // 从菜单进入时的特殊处理方法
    let index = GetQueryString("index");
    if (index != null && index != "" && typeof(index) != 'undefined') {
        $($(".tab-item").get(index - 1)).trigger("click");
    }
}


function tabbarList() {
    let url = URL.categoryListUrl;
    $.ajax({
        type: "GET",
        url: url + "136",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {
            let tabbarList = '';
            let contentList = '';
            for (let index in data.data) {
                let item = data.data[index];
                let detailId = '';
                // console.log(item.link);
                // if(item.link) {
                //     detailId = GetQueryById(item.link,"id");
                // }
                if(item.link) {
                    detailId = getParam(item.link,"id");
                }
                let itemTitle = item.title;
                let itemId = item.id;
                let tabbarItem = partnerTemplate.tabbarList.replace('${title}', itemTitle).replace("${id}", item.id).replace('${detailId}',detailId);
                let contentItem = partnerTemplate.contentList.replace('${id}',itemId);

                tabbarList = tabbarList.concat(tabbarItem);
                contentList = contentList.concat(contentItem);
            }

            $('#tabbarList').append(tabbarList);
            $('#swiper-content').append(contentList);

            init();

        },
        error: function(error) {

        }
    })

}

/**
 * 获取文章详情
 * @param id    文章id
 * @param index  tab索引
 */
function getContent(id,index) {
    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url+id,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {
            let curr = data.data.curr;
            let item = curr;
            // let itemTitle = item.title;
            // let itemTime = new Date(item.createTime);
            // let date = itemTime.getFullYear()+"年"+ (itemTime.getMonth()+1)+ "月"+ itemTime.getDate()+ "日";
            // let title = partnerTemplate.title.replace('${title}',itemTitle).replace('${createTime}', date);

            $('.col-content-item').eq(index).empty().append(item.content);

        },
        error: function(message) {
            console.log('请求失败！');
        }
    })
}

