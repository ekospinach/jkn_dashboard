var server = 'http://192.168.43.201/server_djsn'; /*'http://ladangku.org/server';*/

$(function () {
    
    var getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
    $(window).scroll(function () {
        if ($(window).scrollTop() > $('#header_logo').height()) {
          $('#nav_bar').addClass('navbar-fixed');
        }
        if ($(window).scrollTop() < $('#header_logo').height()) {
          $('#nav_bar').removeClass('navbar-fixed');
        }
    });
    
    $('#select_tahun').on('change', function (e) {
        loadBulan(this.value);        
    });
    
    $('#btn_submit').on('click', function (e) {
        loadData($('#select_tahun').val(), $('#select_bulan').val());
    });
    
    var loadTahun = function() {
        $("#select_tahun").val('');
        $("#select_tahun").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivetahundatastore",
            url: server+'/store/tahunDataStore.php',
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['tahun']+'"'+(topics[key]['selected']?'selected="selected"':'')+'>'+topics[key]['tahun']+'</option>';
                }
                $(option).appendTo('#select_tahun');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_tahun();
            } 
        });
    };
    
    var loadBulan = function(tahun) {
        $("#select_bulan").val('');
        $("#select_bulan").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivebulandatastore",
            url: server+'/store/bulanDataStore.php?tahun='+tahun,
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '<option value="0">-- Bulan --</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'"'+(topics[key]['selected']?'selected="selected"':'')+'>'+topics[key]['nama']+'</option>';
                }
                $(option).appendTo('#select_bulan');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                loadBulan(tahun);
            } 
        });
    };
    
    var loadData = function(tahun, id_periode) {
        $("body").mLoading();
        var lang = getParameterByName('lang');
        console.log('Tahun: '+tahun);
        console.log('ID Periode: '+id_periode);
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receive_iuran",
            url: server+'/iuran/proporsi.php?lang='+lang+'&tahun='+tahun+'&id_periode='+id_periode,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                    
                if(data['success']) {
                    var periode = data['periode'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    for(var key in summary) {
                        $('#summary_'+(eval(key)+1)+'_nilai').text(summary[key]['nilai']);
                        $('#summary_'+(eval(key)+1)+'_satuan').text(summary[key]['satuan']);
                        $('#summary_'+(eval(key)+1)+'_nama').text(summary[key]['nama']);
                    }
                    
//                    if(id_periode==0) {
//                        $('#div_pendapatan_bulan').hide();
//                        $('#div_penerimaan_bulan').hide();
//                        $('#div_piutang_bulan').hide();
//                        $('#div_kolektibilitas_bulan').hide();
//                        
//                        $('#div_pendapatan_tahun').show();
//                        $('#div_penerimaan_tahun').show();
//                        $('#div_piutang_tahun').show();
//                        $('#div_kolektibilitas_tahun').show();
//                    } else {
//                        $('#div_pendapatan_bulan').show();
//                        $('#div_penerimaan_bulan').show();
//                        $('#div_piutang_bulan').show();
//                        $('#div_kolektibilitas_bulan').show();
//                        
//                        $('#div_pendapatan_tahun').hide();
//                        $('#div_penerimaan_tahun').hide();
//                        $('#div_piutang_tahun').hide();
//                        $('#div_kolektibilitas_tahun').hide();
//                    }
                        
                    //PENDAPATAN TAHUN
                    var arr = [];
                    var data_jumlah = [];
                    var topics = data['pendapatan_tahun'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pendapatan_tahun.series.length) > 0) {
                        chart_pendapatan_tahun.series[0].remove(true);
                    }
                    
                    chart_pendapatan_tahun.addSeries({                        
                        name: 'Pendapatan',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_pendapatan_tahun.title.update({ text: 'Pedapatan Iuran sampai Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pendapatan_tahun.xAxis[0].setCategories(arr, true, true);
                    chart_pendapatan_tahun.redraw();
                    
                    //PENERIMAAN TAHUN
                    var arr = [];
                    var data_jumlah = [];
                    var topics = data['penerimaan_tahun'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_penerimaan_tahun.series.length) > 0) {
                        chart_penerimaan_tahun.series[0].remove(true);
                    }
                    
                    chart_penerimaan_tahun.addSeries({                        
                        name: 'Penerimaan',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_penerimaan_tahun.title.update({ text: 'Penerimaan Iuran sampai Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_penerimaan_tahun.xAxis[0].setCategories(arr, true, true);
                    chart_penerimaan_tahun.redraw();
                    
                    //PIUTANG TAHUN
                    var arr = [];
                    var data_jumlah = [];
                    var topics = data['piutang_tahun'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_piutang_tahun.series.length) > 0) {
                        chart_piutang_tahun.series[0].remove(true);
                    }
                    
                    chart_piutang_tahun.addSeries({                        
                        name: 'Piutang',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_piutang_tahun.title.update({ text: 'Piutang Iuran sampai Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_piutang_tahun.xAxis[0].setCategories(arr, true, true);
                    chart_piutang_tahun.redraw();
                    
                    //KOLEKTIBILITAS TAHUN
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['kolektibilitas_tahun'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_kolektibilitas_tahun.series.length) > 0) {
                        chart_kolektibilitas_tahun.series[0].remove(true);
                    }
                    
                    chart_kolektibilitas_tahun.addSeries({                        
                        name: 'Kolektibilitas',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_kolektibilitas_tahun.title.update({ text: 'Kolektibilitas Iuran sampai Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_kolektibilitas_tahun.xAxis[0].setCategories(arr, true, true);
                    chart_kolektibilitas_tahun.redraw();
                    
                    //PENDAPATAN BULAN
                    var arr = [];
                    var data_jumlah = [];
                    
                    var topics = data['pendapatan_bulan'];
                    var row = 0;
                    for(var key in topics) {
                        if(eval(topics[key]['jumlah'])>0) {
                            arr[row] = topics[key]['nama_segmen'];
                            data_jumlah[row] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                            row++;
                        }
                    }
                    
                    //clear series
                    while(eval(chart_pendapatan_bulan.series.length) > 0) {
                        chart_pendapatan_bulan.series[0].remove(true);
                    }
                    
                    chart_pendapatan_bulan.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_pendapatan_bulan.title.update({ text: 'Pendapatan Iuran Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pendapatan_bulan.xAxis[0].setCategories(arr, true, true);
                    chart_pendapatan_bulan.redraw();
                    
                    
                    
                    //PENERIMAAN BULAN
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['penerimaan_bulan'];
                    var row = 0;
                    for(var key in topics) {
                        if(eval(topics[key]['jumlah'])>0) {
                            arr[row] = topics[key]['nama_segmen'];
                            data_jumlah[row] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                            row++;
                        }
                    }
                    
                    //clear series
                    while(eval(chart_penerimaan_bulan.series.length) > 0) {
                        chart_penerimaan_bulan.series[0].remove(true);
                    }
                    
                    chart_penerimaan_bulan.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    /*chart_penerimaan_bulan.addSeries({                        
                        name: 'Pertumbuhan',
                        type: 'areaspline',
                        color: '#0000FF',
                        yAxis: 1,
                        data: data_tumbuh,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#fff'
                            }
                        }
                    }, false);*/
                    
                    /*if(label_pertumbuhan_segmen!==undefined) {
                        label_pertumbuhan_segmen.destroy();
                    }
                    
                    label_pertumbuhan_segmen = chart_penerimaan_bulan.renderer.label("Pertumbuhan"+($('#select_bulan').val()==0?" Rata-rata":"")+": "+ summary['pertumbuhan']+($('#select_bulan').val()==0?" jiwa":" %"))
                    .css({
                        width: '370px',
                        color: '#333',
                        //backgroundColor: 'red',
                        fontWeight: 'bold',
                        fontSize: '10pt',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                    })
                    .attr({
                        'stroke': 'silver',
                        'stroke-width': 2,
                        'r': 5,
                        'padding': 10
                    })
                    .add();

                    label_pertumbuhan_segmen.align(Highcharts.extend(label_pertumbuhan_segmen.getBBox(), {
                        align: 'right',
                        x: -80, // offset
                        verticalAlign: 'top',
                        y: 15 // offset
                    }), null, 'spacingBox');*/
                    
                    
                    
                    
                    chart_penerimaan_bulan.title.update({ text: 'Penerimaan Iuran Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_penerimaan_bulan.xAxis[0].setCategories(arr, true, true);
                    chart_penerimaan_bulan.redraw();
                    
                    
                    
                    //PIUTANG BULAN
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['piutang_bulan'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama_segmen'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                        //data_tumbuh[key] = {y: eval(topics[key]['persentase']), label: topics[key]['view_persentase']};
                    }
                    
                    //clear series
                    while(eval(chart_piutang_bulan.series.length) > 0) {
                        chart_piutang_bulan.series[0].remove(true);
                    }
                    
                    chart_piutang_bulan.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    /*chart_piutang_bulan.addSeries({                        
                        name: 'Pertumbuhan',
                        type: 'areaspline',
                        color: '#0000FF',
                        yAxis: 1,
                        data: data_tumbuh,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#fff'
                            }
                        }
                    }, false);*/
                    
                    /*if(label_pertumbuhan_segmen!==undefined) {
                        label_pertumbuhan_segmen.destroy();
                    }
                    
                    label_pertumbuhan_segmen = chart_piutang_bulan.renderer.label("Pertumbuhan"+($('#select_bulan').val()==0?" Rata-rata":"")+": "+ summary['pertumbuhan']+($('#select_bulan').val()==0?" jiwa":" %"))
                    .css({
                        width: '370px',
                        color: '#333',
                        //backgroundColor: 'red',
                        fontWeight: 'bold',
                        fontSize: '10pt',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                    })
                    .attr({
                        'stroke': 'silver',
                        'stroke-width': 2,
                        'r': 5,
                        'padding': 10
                    })
                    .add();

                    label_pertumbuhan_segmen.align(Highcharts.extend(label_pertumbuhan_segmen.getBBox(), {
                        align: 'right',
                        x: -80, // offset
                        verticalAlign: 'top',
                        y: 15 // offset
                    }), null, 'spacingBox');*/
                    
                    
                    
                    
                    //chart_piutang_bulan.title.update({ text: "Pendapatan per" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_piutang_bulan.xAxis[0].setCategories(arr, true, true);
                    chart_piutang_bulan.redraw();
                    
                    
                    
                    //KOLEKTIBILITAS BULAN
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['kolektibilitas_bulan'];
                    var row = 0;
                    for(var key in topics) {
                        if(eval(topics[key]['jumlah'])>0) {
                            arr[row] = topics[key]['nama_segmen'];
                            data_jumlah[row] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                            row++;
                        }
                    }
                    
                    //clear series
                    while(eval(chart_kolektibilitas_bulan.series.length) > 0) {
                        chart_kolektibilitas_bulan.series[0].remove(true);
                    }
                    
                    chart_kolektibilitas_bulan.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#000'
                            }
                        }
                    }, false);
                    
                    chart_kolektibilitas_bulan.title.update({ text: 'Kolektibilitas Iuran Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_kolektibilitas_bulan.xAxis[0].setCategories(arr, true, true);
                    chart_kolektibilitas_bulan.redraw();
                } else {
                    //loadData();
                }
                
                $("body").mLoading('hide');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');
            } 
        });    
    };
    
    
    var chart_pendapatan_tahun = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'pendapatan_tahun'
        },
        title: {
            text: 'Pendapatan',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            gridLineWidth: 1,
            tickColor: '#fff',
            startOnTick: false,
            endOnTick: false,
            labels: {
                overflow: 'justify',
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            //gridLineWidth: 1,
            //min: 160000000,
            //max: 200000000,
            //tickInterval: 20*1000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            column: {
                fillOpacity: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '  {point.label}',
                    align: 'center',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
                    }
                },
                showInLegend: true
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'top',
            align:'center',
            itemMarginTop: 30,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '14px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    
    
    var chart_penerimaan_tahun = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'penerimaan_tahun'
        },
        title: {
            text: 'Pendapatan',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            gridLineWidth: 1,
            tickColor: '#fff',
            startOnTick: false,
            endOnTick: false,
            labels: {
                overflow: 'justify',
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            //gridLineWidth: 1,
            //min: 160000000,
            //max: 200000000,
            //tickInterval: 20*1000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            column: {
                fillOpacity: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '  {point.label}',
                    align: 'center',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
                    }
                },
                showInLegend: true
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'top',
            align:'center',
            itemMarginTop: 30,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '14px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    var chart_piutang_tahun = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'piutang_tahun'
        },
        title: {
            text: 'Pendapatan',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            gridLineWidth: 1,
            tickColor: '#fff',
            startOnTick: false,
            endOnTick: false,
            labels: {
                overflow: 'justify',
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            //gridLineWidth: 1,
            //min: 160000000,
            //max: 200000000,
            //tickInterval: 20*1000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            column: {
                fillOpacity: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '  {point.label}',
                    align: 'center',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
                    }
                },
                showInLegend: true
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'top',
            align:'center',
            itemMarginTop: 30,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '14px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    
    
    var chart_kolektibilitas_tahun = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'kolektibilitas_tahun'
        },
        title: {
            text: 'Pendapatan',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            gridLineWidth: 1,
            tickColor: '#fff',
            startOnTick: false,
            endOnTick: false,
            labels: {
                overflow: 'justify',
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            //gridLineWidth: 1,
            //min: 160000000,
            //max: 200000000,
            //tickInterval: 20*1000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            column: {
                fillOpacity: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '  {point.label}',
                    align: 'center',
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
                    }
                },
                showInLegend: true
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'top',
            align:'center',
            itemMarginTop: 30,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '14px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    
    var chart_pendapatan_bulan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pendapatan_bulan'
        },
        title: {
            text: '',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            gridLineWidth: 1,
            tickColor: '#fff',
            labels: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '10pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }          
        },
        yAxis: {
            //gridLineWidth: 1,
            //tickInterval: 2000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    //format: '{point.label} ({point.percentage:.1f} %)',
                    //distance: -70,
                    formatter:function(){
                        //if(this.y > 0) {
                            return this.point.label;
                        //}
                    },
                    //y: 2,
                    //color: '#ffff00',
                    //outside: true,
                    //align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false
            }
        }, 
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            y: 30,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '13px',
                color: '#333',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    var chart_penerimaan_bulan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'penerimaan_bulan'
        },
        title: {
            text: 'Penerimaan Iuran',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            gridLineWidth: 1,
            tickColor: '#fff',
            labels: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '10pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }          
        },
        yAxis: {
            //gridLineWidth: 1,
            //tickInterval: 2000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value/1000000000, 0)+' M';
                },
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    //format: '{point.label} ({point.percentage:.1f} %)',
                    //distance: -70,
                    formatter:function(){
                        //if(this.y > 0) {
                            return this.point.label;
                        //}
                    },
                    //y: 2,
                    //color: '#ffff00',
                    //outside: true,
                    //align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false
            }
        }, 
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            y: 30,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '13px',
                color: '#333',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    var chart_piutang_bulan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'piutang_bulan'
        },
        title: {
            text: '',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            gridLineWidth: 1,
            tickColor: '#fff',
            labels: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '10pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }          
        },
        yAxis: {
            //gridLineWidth: 1,
            //tickInterval: 2000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    //format: '{point.label} ({point.percentage:.1f} %)',
                    //distance: -70,
                    formatter:function(){
                        //if(this.y > 0) {
                            return this.point.label;
                        //}
                    },
                    //y: 2,
                    //color: '#ffff00',
                    //outside: true,
                    //align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false
            }
        }, 
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            y: 30,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '13px',
                color: '#333',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    var chart_kolektibilitas_bulan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'kolektibilitas_bulan'
        },
        title: {
            text: '',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            gridLineWidth: 1,
            tickColor: '#fff',
            labels: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '10pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }          
        },
        yAxis: {
            //gridLineWidth: 1,
            //tickInterval: 2000000,
            title: {
                text: 'Jumlah',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    //format: '{point.label} ({point.percentage:.1f} %)',
                    //distance: -70,
                    formatter:function(){
                        //if(this.y > 0) {
                            return this.point.label;
                        //}
                    },
                    //y: 2,
                    //color: '#ffff00',
                    //outside: true,
                    //align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false
            }
        }, 
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            y: 30,
            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '13px',
                color: '#333',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            },
            itemHoverStyle: {
                color: '#039'
            },
            itemHiddenStyle: {
                color: 'gray'
            },
            labelFormat: '{name}'
        },
        series: []
    });
    
    
    loadTahun();
    loadBulan(0);
    loadData(0, 0);
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
});