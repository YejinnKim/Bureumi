$(function() { 
    $.ajax({
        url : "http://localhost:3000/request_content",
        dataType : "json",
        success : function(result) {
            var tag = '<table>';
            tag += '<tr><td>작성자</td><td><div></div><p>' + result[0].writer_id + '</p></td></tr>';
            tag += '<tr><td>제목</td><td>' + result[0].request_title + '</td></tr>';
            tag += '<tr><td>내용</td><td>' + result[0].request_content + '</td></tr>';
            tag += '</table>';
            $('.request_content').append(tag);
        },
        error : function(request, status, error) {
            console.log('전송 에러');
        }
    });    
});
