let template = {};
template.headerMenu =
	'<li class="item-nav"><a href="${link}" class="nav-link">${pTitle}${triangle}</a>${subWrap}</li>';
template.menuLi = '<li><a href="${link}" class="link">${title}</a></li>';
template.unAudit = '<a href="javascript:void(0);" class="btn btn-audit">${status}</a>';
template.auditFail = '<a href="javascript:void(0);" class="btn btn-audit">${status}</a>';
template.audited = '<a href="javascript:void(0);" class="btn btn-audited">${status}</a>';
template.loginstatus = '<a href="javascript:void(0);" class="btn btn-login">${status}</a>';
template.register = '<a href="javascript:void(0);" class="btn-link"><i class="icon icon-user"></i>您好，${companyName}</a>';
template.logout = '<a href="javascript:void(0);" class="btn-logout">${status}</a>';
template.headerMenuLi = '<li><a href="${link}" class="link"><span class="sign">-</span>${title}</a></li>';
template.footerMenu = '<li class="item">${pList}</li>';
template.footerMenuList = '<a href="${link}" class="link">${pTitle}</a><ul class="inner-list">${li}</ul>';
template.footerMenuLi = '<li class="inner-item"><a class="link-item" href="${link}">${title}</a></li>'
template.footerLink = '<a href="${link}" class="link-item">${title}</a>';
template.companyInfo = '<p><span>招聘电话：${employPhone}</span><span>地址：${address}</span><span>邮政编码：${postCode}</span></p><p>版权所有 © 2021 ${name}</p><p>粤ICP备17142398号</p>';
template.mobileFooterInfo = '<span class="beian">粤ICP备20002745号</span><span class="info">© ${name}</span><span class="number">${phone}</span>'
template.itemImgUrl = '<div class="bg-point-wrap" style="background-image: url(${imgUrl})"></div>';
template.qrcodeContent = '<div class="qrcode-content"><div class="qrcode-item"><img src="${wxQrCode}" alt="" class="item-qrcode"><span class="text">关注公众号</span></div><div class="qrcode-item"><img src="${mobileQrCode}" alt="" class="item-qrcode"><span class="text">浏览手机版</span></div></div>';
template.logoContent = '<a href="./index.html" class="link-wrap"><img src="${logo}" alt="" class="logo logo-pc"><img src="${logoMobile}" alt="" class="logo logo-mobile"></a>'

let staticURL = {
    //详情页
    detailUrl: "detail.html",
    //投标详情页
    bidsDetailUrl: "bids-detail.html",
    //投标详情页
    jobDetailUrl: "job-detail.html",
    //占位图
    placeholder: "/assets/images/placeholder-img.png"
}


$(function () {

	// 获取用户信息
	// getUserInfo();
	// // 处理登录状态栏
	// loginStatus();
    // 请求后台获取头部和footer菜单
    menuList();

    //请求footer相关链接
    getFooterLink();


    //页面初始化的时候，获取滚动条的高度（上次高度）
    var start_height = $(document).scrollTop();
    //获取导航栏的高度(包含 padding 和 border)
    var navigation_height = $('.header-wrap').outerHeight();
    // console.log(navigation_height);
    $(window).scroll(function() {
        //触发滚动事件后，滚动条的高度（本次高度）
        var end_height = $(document).scrollTop();
        //触发后的高度 与 元素的高度对比
        if (end_height > navigation_height){
            $('.header-wrap').hide();
        }else {
            $('.header-wrap').show();
        }
        //再次获取滚动条的高度，用于下次触发事件后的对比
        start_height = $(document).scrollTop();
    });




    $('.side-bar').on('.item-side', 'hover', function() {
        $(this).toggleClass('hover');
    });

    $('.side-bar').on('mouseenter', '.item-side', function() {//绑定鼠标进入事件
        $(this).addClass('hover');
    });
    $('.side-bar').on('mouseleave', '.item-side', function() {//绑定鼠标划出事件
        $(this).removeClass('hover');
    });

    if (($(window).width() > 480)) {
        $("#menuList").on('mouseenter mouseleave', '.item-nav', function(event){
            if (event.type=="mouseenter"){
                $(".nav-sub-wrap", this).stop(true, true).slideDown(200);
            } else if (event.type=="mouseleave") {
                $(".nav-sub-wrap", this).stop(true, true).slideUp(200);
            }
        })


        $('.modal-register-wrap .close').bind('click', function () {
            $('.modal-register-wrap').hide();
            $('.modal-backdrop').hide();

        });

		$('.info-wrap').on('click','.btn-login', function () {
		    $('.modal-login-wrap').show();
		    $('.modal-backdrop').show();
		});

        $('.modal-login-wrap .close').bind('click', function () {
            $('.modal-login-wrap').hide();
            $('.modal-backdrop').hide();
        });

        // 打开个人中心
        $('.info-wrap').on('click','.btn-link', function () {
            window.location.href='center.html';
        });


        // $('.info-wrap').on('click','.btn-audit', function () {
        //     window.location.href='cert.html';
        // });

        $('.nav-inner-wrap').on('mouseenter', '.item-nav', function() {//绑定鼠标进入事件
            $(this).addClass('active');
        });
        $('.nav-inner-wrap').on('mouseleave', '.item-nav', function() {//绑定鼠标划出事件
            $(this).removeClass('active');
        });

        $('.wrapper').bind("DOMNodeInserted", function() {

            let width = $('#menuList .item-nav').eq(0).width();
            // console.log(width);
            $('.nav-sub-wrap').width(width);
        });

    } else {

        // 移动端点击登录跳转到登录页
        $('.info-wrap').on('click','.btn-login', function () {
           window.location.href='mobile.html';
        });
        // 打开注册
        $('.info-wrap').on('click','.btn-bink', function () {
            $('.modal-register-wrap').hide();
            $('.modal-backdrop').hide();
        });
        // 打开个人中心
        $('.info-wrap').on('click','.btn-user', function () {
            window.location.href='mobileCenter.html';
        });


        // $(".nav-icon").bind('click', function () {
        //     // console.log($(window).width());
        //     $(this).toggleClass("open");
        //     $(".nav-wrap").slideToggle(250);
        //     $(".header-wrap").toggleClass("nav-open");
        // });
        $(".nav-icon-wrap").bind('click', function () {
            // console.log($(window).width());
            $(this).toggleClass("open");
            $(".nav-wrap").slideToggle(250);
            $(".header-wrap").toggleClass("nav-open");
        });

        $('.nav-inner-wrap').delegate('.item-nav', 'click', function() {
            $(".nav-sub-wrap",this).toggle();
        });


    }



    $('.info-wrap').on('click','.btn-audit', function () {
        $('.modal-user-wrap').show();
        $('.modal-backdrop').show();
    });


    // $('.info-wrap').on('click','.btn-user', function () {
    //     $('.modal-user-wrap').show();
    //     $('.modal-backdrop').show();
    // });

    $('.modal-user-wrap .icon-close').bind('click', function () {
        $('.modal-user-wrap').hide();
        $('.modal-backdrop').hide();
    });

    $('.modal-user-wrap .link-close').bind('click', function () {
        $('.modal-user-wrap').hide();
        $('.modal-backdrop').hide();
    });




    $(".attract-wrap .tabbar-wrap .tab-item").each(function(index) {
        $(this).mouseover(function() {
            $(".tab-item.current").removeClass("current"); //注意这里
            $(this).addClass("current"); //注意这里
            $(".col-content-wrap .col-content-item.active").removeClass("active");
            $(".col-content-wrap .col-content-item").eq(index).addClass("active");
        });
    })





    //图片懒加载
    $('.wrapper').bind("DOMNodeInserted", function() {

        $(".lazyload").lazyload({effect: "fadeIn",threshold: 400});

    });


    // let width = $('#menuList .item-nav').eq(0).width();
    // console.log(width);
    // $('.nav-sub-wrap').width($('.item-nav').width());


});


// 点击按钮，返回顶部
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/**
 * 处理顶部登录状态
 */
function loginStatus(){
	// 判断有没有登录
	let token = window.localStorage.getItem("token");
	// let user = JSON.parse(window.localStorage.getItem("user"));
	// console.log(user);
	let loginStatusHtml;
	let auditHtml;
	// PC端
	if (token == "" || token == null) {
		loginStatusHtml = template.loginstatus.replace("${status}", "登录");
		$("#login").empty().append(loginStatusHtml);
	} else {

		// 如果已经登录了，则显示用户是否已企业认证
		let user = JSON.parse(window.localStorage.getItem("user"));
		// 登录完成后显示注册信息
        loginStatusHtml = template.register.replace("${companyName}", user.enterpriseName == null ? '请填写注册信息': user.enterpriseName);
		if (user.enterprise.auditStatus == null) {
			auditHtml = template.unAudit.replace("${status}", "请认证企业");
		} else if (user.enterprise.auditStatus == 1) {
            auditHtml = template.auditFail.replace("${status}", "正在认证");
        } else if (user.enterprise.auditStatus == 3) {
		    auditHtml = template.auditFail.replace("${status}", "认证失败");
        } else if (user.enterprise.auditStatus == 2){
		    auditHtml = template.audited.replace("${status}", "已认证")
        }

		let logoutHtml = template.logout.replace("${status}","退出");

		if(user.enterpriseName == null){

            $("#login").empty().append(loginStatusHtml).append(logoutHtml);

        } else {

            $("#login").empty().append(loginStatusHtml).append(auditHtml).append(logoutHtml);

        }


		if ($(window).width() > 480) {
			// 查询是否已填写注册信息
            /**
             * 首先判断是否已经填写注册信息，如果还没填写注册信息且未通过企业验证的，则不跳出企业认证弹出框
             * 如果已经填写了注册信息，则跳出企业认证
             */
			if (user.enterpriseName == null && user.mobile == null) {
                $('.info-wrap').off('click').on('click','.btn-link', function () {
                    $('.modal-register-wrap').show();
                    $('.modal-backdrop').show();
                });

			} else if (user.enterprise.id == null) { // 判断是否已填写企业验证


                //判断企业验证缓存是否失效 未验证为false
                if(!getLocalStorageAndTime('isAudit')) {

                    //弹出弹窗
                    $('.modal-user-wrap').show();
                    $('.modal-backdrop').show();

                    // console.log("设置未验证缓存");
                    //设置未验证缓存
                    // setLocalStorageAndTime('isAudit', '未验证');

                    $('.link-close').on('click','a', function () {

                        if(!getLocalStorageAndTime('isAudit')) {

                            // console.log("----------","设置未验证缓存");
                            setLocalStorageAndTime('isAudit', '未验证');
                        }
                    });

                    return
                }
            }
		} else {

		    if(user.enterpriseName == null) {

                $('.info-wrap').off('click').on('click','.btn-link', function () {
                    window.location.href = "register.html";
                });


            } else {

                $('.info-wrap').off('click').on('click','.btn-link', function () {
                    window.location.href = "mobileCenter.html";
                });

                $('.info-wrap').on('click','.btn-audit', function () {
                    $('.modal-user-wrap').show();
                    $('.modal-backdrop').show();
                });

            }

        }


        $('.info-wrap').on('click','.btn-logout', function () {
            // 清除缓存信息
            window.localStorage.clear();
            window.location.href="index.html";
        });

	}


}


/**
 * 设置缓存时间
 * @param key
 * @param value
 */
function setLocalStorageAndTime(key, value) {
    window.localStorage.setItem(key, JSON.stringify({ data: value, time: new Date().getTime() }))
}

/**
 * 设置缓存过期时间
 * @param key
 * @param exp  默认30分钟失效 1800000毫秒
 * @returns {null|*}
 */
function getLocalStorageAndTime(key, exp = 1800000) {
    // 获取数据
    let data = window.localStorage.getItem(key)
    if (!data) return null
    let dataObj = JSON.parse(data)

    // let time = new Date().getTime()-dataObj.time;
    // console.log("time",time,exp)
    // 与过期时间比较
    if (new Date().getTime() - dataObj.time > exp) {
        // 过期删除返回null
        window.localStorage.removeItem(key)
        console.log('信息已过期')
        return null
    } else {
        return dataObj.data
    }
}



/**
 * 提交注册信息
 */
function registerSubmit() {
    let url = URL.registerUrl;
    let enterpriseName = $("input[name='enterpriseName']").val();
    let personName = $("input[name='personName']").val();
    let phone = $("input[name='phone']").val();
    let address = $("input[name='address']").val();

    if (enterpriseName == '' || enterpriseName == null) {
        layer.alert("请填写企业名称");
        return
    } else if (personName == '' || personName == null) {
        layer.alert("请填写负责人名称");
        return
    } else if (phone == '' || phone == null) {
        layer.alert("请填写联系电话");
        return;
    }
    let data = {
        enterpriseName: enterpriseName,
        personName: personName,
        phone: phone,
        address: address
    };

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        /*传给后端的数据格式json*/
        dataType: "json",
        /*后端返回的数据格式json*/
        headers: {
            'X-Winzkj-Token': window.localStorage.getItem("token")
        },
        success: function(data) {
            if (data.code == "401") {
                alert("登录失效，请重新登录");
                // 清除缓存信息
                window.localStorage.clear();
            } else if (data.code == "0") {
                layer.alert("已提交成功",function(){window.location.reload()} );
                $('.modal-register-wrap .close').trigger('click');
            }
        },
        error: function(message) {
            console.log(message);
        }
    });

}



function menuList() {
    let url = URL.categoryListUrl;
	$.ajax({
		type: "GET",
		url: url + "101",
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {
            var menuList = data.data;
            // 修改子菜单排序问题
            for (var i =0; i < menuList.length; i ++) {
                var suMenuList = menuList[i].children;
                // 假如子菜单长度超过1时，进行排序
                if (suMenuList.length> 1 ) {
                    suMenuList.sort(function (a,b) {
                        return a.sort - b.sort;
                    })
                };
            }
		    //渲染头部信息
		    headerMenuList(data);

		},
		error: function(message) {
			console.log(message);
		}
	})
}

/**
 * 获取用户信息
 */
function getUserInfo () {
	if (window.localStorage.getItem("token") == null){
		return;
	};
	let url = URL.getUserInfoUrl;
	$.ajax({
		type: "GET",
		url: url,
		/*传给后端的数据格式json*/
		dataType: "json",
		/*后端返回的数据格式json*/
		headers: {
			'X-Winzkj-Token': window.localStorage.getItem("token")
		},
		success: function(data) {
		    // console.log(data);
			if (data.code == "401") {
				layer.alert("登录失效，请重新登录");
				// 清除缓存信息
				window.localStorage.clear();
				window.location.href="index.html";
			} else if (data.code == 0) {
				let user = JSON.stringify(data.data);
				window.localStorage.setItem("user", user);
				loginStatus();
			} else {
                layer.alert(data.msg);
			}
		},
		error: function(message) {
			console.log(message);
		}
	});
}

function headerMenuList(data) {

    $("#menuList").empty();

    // let menu;
    for (let idx in data.data) {
        let item = data.data[idx];

        // 菜单模板
        let menu = template.headerMenu;
        // menu = template.headerMenu;
        let imgUrl = '';


        let str = item.link;
        let link = window.location.pathname;

        if(str.indexOf(link) !== -1 && link !== '/') {
            if(item.imgUrl) {
                imgUrl = baseUrl + item.imgUrl;
                imgUrl = template.itemImgUrl.replace("${imgUrl}",imgUrl);
            }
        }


        if (item.children.length > 0) {

            menu = menu.replace('${link}','javascript:0;').replace('${pTitle}', item.title);

            // 二级菜单模板
            let triangle = '<i class="icon icon-triangle-down"></i><i class="triangle-down-wrap"></i>';
            let subWrap = '<div class="nav-sub-wrap"><ul class="sub-list">${li}</ul></div>';

            menu = menu.replace('${subWrap}', subWrap).replace('${triangle}',triangle);

            // 二级菜单
            let menuList = "";
            for (let idx2 in item.children) {
                let ii = item.children[idx2];
                let link = ii.link;
                let title = ii.title;
                let menuLi = template.headerMenuLi.replace('${title}', title).replace('${link}', link);
                menuList = menuList.concat(menuLi);


            }
            if (menuList.length > 0) {
                menu = menu.replace("${li}", menuList);
            }
        } else {

            // 二级菜单模板

            menu = menu.replace('${subWrap}', '').replace('${triangle}','');menu = menu.replace('${link}',item.link).replace('${pTitle}', item.title).replace('${li}',' ');

            // menu = menu.replace('${li}',' ');
        }
        $("#menuList").append(menu);


        // console.log(imgUrl);
        $(".section-wrap").prepend(imgUrl);



    }
    // menu = menu.concat(menu);
    //
    // console.log(menu);

}

// 工具方法
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}


/**
 *  请求数据到友情链接
 **/
function getFooterLink() {
    let url = URL.contentListUrl;
    let json = {
        categoryId: "103",
        pageNum: "1",
        pageSize: "5"
    }
    $.ajax({
        type: "POST",
        url: url,
        data: json,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            // console.log(data.data.content);
            // console.log(data);

            let footerLink = "";
            for (let index in data.rows) {
                let item = data.rows[index];
                // console.log(item);
                let itemUrl = item.url;
                let itemTitle = item.title;
                let footerLinkItem = template.footerLink.replace('${link}', itemUrl).replace('${title}', itemTitle);
                footerLink = footerLink.concat(footerLinkItem);

            }
            // console.log(bidsList);
            $('#footerLink').append(footerLink);

        },
        error: function(message) {
            console.log("请求失败！");
        }
    });

}


/**
 * 请求网站信息
 */

function getWebInfo() {
    let url = URL.getWebInfo;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {

            // console.log(data);
            if(data.code == 0) {
                // alert(data.msg);
                let name = data.data.name;
                let address = data.data.address;
                let phone = data.data.phone;
                let employPhone = data.data.employPhone;
                let postCode = data.data.postCode;
                let locationX = data.data.locationX;
                let locationY = data.data.locationY;
                let wxQrCode = baseUrl + data.data.wxQrCode;
                let mobileQrCode = baseUrl + data.data.mobileQrCode;
                let webLogo = baseUrl + data.data.webLogo;

                // console.log(name);

                let companyInfo = template.companyInfo.replace('${name}', name).replace('${address}', address).replace('${phone}', phone).replace('${employPhone}', employPhone).replace('${postCode}', postCode).replace('${locationX}', locationX).replace('${locationY}', locationY);

                let mobileFooterInfo = template.mobileFooterInfo.replace('${name}', name).replace('${phone}', phone);

                let qrcodeContent = template.qrcodeContent.replace('${wxQrCode}', wxQrCode).replace('${mobileQrCode}', mobileQrCode);

                let logoContent = template.logoContent.replace('${logo}',webLogo).replace('${logoMobile}',webLogo);

                $('#companyInfo').append(companyInfo);
                $('#copyright').append(mobileFooterInfo);
                $('#qrcodeWrap').append(qrcodeContent);
                $('#logoWrap').append(logoContent);

            }

        },
        error: function(message) {
            console.log("请求失败！");
        }
    });
}
