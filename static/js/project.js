let projectTemplate = {};
projectTemplate.projectList01 = '<div class="section-content-item colum-cover-text" data-catogoryid="${id}"><div class="cover-wrap"><img src="${imgUrl}" class="cover" alt=""></div><div class="text-wrap"><h3 class="wow animate__animated animate__slideInRight"><a href="${link}"><span class="title"><i class="icon icon-sign"></i>${title}</span><span class="icon-detail"></span></a></h3><p>${desc}</p></div></div>';
projectTemplate.projectList02 = '<div class="section-content-item colum-text-cover" data-catogoryid="${id}"><div class="text-wrap"><h3 class="wow animate__animated animate__slideInRight"><a href="${link}"><span class="title"><i class="icon icon-sign"></i>${title}</span><span class="icon-detail"></span></a></h3><p>${desc}</p></div><div class="cover-wrap"><img src="${imgUrl}" class="cover" alt=""></div></div>';
$(function(){

	//处理登录栏
	loginStatus();

	//获取网站信息
	getWebInfo();

	// 进入页面初始化请求数据
	ajaxRequst(110, 1, 10)


});


// 请求
function ajaxRequst(categoryId, pageNum, pageSize) {
	let json = {
		categoryId: categoryId,
		pageNum: pageNum,
		pageSize: pageSize,
		isAsc: "asc",
		orderByColumn: "sort"
	}
	// 请求数据
	Ajax(json, function(result) {
		if (result.code == 0) {
			let projectList = "";
			let total = result.total;
			for (let index in result.rows) {
				let item = result.rows[index];
				// console.log(item);
				let template;
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemId = item.categoryId;
				template = (index % 2 == 0) ? projectTemplate.projectList01 : projectTemplate.projectList02;
				let projectItem = template.replace('${link}', itemUrl).replace('${imgUrl}', itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc).replace('${id}',itemId);
				projectList = projectList.concat(projectItem);

			}

			// 渲染分页插件
			renderHtml(projectList,categoryId,pageSize,pageNum,total);


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
					$('#projectList').empty().append(html);
					// debugger
					// console.log(3333);
					// swiper.update();// 重新计算高度;
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
				elem: '#projectList' //流加载容器
				,done: function(page, next){ //执行下一页的回调

					//模拟数据插入
					setTimeout(function(){
						// alert(111);

						let json = {
							categoryId: categoryId,
							pageNum: pageNum++,
							pageSize: pageSize,
							isAsc: "asc",
							orderByColumn: "sort"
						}
						let projectList = "";
						Ajax(json, function(result) {
							// alert(1111);
							if (result.code == 0) {


								for (let index in result.rows) {
									let item = result.rows[index];
									// console.log(item);
									let template;
									let itemUrl = staticURL.detailUrl +"?id="+item.id;
									let itemImgUrl = baseUrl + item.imgUrl;
									let itemTitle = item.title;
									let itemDesc = item.description;
									let itemId = item.categoryId;
									template = (index % 2 == 0) ? projectTemplate.projectList01 : projectTemplate.projectList02;
									let projectItem = template.replace('${link}', itemUrl).replace('${imgUrl}', itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc).replace('${id}',itemId);
									projectList = projectList.concat(projectItem);

								}
								// 渲染分页插件
								next(projectList, page < Math.ceil(total/pageSize));
							}
						})


					}, 500);

					// first = false;
				}
			});

		});
	}
}
