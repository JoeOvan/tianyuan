let operatingTemplate = {};
operatingTemplate.companyList = '<a href="${link}" class="col-item-wrap"><span class="cover-wrap"><img src="${imgUrl}" class="cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${desc}</p><span class="time">${time}</span></span></a>';
operatingTemplate.newsList = '<a href="${link}" class="col-item-wrap"><span class="title">${title}</span><span class="time">${time}</span></a>';
operatingTemplate.tabbarList = '<a href="javascript:0;" class="swiper-slide tab-item" data-stat="${index}">${title}</a>';
operatingTemplate.introCover = '<img class="cover" src="${imgUrl}" />';
let flag = {};
flag.aflag = true;
flag.bflag = true;
flag.cflag = true;
flag.dflag = true;
flag.eflag = true;
flag.fflag = true;

$(function() {

//     let swiper1 = '';
//     if (($(window).width() <= 480)) {
//         swiper1 = new Swiper('.swiper1', {
// //					设置slider容器能够同时显示的slides数量(carousel模式)。
// //					可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
// //					loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
//             freeModeMomentum: false,
//             freeModeMomentumBounce: false,
//             resistanceRatio : 0,
//             freeModeSticky: true,
//             resistance: false,
//             slidesPerView: 'auto',
//             paginationClickable: true,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
//             spaceBetween: 10,//slide之间的距离（单位px）。
//             freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
//             loop: false,//是否可循环
//             disableScroll:true,
//             onTab: function (swiper) {
//                 var n = swiper1.clickedIndex;
//             }
//         });
//     }
//     tabbarList(swiper1);


    tabbarList();
	loginStatus();

    //获取网站信息
    getWebInfo();

});

function setCurrentSlide(ele, index) {
    $(".swiper1 .swiper-slide").removeClass("current");
    ele.addClass("current");
    // swiper1.initialSlide=index;
}


function tabbarList() {
    let url = URL.categoryListUrl;
    $.ajax({
        type: "GET",
        url: url + "106",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            // console.log(data.data);
            let tabbarList = '';
            for(let index in data.data) {
                let item = data.data[index];
                let itemTitle = item.title;
                let itemIndex = parseInt(index)+parseInt(1);
                let tabbarItem = operatingTemplate.tabbarList.replace('${index}',itemIndex).replace('${title}',itemTitle);
                tabbarList = tabbarList.concat(tabbarItem);
            }

            $('#tabbarList').append(tabbarList);

            init();

        },
        error: function(message) {
            console.log('请求失败！');
        }
    })

}


function init() {


    if($(window).width() < 480) {
        let slidesCount = 2.5;

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

    }


    $("#tabbarList").on('click', ".tab-item", function(event) {
        let catogoryid = $(this).data("catogoryid");
        let detailId = $(this).data("detailid");

        let index = $(this).index();
        $(".tab-item").removeClass("current");
        $(this).addClass("current");
        $('.col-content-wrap .col-content-item').eq(index).show().siblings().hide();

        switchOperating(index);

        // swiper.slideTo(index-1, 1000, false)//切换到对应的slide，速度为1秒

    });

    // 从菜单进入时的特殊处理方法
    let index = GetQueryString("index");
    if (index != null && index != "" && typeof(index) != 'undefined') {
        $($(".tab-item").get(index - 1)).trigger("click");
    }
}



function switchOperating(type) {

    switch(type) {
        case 0:
            //请求运营中心简介文章数据
            // console.log(status);
            if (flag.aflag) {
                getIntroContent();
                // getOperatingContent(9,'operatingContent');
                flag.aflag = false;
            }
            break;
        case 1:
            //请求聚焦核心文章数据
            if (flag.bflag) {
                getOperatingContent(21, 'coreContent');
                flag.bflag = false;
            }
            break;
        case 2:
            //请求发展历程文章数据
            if (flag.cflag) {
            getOperatingContent(22,'historyContent');
                flag.cflag = false;
            }
            break;
        case 3:
            //请求企业荣誉文章数据
            if (flag.dflag) {
                getOperatingContent(23,'honorContent');
                flag.dflag = false;
            }
            break;
        case 4:
            //请求企业形象文章数据
            if (flag.eflag) {
                getContactContent();
                // getOperatingContent(26,'imageContent');
                flag.eflag = false;
            }
            break;
        case 5:
            //请示业务范围文章数据
            if (flag.fflag) {
                getOperatingContent(26,'recruitContent');
                flag.fflag = false;
            }
    }
}



function getOperatingContent(id,contentWrap) {
    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url + id,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            $('#'+contentWrap).append(data.data.curr.content);

            // console.log(data.data.curr.content);
        },
        error: function(message) {
            console.log('请求失败！');
        }
    })
}

function getIntroContent() {

    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url + "9",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            // console.log(data.data.curr);

            let imgUrl =  baseUrl + data.data.curr.imgUrl;
            let content = data.data.curr.content;

            let cover = operatingTemplate.introCover.replace('${imgUrl}', imgUrl);
            $('#introCover').append(cover);
            $('#introText').append(content);
            // $('#'+contentWrap).append(data.data.curr.content);

            // console.log(data.data.curr);
        },
        error: function(message) {
            console.log('请求失败！');
        }
    })

}

function getContactContent() {

    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url + "26",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            // console.log(data.data.curr);

            let imgUrl =  baseUrl + data.data.curr.imgUrl;
            let content = data.data.curr.content;

            let cover = operatingTemplate.introCover.replace('${imgUrl}', imgUrl);
            $('#contactCover').append(cover);
            $('#contactText').append(content);
            // $('#'+contentWrap).append(data.data.curr.content);

            // console.log(data.data.curr);
        },
        error: function(message) {
            console.log('请求失败！');
        }
    })

}




