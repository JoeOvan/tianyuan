let indexTemplate = {};
indexTemplate.slide = '<div class="swiper-slide"><a href="javascript:0;"><img src="${imgUrl}" data-original="${imgUrl}" alt="" class=""></a></div>';
indexTemplate.bullet = '<a class="item-desc" href="javascript:0;"><strong>${title}</strong><span>${desc}</span></a>';
indexTemplate.noticeList = '<li><a href="${link}" class="link-wrap"><i class="icon icon-sign"></i>${title}</a></li>';
indexTemplate.companyList =
	'<a href="${link}" class="link"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload"><h3>${title}</h3><p>${desc}</p></a>';
indexTemplate.newsMobileList =
	'<a href="${link}" class="link"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload"><h3>${title}</h3><p>${desc}</p></a>';
indexTemplate.newsList = '<li><a href="${link}" data-id="${id}"><i class="masker"></i>${title}</a></li>';
indexTemplate.industryList =
	'<li><a href="${link}" class="link-item"><i class="masker"></i>${title}</a></li>';
indexTemplate.bidsList =
	'<div class="swiper-slide"><a href="${link}" class="swiper-item-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""><h3>${title}</h3><p>${desc}</p><i class="icon icon-go"></i></a></div>';
indexTemplate.exhibitionList01 =
	'<div class="section-content-item colum-cover-text"><div class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload cover"></div><div class="text-wrap"><a href="${link}"><h3 class="wow animate__animated animate__fadeInRight"><i class="icon icon-sign"></i>${title}</h3></a><p class="wow animate__animated animate__fadeInUp">${desc}</p><a href="${linkUrl}" class="link-more"  target="view_window"><i class="icon icon-go-wrap"></i></a><i class="triangle-left"></i></div></div>';
indexTemplate.exhibitionList02 =
	'<div class="section-content-item colum-text-cover"><div class="text-wrap"><a href="${link}"><h3 class="wow animate__animated animate__fadeInRight"><i class="icon icon-sign"></i>${title}</h3></a><p class="wow animate__animated animate__fadeInUp">${desc}</p><a href="${linkUrl}" class="link-more"  target="view_window"><i class="icon icon-go-wrap"></i></a><i class="triangle-right"></i></div><div class="cover-wrap"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload cover"></div></div>';
indexTemplate.attractList =
	'<div class="col-item-wrap"><a href="${link}" class="col-content-item"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" class="lazyload cover" alt=""><h3>${title}</h3><p>${desc}</p><div class="link-detail-wrap"><span class="link-detail">????????????</span></div></a></div>';
indexTemplate.newsFristImg = '<a href="${link}"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload cover"><span class="mask"></span><h3 class="title">${title}>></h3></a>';
indexTemplate.industryFristImg = '<a href="${link}"><img src="../../assets/images/placeholder-img.png" data-original="${imgUrl}" alt="" class="lazyload cover"><span class="mask"></span><h3 class="title">${title}>></h3></a>';
indexTemplate.updateHtml = "<div>?????????????????????...</div>";


$(function() {
	//?????????????????????
	slideList();
	//???????????????????????????mobile???
	noticeList();
	//??????????????????????????????
	companyList();
	//??????????????????????????????
	newsList();

	//??????????????????????????????
	industryList();

	//??????????????????????????????
	companyeContent();
	//????????????????????????
	bidsList();
	//??????????????????????????????
	exhibitionList();
	//????????????????????????
	attractList();
	//???????????????????????????
	partnerContent();


	getUserInfo();

	//??????????????????
	getWebInfo();


	// ????????????url???code????????????
	var code = GetQueryString("code");
	if (code != null && code.toString().length > 1) {
		getToken(code);
	}

	$('.btn-user').click(function(){

	});


})



function getToken(code) {
	let url = URL.loginUrl;
	$.ajax({
		type: "GET",
		url: url + "/getAccessToken?code=" + code,
		dataType: "json",
		/*???????????????????????????json*/
		success: function(result) {
			if (result.code != 0) {
				alert(result.msg);
				if (result.code == 401) {
					window.location.href = "index.html";
				}
			} else {

				let user = result.data.user;
				let token = user.token;

				window.localStorage.setItem("token", token);
				window.localStorage.setItem("user", JSON.stringify(user));

				window.location.href = "index.html";

			}
		},
		error: function(message) {
			console.log(message);
		}
	})

}

function slideList() {
	let url = URL.contentListUrl;
	// let url = URL.contentUrl;
	// let json = {
	// 	categoryId: "122"
	// }
	let json = {
		categoryId: "122",
		pageNum: "1",
		pageSize: '10',
		isAsc: "asc",
		orderByColumn: "sort"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// console.log(data);
			//
			let slideList = "";
			let bulletList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemImgUrl;
				if(($(window).width() > 480)) {
					itemImgUrl = baseUrl + item.imgUrl;
				} else {
					itemImgUrl = baseUrl + item.mobileImgUrl;
				}

				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemSlide = indexTemplate.slide.replace('${link}', itemUrl).replace('${imgUrl}',
					itemImgUrl).replace('${title}', itemTitle);
				let itemBullet = indexTemplate.bullet.replace('${desc}', itemDesc).replace('${title}', itemTitle);
				slideList = slideList.concat(itemSlide);
				bulletList = bulletList.concat(itemBullet);

			}

			$('#home-slide').append(slideList);
			$('#slideBullet').append(bulletList);



			// var mySwiper = 0;
			//
			// if (mySwiper != 0) {
			// 	mySwiper.destroy();
			// }

			var mySwiper = new Swiper('.home-focus-wrap', {
				observer:true,//??????swiper???????????????????????????????????????swiper
				observeParents:true,//??????swiper?????????????????????????????????swiper


				direction: 'horizontal', // ??????????????????
				loop: true, // ??????????????????

				// ?????????????????????
				pagination: {
					el: '.swiper-pagination',
				},

				// ??????????????????????????????
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				autoplay: {
					delay: 5000,
					stopOnLastSlide: false,
					// disableOnInteraction: true,
					disableOnInteraction: false,
				},

			})


			// function swiper() {
			// }
			//
			//
			// setTimeout("swiper()",5000);


		},
		error: function(message) {
			console.log(message);
		}
	});
}


function noticeList() {
	let url = URL.contentListUrl;
	let json = {
		categoryId: "108",
		pageNum: "1",
		pageSize: "20"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			//let data = data.rows;

			// console.log(data);
			let noticeList = "";
			for (let index in data.rows) {


				let item = data.rows[index];
				// console.log(item);
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemTitle = item.title;
				let noticeItem = indexTemplate.noticeList.replace('${link}', itemUrl).replace('${title}', itemTitle);

				noticeList = noticeList.concat(noticeItem);

			}
			// console.log(companyList);

			if(data.rows.length>2) {
				$('#noticeList').append(noticeList).append(noticeList);

				//????????????
				var oDiv = document.getElementById('mobileScroll');
				var oUl = oDiv.getElementsByTagName('ul')[0];
				var timer = null;
				var speed = -1;
				oUl.innerHTML += oUl.innerHTML;
				// console.log(oUl.innerHTML);
				setTimeout(move, 2000);
				oUl.onmouseover = function() {
					clearInterval(timer);
				};
				oUl.onmouseout = function() {
					move();
				};

				function move() {
					// alert(222);
					timer = setInterval(function() {
						// console.log(333);
						oUl.style.top = oUl.offsetTop + speed + 'px';
						if (oUl.offsetTop <= -oUl.offsetHeight / 2) {
							oUl.style.top = '0';
						} else if (oUl.offsetTop >= 0) {
							oUl.style.top = -oUl.offsetHeight / 2 + 'px';
						}
					}, 30);
				}

			} else {
				$('#noticeList').append(noticeList)
			}

			// if($(window).width() < 480) {
			//
			// }


		},
		error: function(message) {
			// console.log(message);
		}
	});
}

//????????????
function companyList() {
	let url = URL.contentListUrl;
	let json = {
		categoryId: "109",
		pageNum: "1",
		pageSize: "5"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			//let data = data.rows;

			// console.log(data);
			let companyList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let companyItem = indexTemplate.companyList.replace('${link}', itemUrl).replace('${imgUrl}',
					itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc);
				companyList = companyList.concat(companyItem);

			}
			// console.log(companyList);
			$('.section-colum-first .col-content-wrap').append(companyList);

		},
		error: function(message) {
			console.log("???????????????");
		}
	});
}

//????????????
function newsList() {
	let url = URL.contentListUrl;
	let pageSize;
	if(($(window).width() > 480)) {
		pageSize = 20;
	} else {
		pageSize = 4;
	}
	let json = {
		categoryId: "108",
		pageNum: "1",
		pageSize: pageSize
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			//let data = data.rows;

			// console.log(data);
			let newsList = "";
			let newsMobileList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				if(index==0) {
					// console.log(item.id);
					//?????????????????????????????????
					getNewsFristImg(item.id)
				}
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemTitle = item.title;
				let itemId = item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemDesc = item.description;
				let newsItem = indexTemplate.newsList.replace('${link}', itemUrl).replace('${title}',
					itemTitle).replace('${id}',itemId);
				let newsMobileItem = indexTemplate.newsMobileList.replace('${link}', itemUrl).replace('${title}',
					itemTitle).replace('${id}',itemId).replace('${desc}',itemDesc).replace('${imgUrl}',itemImgUrl);

				newsMobileList = newsMobileList.concat(newsMobileItem);
				newsList = newsList.concat(newsItem);

			}
			// console.log(newsList);
			// console.log(data.rows.length);
			//???????????????
			$('#newsMobileList').append(newsMobileList);

			if(data.rows.length>6) {
				$('#newsList').append(newsList).append(newsList);

				//????????????
				var oDiv = document.getElementById('scroll');
				var oUl = oDiv.getElementsByTagName('ul')[0];
				var timer = null;
				var speed = -1;
				oUl.innerHTML += oUl.innerHTML;
				// console.log(oUl.innerHTML);
				setTimeout(move, 2000);
				oUl.onmouseover = function() {
					clearInterval(timer);
				};
				oUl.onmouseout = function() {
					move();
				};

				function move() {
					timer = setInterval(function() {
						oUl.style.top = oUl.offsetTop + speed + 'px';
						if (oUl.offsetTop <= -oUl.offsetHeight / 2) {
							oUl.style.top = '0';
						} else if (oUl.offsetTop >= 0) {
							oUl.style.top = -oUl.offsetHeight / 2 + 'px';
						}
					}, 30);
				}

			} else {
				$('#newsList').append(newsList);

			}



		},
		error: function(message) {
			console.log(message);
		}
	});
}


//????????????
function industryList() {
	let url = URL.contentListUrl;
	let json = {
		categoryId: "113",
		pageNum: "1",
		pageSize: "8"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// let data = data.rows;
			// console.log(data.rows);
			let industryList = "";

			// alert(data.rows.length);
			if(data.rows.length==0) {
				// console.log(indexTemplate.updateHtml);
				$('#industryList').empty().append(indexTemplate.updateHtml);
				return
			}

			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				if(index==0) {
					//?????????????????????????????????
					getIndustryFristImg(item.id);
				}
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemTitle = item.title;

				let industryItem = indexTemplate.industryList.replace('${link}', itemUrl).replace(
					'${title}', itemTitle)
				industryList = industryList.concat(industryItem);

			}
			// console.log(industryList);
			$('#industryList').append(industryList);

		},
		error: function(message) {
			console.log(message);
		}
	});
}



function companyeContent() {
	let url = URL.contentUrl;
	$.ajax({
		type: "GET",
		url: url + "9",
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// console.log(data);

			$('#companyeContent').append(data.data.curr.content);


		},
		error: function(message) {
			console.log(message);
		}
	});
}


function bidsList() {
	let url = URL.contentListUrl;
	let pageSize;
	if(($(window).width() > 480)) {
		pageSize = 10;
	} else {
		pageSize = 4;
	}
	let json = {
		categoryId: "110",
		pageNum: "1",
		pageSize: pageSize,
		isAsc: "asc",
		orderByColumn: "sort"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// let data = data.rows;
			// console.log(data);
			let bidsList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let bidsItem = indexTemplate.bidsList.replace('${link}', itemUrl).replace('${imgUrl}',
					itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc);
				bidsList = bidsList.concat(bidsItem);
			}
			// console.log(bidsList);
			$('#bidsList').append(bidsList);

			if (($(window).width() > 480)) {
				var swiper = new Swiper('.document-swiper-wrap', {
					slidesPerView: 3,
					spaceBetween: 0,
					// ??????????????????????????????
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
				});
			}

		},
		error: function(message) {
			console.log(message);
		}
	});
}




function exhibitionList() {
	let url = URL.contentListUrl;
	let json = {
		categoryId: "110",
		pageNum: "1",
		pageSize: "8"
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// let data = data.rows;
			// console.log(data.rows);
			// console.log(data);
			let exhibitionList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log("????????????",item);
				let template;
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemMoreUrl = staticURL.detailUrl +"?id="+item.id;
				// console.log(itemUrl);
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let itemLinkUrl = item.url
				template = (index % 2 == 0) ? indexTemplate.exhibitionList01 : indexTemplate
					.exhibitionList02;
				let exhibitionItem = template.replace('${link}', itemUrl).replace('${imgUrl}', itemImgUrl)
					.replace('${title}', itemTitle).replace('${desc}', itemDesc).replace('${moreLink}',itemMoreUrl).replace('${linkUrl}',itemLinkUrl);
				exhibitionList = exhibitionList.concat(exhibitionItem);

			}
			// console.log(bidsList);
			$('#exhibitionList').prepend(exhibitionList);

		},
		error: function(message) {
			console.log(message);
		}
	});
}


function attractList() {
	let url = URL.contentListUrl;
	let pageSize = '';
	if($(window).width() > 480){
		pageSize = "3";
	} else {
		pageSize = "4"
	}
	let json = {
		categoryId: "120",
		pageNum: "1",
		pageSize: pageSize
	}
	$.ajax({
		type: "POST",
		url: url,
		data: json,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// let data = data.rows;
			// console.log(data.rows);
			// console.log(data);
			let attractList = "";
			for (let index in data.rows) {
				let item = data.rows[index];
				// console.log(item);
				let itemUrl = staticURL.detailUrl +"?id="+item.id;
				let itemImgUrl = baseUrl + item.imgUrl;
				let itemTitle = item.title;
				let itemDesc = item.description;
				let attractItem = indexTemplate.attractList.replace('${link}', itemUrl).replace('${imgUrl}',
					itemImgUrl).replace('${title}', itemTitle).replace('${desc}', itemDesc);
				attractList = attractList.concat(attractItem);
			}
			// console.log(bidsList);
			$('#attractList').append(attractList);

		},
		error: function(message) {
			console.log(message);
		}
	});
}

/**
 * ????????????
 */
function submitMsg() {
	let url = URL.messageUrl;
	let msg = $("#comment").val();
	if (msg == "" || msg == null) {
		alert("???????????????");
		return
	}
	let data = {
		msg: msg
	}
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		/*???????????????????????????json*/
		dataType: "json",
		/*???????????????????????????json*/
		headers: {
			'X-Winzkj-Token': window.localStorage.getItem("token")
		},
		success: function(data) {

			if (data.code != 0) {
				if (data.code == "401") {
					alert("??????????????????????????????");
					// ??????????????????
					window.localStorage.clear();
					window.location.href = "index.html";
				} else {
					alert("????????????");
				}
			} else {
				alert("??????????????????");
				$("input[name='comment']").val('');
			}
		}
	});
}

/**
 * ????????????
 */
function reset() {
	$("input[name='comment']").val('');
}

/**
 *  ????????????????????????????????????
 **/
function partnerContent() {
	let url = URL.contentUrl;
	$.ajax({
		type: "GET",
		url: url + "28",
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			// console.log(data.data.content);

			$('#partnerContent').append(data.data.content);


		},
		error: function(message) {
			console.log(message);
		}
	});

}

/**
 * ??????????????????????????????
 * @param id
 */
function getNewsFristImg(id) {
	let url = URL.contentUrl;

	// console.log(url + id);
	$.ajax({
		type: "GET",
		url: url + id,
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			let item = data.data.curr;
			// console.log(item);

			let itemUrl = staticURL.detailUrl +"?id="+item.id;
			let itemImgUrl = baseUrl + item.imgUrl;
			let itemTitle = item.title;
			let newsFristImg = indexTemplate.newsFristImg.replace('${link}', itemUrl).replace('${imgUrl}',
				itemImgUrl).replace('${title}', itemTitle);

			$('#newsFristImg').append(newsFristImg);


		},
		error: function(message) {
			console.log(message);
		}
	});
}


/**
 * ??????????????????????????????
 * @param id
 */
function getIndustryFristImg(id){

	let url = URL.contentUrl;

	// console.log(url + id);
	$.ajax({
		type: "GET",
		url: url + id,
		dataType: "json",
		/*???????????????????????????json*/
		success: function(data) {

			let item = data.data.curr;
			console.log(item);

			let itemUrl = staticURL.detailUrl +"?id="+item.id;
			let itemImgUrl = baseUrl + item.imgUrl;
			let itemTitle = item.title;
			let industryFristImg = indexTemplate.industryFristImg.replace('${link}', itemUrl).replace('${imgUrl}',
				itemImgUrl).replace('${title}', itemTitle);

			$('#industryFristImg').append(industryFristImg);


		},
		error: function(message) {
			console.log(message);
		}
	});
}


