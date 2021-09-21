$(function() {
    $.ajax({
        url : "http://localhost:3000/search/data",
        dataType : "json",
        success : function(result) {
            var tag = '<table>';
            $.each(result, function(idx, data) {
                tag += '<tr><td class="category" rowspan="2">' + data.category + '</td>';
                tag += '<td class="title"><a href="/request_content/' + data.request_code + '">' + data.request_title + '</a></td></tr>';
                tag += '<tr><td class="price">' + data.request_price + '</td></tr>';
            });
            tag += '</table>';
            $("#request_box").append(tag);
        },
        error : function(request, status, error) {
            console.log('전송 에러');
        }
    });
});
