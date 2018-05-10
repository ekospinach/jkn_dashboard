//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    var label_total = undefined;
    var label_total_fktp = undefined;
    var label_total_fktl = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun, level) {
        $("body").mLoading();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/pelayanan/proporsi_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun+'&level='+level,
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
                    
                    if(label_total!==undefined) {
                        label_total.destroy();
                    }
                    
                    label_total = chart_proporsi_all.renderer.label("Total: "+data['total'])
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

                    label_total.align(Highcharts.extend(label_total.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    
                    chart_proporsi_all.redraw();
                                        
                    var arr = [];
                    var data_proporsi_fktp_all = [];
                    var proporsi_fktp_all = data['proporsi_fktp_all'];
                    var total_fktp = 0;
                    for(var key in proporsi_fktp_all) {
                        if(eval(proporsi_fktp_all[key]['jumlah'])>0) {
                            var i = arr.length;
                            arr[i] = proporsi_fktp_all[key]['nama'];
                            data_proporsi_fktp_all[i] = {y: eval(proporsi_fktp_all[key]['jumlah']), label: proporsi_fktp_all[key]['view_jumlah'], color: proporsi_fktp_all[key]['color']};
                            total_fktp += eval(proporsi_fktp_all[key]['jumlah']);
                        }
                    }

                    chart_proporsi_fktp_all.subtitle.update({ text: 'Primary Care Facility (FKTP) as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_fktp_all.xAxis[0].setCategories(arr, true, true);

                    chart_proporsi_fktp_all.series[0].setData(data_proporsi_fktp_all);
                    
                    if(label_total_fktp!==undefined) {
                        label_total_fktp.destroy();
                    }
                    
                    label_total_fktp = chart_proporsi_fktp_all.renderer.label("Total FKTP: "+(total_fktp+"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))
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

                    label_total_fktp.align(Highcharts.extend(label_total_fktp.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    chart_proporsi_fktp_all.redraw();                                        

                    
                    var arr = [];
                    var data_proporsi_fktl_all = [];
                    var proporsi_fktl_all = data['proporsi_fktl_all'];
                    var total_fktl = 0;
                    for(var key in proporsi_fktl_all) {
                        if(eval(proporsi_fktl_all[key]['jumlah'])>0) {
                            var i = arr.length;
                            arr[i] = proporsi_fktl_all[key]['nama'];
                            data_proporsi_fktl_all[i] = {y: eval(proporsi_fktl_all[key]['jumlah']), label: proporsi_fktl_all[key]['view_jumlah'], color: proporsi_fktl_all[key]['color']};
                            total_fktl += eval(proporsi_fktl_all[key]['jumlah']);
                        }
                    }

                    chart_proporsi_fktl_all.subtitle.update({ text: 'Referral Health Facility (FKTL) as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_fktl_all.xAxis[0].setCategories(arr, true, true);

                    chart_proporsi_fktl_all.series[0].setData(data_proporsi_fktl_all);
                    if(label_total_fktl!==undefined) {
                        label_total_fktl.destroy();
                    }
                    
                    label_total_fktl = chart_proporsi_fktl_all.renderer.label("Total FKTL: "+(total_fktl+"").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))
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

                    label_total_fktl.align(Highcharts.extend(label_total_fktl.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom',
                        y: 0 // offset
                    }), null, 'spacingBox');
                    chart_proporsi_fktl_all.redraw(); 
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
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
    
    var chart_proporsi_fktp_all = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'proporsi_fktp_all',
            marginBottom: 90
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
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_proporsi_fktl_all = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'proporsi_fktl_all',
            marginBottom: 90
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
            color: '#0000FF',
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