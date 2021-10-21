/*admin index side navigation */
$('.dropmenu-btn').click(function(){
    $('nav ul .dropmenu-show').toggleClass("show");
    $('nav ul .first').toggleClass("rotate");
});
$('.dropmenu2-btn').click(function(){
    $('nav ul .dropmenu2-show').toggleClass("show");
    $('nav ul .second').toggleClass("rotate");
});
$('.dropmenu3-btn').click(function(){
    $('nav ul .dropmenu3-show').toggleClass("show");
    $('nav ul .third').toggleClass("rotate");
});
$('nav ul li').click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    $(this).addClass("nav ul li").css("backgroundColor","#22252b");
});