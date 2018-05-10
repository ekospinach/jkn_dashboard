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
            url: server+'/pelayanan/rate_kunjungan_android.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun+'&level='+level,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    var arr = [];
                    var data_rate_kunjungan = [];
                    var rate_kunjungan = data['rate_kunjungan'];
                    for(var key in rate_kunjungan) {
                        if(eval(rate_kunjungan[key]['jumlah'])>0) {
                            var i = arr.length;
                            arr[i] = rate_kunjungan[key]['nama'];
                            data_rate_kunjungan[i] = {y: eval(rate_kunjungan[key]['jumlah']), label: rate_kunjungan[key]['view_jumlah'], color: rate_kunjungan[key]['color']};
                        }
                    }

                    chart_rate_kunjungan.subtitle.update({ text: 'Utilization Rate at Primary Care Facility as of '+periode['bulan']+' '+periode['tahun'] });
                    chart_rate_kunjungan.xAxis[0].setCategories(arr, true, true);

                    chart_rate_kunjungan.series[0].setData(data_rate_kunjungan);
                    chart_rate_kunjungan.redraw(); 
                } else {

                }
                
                $("body").mLoading('hide');
                
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');                
            } 
        });    
    };
    
    
    var chart_rate_kunjungan = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'rate_kunjungan',
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
            tickInterval: 50,
            title: {
                text: 'Permil (‰)',
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
                            return this.point.label+ ' ‰';
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
            color: '#FF0000',
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