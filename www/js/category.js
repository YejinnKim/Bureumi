$(function() {
    var category = decodeURI(document.location.href).substr(31);
    
   
    $('#category_opt').on('change', function() {
        category = $("#category_opt option:selected").val();
        switch (category) {
            case "배달":
                var __category = "delivery";
                break;
            case '편의점':
                var __category = "convince";
                break;
            case '설치조립':
                var __category = "installation";
                break;
            case '장보기':
                var __category = "shopping";
                break;
            case '줄서기':
                var __category = "lineup";
                break;
            case '우체국':
                var __category = "postoffice";
                break;
            case '청소':
                var __category = "cleanup";
                break;
            case '기타':
                var __category = "etc";
                break;
        }
        location.href='/category/'+__category;
    });
});
