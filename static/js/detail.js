let detailTemplate = {};
detailTemplate.title = '<h1 class="title"><div>${title}</div><p class="createTime">发布时间：${createTime}</p></h1>';

$(function() {
    //处理登录栏
    loginStatus();

    //请求文章内容
    let id = GetQueryString("id");
    getContent(id);


    //获取网站信息
    getWebInfo();

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

            let prev = data.data.prev;
            let next = data.data.next;
            if (prev.id != null) {
                let id = prev.id;
                let title = prev.title;
                let html = "<a href='detail.html?id=" + id + "'>上一篇:" + title + "</a>";
                $(".prev").append(html);
                let html2 = "<a href='detail.html?id=" + id + "'> < 上一篇 </a>";
                $(".left").append(html2);
            } else {
                $(".prev, .left").append("上一篇:(没有了)");
            }

            if (next.id != null) {
                let id = next.id;
                let title = next.title;
                let html = "<a href='detail.html?id=" + id + "'>下一篇:" + title + "</a>";
                $(".next").append(html);
                let html2 = "<a href='detail.html?id=" + id + "'>下一篇 > </a>";
                $(".right").append(html2);
            } else {
                $(".next, .right").append("下一篇:(没有了)");
            }
        },
        error: function(message) {
            console.log('请求失败！');
        }
    })
}
