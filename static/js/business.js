$(function(){
	//处理登录栏
	loginStatus();

	//请求业务范围数据
	businessContent();

	//获取网站信息
	getWebInfo();

})


function businessContent() {
	let url = URL.contentUrl;
	$.ajax({
		type: "GET",
		url: url + "26",
		dataType: "json",
		/*后端返回的数据格式json*/
		success: function(data) {

			$('#businessContent').append(data.data.content);

		},
		error: function(message) {
			console.log('请求失败！');
		}
	})
}
