$(document).ready( function () {
    $('.filter-btn').click( function () {
        var filter = $(this).attr('data-filter');

        $('.filter-btn').removeClass('active')
        $(this).addClass('active')

        if (filter === 'all'){
            $('.gallery-item').fadeIn();
        }
        else{
            $('.gallery-item').each( function () {
                if ($(this).hasClass(filter)){
                    $(this).fadeIn();
                }
                else{
                    $(this).fadeOut();
                }
            });
        }
    });
})

var modal = $('.modal')
var modalImg = $('.modal-img')
var modalCap = $('.modal-caption')

$('.gallery-item').click( function (){
    modal.fadeIn();
    modalImg.attr('src', $(this).attr('src'));
    modalCap.text($(this).attr('alt'))
})

$('.close').click( function () {
    modal.fadeOut();
})

