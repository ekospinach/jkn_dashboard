$(function () {
    
    var getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    
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
                var option = ''; //<option value="0">Setahun</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'"'+(key==topics.length-1?'selected="selected"':'')+'>'+topics[key]['nama']+'</option>';
                }
                $(option).appendTo('#select_bulan');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_bulan(tahun);
            } 
        });
    };
    
    
    var loadData = function(tahun, id_periode) {
        $("body").mLoading();
        var lang = getParameterByName('lang');
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receive_keuangan",
            url: server+'/keuangan/proporsi.php?lang='+lang+'&tahun='+tahun+'&id_periode='+id_periode,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                    
                if(data['success']) {
                    var periode = data['periode'];
                    var periode_sum_1 = data['periode_sum_1'];
                    var periode_sum_3 = data['periode_sum_3'];
                    var periode_sum_4 = data['periode_sum_4'];
                    var periode_sum_5 = data['periode_sum_5'];
                    var periode_sum_6 = data['periode_sum_6'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    for(var key in summary) {
                        $('#summary_'+(eval(key)+1)+'_nilai').text(summary[key]['nilai']);
                        $('#summary_'+(eval(key)+1)+'_satuan').text(summary[key]['satuan']);
                        $('#summary_'+(eval(key)+1)+'_nama').text(summary[key]['nama']);
                    }
                    
                    if(periode_sum_1['id']==periode['id']) {
                        $('#summary_1_blink').hide();
                        $('#summary_2_blink').hide();
                    } else {
                        $('#summary_1_blink').show();
                        $('#text_summary_1_blink').text(periode_sum_1['bulan']+' '+periode_sum_1['tahun']);
                        $('#summary_2_blink').show();
                        $('#text_summary_2_blink').text(periode_sum_1['bulan']+' '+periode_sum_1['tahun']);
                    }
                    
                    if(periode_sum_3['id']==periode['id']) {
                        $('#summary_3_blink').hide();
                    } else {
                        $('#summary_3_blink').show();
                        $('#text_summary_3_blink').text(periode_sum_3['bulan']+' '+periode_sum_3['tahun']);
                    }
                    
                    if(periode_sum_4['id']==periode['id']) {
                        $('#summary_4_blink').hide();
                    } else {
                        $('#summary_4_blink').show();
                        $('#text_summary_4_blink').text(periode_sum_4['bulan']+' '+periode_sum_4['tahun']);
                    }
                    
                    if(periode_sum_5['id']==periode['id']) {
                        $('#summary_5_blink').hide();
                    } else {
                        $('#summary_5_blink').show();
                        $('#text_summary_5_blink').text(periode_sum_5['bulan']+' '+periode_sum_5['tahun']);
                    }
                    
                    if(periode_sum_6['id']==periode['id']) {
                        $('#summary_6_blink').hide();
                    } else {
                        $('#summary_6_blink').show();
                        $('#text_summary_6_blink').text(periode_sum_6['bulan']+' '+periode_sum_6['tahun']);
                    }
                    
                    //PEMBAYARAN PENDAPATAN PERIODE
                    var arr = [];
                    var topics = data['pembayaran_pendapatan_periode'];
                    
                    var data_pembayaran = [];
                    for(var key in topics['pembayaran']) {
                        arr[key] = topics['pembayaran'][key]['periode'];
                        data_pembayaran[key] = {y: eval(topics['pembayaran'][key]['jumlah']), label: topics['pembayaran'][key]['view_jumlah']};
                    }
                    
                    var data_pendapatan = [];                    
                    for(var key in topics['pendapatan']) {
                        data_pendapatan[key] = {y: eval(topics['pendapatan'][key]['jumlah']), label: topics['pendapatan'][key]['view_jumlah']};
                    }
                    
                    var data_klaimrasio = [];                    
                    for(var key in topics['klaimrasio']) {
                        data_klaimrasio[key] = {y: eval(topics['klaimrasio'][key]['jumlah']), label: topics['klaimrasio'][key]['view_jumlah']};
                    }
                    
                    var periode_pembayaran_pendapatan = topics['periode'];
                    
                    //clear series
                    while(eval(chart_pembayaran_pendapatan_periode.series.length) > 0) {
                        chart_pembayaran_pendapatan_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_pendapatan_periode.addSeries({                        
                        name: 'Pembayaran Klaim',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_pembayaran,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_pendapatan_periode.addSeries({                        
                        name: 'Pendapatan',
                        type: 'areaspline',
                        color: '#0000ff',
                        data: data_pendapatan,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    
                    chart_pembayaran_pendapatan_periode.title.update({ text: 'Jumlah Pembayaran Klaim dan Pendapatan Setiap Bulan Sampai Dengan Bulan '+(periode_pembayaran_pendapatan['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_pembayaran_pendapatan['bulan']+' '+periode_pembayaran_pendapatan['tahun']+(periode_pembayaran_pendapatan['id']!=periode['id']?'</span>':'') });
                    chart_pembayaran_pendapatan_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_pendapatan_periode.redraw();
                    
                    
                    //KLAIM RASIO PERIODE
                    //clear series
                    while(eval(chart_klaimrasio_periode.series.length) > 0) {
                        chart_klaimrasio_periode.series[0].remove(true);
                    }
                    
                    chart_klaimrasio_periode.addSeries({                        
                        name: 'Klaim Rasio',
                        type: 'areaspline',
                        color: '#0000ff',
                        data: data_klaimrasio,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    
                    chart_klaimrasio_periode.title.update({ text: 'Klaim Rasio Sampai Dengan Bulan '+(periode_pembayaran_pendapatan['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_pembayaran_pendapatan['bulan']+' '+periode_pembayaran_pendapatan['tahun']+(periode_pembayaran_pendapatan['id']!=periode['id']?'</span>':'') });
                    chart_klaimrasio_periode.xAxis[0].setCategories(arr, true, true);
                    chart_klaimrasio_periode.redraw();
                    
                    
                    var arr = [];
                    var data_jumlah = [];                   
                    var topics = data['klaim_rasio_per_segmen_jumlah'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_klaim_rasio_per_segmen_jumlah.series.length) > 0) {
                        chart_klaim_rasio_per_segmen_jumlah.series[0].remove(true);
                    }
                    
                    chart_klaim_rasio_per_segmen_jumlah.addSeries({                        
                        name: 'Biaya Manfaat',
                        type: 'bar',
                        color: '#884ea0',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#78281f'
                            }
                        }
                    }, false);
                    
                    chart_klaim_rasio_per_segmen_jumlah.title.update({ text: 'Biaya Manfaat sampai Bulan '+(periode_pembayaran_pendapatan['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_pembayaran_pendapatan['bulan']+' '+periode_pembayaran_pendapatan['tahun']+(periode_pembayaran_pendapatan['id']!=periode['id']?'</span>':'') });
                    chart_klaim_rasio_per_segmen_jumlah.xAxis[0].setCategories(arr, true, true);
                    chart_klaim_rasio_per_segmen_jumlah.redraw();
                    
                    var arr = [];
                    var data_persen = [];                   
                    var topics = data['klaim_rasio_per_segmen_persen'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama'];
                        data_persen[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_klaim_rasio_per_segmen_persen.series.length) > 0) {
                        chart_klaim_rasio_per_segmen_persen.series[0].remove(true);
                    }
                    
                    chart_klaim_rasio_per_segmen_persen.addSeries({                        
                        name: 'Rasio Pembayaran Biaya Manfaat',
                        type: 'bar',
                        color: '#5c4ea0',
                        data: data_persen,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#78281f'
                            }
                        }
                    }, false);
                    
                    chart_klaim_rasio_per_segmen_persen.title.update({ text: 'Rasio Pembayaran Biaya Manfaat sampai Bulan '+(periode_pembayaran_pendapatan['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_pembayaran_pendapatan['bulan']+' '+periode_pembayaran_pendapatan['tahun']+(periode_pembayaran_pendapatan['id']!=periode['id']?'</span>':'') });
                    chart_klaim_rasio_per_segmen_persen.xAxis[0].setCategories(arr, true, true);
                    chart_klaim_rasio_per_segmen_persen.redraw();
                    
                    
                    var arr = [];
                    var topics = data['rasio_likuiditas'];
                    
                    var data_rasio_likuiditas = [];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_rasio_likuiditas[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_rasio_likuiditas_periode.series.length) > 0) {
                        chart_rasio_likuiditas_periode.series[0].remove(true);
                    }
                    
                    chart_rasio_likuiditas_periode.addSeries({                        
                        name: 'Rasio Likuiditas',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_rasio_likuiditas,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    
                    chart_rasio_likuiditas_periode.title.update({ text: 'Rasio Likuiditas Sampai Dengan Bulan '+(periode_sum_3['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_sum_3['bulan']+' '+periode_sum_3['tahun']+(periode_sum_3['id']!=periode['id']?'</span>':'') });
                    chart_rasio_likuiditas_periode.xAxis[0].setCategories(arr, true, true);
                    chart_rasio_likuiditas_periode.redraw();
                    
                    
                    var arr = [];
                    var topics = data['cadangan_teknis_periode'];
                    
                    var data_cadangan_teknis_periode = [];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_cadangan_teknis_periode[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_cadangan_teknis_periode.series.length) > 0) {
                        chart_cadangan_teknis_periode.series[0].remove(true);
                    }
                    
                    chart_cadangan_teknis_periode.addSeries({                        
                        name: 'Cadangan Teknis',
                        type: 'areaspline',
                        color: '#0ff000',
                        data: data_cadangan_teknis_periode,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    
                    chart_cadangan_teknis_periode.title.update({ text: 'Cadangan Teknis Sampai Dengan Bulan '+(periode_sum_4['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_sum_4['bulan']+' '+periode_sum_4['tahun']+(periode_sum_4['id']!=periode['id']?'</span>':'') });
                    chart_cadangan_teknis_periode.xAxis[0].setCategories(arr, true, true);
                    chart_cadangan_teknis_periode.redraw();
                    
                    var arr = [];
                    var data_jumlah = [];                   
                    var topics = data['cadangan_teknis'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_cadangan_teknis.series.length) > 0) {
                        chart_cadangan_teknis.series[0].remove(true);
                    }
                    
                    chart_cadangan_teknis.addSeries({                        
                        name: 'Jumlah Cadangan Teknis',
                        type: 'bar',
                        color: '#884ea0',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#78281f'
                            }
                        }
                    }, false);
                    
                    chart_cadangan_teknis.title.update({ text: 'Cadangan Teknis Bulan '+(periode_sum_4['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_sum_4['bulan']+' '+periode_sum_4['tahun']+(periode_sum_4['id']!=periode['id']?'</span>':'') });
                    chart_cadangan_teknis.xAxis[0].setCategories(arr, true, true);
                    chart_cadangan_teknis.redraw();
                    
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
    
    var chart_pembayaran_pendapatan_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_pendapatan_periode'
        },
        title: {
            text: ' ',
            align: 'center'
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
            //min: 6000000000000,
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
                    return Highcharts.numberFormat(this.value/1000000000000, 2) + ' T';
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
            areaspline: {
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
                        color: '#fff'
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
    
    
    var chart_klaimrasio_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pendapatan_periode'
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
            //min: 4000000000000,
            title: {
                text: 'Klaim Rasio',
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
                    return Highcharts.numberFormat(this.value, 0)+ ' %';
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
            areaspline: {
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
                        color: '#fff'
                    }
                },
                showInLegend: false
            }
        },
        legend: {
            enabled: false,
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
    
    var chart_klaim_rasio_per_segmen_jumlah = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'klaim_rasio_per_segmen_jumlah'
        },
        title: {
            text: 'Biaya Manfaat',
            align: 'left'
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
            title: {
                text: 'Biaya Manfaat',
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
                    return Highcharts.numberFormat(this.value/1000000000000, 0)+' Trilyun';
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
            bar: {
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
                        fontSize: '14px'
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
    
    
    var chart_klaim_rasio_per_segmen_persen = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'klaim_rasio_per_segmen_persen'
        },
        title: {
            text: 'Rasio Pembayaran Biaya Manfaat',
            align: 'left'
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
            title: {
                text: 'Rasio Pembayaran Biaya Manfaat',
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
                    return Highcharts.numberFormat(this.value, 0)+' %';
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
            bar: {
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
                        fontSize: '14px'
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
    
    var chart_rasio_likuiditas_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'rasio_likuiditas_periode'
        },
        title: {
            text: 'Rasio Likuiditas',
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
            //min: 4000000000000,
            title: {
                text: 'Rasio Likuiditas',
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
                    return Highcharts.numberFormat(this.value, 0) + ' %';
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
            areaspline: {
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
                        color: '#fff'
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
    
    var chart_cadangan_teknis_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'cadangan_teknis_periode'
        },
        title: {
            text: ' ',
            align: 'center'
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
            min: 8000000000000,
            title: {
                text: 'Cadangan Teknis',
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
                    return Highcharts.numberFormat(this.value/1000000000000, 0) + ' T';
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
            areaspline: {
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
                        color: '#fff'
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
    
    var chart_cadangan_teknis = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'cadangan_teknis'
        },
        title: {
            text: ' ',
            align: 'center'
        },
        
        subtitle: {
            style: {
                display: 'none'
            }
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
                    return Highcharts.numberFormat(this.value/1000000000000, 2)+ ' T';
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
            bar: {
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
                        fontSize: '14px'
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
            thousandsSep: '.'
        }
    });
    
});