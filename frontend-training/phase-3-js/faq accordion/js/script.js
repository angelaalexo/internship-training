$(document).ready( function () {
    $('.faq-question').click( function () {
        const answer = $(this).next('.faq-answer');

        /* If this question is active on click slide it up */
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
            answer.slideUp();
        }

        /* If the faq question is not active
        * answer up */
        else {
            $('.faq-question').not(this).removeClass('active');
            $('.faq-answer').not(answer).slideUp();

            /* Open the question */
            $(this).addClass('active')
            answer.slideDown();
        }
    })
})