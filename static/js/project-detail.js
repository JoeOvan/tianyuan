let detailTemplate = {};
detailTemplate.title = '<h1 class="title-wrap"><span class="block">${title}</span><span class="line"></span><span class="left-line"></span><span class="right-line"></span></h1>';

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
            let itemTime = new Date(item.createTime.replace(/-/g, "/"));
            let date = itemTime.getFullYear()+"年"+ (itemTime.getMonth()+1)+ "月"+ itemTime.getDate()+ "日";
            let title = detailTemplate.title.replace('${title}',itemTitle).replace('${createTime}', date);

            $('#content').append(title).append(item.content);

        },
        error: function(message) {
            console.log('请求失败！');
        }
    })
}
