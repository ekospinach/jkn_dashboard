$(function () {
    
    var load_data = function(periode, propinsi, kabupaten) {
        $("body").mLoading();
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/organisasi/proporsi.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    
                    
                    var periode = data['periode'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    $('#pusat').text(summary['pusat']);
                    $('#divre').text(summary['divre']);
                    $('#cabang').text(summary['cabang']);
                    $('#klok').text(summary['klok']);

                    //CAKUPAN MAP
                    var data_cakupan_map = [];
                    var cakupan_map = data['cakupan_map'];
                    for(var key in cakupan_map) {
                        //console.log(cakupan_map[key]['cakupan'] +"\t"+cakupan_map[key]['peserta']+"\t"+cakupan_map[key]['populasi']);
                        data_cakupan_map[key] = {
                            "hc-key": cakupan_map[key]['hc_key'],
                            "value": eval(cakupan_map[key]['cakupan']),
                            dataLabels: { x: eval(cakupan_map[key]['x']), y: eval(cakupan_map[key]['y']) }
                        };
                    }
                    peta_cakupan_cabang.series[0].setData(data_cakupan_map, true);
                    peta_cakupan_divre.series[0].setData(data_cakupan_map, true);
                    
                    //KANTOR CABANG
                    var data_cabang_map = [];
                    var cabang_map = data['cabang'];
                    for(var key in cabang_map) {
                        //console.log(cabang_map[key]['nama'] +"\t"+cabang_map[key]['lat']+"\t"+cabang_map[key]['lon']);
                        data_cabang_map[key] = {
                            "nama": cabang_map[key]['nama'],
                            "lat": eval(cabang_map[key]['lat']),
                            "lon": eval(cabang_map[key]['lon'])
                        };
                    }
                    peta_cakupan_cabang.series[2].setData(data_cabang_map, true);
                    
                    //DIVISI REGIONAL
                    var data_divre_map = [];
                    var divre_map = data['divre'];
                    for(var key in divre_map) {
                        data_divre_map[key] = {
                            "nama": divre_map[key]['nama'],
                            "lat": eval(divre_map[key]['lat']),
                            "lon": eval(divre_map[key]['lon'])
                        };
                    }
                    peta_cakupan_divre.series[2].setData(data_divre_map, true);
                    
                    //peta_cakupan_cabang.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    //peta_cakupan_divre.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    
                } else {

                }
                
                $("body").mLoading('hide');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');
            } 
        });    
    };
    
    var load_kabupaten = function(propinsi) {
        $("#select_kabupaten").val('');
        $("#select_kabupaten").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivekabupatendatastore",
            url: server+'/store/kabupatenDataStore.php?propinsi='+propinsi,
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '<option value="0">'+(propinsi>0?'ALL':'')+'</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'">'+topics[key]['name']+'</option>';
                }
                $(option).appendTo('#select_kabupaten');
            },
            error: function(jqXHR, textStatus, errorThrown) { 

            } 
        });
    };
    
    var load_propinsi = function() {
        $("#select_propinsi").val('');
        $("#select_propinsi").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivepropinsidatastore",
            url: server+'/store/propinsiDataStore.php',
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '<option value="0">NASIONAL</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'">'+topics[key]['name']+'</option>';
                }
                $(option).appendTo('#select_propinsi');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_propinsi();
            } 
        });
    };
    
    var load_periode = function() {
        $("#select_periode").val('');
        $("#select_periode").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveperiodedatastore",
            url: server+'/store/periodeDataStore.php',
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'"'+(topics[key]['selected']?'selected="selected"':'')+'>'+topics[key]['periode']+'</option>';
                }
                $(option).appendTo('#select_periode');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_periode();
            } 
        });
    };
    
    $("#select_kabupaten").prop('disabled', true);
    
    $('#select_periode').on('change', function (e) {
        var periode = this.value;
        var propinsi = $('#select_propinsi').val()===null?0:$('#select_propinsi').val();
        var kabupaten = $('#select_kabupaten').val()===null?0:$('#select_kabupaten').val();
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
    });
    
    $('#select_propinsi').on('change', function (e) {
        $("#select_kabupaten").prop('disabled', this.value==0);
        load_kabupaten(this.value);
        
        var periode = $('#select_periode').val()===null?0:$('#select_periode').val();
        var propinsi = this.value;
        var kabupaten = $('#select_kabupaten').val()===null?0:$('#select_kabupaten').val();
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
    });
    
    $('#select_kabupaten').on('change', function (e) {
        var periode = $('#select_periode').val()===null?0:$('#select_periode').val();
        var propinsi = $('#select_propinsi').val()===null?0:$('#select_propinsi').val();
        var kabupaten = this.value;
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
    });
    
    var H = Highcharts,
        map = H.maps['countries/id/id-all'],
        chart;
        
    var peta_cakupan_cabang = new Highcharts.Map('map_canvas_cabang', {
        
        title : {
            text : 'Sebaran Kantor Cabang'
        },

        subtitle : {
            style : {
                display: 'none'
            }
        },

        colorAxis: {
            dataClasses: [{
                from: 0,
                color: "#c5c5c5"
            }]
        },
    
        
    
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align: 'center',
            floating: true,
            valueDecimals: 0,
            valueSuffix: ' %',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14,
            y: 50
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            },
            enableMouseWheelZoom: false
        },
        series : [{
            data : [],
            mapData: map,
            joinBy: 'hc-key',
            name: 'Kantor Cabang',
            states: {
                /*hover: {
                    color: '#C5C5C5'
                }*/
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                allowOverlap: true,
                crop: true,
                outside: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                    color: '#fff'
                }
            },
            
            tooltip: {
                pointFormat: 'aa '
            }        
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Kantor Cabang',
            color: '#0000ff',
            data: []
        }]
    });
    
    
    var peta_cakupan_divre = new Highcharts.Map('map_canvas_divre', {
        
        title : {
            text : 'Sebaran Kedeputian Wilayah'
        },

        subtitle : {
            style: {
                display: 'none'
            }
        },

        colorAxis: {
            dataClasses: [{
                from: 0,
                color: "#c5c5c5"
            }]
        },
    
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align: 'center',
            floating: true,
            valueDecimals: 0,
            valuePrefix: 'Divre ',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14,
            y: 50
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            },
            enableMouseWheelZoom: false
        },
        series : [{
            data : [],
            mapData: map,
            joinBy: 'hc-key',
            name: 'Divre',
            states: {
                /*hover: {
                    color: '#C5C5C5'
                }*/
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                allowOverlap: true,
                crop: true,
                outside: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                    color: '#fff'
                }
            },
            tooltip: {
                pointFormat: '{point.x} - {point.y}'
            }        
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Divisi Regional',
            color: '#000',
            data: []
        }]
    });
    
    load_data('', 0, 0);
    //load_propinsi();
    //load_periode();
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
});