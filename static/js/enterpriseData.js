
$(function (){

    getEnterPriseInfo()

});

/**
 * 查询企业信息
 */
function getEnterPriseInfo() {
    $.ajax({
        url: URL.enterpriseView,
        type: "GET",
        headers: {'X-Winzkj-Token': window.localStorage.getItem("token")},
        dataType: "json",
        /*后端返回的数据格式json*/
        success: function (data) {
            // console.log(data);
            if (data.code == 0) {
                var enterprise = data.data;
                if (enterprise.id != null) {
                    $("#name").text(enterprise.name);
                    $("#creditCode").text(enterprise.creditCode);
                    $("#address").text(enterprise.address);
                    $("#contactName").text(enterprise.contactName);
                    $("#contactPhone").text(enterprise.contactPhone);
                    $("#certificationUrl").text(enterprise.certificationUrl);
                }
            } else if (data.code == 401) {
                layer.alert("登录失效，请重新登录", function () {
                    window.location.href = "index.html";
                })

            }
        },
    })
}