$(document).ready(function() {
    $("#toggleBtn").click(function() {
        $("#text").toggle();

        if ($("#text").is(":visible")) {
            $(this).text("Hide text");
        } else {
            $(this).text("Show text");
        }
    });
});
