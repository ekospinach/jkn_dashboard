//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    var label_populasi = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun, level) {
        $("body").mLoading();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/kepesertaan/proporsi_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun+'&level='+level,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    //PROPORSI ALL
                    var data_proporsi_all = [];
                    var proporsi_all = data['proporsi_all'];
                    for(var key in proporsi_all) {
                        data_proporsi_all[key] = {name: proporsi_all[key]['nama'], y: eval(proporsi_all[key]['jumlah']), visible: eval(proporsi_all[key]['jumlah'])>0, color: proporsi_all[key]['color'], label: proporsi_all[key]['view_jumlah']};
                    }
                    chart_proporsi_all.series[0].setData(data_proporsi_all, true);
                    chart_proporsi_all.series[0].data[0].select();
                    chart_proporsi_all.subtitle.update({ text: ' as of '+periode['bulan']+' '+periode['tahun'] });
                    
                    var populasi = data['populasi'];                    
                    if(label_populasi!==undefined) {
                        label_populasi.destroy();
                    }
                    
                    label_populasi = chart_proporsi_all.renderer.label("Population: "+populasi)
                    .css({
                        width: '170px',
                        color: '#333',
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

                    label_populasi.align(Highcharts.extend(label_populasi.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    
                    chart_proporsi_all.redraw();
                                        
                    var arr = [];
                    var data_proporsi_bar_all = [];
                    var proporsi_bar_all = data['proporsi_bar_all'];
                    for(var key in proporsi_bar_all) {
                        if(eval(proporsi_bar_all[key]['jumlah'])>0) {
                            var i = arr.length;
                            arr[i] = proporsi_bar_all[key]['nama'];
                            data_proporsi_bar_all[i] = {y: eval(proporsi_bar_all[key]['jumlah']), label: proporsi_bar_all[key]['view_jumlah'], color: proporsi_bar_all[key]['color']};
                        }
                    }

                    chart_proporsi_bar_all.subtitle.update({ text: ' as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_bar_all.xAxis[0].setCategories(arr, true, true);

                    chart_proporsi_bar_all.series[0].setData(data_proporsi_bar_all);
                    chart_proporsi_bar_all.redraw();                                        
                                        
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
    var chart_proporsi_bar_all = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'proporsi_bar_all'
        },
        title: {
            text: ' ',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: ' '
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
            gridLineWidth: 0,
            tickInterval: 10,
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
                enabled: false,
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(eval(this.value), 0);
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
            enabled: false,
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            bar: {
                allowPointSelect: true,
                cursor: 'pointer',
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
                    y: 2,
                    //color: '#ffff00',
                    outside: true,
                    align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
                    }
                },
                showInLegend: true
            }
        }, 
        legend: {
            enabled: false,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            y: 50,
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
        series: [{
            name: 'Rasio Rujukan',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_proporsi_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_all',
            marginTop: -40
        },
        title: {
            text: ' ',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            enabled: false,
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -20,
                    
                    color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
                    }
                },
                showInLegend: true
            }
        }, 
        legend: {
            enabled: false,
            layout: 'vertical',
            verticalAlign: 'middle',
            align:'right',
            x: -50,
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
        series: [{
            colorByPoint: true,
            data: []
        }]
    });
    
    load_data(0, 0, 0, 2017, 3);
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: '.'
        }
    });
    
});