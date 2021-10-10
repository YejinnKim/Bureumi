$(function() {
    var category = decodeURI(document.location.href).substr(31);
    
    $('#category_opt').val(category).attr('selected', 'selected');
    
    $('#category_opt').on('change', function() {
        category = $("#category_opt option:selected").val();
        location.href='/category/' + category;
    });
});
