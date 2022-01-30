let jobTemplate = {};
jobTemplate.jobList = '<div class="item-wrap"><span class="time">${month}/${day}<br/><span class="year">${year}</span></span><span class="line">|</span><a href="${link}" class="link"><strong class="title">${title}</strong></a></div>';
jobTemplate.tabbarList = '<a href="javascript:0;" data-catogoryid="${id}" data-detailid="${detailId}" class="swiper-slide tab-item">${title}</a>';
let flag = {};
flag.aflag = true;
flag.bflag = true;
flag.cflag = true;
flag.dflag = true;

$(function(){
	//处理登录栏
	loginStatus();

	//请求tabber数据
	tabbarList();

	//获取网站信息
	getWebInfo();

})


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
			// console.log(result);
			let jobList = "";
			let total = result.total;
			for (let index in result.rows) {
				let item = result.rows[index];
				let itemUrl = staticURL.jobDetailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTime = item.createTime.toString().split(" ")[0];

				let timearr = itemTime.replace(" ", ":").replace(/\:/g, "-").split("-");
				let year = timearr[0]+"年";
				let month = timearr[1];
				let day = timearr[2];

				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemId = item.id;
				let jobItem = jobTemplate.jobList.replace('${link}', itemUrl).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
					.replace('${desc}', itemDesc).replace('${id}',itemId).replace('${year}',year).replace('${month}',month).replace('${day}',day);
				jobList = jobList.concat(jobItem);

			}

			// 渲染分页插件
			renderHtml(jobList,categoryId,pageSize,pageNum,total);


		}
	})



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
					// console.log(html);
					$('#joinUsContent').empty().append(html);
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
				elem: '#joinUsContent' //流加载容器
				,done: function(page, next){ //执行下一页的回调

					//模拟数据插入
					setTimeout(function(){
						// alert(111);

						let json = {
							categoryId: categoryId,
							pageNum: pageNum++,
							pageSize: pageSize
						}
						let jobList = "";
						Ajax(json, function(result) {
							// alert(1111);
							if (result.code == 0) {


								for (let index in result.rows) {
									let item = result.rows[index];
									let itemUrl = staticURL.jobDetailUrl +"?id="+item.id;
									let itemImgUrl = baseUrl + item.imgUrl;
									let itemTime = item.createTime.toString().split(" ")[0];
									let timearr = itemTime.replace(" ", ":").replace(/\:/g, "-").split("-");
									let year = timearr[0]+"年";
									let month = timearr[1];
									let day = timearr[2];

									let itemTitle = item.title;
									let itemDesc = item.description;
									let itemId = item.id;
									let jobItem = jobTemplate.jobList.replace('${link}', itemUrl).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
										.replace('${desc}', itemDesc).replace('${id}',itemId).replace('${time}',itemTime).replace('${year}',year).replace('${month}',month).replace('${day}',day);
									jobList = jobList.concat(jobItem);

								}
								// 渲染分页插件
								next(jobList, page < Math.ceil(total/pageSize));
							}
						})


					}, 500);

					// first = false;
				}
			});

		});
	}
}

function tabbarList() {
	let url = URL.categoryListUrl;
	$.ajax({
		type: "GET",
		url: url + "119",
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {
			let tabbarList = '';
			let contentList = '';
			for (let index in data.data) {
				let item = data.data[index];
				let detailId = '';
				// console.log(item.link);
				if(item.link) {
					detailId = getParam(item.link,"id");
				}
				let itemTitle = item.title;
				let itemId = item.id;
				let tabbarItem = jobTemplate.tabbarList.replace('${title}', itemTitle).replace("${id}", item.id).replace('${detailId}',detailId);
				// let contentItem = partnerTemplate.contentList.replace('${id}',itemId);

				tabbarList = tabbarList.concat(tabbarItem);
				// contentList = contentList.concat(contentItem);
			}

			$('#tabbarList').append(tabbarList);
			// $('#swiper-content').append(contentList);
			// debugger
			init();

		},
		error: function(error) {

		}
	})

}

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

	$("#tabbarList").on('click', ".tab-item", function(event) {
		let catogoryid = $(this).data("catogoryid");
		let detailId = $(this).data("detailid");
		let index = $(this).index();
		$(".tab-item").removeClass("current");
		$(this).addClass("current");
		$('.section-content').eq(index-1).show().siblings().hide();
		if (index == 1) {
			ajaxRequst(catogoryid, 1, 10)
		} else if (index == 0){
			ideaContent(detailId);
		}
	});

	// 从菜单进入时的特殊处理方法
	let index = GetQueryString("index");
	if (index != null && index != "" && typeof(index) != 'undefined') {
		$($(".tab-item").get(index - 1)).trigger("click");
	}

}

function ideaContent(id) {
	let url = URL.contentUrl;
	$.ajax({
		type: "GET",
		url: url + id,
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {

			// console.log(data);
			$('#ideaContent').append(data.data.curr.content);
			// console.log(data.data.content);
		},
		error: function(message) {
			console.log('请求失败！');
		}
	})
}
