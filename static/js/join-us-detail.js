let detailTemplate = {};
detailTemplate.title = '<h1 class="title"><div>${title}</div></h1>';

$(function() {
    //处理登录栏
    loginStatus();

    //获取网站信息
    getWebInfo();

    //请求文章内容
    let id = GetQueryString("id");
    getContent(id);
});


function getContent(id) {
    let url = URL.contentUrl;
    $.ajax({
        type: "GET",
        url: url+id,
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function(data) {
            let curr = data.data.curr;
            let item = curr;
            let itemTitle = item.title;
            let title = detailTemplate.title.replace('${title}',itemTitle);

            $('#content').append(title).append(item.content);

        },
        error: function(message) {
            console.log('请求失败！');
        }
    })
}
