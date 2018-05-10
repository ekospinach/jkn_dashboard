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
                var option = '<option value="0">Setahun</option>';
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
        //console.log('Tahun: '+tahun);
        //console.log('ID Periode: '+id_periode);
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receive_pembayaran",
            url: server+'/pembayaran/proporsi.php?lang='+lang+'&tahun='+tahun+'&id_periode='+id_periode,
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
                                        
                    //PEMBAYARAN FKTP
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['pembayaran_fktp'];
                    
                    for(var key in topics) {
                        arr[key] = topics[key]['nama_pembayaran'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_fktp.series.length) > 0) {
                        chart_pembayaran_fktp.series[0].remove(true);
                    }
                    
                    chart_pembayaran_fktp.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#148f77',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    if(topics[0]!=null) {
                        chart_pembayaran_fktp.title.update({ text: 'Pembayaran FKTP '+topics[0]['keterangan']+' Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                        chart_pembayaran_fktp.xAxis[0].setCategories(arr, true, true);
                        chart_pembayaran_fktp.redraw();
                    }
                    //PEMBAYARAN FKRTL
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['pembayaran_fkrtl'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama_pembayaran'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_fkrtl.series.length) > 0) {
                        chart_pembayaran_fkrtl.series[0].remove(true);
                    }
                    
                    chart_pembayaran_fkrtl.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#af601a',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    if(topics[0]!=null) {
                        chart_pembayaran_fkrtl.title.update({ text: 'Pembayaran FKRTL '+topics[0]['keterangan']+' Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                        chart_pembayaran_fkrtl.xAxis[0].setCategories(arr, true, true);
                        chart_pembayaran_fkrtl.redraw();
                    }
                    
                    //PEMBAYARAN PERIODE
                    var arr = [];
                    var topics = data['pembayaran_periode'];
                    
                    var data_fktp = [];
                    for(var key in topics['fktp']) {
                        arr[key] = topics['fktp'][key]['periode'];
                        data_fktp[key] = {y: eval(topics['fktp'][key]['jumlah']), label: topics['fktp'][key]['view_jumlah']};
                    }
                    var data_fkrtl = [];
                    var data_total = [];
                    for(var key in topics['fkrtl']) {
                        data_fkrtl[key]  = {y: eval(topics['fkrtl'][key]['jumlah']), label: topics['fkrtl'][key]['view_jumlah']};
                    }
                    
                    var data_total = [];
                    for(var key in topics['total']) {
                        data_total[key] = {y: eval(topics['total'][key]['jumlah']), label: topics['total'][key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_periode.series.length) > 0) {
                        chart_pembayaran_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_periode.addSeries({                        
                        name: 'FKTP',
                        type: 'areaspline',
                        color: '#f39c12',
                        data: data_fktp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_periode.addSeries({                        
                        name: 'FKRTL',
                        type: 'areaspline',
                        color: '#641e16',
                        data: data_fkrtl,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_periode.addSeries({                        
                        name: 'TOTAL',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_total,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_periode.title.update({ text: 'Perkembangan Total Pembayaran per Bulan sampai dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pembayaran_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_periode.redraw();
                    
                    
                    //PEMBAYARAN FKTP PERIODE
                    var arr = [];
                    
                    var topics = data['pembayaran_fktp_periode'];
                    
                    var data_rjtp = [];
                    for(var key in topics['rjtp']) {
                        arr[key] = topics['rjtp'][key]['periode'];
                        data_rjtp[key] = {y: eval(topics['rjtp'][key]['jumlah']), label: topics['rjtp'][key]['view_jumlah']};
                    }
                    var data_ritp = [];
                    var data_total = [];
                    for(var key in topics['ritp']) {
                        data_ritp[key]  = {y: eval(topics['ritp'][key]['jumlah']), label: topics['ritp'][key]['view_jumlah']};
                    }
                    
                    var data_total = [];
                    for(var key in topics['total']) {
                        data_total[key] = {y: eval(topics['total'][key]['jumlah']), label: topics['total'][key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_fktp_periode.series.length) > 0) {
                        chart_pembayaran_fktp_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_fktp_periode.addSeries({                        
                        name: 'RJTP',
                        type: 'areaspline',
                        color: '#f39c12',
                        data: data_rjtp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fktp_periode.addSeries({                        
                        name: 'RITP',
                        type: 'areaspline',
                        color: '#641e16',
                        data: data_ritp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fktp_periode.addSeries({                        
                        name: 'TOTAL',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_total,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fktp_periode.title.update({ text: 'Perkembangan Pembayaran FKTP per Bulan sampai dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pembayaran_fktp_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_fktp_periode.redraw();
                    
                    //PEMBAYARAN FKRTL PERIODE
                    var arr = [];
                    var topics = data['pembayaran_fkrtl_periode'];
                    var data_rjtp = [];
                    for(var key in topics['rjtp']) {
                        arr[key] = topics['rjtp'][key]['periode'];
                        data_rjtp[key] = {y: eval(topics['rjtp'][key]['jumlah']), label: topics['rjtp'][key]['view_jumlah']};
                    }
                    
                    var data_ritp = [];                    
                    for(var key in topics['ritp']) {
                        data_ritp[key] = {y: eval(topics['ritp'][key]['jumlah']), label: topics['ritp'][key]['view_jumlah']};
                    }
                    
                    var data_total = [];
                    for(var key in topics['total']) {
                        data_total[key] = {y: eval(topics['total'][key]['jumlah']), label: topics['total'][key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_fkrtl_periode.series.length) > 0) {
                        chart_pembayaran_fkrtl_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_fkrtl_periode.addSeries({                        
                        name: 'RJTL',
                        type: 'areaspline',
                        color: '#f39c12',
                        data: data_rjtp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fkrtl_periode.addSeries({                        
                        name: 'RITL',
                        type: 'areaspline',
                        color: '#641e16',
                        data: data_ritp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fkrtl_periode.addSeries({                        
                        name: 'TOTAL',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_total,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_fkrtl_periode.title.update({ text: 'Perkembangan Pembayaran FKRTL per Bulan sampai dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pembayaran_fkrtl_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_fkrtl_periode.redraw();
                    
                    
                    //PEMBAYARAN KLAIM RASIO PERIODE
                    var arr = [];
                    var topics = data['klaim_rasio_periode'];
                    var data_fktp = [];
                    for(var key in topics['fktp']) {
                        arr[key] = topics['fktp'][key]['periode'];
                        data_fktp[key] = {y: eval(topics['fktp'][key]['jumlah']), label: topics['fktp'][key]['view_jumlah']};
                    }
                    
                    var data_fkrtl = [];                    
                    for(var key in topics['fkrtl']) {
                        data_fkrtl[key] = {y: eval(topics['fkrtl'][key]['jumlah']), label: topics['fkrtl'][key]['view_jumlah']};
                    }
                    
                    var data_total = [];
                    for(var key in topics['total']) {
                        data_total[key] = {y: eval(topics['total'][key]['jumlah']), label: topics['total'][key]['view_jumlah']};
                    }
                    
                    var data_klaim = [];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_klaim[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_klaim_rasio_periode.series.length) > 0) {
                        chart_klaim_rasio_periode.series[0].remove(true);
                    }
                    
                   /* chart_klaim_rasio_periode.addSeries({                        
                        name: 'FKTP',
                        type: 'areaspline',
                        color: '#f39c12',
                        data: data_fktp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_klaim_rasio_periode.addSeries({                        
                        name: 'FKRTL',
                        type: 'areaspline',
                        color: '#641e16',
                        data: data_fkrtl,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);*/
                    
                    chart_klaim_rasio_periode.addSeries({                        
                        name: 'Klaim Rasio',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_total,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_klaim_rasio_periode.title.update({ text: 'Klaim Rasio Sampai Dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_klaim_rasio_periode.xAxis[0].setCategories(arr, true, true);
                    chart_klaim_rasio_periode.redraw();
                    
                    //PEMBAYARAN KAPITASI
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['pembayaran_kapitasi'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_kapitasi.series.length) > 0) {
                        chart_pembayaran_kapitasi.series[0].remove(true);
                    }
                    
                    chart_pembayaran_kapitasi.addSeries({                        
                        name: 'Jumlah Pembayaran',
                        type: 'bar',
                        color: '#7d6608',
                        data: data_jumlah,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#78281f'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_kapitasi.title.update({ text: "Pembayaran Kapitasi Bulan " + periode['bulan'] + " " + periode['tahun'] });
                    chart_pembayaran_kapitasi.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_kapitasi.redraw();
                    
                    //PEMBAYARAN UNITCOST
                    var arr = [];
                    var data_jumlah = [];
                    //var data_tumbuh = [];                    
                    var topics = data['pembayaran_unitcost'];
                    for(var key in topics) {
                        arr[key] = topics[key]['nama'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_unitcost.series.length) > 0) {
                        chart_pembayaran_unitcost.series[0].remove(true);
                    }
                    
                    chart_pembayaran_unitcost.addSeries({                        
                        name: 'Jumlah Unitcost',
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
                    
                    chart_pembayaran_unitcost.title.update({ text: "Pembayaran Unit Cost Bulan " + periode['bulan'] + " " + periode['tahun'] });
                    chart_pembayaran_unitcost.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_unitcost.redraw();
                    
                    //PEMBAYARAN KAPITASI PERIODE
                    var arr = [];
                    var topics = data['pembayaran_kapitasi_periode'];
                    var data_kapitasi = [];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_kapitasi[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_kapitasi_periode.series.length) > 0) {
                        chart_pembayaran_kapitasi_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_kapitasi_periode.addSeries({                        
                        name: 'TOTAL KAPITASI',
                        type: 'areaspline',
                        color: '#7d6608',
                        data: data_kapitasi,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_kapitasi_periode.title.update({ text: 'Perkembangan Pembayaran Kapitasi per Bulan sampai dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pembayaran_kapitasi_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_kapitasi_periode.redraw();
                    
                    //PEMBAYARAN UNITCOST PERIODE
                    var arr = [];
                    var topics = data['pembayaran_unitcost_periode'];
                    var data_rjtp = [];
                    for(var key in topics['rjtp']) {
                        arr[key] = topics['rjtp'][key]['periode'];
                        data_rjtp[key] = {y: eval(topics['rjtp'][key]['jumlah']), label: topics['rjtp'][key]['view_jumlah']};
                    }
                    
                    var data_ritp = [];                    
                    for(var key in topics['ritp']) {
                        data_ritp[key] = {y: eval(topics['ritp'][key]['jumlah']), label: topics['ritp'][key]['view_jumlah']};
                    }
                    
                    var data_total = [];
                    for(var key in topics['total']) {
                        data_total[key] = {y: eval(topics['total'][key]['jumlah']), label: topics['total'][key]['view_jumlah']};
                    }
                    
                    //clear series
                    while(eval(chart_pembayaran_unitcost_periode.series.length) > 0) {
                        chart_pembayaran_unitcost_periode.series[0].remove(true);
                    }
                    
                    chart_pembayaran_unitcost_periode.addSeries({                        
                        name: 'RJTL',
                        type: 'areaspline',
                        color: '#f39c12',
                        data: data_rjtp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_unitcost_periode.addSeries({                        
                        name: 'RITL',
                        type: 'areaspline',
                        color: '#641e16',
                        data: data_ritp,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_unitcost_periode.addSeries({                        
                        name: 'TOTAL',
                        type: 'areaspline',
                        color: '#ff0000',
                        data: data_total,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: '#17202a'
                            }
                        }
                    }, false);
                    
                    chart_pembayaran_unitcost_periode.title.update({ text: 'Perkembangan Rata-rata Besaran Pembayaran per Kasus Sampai Dengan Bulan ' + periode['bulan'] + ' ' + periode['tahun'] });
                    chart_pembayaran_unitcost_periode.xAxis[0].setCategories(arr, true, true);
                    chart_pembayaran_unitcost_periode.redraw();
                    
                    //10 CBG'S RJTL KASUS TERBANYAK
                    var arr = [];
                    var data_kasus = [];
                    var data_cbgs_rjtl_kasus = data['cbgs_rjtl_kasus'];
                    for(var key in data_cbgs_rjtl_kasus) {
                        if(eval(data_cbgs_rjtl_kasus[key]['kasus'])>0) {
                            var i = arr.length;
                            arr[i] = data_cbgs_rjtl_kasus[key]['nama_cbgs'];
                            data_kasus[i] = {y: eval(data_cbgs_rjtl_kasus[key]['kasus']), label: data_cbgs_rjtl_kasus[key]['view_kasus']};
                        }
                    }

                    //clear series
                    while(eval(chart_cbgs_rjtl_kasus.series.length) > 0) {
                        chart_cbgs_rjtl_kasus.series[0].remove(true);
                    }
                    
                    chart_cbgs_rjtl_kasus.addSeries({                        
                        name: 'Jumalah Kasus',
                        type: 'column',
                        color: ' #900C3F',
                        data: data_kasus,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '18px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: ' #581845 '
                            }
                        }
                    }, false);
                    
                    chart_cbgs_rjtl_kasus.title.update({ text: "10 CBG\'s Kasus Terbanyak pada RJTL Bulan " + periode['bulan'] + " " + periode['tahun'] });                            
                    chart_cbgs_rjtl_kasus.xAxis[0].setCategories(arr, true, true);
                    chart_cbgs_rjtl_kasus.series[0].setData(data_kasus);
                    chart_cbgs_rjtl_kasus.redraw();
                    
                    
                    
                    //10 CBG'S RJTL BIAYA TERBESAR
                    var arr = [];
                    var data_biaya = [];
                    var data_cbgs_rjtl_biaya = data['cbgs_rjtl_biaya'];
                    for(var key in data_cbgs_rjtl_biaya) {
                        if(eval(data_cbgs_rjtl_biaya[key]['biaya'])>0) {
                            var i = arr.length;
                            arr[i] = data_cbgs_rjtl_biaya[key]['nama_cbgs'];
                            data_biaya[i] = {y: eval(data_cbgs_rjtl_biaya[key]['biaya']), label: data_cbgs_rjtl_biaya[key]['view_biaya']};
                        }
                    }
                    
                    //clear series
                    while(eval(chart_cbgs_rjtl_biaya.series.length) > 0) {
                        chart_cbgs_rjtl_biaya.series[0].remove(true);
                    }
                    
                    chart_cbgs_rjtl_biaya.addSeries({                        
                        name: 'Jumlah Biaya',
                        type: 'column',
                        color: '#1d8348',
                        data: data_biaya,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: ' #145a32 '
                            }
                        }
                    }, false);
                    
                    chart_cbgs_rjtl_biaya.title.update({ text: "Biaya 10 CBG\'s Kasus Terbanyak pada RJTL Bulan " + periode['bulan'] + " " + periode['tahun'] });                            
                    chart_cbgs_rjtl_biaya.xAxis[0].setCategories(arr, true, true);
                    chart_cbgs_rjtl_biaya.series[0].setData(data_biaya);
                    chart_cbgs_rjtl_biaya.redraw();
                    
                    
                    //10 CBG'S RITL KASUS TERBANYAK
                    var arr = [];
                    var data_kasus = [];
                    var data_cbgs_ritl_kasus = data['cbgs_ritl_kasus'];
                    for(var key in data_cbgs_ritl_kasus) {
                        if(eval(data_cbgs_ritl_kasus[key]['kasus'])>0) {
                            var i = arr.length;
                            arr[i] = data_cbgs_ritl_kasus[key]['nama_cbgs'];
                            data_kasus[i] = {y: eval(data_cbgs_ritl_kasus[key]['kasus']), label: data_cbgs_ritl_kasus[key]['view_kasus']};
                        }
                    }

                    //clear series
                    while(eval(chart_cbgs_ritl_kasus.series.length) > 0) {
                        chart_cbgs_ritl_kasus.series[0].remove(true);
                    }
                    
                    chart_cbgs_ritl_kasus.addSeries({                        
                        name: 'Jumalah Kasus',
                        type: 'column',
                        color: ' #900C3F',
                        data: data_kasus,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '18px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: ' #581845 '
                            }
                        }
                    }, false);
                    
                    chart_cbgs_ritl_kasus.title.update({ text: "10 CBG\'s Kasus Terbanyak pada RITL Bulan " + periode['bulan'] + " " + periode['tahun'] });                            
                    chart_cbgs_ritl_kasus.xAxis[0].setCategories(arr, true, true);
                    chart_cbgs_ritl_kasus.series[0].setData(data_kasus);
                    chart_cbgs_ritl_kasus.redraw();
                    
                    //10 CBG'S RITL BIAYA TERBESAR
                    var arr = [];
                    var data_biaya = [];
                    var data_cbgs_ritl_biaya = data['cbgs_ritl_biaya'];
                    for(var key in data_cbgs_ritl_biaya) {
                        if(eval(data_cbgs_ritl_biaya[key]['biaya'])>0) {
                            var i = arr.length;
                            arr[i] = data_cbgs_ritl_biaya[key]['nama_cbgs'];
                            data_biaya[i] = {y: eval(data_cbgs_ritl_biaya[key]['biaya']), label: data_cbgs_ritl_biaya[key]['view_biaya']};
                        }
                    }
                    
                    //clear series
                    while(eval(chart_cbgs_ritl_biaya.series.length) > 0) {
                        chart_cbgs_ritl_biaya.series[0].remove(true);
                    }
                    
                    chart_cbgs_ritl_biaya.addSeries({                        
                        name: 'Jumlah Biaya',
                        type: 'column',
                        color: '#1d8348',
                        data: data_biaya,
                        dataLabels: {
                            allowOverlap: true,
                            style: {
                                fontSize: '16px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                                color: ' #145a32 '
                            }
                        }
                    }, false);
                    
                    chart_cbgs_ritl_biaya.title.update({ text: "Biaya 10 CBG\'s Kasus Terbanyak pada RITL Bulan " + periode['bulan'] + " " + periode['tahun'] });                            
                    chart_cbgs_ritl_biaya.xAxis[0].setCategories(arr, true, true);
                    chart_cbgs_ritl_biaya.series[0].setData(data_biaya);
                    chart_cbgs_ritl_biaya.redraw();
                    
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
    
    
    var chart_pembayaran_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pembayaran_fktp'
        },
        title: {
            text: 'Pembayaran FKTP',
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
                    fontSize: '12pt',
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
                    fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value/1000000000000, 2) + " T";
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
    
    var chart_pembayaran_fkrtl = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pembayaran_fkrtl'
        },
        title: {
            text: 'Pembayaran FKRTL',
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
                    fontSize: '12pt',
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
                    fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                //rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(this.value/1000000000000, 2) + " T";
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
    
    
    var chart_pembayaran_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_periode'
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
            //min: 1000000000000, 
            title: {
                text: 'Jumlah Pembayaran',
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
    
    var chart_pembayaran_fktp_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_fktp_periode'
        },
        title: {
            text: 'Pembayaran FKTP',
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
            title: {
                text: 'Jumlah Pembayaran',
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
    
    var chart_pembayaran_fkrtl_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_fkrtl_periode'
        },
        title: {
            text: 'Pembayaran FKRTL',
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
            title: {
                text: 'Jumlah Pembayaran',
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
    
    
    var chart_klaim_rasio_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'klaim_rasio_periode'
        },
        title: {
            text: 'Pembayaran Kapitasi',
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
            //min: 990000,
            title: {
                text: 'Jumlah Klaim Rasio',
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
    
    var chart_pembayaran_kapitasi = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'pembayaran_kapitasi'
        },
        title: {
            text: 'Pembayaran Kapitasi',
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
                    return Highcharts.numberFormat(this.value/1000, 0)+' M';
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
    
    var chart_pembayaran_unitcost = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'pembayaran_unitcost'
        },
        title: {
            text: 'Pembayaran Unit Cost',
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
                text: 'Jumlah Unitcost',
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                rotation: -45,
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
    
    
    var chart_pembayaran_kapitasi_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_kapitasi_periode'
        },
        title: {
            text: 'Pembayaran Kapitasi',
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
            //min: 990000,
            title: {
                text: 'Jumlah Pembayaran',
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
                    return Highcharts.numberFormat(this.value/1000000, 2) + ' T';
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
    
    var chart_pembayaran_unitcost_periode = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            renderTo: 'pembayaran_unitcost_periode'
        },
        title: {
            text: 'Pembayaran Unitcost',
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
            title: {
                text: 'Jumlah Pembayaran',
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
    
    var chart_cbgs_rjtl_kasus = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'cbgs_rjtl_kasus'
        },
        title: {
            text: '10 CBG\'s Kasus Terbanyak pada RJTL',
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
                text: 'Jumlah Kasus',
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
    
    var chart_cbgs_rjtl_biaya = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'cbgs_rjtl_biaya'
        },
        title: {
            text: '10 CBG\'s Biaya Terbesar pada RJTL',
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
                text: 'Jumlah Biaya',
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
                    return Highcharts.numberFormat(this.value/1000000000, 0)+ ' M';
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
    
    var chart_cbgs_ritl_kasus = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'cbgs_ritl_kasus'
        },
        title: {
            text: '10 CBG\'s Kasus Terbanyak pada RITL',
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
                text: 'Jumlah Kasus',
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
    
    var chart_cbgs_ritl_biaya = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'cbgs_ritl_biaya'
        },
        title: {
            text: '10 CBG\'s Biaya Terbesar pada RITL',
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
                text: 'Jumlah Biaya',
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
                    return Highcharts.numberFormat(this.value/1000000000, 0)+ ' M';
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
            thousandsSep: '.'
        }
    });
    
});