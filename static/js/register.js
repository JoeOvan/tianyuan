

$(function (){

    //获取用户信息
    getUserInfo();

});

/**
 * 提交注册信息
 */
function registerMobileSubmit() {
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
            // console.log(data);
            if (data.code == "401") {
                alert("登录失效，请重新登录");
                // 清除缓存信息
                window.localStorage.clear();
            } else if (data.code == "0") {
                layer.alert("已提交成功",function(){window.location.href="index.html"} );
            }
        },
        error: function(message) {
            console.log(message);
        }
    });

}
