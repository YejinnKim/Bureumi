$(function() {
    $.ajax({
        url : "http://localhost:3000/category",
        dataType : "json",
        success : function(result) {
            $('#request_box table').remove();
            var tag = '<table>';
            $.each(result, function(idx, data) {
                $('#category_opt').val(data.category).attr('selected', 'selected')
                tag += '<tr><td class="category" rowspan="2">' + data.category + '</td>';
                tag += '<td class="title"><a href="/request_content/' + data.request_code + '">' + data.request_title + '</a></td></tr>';
                tag += '<tr><td class="price">' + data.request_price + '</td></tr>';
            });
            tag += '</table>';
            $('#request_box').append(tag);
        },
        error : function(request, status, error) {
            console.log('전송 에러');
        }
    });

    $('#category_opt').val(category).attr('selected', 'selected')

    $('#category_opt').on('change', function() {
        var category = $("#category_opt option:selected").val();
        location.href='/category/' + category;
    });
});
