//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    
    var load_data = function(periode, propinsi, kabupaten, tahun, level) {
        $("body").mLoading();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/pelayanan/rasio_rujukan_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun+'&level='+level,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    var arr = [];
                    var data_rasio_rujukan = [];
                    var rasio_rujukan = data['rasio_rujukan'];
                    for(var key in rasio_rujukan) {
                        if(eval(rasio_rujukan[key]['jumlah'])>0) {
                            var i = arr.length;
                            arr[i] = rasio_rujukan[key]['nama'];
                            data_rasio_rujukan[i] = {y: eval(rasio_rujukan[key]['jumlah']), label: rasio_rujukan[key]['view_jumlah'], color: rasio_rujukan[key]['color']};
                        }
                    }

                    chart_rasio_rujukan.subtitle.update({ text: 'Referral Ratio at Primary Care Facility as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_rasio_rujukan.xAxis[0].setCategories(arr, true, true);

                    chart_rasio_rujukan.series[0].setData(data_rasio_rujukan);
                    chart_rasio_rujukan.redraw(); 
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
    var chart_rasio_rujukan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'rasio_rujukan',
            marginTop: 50
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
            gridLineWidth: 1,
            tickInterval: 10,
            title: {
                text: 'Persen (%)',
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
                            return this.point.label+ ' %';
                        //}
                    },
                    y: 2,
                    //color: '#ffff00',
                    outside: true,
                    align: 'left',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
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