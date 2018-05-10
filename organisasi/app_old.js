//var server = 'http://192.168.43.201/server_djsn'; /*'http://ladangku.org/server';*/
var server = 'http://sismonev.djsn.go.id/server_djsn';

$(function () {
    
    var me = new Object();
    var data_alamat = [];
    var organisasi_marker = [];
    
    var getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    

    var contentString = function() {
      
    };

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
  
    var addMapMarker = function(data_marker) {
        for (var i = 0; i < data_marker.length; i++) {
            data_marker[i].setMap(me.map);
        }
    };

    var removeMapMarker = function(data_marker) {
        for (var i = 0; i < data_marker.length; i++) {
            data_marker[i].setMap(null);
        }
    };

    var addMarker = function(options) {

        // create new marker location
        var myLatlng = new google.maps.LatLng(options['lat'], options['lng']);

        var pinIcon = new google.maps.MarkerImage(
            options['icon'],
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(13, 20)
        );

        // create new marker
        var marker = new google.maps.Marker({
            id: options['id'],
            //map: me.map,
            icon: pinIcon,
            title: options['title'],
            position: myLatlng,
            optimized: false                
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(me.map, marker);
        });

        google.maps.event.addListener(marker, 'mouseover', function() {

        }); 

        google.maps.event.addListener(me.infowindow,'closeclick', function() {

        });

        google.maps.event.addListener(me.map, 'zoom_changed', function() {

        });

        google.maps.event.addListener(me.map, 'center_changed', function() {

        });


        return marker;
    };
    
    var loadMap = function() {

        var myOptions = {
            //scrollwheel: true,    
            zoom: 5,
            center: new google.maps.LatLng( -2.901009, 120.335554 ),
            mapTypeId: google.maps.MapTypeId.MAP_TYPE_NORMAL
        };

        // create new map make sure a DIV with id myMap exist on page
        me.map = new google.maps.Map(document.getElementById("myMap"), myOptions);

        // create new info window for marker detail pop-up
        me.infowindow = new google.maps.InfoWindow();

        google.maps.event.addListenerOnce(me.map, 'idle', function(){
                    //console.log($(".gm-style").position().top);
            $('.gm-style').css( { top: $('.main-header').height() } );
            $('.gm-style').css( { height: $('.wrapper').height()-$('.main-header').height() } );
            $('#over_map').css( { left: $('.sidebar').width()+20, top: $('.wrapper').height()-27, 'z-index': 999 } );
        });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = me.map.getCenter();
            google.maps.event.trigger(me.map, "resize");
            me.map.setCenter(center); 
            $('.gm-style').css( { height: $('.wrapper').height()-$('.main-header').height() } );
            $('#over_map').css( { left: $('.sidebar').width()+20, top: $('.wrapper').height()-27, 'z-index': 999 } );
        });
    };
        
    var loadData = function() {
        $("body").mLoading();
        var lang = getParameterByName('lang');
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receive_organisasi",
            url: server+'/organisasi/proporsi.php?lang='+lang,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    
                    //SUMMARY
                    var summary = data['summary'];
                    for(var key in summary) {
                        $('#summary_'+(eval(key)+1)+'_nilai').text(summary[key]['nilai']);
                        $('#summary_'+(eval(key)+1)+'_satuan').text(summary[key]['satuan']);
                        $('#summary_'+(eval(key)+1)+'_nama').text(summary[key]['nama']);
                    }
                    
                    //LODA MAP MARKER
                    organisasi_marker = [];
                    data_alamat = data['alamat'];
                    for(var key in data_alamat) {
                        organisasi_marker.push(addMarker(data_alamat[key]));
                    }
                    addMapMarker(organisasi_marker);
                    
                    var topics = data['tipe'];
                    var html = '';
                    for(var key in topics) {
                        html+='<label><input type="checkbox" name="checkbox_tipe_'+topics[key]['id']+'" id_tipe="'+topics[key]['id']+'" class="checkbox_tipe" checked> <span class="label bg-gray">'+topics[key]['title']+'</span></label>&nbsp;&nbsp;&nbsp;';
                    }
                    $('#tipes').html(html);
                    
                    $('.checkbox_tipe').iCheck({
                        checkboxClass: 'icheckbox_square-grey',
                        //radioClass: 'iradio_square-blue',
                        increaseArea: '20%' // optional
                    });
            
                    $('.checkbox_tipe').change(function() {
                        var id_tipe = this.getAttribute("id_tipe");
                        if($( '[name=checkbox_tipe_'+id_tipe+']' ).is(':checked')) {
                            
                            //add
                            var add_marker = [];
                            for(var key in data_alamat) {
                                if(data_alamat[key]['id_tipe']==id_tipe) {
                                    add_marker.push(organisasi_marker[key]);
                                }                                    
                            }
                            addMapMarker(add_marker);
                        } else {
                            
                            //remove
                            var remove_marker = [];
                            for(var key in data_alamat) {
                                if(data_alamat[key]['id_tipe']==id_tipe) {
                                    remove_marker.push(organisasi_marker[key]);
                                }                                    
                            }
                            removeMapMarker(remove_marker);
                        }
                    });

                    $('.checkbox_tipe').on('ifChanged', function (event) { $(event.target).trigger('change'); });
                        
                } else {

                }
                
                $("body").mLoading('hide');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');
            } 
        });    
    };
    
    $(window).scroll(function () {
        if ($(window).scrollTop() > $('#header_logo').height()) {
          $('#nav_bar').addClass('navbar-fixed');
        }
        if ($(window).scrollTop() < $('#header_logo').height()) {
          $('#nav_bar').removeClass('navbar-fixed');
        }
    });
    
    
    
    loadMap();
    loadData();
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
});