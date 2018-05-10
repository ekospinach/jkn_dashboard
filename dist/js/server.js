var server = 'http://180.250.242.162/server_djsn';
$(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > $('#header_logo').height()) {
          $('#nav_bar').addClass('navbar-fixed');
        }
          
        if ($(window).scrollTop() < $('#header_logo').height()) {
          $('#nav_bar').removeClass('navbar-fixed');
        }
    });
    
    $.ajax({
        type: 'POST',
        crossDomain: true,
        jsonpCallback: "hitcounter",
        url: server+'/store/hitcounter.php?page='+window.location.href+'&ip_address='+ip_address,
        dataType: 'jsonp',
        success: function(data) {
            var total = data["TOTAL"];
            var today = data["TODAY"];

            $('#pengunjung').text('Pengunjung: '+total);
            $('#hari_ini').text('Hari Ini: '+today);

        },
        error: function(jqXHR, textStatus, errorThrown) { 

        }
    });
});

