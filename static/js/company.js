let companyTemplate = {};
companyTemplate.companyList =
    '<a href="${link}" class="col-item-wrap" data-catogoryid="${id}"><span class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${desc}</p><span class="time">${time}</span></span></a>';
companyTemplate.newsList =
    '<a href="${link}" class="col-item-wrap item-news-wrap" data-catogoryid="${id}"><span class="title">${title}</span><span class="timer">${time}</span><i class="icon icon-sign"></i></a>';
companyTemplate.tabbarList = '<a href="javascript:0;" data-catogoryid="${id}" class="swiper-slide tab-item">${title}</a>';
companyTemplate.updateHtml = "<img src='../../assets/images/update.png' alt='' style='margin: 30px 0;'>";
let flag = {};
flag.aflag = true;
flag.bflag = true;
flag.cflag = true;
flag.dflag = true;

$(function() {

    // tabbarList(swiper1);
    tabbarList();
    //请求tabber数据
    // tabbarList();
    // 处理登录状态
    loginStatus();

    //获取网站信息
    getWebInfo();

})

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


    // $("#tabbarList").on('click', ".tab-item", function(event) {
    //     let catogoryid = $(this).data("catogoryid");
    //     let index = $(this).index();
    //     $(".tab-item").removeClass("current");
    //     $(this).addClass("current");
    //     $('.col-content-wrap .col-content-item').eq(index).show().siblings().hide();
    //     switchCompany(catogoryid, 1, 5, index,flag);
    // });
    //
    //
    // // 从菜单进入时的特殊处理方法
    // let type = GetQueryString("type");
    // if (type != null && type != "" && typeof(type) != 'undefined') {
    //     $($(".tab-item").get(type - 1)).trigger("click");
    // }



    $("#tabbarList").on('click', ".tab-item", function(event) {
        let catogoryid = $(this).data("catogoryid");
        let detailId = $(this).data("detailid");

        let index = $(this).index();
        $(".tab-item").removeClass("current");
        $(this).addClass("current");
        $('.col-content-wrap .col-content-item').eq(index).show().siblings().hide();

        switchCompany(catogoryid, 1, 5, index,flag);
    });

    // 从菜单进入时的特殊处理方法
    let index = GetQueryString("index");
    if (index != null && index != "" && typeof(index) != 'undefined') {
        $($(".tab-item").get(index - 1)).trigger("click");
    }



}


//tab切换
function switchCompany(categoryId, pageNum, pageSize, type, status) {
    switch(type) {
        case 0:
            //请求产业动态数据
            if (status.aflag) {
                // alert(type);
                getCompanyContent01(categoryId, pageNum, pageSize, "companyList01");
                status.aflag = false;
            }
            break;
        case 1:
            //请求集团风采数据
            if (status.bflag) {
                // alert(type);
                getCompanyContent02(categoryId, pageNum, pageSize, "companyList02");
                status.bflag = false;
            }
            break;
        case 2:
            //请求行业资讯数据
            if (status.cflag) {
                // alert(type);
                getCompanyContent03(categoryId, pageNum, pageSize, "companyList03");
                status.cflag = false;
            }
            break;
        case 3:
            //请求通知公告数据
            if (status.dflag) {
                // alert(type);
                getCompanyContent04(categoryId, pageNum, pageSize, "companyList04");
                status.dflag = false;
            }
    }
}


function getCompanyContent01(categoryId, pageNum, pageSize, contentWrap) {

    let json = {
        categoryId: categoryId,
        pageNum: pageNum,
        pageSize: pageSize
    }
    Ajax(json, function(result) {
        if (result.code == 0) {

            let companyList = "";
            let total = result.total;

            if(result.rows.length==0) {
                $('#'+contentWrap).empty().append(companyTemplate.updateHtml);
                return
            }

            for (let index in result.rows) {
                let item = result.rows[index];
                // console.log(item);
                let itemUrl = staticURL.detailUrl +"?id="+item.id;
                let itemId = item.categoryId;
                let itemImgUrl = baseUrl + item.imgUrl;
                let itemTitle = item.title;
                let itemDesc = item.description != null ? item.description : "";
                let createTime = item.createTime.toString().split(" ")[0];
                let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                    .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                companyList = companyList.concat(companyItem);
            }

            // console.log(companyList);

            if($(window).width() > 480) {
                // 渲染分页插件
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: 'pagination01',
                        count: total,
                        limit: pageSize,
                        curr: pageNum,
                        jump: function(obj, first) {
                            //模拟渲染
                            if (!first) {
                                console.log(first);
                                getCompanyContent01(categoryId, obj.curr++, obj.limit,"companyList01");
                            } else {
                                $('#'+contentWrap).empty().append(companyList);
                            }
                        }
                    });
                });
            } else {

                layui.use('flow', function(){
                    var flow = layui.flow;
                    flow.load({
                        elem: '#' + contentWrap //流加载容器
                        ,done: function(page, next){ //执行下一页的回调

                            let json = {
                                categoryId: categoryId,
                                pageNum: pageNum++,
                                pageSize: pageSize
                            }

                            Ajax(json, function(result) {

                                if (result.code == 0) {
                                    let companyList = "";

                                    for (let index in result.rows) {
                                        let item = result.rows[index];
                                        // console.log(item);
                                        let itemUrl = staticURL.detailUrl +"?id="+item.id;
                                        let itemId = item.categoryId;
                                        let itemImgUrl = baseUrl + item.imgUrl;
                                        let itemTitle = item.title;
                                        let itemDesc = item.description != null ? item.description : "";
                                        let createTime = item.createTime.toString().split(" ")[0];
                                        let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                                            .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                                        companyList = companyList.concat(companyItem);
                                    }

                                    // 渲染分页插件
                                    next(companyList, page < Math.ceil(total/pageSize));
                                }
                            })
                            // first = false;
                        }
                    });

                });
            }

        }
    })




}

function getCompanyContent02(categoryId, pageNum, pageSize, contentWrap) {

    let json = {
        categoryId: categoryId,
        pageNum: pageNum,
        pageSize: pageSize
    }
    Ajax(json, function(result) {
        if (result.code == 0) {

            let companyList = "";
            let total = result.total;

            if(result.rows.length==0) {
                $('#'+contentWrap).empty().append(companyTemplate.updateHtml);
                return
            }

            for (let index in result.rows) {
                let item = result.rows[index];
                // console.log(item);
                let itemUrl = staticURL.detailUrl +"?id="+item.id;
                let itemId = item.categoryId;
                let itemImgUrl = baseUrl + item.imgUrl;
                let itemTitle = item.title;
                let itemDesc = item.description != null ? item.description : "";
                let createTime = item.createTime.toString().split(" ")[0];
                let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                    .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                companyList = companyList.concat(companyItem);
            }

            // console.log(newsList);

            if($(window).width() > 480) {
                // 渲染分页插件
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: 'pagination02',
                        count: total,
                        limit: pageSize,
                        curr: pageNum,
                        jump: function(obj, first) {
                            //模拟渲染
                            if (!first) {
                                console.log(first);
                                getCompanyContent02(categoryId, obj.curr++, obj.limit,"companyList02")
                            } else {
                                $('#'+contentWrap).empty().append(companyList);
                            }
                        }
                    });
                });
            } else {

                layui.use('flow', function(){
                    var flow = layui.flow;
                    flow.load({
                        elem: '#' + contentWrap //流加载容器
                        ,done: function(page, next){ //执行下一页的回调

                            let json = {
                                categoryId: categoryId,
                                pageNum: pageNum++,
                                pageSize: pageSize
                            }

                            Ajax(json, function(result) {

                                if (result.code == 0) {
                                    let companyList = "";

                                    for (let index in result.rows) {
                                        let item = result.rows[index];
                                        // console.log(item);
                                        let itemUrl = staticURL.detailUrl +"?id="+item.id;
                                        let itemId = item.categoryId;
                                        let itemImgUrl = baseUrl + item.imgUrl;
                                        let itemTitle = item.title;
                                        let itemDesc = item.description != null ? item.description : "";
                                        let createTime = item.createTime.toString().split(" ")[0];
                                        let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                                            .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                                        companyList = companyList.concat(companyItem);
                                    }

                                    // 渲染分页插件
                                    next(companyList, page < Math.ceil(total/pageSize));
                                }
                            })
                            // first = false;
                        }
                    });

                });
            }

        }
    })




}

function getCompanyContent03(categoryId, pageNum, pageSize, contentWrap) {

    let json = {
        categoryId: categoryId,
        pageNum: pageNum,
        pageSize: pageSize
    }
    Ajax(json, function(result) {
        if (result.code == 0) {

            let newsList = "";
            let total = result.total;

            if(result.rows.length==0) {
                $('#'+contentWrap).empty().append(companyTemplate.updateHtml);
                return
            }

            for (let index in result.rows) {
                let item = result.rows[index];
                // console.log(item);
                let itemUrl = staticURL.detailUrl +"?id="+item.id;
                let itemId = item.categoryId;
                let itemImgUrl = baseUrl + item.imgUrl;
                let itemTitle = item.title;
                let itemDesc = item.description != null ? item.description : "";
                if(($(window).width() > 480)){
                    createTime = item.createTime.toString().split(" ")[0];
                } else {
                    createTime = item.createTime.toString().split(" ")[0].substring(5);
                }
                let newsItem = companyTemplate.newsList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
                    .replace('${desc}', itemDesc).replace('${time}', createTime);


                newsList = newsList.concat(newsItem);

                if (index%4 == 1 && $(window).width >= 480) {
                    let hr = '<hr/>';
                    newsList = newsList.concat(hr);

                }
            }

            // console.log(newsList);

            if($(window).width() > 480) {
                // 渲染分页插件
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: 'pagination03',
                        count: total,
                        limit: pageSize,
                        curr: pageNum,
                        jump: function(obj, first) {
                            //模拟渲染
                            if (!first) {
                                getCompanyContent03(categoryId, obj.curr++, obj.limit,"companyList03")
                            } else {
                                $('#'+contentWrap).empty().append(newsList);
                            }
                        }
                    });
                });
            } else {

                layui.use('flow', function(){
                    var flow = layui.flow;
                    flow.load({
                        elem: '#' + contentWrap //流加载容器
                        ,done: function(page, next){ //执行下一页的回调

                            let json = {
                                categoryId: categoryId,
                                pageNum: pageNum++,
                                pageSize: pageSize
                            }

                            Ajax(json, function(result) {

                                if (result.code == 0) {
                                    let companyList = "";

                                    for (let index in result.rows) {
                                        let item = result.rows[index];
                                        // console.log(item);
                                        let itemUrl = staticURL.detailUrl +"?id="+item.id;
                                        let itemId = item.categoryId;
                                        let itemImgUrl = baseUrl + item.imgUrl;
                                        let itemTitle = item.title;
                                        let itemDesc = item.description != null ? item.description : "";
                                        let createTime = item.createTime.toString().split(" ")[0];
                                        let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                                            .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                                        companyList = companyList.concat(companyItem);
                                    }

                                    // 渲染分页插件
                                    next(companyList, page < Math.ceil(total/pageSize));
                                }
                            })
                            // first = false;
                        }
                    });

                });
            }

        }
    })




}

function getCompanyContent04(categoryId, pageNum, pageSize, contentWrap) {

    let json = {
        categoryId: categoryId,
        pageNum: pageNum,
        pageSize: pageSize
    }
    Ajax(json, function(result) {
        if (result.code == 0) {

            let newsList = "";
            let total = result.total;

            if(result.rows.length==0) {
                $('#'+contentWrap).empty().append(companyTemplate.updateHtml);
                return
            }

            for (let index in result.rows) {
                let item = result.rows[index];
                // console.log(item);
                let itemUrl = staticURL.detailUrl +"?id="+item.id;
                let itemId = item.categoryId;
                let itemImgUrl = baseUrl + item.imgUrl;
                let itemTitle = item.title;
                let itemDesc = item.description != null ? item.description : "";
                if(($(window).width() > 480)){
                    createTime = item.createTime.toString().split(" ")[0];
                } else {
                    createTime = item.createTime.toString().split(" ")[0].substring(5);
                }
                let newsItem = companyTemplate.newsList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
                    .replace('${desc}', itemDesc).replace('${time}', createTime);


                newsList = newsList.concat(newsItem);

                if (index%4 == 1 && $(window).width >= 480) {
                    let hr = '<hr/>';
                    newsList = newsList.concat(hr);

                }
            }

            // console.log(newsList);

            if($(window).width() > 480) {
                // 渲染分页插件
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: 'pagination04',
                        count: total,
                        limit: pageSize,
                        curr: pageNum,
                        jump: function(obj, first) {
                            //模拟渲染
                            if (!first) {
                                getCompanyContent04(categoryId, obj.curr++, obj.limit,"companyList03")
                            } else {
                                $('#'+contentWrap).empty().append(newsList);
                            }
                        }
                    });
                });
            } else {

                layui.use('flow', function(){
                    var flow = layui.flow;
                    flow.load({
                        elem: '#' + contentWrap //流加载容器
                        ,done: function(page, next){ //执行下一页的回调

                            let json = {
                                categoryId: categoryId,
                                pageNum: pageNum++,
                                pageSize: pageSize
                            }

                            Ajax(json, function(result) {

                                if (result.code == 0) {
                                    let companyList = "";

                                    for (let index in result.rows) {
                                        let item = result.rows[index];
                                        // console.log(item);
                                        let itemUrl = staticURL.detailUrl +"?id="+item.id;
                                        let itemId = item.categoryId;
                                        let itemImgUrl = baseUrl + item.imgUrl;
                                        let itemTitle = item.title;
                                        let itemDesc = item.description != null ? item.description : "";
                                        let createTime = item.createTime.toString().split(" ")[0];
                                        let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                                            .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                                        companyList = companyList.concat(companyItem);
                                    }

                                    // 渲染分页插件
                                    next(companyList, page < Math.ceil(total/pageSize));
                                }
                            })
                            // first = false;
                        }
                    });

                });
            }

        }
    })




}


// 请求
function ajaxRequst(categoryId, pageNum, pageSize, type) {
    let json = {
        categoryId: categoryId,
        pageNum: pageNum,
        pageSize: pageSize
    }
    // 请求数据
    if (type == 2 || type == 3) {
        Ajax(json, function(result) {
            if (result.code == 0) {

                let newsList = "";
                let total = result.total;

                if(result.rows.length==0) {
                    $('#companyList').empty().append(companyTemplate.updateHtml);
                    return
                }

                for (let index in result.rows) {
                    let item = result.rows[index];
                    // console.log(item);
                    let itemUrl = staticURL.detailUrl +"?id="+item.id;
                    let itemId = item.categoryId;
                    let itemImgUrl = baseUrl + item.imgUrl;
                    let itemTitle = item.title;
                    let itemDesc = item.description != null ? item.description : "";
                    if(($(window).width() > 480)){
                        createTime = item.createTime.toString().split(" ")[0];
                    } else {
                        createTime = item.createTime.toString().split(" ")[0].substring(5);
                    }
                    let newsItem = companyTemplate.newsList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
                        .replace('${desc}', itemDesc).replace('${time}', createTime);


                    newsList = newsList.concat(newsItem);

                    if (index%4 == 1 && $(window).width >= 480) {
                        let hr = '<hr/>';
                        newsList = newsList.concat(hr);

                    }
                }

                // console.log(newsList);

                renderHtml(newsList,categoryId,pageSize,pageNum,total,type);


            }
        })
    } else {
        Ajax(json, function(result) {
            if (result.code == 0) {
                let companyList = "";
                let total = result.total;

                if(result.rows.length==0) {
                    $('#companyList').empty().append(companyTemplate.updateHtml);
                    return
                }

                for (let index in result.rows) {
                    let item = result.rows[index];
                    // console.log(item);
                    let itemUrl = staticURL.detailUrl +"?id="+item.id;
                    let itemId = item.categoryId;
                    let itemImgUrl = baseUrl + item.imgUrl;
                    let itemTitle = item.title;
                    let itemDesc = item.description != null ? item.description : "";
                    let createTime = item.createTime.toString().split(" ")[0];
                    let companyItem = companyTemplate.companyList.replace('${link}', itemUrl).replace('${id}',itemId).replace('${imgUrl}', itemImgUrl)
                        .replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime);

                    companyList = companyList.concat(companyItem);
                }
                // 渲染分页插件
                renderHtml(companyList,categoryId,pageSize,pageNum,total,type);

            }
        })
    }
}

function Ajax(json, callback) {
    let url = URL.contentListUrl;
    $.ajax({
        type: "POST",
        url: url,
        data: json,
        /*传给后端的数据格式json*/
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(result) {
            if (typeof callback == 'function') {
                callback(result)
            }
        },
        error: function(message) {
            // console.log(message);
        }
    });
}



function tabbarList() {
    let url = URL.categoryListUrl;
    $.ajax({
        type: "GET",
        url: url + "105",
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {
            let tabbarList = '';
            for (let index in data.data) {
                let item = data.data[index];
                let itemTitle = item.title;
                let tabbarItem = companyTemplate.tabbarList.replace('${title}', itemTitle).replace("${id}",
                    item.id);
                tabbarList = tabbarList.concat(tabbarItem);
            }

            $('#tabbarList').append(tabbarList);

            init();

            // console.log(swiper1);
            // if (($(window).width() <= 480)) {
            //     swiper1.update();
            // }

        },
        error: function(message) {
            // console.log(message);
        }
    })

}
