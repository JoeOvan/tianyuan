let attractTemplate = {};
attractTemplate.attractList =
	'<div class="item-attract-wrap"><a href="${link}" class="col-item-wrap" data-catogoryid="${id}"><span class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${desc}</p><span class="time">${time}</span></span></a></div>';
attractTemplate.tabbarList = '<a data-catogoryid="${id}" class="swiper-slide tab-item">${title}<i class="triangle-down"></i></a>';
attractTemplate.updateHtml = "<img src='../../assets/images/update.png' alt='' style='margin: 30px 0;'>";

$(function() {

// 	let swiper1 = '';
// 	if (($(window).width() <= 480)) {
// 		swiper1 = new Swiper('.swiper1', {
// //					设置slider容器能够同时显示的slides数量(carousel模式)。
// //					可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
// //					loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
// 			freeModeMomentum: false,
// 			freeModeMomentumBounce: false,
// 			resistanceRatio : 0,
// 			slidesPerView: 'auto',
// 			paginationClickable: true,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
// 			spaceBetween: 10,//slide之间的距离（单位px）。
// 			freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
// 			loop: false,//是否可循环
// 			disableScroll:true,
// 			onTab: function (swiper) {
// 				var n = swiper1.clickedIndex;
// 			}
// 		});
// 	}
	//请求tabber数据
	tabbarList();

	// 处理登录状态
	getUserInfo();

	//获取网站信息
	getWebInfo();

});

function init() {
	$("#tabbarList").on('click', ".tab-item", function(event) {
		let catogoryid = $(this).data("catogoryid");
		$(".tab-item").removeClass("current");
		$(this).addClass("current");
		// alert($(this).index());
		let index = $(this).index();
		if(index == 0) {
			ajaxRequst(catogoryid, 1, 10, $(this).index());
		} else if(index==1) {
			partnerContent();
		} else {
			//请求招标文件列表页
			ajaxRequst(107, 1, 10);

			// console.log("招标项目管理");
		}
	});

	// 从菜单进入时的特殊处理方法
	let type = GetQueryString("type");
	if (type != null && type != "" && typeof(type) != 'undefined') {
		$($(".tab-item").get(type - 1)).trigger("click");
	}
}

// 请求
function ajaxRequst(categoryId, pageNum, pageSize) {
	let json = {
		categoryId: categoryId,
		pageNum: pageNum,
		pageSize: pageSize
	}
	// 请求数据
	Ajax(json, function(result) {

		if (result.code == 0) {
			let attractList = "";
			let total = result.total;
			console.log(result.rows.length);
			if(result.rows.length==0) {
				$('#attractList').empty().append(attractTemplate.updateHtml);
				return
			}
			for (let index in result.rows) {
				let item = result.rows[index];
				let itemUrl = '';
				if(categoryId=="107"){
					itemUrl = staticURL.bidsDetailUrl +"?id="+item.id;
				} else {

					itemUrl = staticURL.detailUrl +"?id="+item.id;
				}
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemId = item.categoryId;
				let createTime = item.createTime.toString().split(" ")[0];
				let attractItem = attractTemplate.attractList.replace('${link}', itemUrl).replace('${imgUrl}', itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime).replace('${id}',itemId);

				attractList = attractList.concat(attractItem);
			}

			// 渲染分页插件
			renderHtml(attractList,categoryId,pageSize,pageNum,total);

		}
	})



}

function Ajax(json, callback) {
	let url='';
	if(json.categoryId=="107") {
		url = URL.getBidInvitationList;
	} else {
		url = URL.contentListUrl;
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*传给后端的数据格式json*/
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(reuslt) {
			if (typeof callback == 'function') {
				callback(reuslt)
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
		url: url + "112",
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {
			let tabbarList = '';
			for (let index in data.data) {
				let item = data.data[index];
				let itemTitle = item.title;
				let tabbarItem = attractTemplate.tabbarList.replace('${title}', itemTitle).replace("${id}",
					item.id);
				tabbarList = tabbarList.concat(tabbarItem);
			}

			$('#tabbarList').append(tabbarList);

			init();

			// console.log(swiper1);
			// if (($(window).width() <= 480)) {
			// 	swiper1.update();
			// }

		},
		error: function(message) {
			// console.log(message);
		}
	})

}

function partnerContent() {
	let url = URL.contentUrl;
	$.ajax({
		type: "GET",
		// url: url + "28",
		url: url + "84",
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {

			// console.log(data.data.curr.content);

			$('#attractList').empty().append(data.data.curr.content);

			$('.page-wrap').hide();

		},
		error: function(message) {
			console.log(message);
		}
	});

}


function renderHtml(html,categoryId,pageSize,pageNum,total) {
	if($(window).width() > 480) {

		// 渲染分页插件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'pagination',
				count: total,
				limit: pageSize,
				curr: pageNum,
				jump: function(obj, first) {
					//模拟渲染
					$('#attractList').empty().append(html);
					if (($(window).width() > 480)) {
						$('.page-wrap').show();
					}
					if (!first) {
						ajaxRequst(categoryId, obj.curr++, obj.limit)
					}
				}
			});
		});
	} else {
		layui.use('flow', function(){
			var flow = layui.flow;
			flow.load({
				elem: '#attractList' //流加载容器
				,done: function(page, next){ //执行下一页的回调

					//模拟数据插入
					setTimeout(function(){
						// alert(111);

						let json = {
							categoryId: categoryId,
							pageNum: pageNum++,
							pageSize: pageSize
						}
						let attractList = "";
						Ajax(json, function(result) {

							if (result.code == 0) {


								for (let index in result.rows) {
									let item = result.rows[index];
									let itemUrl = staticURL.detailUrl +"?id="+item.id;
									let itemImgUrl = baseUrl + item.imgUrl;
									let itemTitle = item.title;
									let itemDesc = item.description;
									let itemId = item.categoryId;
									let createTime = item.createTime.toString().split(" ")[0];
									let attractItem = attractTemplate.attractList.replace('${link}', itemUrl).replace('${imgUrl}', itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc).replace("${time}",createTime).replace('${id}',itemId);

									attractList = attractList.concat(attractItem);
								}
								// 渲染分页插件
								next(attractList, page < Math.ceil(total/pageSize));
							}
						})


					}, 500);

					// first = false;
				}
			});

		});
	}
}
