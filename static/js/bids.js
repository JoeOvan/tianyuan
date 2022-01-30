let bidsTemplate = {};
bidsTemplate.bidsList = '<div class="item-bids-wrap"><a href="${link}" class="col-item-wrap" data-catogoryid="${id}"><span class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""></span><span class="text-wrap"><h3>${title}</h3><p>${desc}</p><span class="time">${time}</span><i class="icon icon icon-go"></i></span></a></div>';
bidsTemplate.updateHtml = "<img src='../../assets/images/update.png' alt='' style='margin: 30px 0;'>";

$(function(){
	//处理登录栏
	getUserInfo();

	//请求招标文件列表页
	ajaxRequst(107, 1, 10);

	//获取网站信息
	getWebInfo();
});



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
			let bidsList = "";
			let total = result.total;
			for (let index in result.rows) {
				let item = result.rows[index];
				let itemUrl = staticURL.bidsDetailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTime = item.createTime.toString().split(" ")[0];
				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemId = item.id;
				let bidsItem = bidsTemplate.bidsList.replace('${link}', itemUrl).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
					.replace('${desc}', itemDesc).replace('${id}',itemId).replace('${time}',itemTime);
				bidsList = bidsList.concat(bidsItem);

			}

			if(bidsList !== '')  {
				// 渲染分页插件
				renderHtml(bidsList,categoryId,pageSize,pageNum,total);
			} else  {
				$('#bidsList').empty().append(bidsTemplate.updateHtml);
			}


		}
	})



}

function Ajax(json, callback) {
	let url = URL.getBidInvitationList;
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
					$('#bidsList').empty().append(html);
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
				elem: '#bidsList' //流加载容器
				,done: function(page, next){ //执行下一页的回调

					//模拟数据插入
					setTimeout(function(){
						// alert(111);

						let json = {
							categoryId: categoryId,
							pageNum: pageNum++,
							pageSize: pageSize
						}
						let bidsList = "";
						Ajax(json, function(result) {
							// alert(1111);
							if (result.code == 0) {


								for (let index in result.rows) {
									let item = result.rows[index];
									let itemUrl = URL.bidsDetailUrl +"?id="+item.id;
									let itemImgUrl = baseUrl + item.imgUrl;
									let itemTime = item.createTime.toString().split(" ")[0];
									let itemTitle = item.title;
									let itemDesc = item.description;
									let itemId = item.id;
									let bidsItem = bidsTemplate.bidsList.replace('${link}', itemUrl).replace('${imgUrl}',itemImgUrl).replace('${title}', itemTitle)
										.replace('${desc}', itemDesc).replace('${id}',itemId).replace('${time}',itemTime);
									bidsList = bidsList.concat(bidsItem);

								}
								// 渲染分页插件
								next(bidsList, page < Math.ceil(total/pageSize));
							}
						})


					}, 500);

					// first = false;
				}
			});

		});
	}
}
