//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    var label_peserta = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun, level) {
        $("body").mLoading();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/kepesertaan/gender_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun+'&level='+level,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    //GENDER ALL
                    var data_gender_all = [];
                    var gender_all = data['gender_all'];
                    for(var key in gender_all) {
                        data_gender_all[key] = {name: gender_all[key]['nama'], y: eval(gender_all[key]['jumlah']), visible: eval(gender_all[key]['jumlah'])>0, color: gender_all[key]['color'], label: gender_all[key]['view_jumlah']};
                    }
                    chart_gender_all.series[0].setData(data_gender_all, true);
                    chart_gender_all.series[0].data[0].select();
                    chart_gender_all.subtitle.update({ text: ' as of '+periode['bulan']+' '+periode['tahun'] });
                    
                    if(label_peserta!==undefined) {
                        label_peserta.destroy();
                    }
                                        
                    label_peserta = chart_gender_all.renderer.label("Total Member: "+data['total'])
                    .css({
                        width: '300px',
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

                    label_peserta.align(Highcharts.extend(label_peserta.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    
                    chart_gender_all.redraw();
                                        
                    var arr = [];
                    var data_gender_bar_all_1 = [];
                    var data_gender_bar_all_2 = [];                    
                    var gender_bar_all = data['gender_bar_all'];
                    for(var key in gender_bar_all) {
                        if(eval(gender_bar_all[key]['laki_laki'])>0 || eval(gender_bar_all[key]['perempuan'])>0) {
                            var i = arr.length;
                            arr[i] = gender_bar_all[key]['segmen'];
                            data_gender_bar_all_1[i] = {y: eval(gender_bar_all[key]['laki_laki']), label: gender_bar_all[key]['laki_laki_view']};
                            data_gender_bar_all_2[i] = {y: eval(gender_bar_all[key]['perempuan']), label: gender_bar_all[key]['perempuan_view']};
                        }
                    }

                    chart_gender_bar_all.subtitle.update({ text: ' as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_gender_bar_all.xAxis[0].setCategories(arr, true, true);

                    chart_gender_bar_all.series[0].setData(data_gender_bar_all_1);
                    chart_gender_bar_all.series[1].setData(data_gender_bar_all_2);
                    chart_gender_bar_all.redraw();                                        
                                        
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
    var chart_gender_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'gender_all',
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
    
    var chart_gender_bar_all = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'gender_bar_all'
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
            enabled: true,
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
            name: 'MALE',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }, {
            name: 'FEMALE',
            color: '#AF00AF',
            colorByPoint: false,
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