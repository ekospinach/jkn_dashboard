//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    var label_pertumbuhan_all = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun) {
        $("body").mLoading();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/kepesertaan/pertumbuhan_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    
                    //PERTUMBUHAN JUMLAH PESERTA
                    var arr = [];
                    var data_jumlah = [];
                    var data_tumbuh = [];                    
                    var topics = data['pertumbuhan_jumlah_peserta'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                        data_tumbuh[key] = {y: eval(topics[key]['persentase']), label: topics[key]['view_persentase']};
                    }
                    
                    //clear series
                    while(eval(chart_pertumbuhan_jumlah_peserta.series.length) > 0) {
                        chart_pertumbuhan_jumlah_peserta.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_jumlah_peserta.addSeries({                        
                        name: 'Total',
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
                    
                    
                    if(label_pertumbuhan_all!==undefined) {
                        label_pertumbuhan_all.destroy();
                    }
                    
                    label_pertumbuhan_all = chart_pertumbuhan_jumlah_peserta.renderer.label("Av growth: "+($('#select_bulan').val()==0?" Rata-rata":"")+": "+ summary['pertumbuhan'])
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

                    label_pertumbuhan_all.align(Highcharts.extend(label_pertumbuhan_all.getBBox(), {
                        align: 'left',
                        x: 80, // offset
                        verticalAlign: 'top',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    
                    
                    chart_pertumbuhan_jumlah_peserta.addSeries({                        
                        name: 'Growth',
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
                    }, false);
                    
                    //chart_pertumbuhan_jumlah_peserta.subtitle.update({ text: "Pertumbuhan Jumlah Peserta" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_pertumbuhan_jumlah_peserta.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_jumlah_peserta.redraw();                                        
                                        
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
    var chart_pertumbuhan_jumlah_peserta = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'pertumbuhan_jumlah_peserta',
            marginTop: 0
        },
        title: {
            text: ' ',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        xAxis: {
            categories: [],
            crosshair: true,
            //gridLineWidth: 1,
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
            min: 170000000,
            //max: 190000000,
            tickInterval: 1000000,
            title: {
                text: 'Total',
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
                    return Highcharts.numberFormat(this.value/1000000, 0) + ' Mio';
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }, {
            //min: 0,
            //max: 4,
            tickInterval: 1,
            title: {
                text: 'Growth',
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
                    return Highcharts.numberFormat(this.value, 1)+' %';
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            opposite: true
        }],
        tooltip: {
            enabled: false,
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
                    verticalAlign: 'top',
                    align: 'center',
                    y:-30,
                    //rotation: -90,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
                    }
                },
                showInLegend: true
            },
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
            itemMarginTop: -5,
            x: 30,
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
    
    load_data(0, 0, 0, 2017);
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: '.'
        }
    });
    
});