$(function () {    
    var label_jumlah_fktl_fktp = undefined;
    var label_jumlah_fktp = undefined;
    var label_jumlah_fktl = undefined;
    var label_proporsi_rs_berdasarkan_kelas = undefined;
    var label_proporsi_rs_berdasarkan_tingkat = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun) {
        $("body").mLoading();
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/pelayanan/proporsi.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    
                    var periode = data['periode'];
                    var periode_sum = data['periode_sum'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    $('#jumlah').text(summary['jumlah']);
                    $('#kunjungan').text(summary['kunjungan_fktp']);
                    $('#rujukan').text(summary['rujukan_fktp']);
                    $('#rasio_rujukan').text(summary['rasio_rujukan_fktp']);
                    
                    if(periode_sum['id']==periode['id']) {
                        $('#summary_bulan_kunjungan').hide();
                        $('#summary_bulan_rujukan').hide();
                        $('#summary_bulan_rasio_rujukan').hide();
                    } else {
                        $('#summary_bulan_kunjungan').show();
                        $('#summary_bulan_rujukan').show();
                        $('#summary_bulan_rasio_rujukan').show();
                        $('#text_summary_bulan_kunjungan').text(periode_sum['bulan']+' '+periode_sum['tahun']);
                        $('#text_summary_bulan_rujukan').text(periode_sum['bulan']+' '+periode_sum['tahun']);
                        $('#text_summary_bulan_rasio_rujukan').text(periode_sum['bulan']+' '+periode_sum['tahun']);
                    }
                    
                    //PROPORSI FKRTL FKTP DAN APOTIK
                    var jumlah_fktl = 0;
                    var jumlah_fktp = 0;
                    var jumlah_fktl_fktp = data['jumlah_fktl_fktp'];
                    var data_proporsi_fktl_fktp = [];
                    var proporsi_fktl_fktp = data['proporsi_fktl_fktp'];
                    for(var key in proporsi_fktl_fktp) {
                        if(key==0) { jumlah_fktp = proporsi_fktl_fktp[key]['view_jumlah']; }
                        if(key==1) { jumlah_fktl = proporsi_fktl_fktp[key]['view_jumlah']; }
                        data_proporsi_fktl_fktp[key] = {name: proporsi_fktl_fktp[key]['nama'], y: eval(proporsi_fktl_fktp[key]['jumlah']), visible: eval(proporsi_fktl_fktp[key]['jumlah'])>0, color: proporsi_fktl_fktp[key]['color'], label: proporsi_fktl_fktp[key]['view_jumlah']};
                    }
                    
                    if(label_jumlah_fktl_fktp!==undefined) {
                        label_jumlah_fktl_fktp.destroy();
                    }
                    
                    label_jumlah_fktl_fktp = chart_proporsi_fktl_fktp.renderer.label('<table>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah FKTP:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_fktp+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah FKRTL:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_fktl+'</td></tr>'+
                            '<tr style="border-top: thin solid;"><td style="padding-top: 3px;"><b><i>TOTAL Faskes:</i></b>&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-top: 3px;"><b><i>'+jumlah_fktl_fktp+'</i></b></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '310px',
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
                
                    label_jumlah_fktl_fktp.align(Highcharts.extend(label_jumlah_fktl_fktp.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'top',
                        y: 70 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_fktl_fktp.series[0].setData(data_proporsi_fktl_fktp, true);
                    chart_proporsi_fktl_fktp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_fktl_fktp.redraw();
                    
                    //PERTUMBUHAN FKRTL
                    var arr = [];
                    var data_jumlah = [];
                    var data_tumbuh = [];                    
                    var topics = data['pertumbuhan_faskes_fktl'];
                    var min_jumlah = 0;
                    var min_tumbuh = 0;
                    //console.log(topics);
                    for(var key in topics) {
                        if(key==0) {
                            min_jumlah = eval(topics[key]['jumlah']);
                            min_tumbuh = eval(topics[key]['persentase']);
                        }
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                        data_tumbuh[key] = {y: eval(topics[key]['persentase']), label: topics[key]['view_persentase']};
                        
                        min_jumlah = eval(topics[key]['jumlah'])<min_jumlah?eval(topics[key]['jumlah']):min_jumlah;
                        min_tumbuh = eval(topics[key]['persentase'])<min_tumbuh?eval(topics[key]['persentase']):min_tumbuh;
                    }
                    
                    while(eval(chart_pertumbuhan_faskes_fktl.series.length) > 0) {
                        chart_pertumbuhan_faskes_fktl.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_faskes_fktl.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah
                    }, false);
                    
                    chart_pertumbuhan_faskes_fktl.addSeries({                        
                        name: 'Pertumbuhan',
                        type: 'areaspline',
                        color: '#0000FF',
                        yAxis: 1,
                        data: data_tumbuh
                    }, false);
                    
                    chart_pertumbuhan_faskes_fktl.yAxis[0].setExtremes(min_jumlah, null);
                    chart_pertumbuhan_faskes_fktl.yAxis[1].setExtremes(min_tumbuh, null);
                    

                    chart_pertumbuhan_faskes_fktl.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_pertumbuhan_faskes_fktl.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_faskes_fktl.redraw();
                    //chart_pertumbuhan_faskes_fktl.series[0].setData(data_pertumbuhan_fktl);
                                        
                    
                    //PERTUMBUHAN FKTP
                    var arr = [];
                    var data_jumlah = [];
                    var data_tumbuh = [];                    
                    var topics = data['pertumbuhan_faskes_fktp'];
                    var min_jumlah = 0;
                    var min_tumbuh = 0;
                    
                    for(var key in topics) {
                        if(key==0) {
                            min_jumlah = eval(topics[key]['jumlah']);
                            min_tumbuh = eval(topics[key]['persentase']);
                        }
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                        data_tumbuh[key] = {y: eval(topics[key]['persentase']), label: topics[key]['view_persentase']};
                        
                        min_jumlah = eval(topics[key]['jumlah'])<min_jumlah?eval(topics[key]['jumlah']):min_jumlah;
                        min_tumbuh = eval(topics[key]['persentase'])<min_tumbuh?eval(topics[key]['persentase']):min_tumbuh;
                    }
                    
                    while(eval(chart_pertumbuhan_faskes_fktp.series.length) > 0) {
                        chart_pertumbuhan_faskes_fktp.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_faskes_fktp.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah
                    }, false);
                    
                    chart_pertumbuhan_faskes_fktp.addSeries({                        
                        name: 'Pertumbuhan',
                        type: 'areaspline',
                        color: '#0000FF',
                        yAxis: 1,
                        data: data_tumbuh
                    }, false);
                    
                    chart_pertumbuhan_faskes_fktp.yAxis[0].setExtremes(min_jumlah, null);
                    chart_pertumbuhan_faskes_fktp.yAxis[1].setExtremes(min_tumbuh, null);
                    

                    chart_pertumbuhan_faskes_fktp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_pertumbuhan_faskes_fktp.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_faskes_fktp.redraw();
                    
                    //PROPORSI FKTP
                    var jumlah_puskesmas = 0;
                    var jumlah_dokter_praktek = 0;
                    var jumlah_klinik_pratama = 0;
                    var jumlah_rs_kelas_d = 0;
                    var jumlah_lainnya = 0;
                    
                    var data_proporsi_fktp = [];
                    var proporsi_fktp = data['proporsi_fktp'];
                    for(var key in proporsi_fktp) {
                        if(key==0) { jumlah_puskesmas = proporsi_fktp[key]['view_jumlah']; }
                        if(key==1) { jumlah_dokter_praktek = proporsi_fktp[key]['view_jumlah']; }
                        if(key==2) { jumlah_klinik_pratama = proporsi_fktp[key]['view_jumlah']; }
                        if(key==3) { jumlah_rs_kelas_d = proporsi_fktp[key]['view_jumlah']; }
                        if(key==4) { jumlah_lainnya = proporsi_fktp[key]['view_jumlah']; }
                        
                        data_proporsi_fktp[key] = {name: proporsi_fktp[key]['nama'], y: eval(proporsi_fktp[key]['jumlah']), visible: eval(proporsi_fktp[key]['jumlah'])>0, color: proporsi_fktp[key]['color'], label: proporsi_fktp[key]['view_jumlah']};
                    }
                    
                    if(label_jumlah_fktp!==undefined) {
                        label_jumlah_fktp.destroy();
                    }
                    
                    label_jumlah_fktp = chart_proporsi_fktp.renderer.label('<table>'+
                            '<tr><td style="padding-bottom: 2px;">Puskesmas:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_puskesmas+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Dokter Praktek:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_dokter_praktek+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Klinin Pratama:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_klinik_pratama+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS Kelas D:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_rs_kelas_d+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Dr. gigi praktek mandiri:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_lainnya+'</td></tr>'+
                            '<tr style="border-top: thin solid;"><td style="padding-top: 3px;"><b><i>TOTAL FKTP:</i></b>&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-top: 3px;"><b><i>'+jumlah_fktp+'</i></b></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '310px',
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
                
                    label_jumlah_fktp.align(Highcharts.extend(label_jumlah_fktp.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 30 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_fktp.series[0].setData(data_proporsi_fktp, true);
                    chart_proporsi_fktp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_fktp.redraw();
                    
                    //PROPORSI FKRTL
                    var jumlah_pemerintah = 0;
                    var jumlah_swasta = 0;
                    var jumlah_tni = 0;
                    var jumlah_polri = 0;
                    var jumlah_non_jiwa = 0;
                    var jumlah_jiwa = 0;
                    var jumlah_klinik_utama = 0;
                    
                    var data_proporsi_fktl = [];
                    var proporsi_fktl = data['proporsi_fktl'];
                    for(var key in proporsi_fktl) {
                        if(key==0) { jumlah_pemerintah = proporsi_fktl[key]['view_jumlah']; }
                        if(key==1) { jumlah_swasta = proporsi_fktl[key]['view_jumlah']; }
                        if(key==2) { jumlah_tni = proporsi_fktl[key]['view_jumlah']; }
                        if(key==3) { jumlah_polri = proporsi_fktl[key]['view_jumlah']; }
                        if(key==4) { jumlah_non_jiwa = proporsi_fktl[key]['view_jumlah']; }
                        if(key==5) { jumlah_jiwa = proporsi_fktl[key]['view_jumlah']; }
                        if(key==6) { jumlah_klinik_utama = proporsi_fktl[key]['view_jumlah']; }
                        
                        data_proporsi_fktl[key] = {name: proporsi_fktl[key]['nama'], y: eval(proporsi_fktl[key]['jumlah']), visible: eval(proporsi_fktl[key]['jumlah'])>0, color: proporsi_fktl[key]['color'], label: proporsi_fktl[key]['view_jumlah']};
                    }
                    
                    if(label_jumlah_fktl!==undefined) {
                        label_jumlah_fktl.destroy();
                    }
                    
                    label_jumlah_fktl = chart_proporsi_fktl.renderer.label('<table>'+
                            '<tr><td style="padding-bottom: 2px;">RS Pemeritah:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_pemerintah+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS Swasta:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_swasta+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS TNI:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_tni+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS POLRI:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_polri+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS Khusus Non Jiwa:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_non_jiwa+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">RS Khusus Jiwa:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_jiwa+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Klinik Utama:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_klinik_utama+'</td></tr>'+
                            '<tr style="border-top: thin solid;"><td style="padding-top: 3px;"><b><i>TOTAL FKRTL:</i></b>&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-top: 3px;"><b><i>'+data['proporsi_fktl_total']+'</i></b></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '310px',
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
                
                    label_jumlah_fktl.align(Highcharts.extend(label_jumlah_fktl.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 25 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_fktl.series[0].setData(data_proporsi_fktl, true);
                    chart_proporsi_fktl.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_fktl.redraw();
                    
                    
                    //PROPORSI RS BERDASARKAN KELAS
                    var jumlah_kelas_a = 0;
                    var jumlah_kelas_b = 0;
                    var jumlah_kelas_c = 0;
                    var jumlah_kelas_d = 0;
                    
                    var data_proporsi_rs_berdasarkan_kelas = [];
                    var proporsi_rs_berdasarkan_kelas = data['proporsi_rs_berdasarkan_kelas'];
                    for(var key in proporsi_rs_berdasarkan_kelas) {
                        if(key==0) { jumlah_kelas_a = proporsi_rs_berdasarkan_kelas[key]['view_jumlah']; }
                        if(key==1) { jumlah_kelas_b = proporsi_rs_berdasarkan_kelas[key]['view_jumlah']; }
                        if(key==2) { jumlah_kelas_c = proporsi_rs_berdasarkan_kelas[key]['view_jumlah']; }
                        if(key==3) { jumlah_kelas_d = proporsi_rs_berdasarkan_kelas[key]['view_jumlah']; }
                        
                        data_proporsi_rs_berdasarkan_kelas[key] = {name: proporsi_rs_berdasarkan_kelas[key]['nama'], y: eval(proporsi_rs_berdasarkan_kelas[key]['jumlah']), visible: eval(proporsi_rs_berdasarkan_kelas[key]['jumlah'])>0, color: proporsi_rs_berdasarkan_kelas[key]['color'], label: proporsi_rs_berdasarkan_kelas[key]['view_jumlah']};
                    }
                    
                    if(label_proporsi_rs_berdasarkan_kelas!==undefined) {
                        label_proporsi_rs_berdasarkan_kelas.destroy();
                    }
                    
                    label_proporsi_rs_berdasarkan_kelas = chart_proporsi_rs_berdasarkan_kelas.renderer.label('<table>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Kelas A:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_kelas_a+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Kelas B:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_kelas_b+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Kelas C:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_kelas_c+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Kelas D:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_kelas_d+'</td></tr>'+
                            '<tr style="border-top: thin solid;"><td style="padding-top: 3px;"><b><i>Total Rumah Sakit:</i></b>&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-top: 3px;"><b><i>'+data['proporsi_rs_berdasarkan_kelas_total']+'</i></b></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '310px',
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
                
                    label_proporsi_rs_berdasarkan_kelas.align(Highcharts.extend(label_jumlah_fktl.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 20 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_rs_berdasarkan_kelas.series[0].setData(data_proporsi_rs_berdasarkan_kelas, true);
                    chart_proporsi_rs_berdasarkan_kelas.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_rs_berdasarkan_kelas.redraw();
                    
                    //PROPORSI RS BERDASARKAN TINGKAT
                    var jumlah_tingkat_1 = 0;
                    var jumlah_tingkat_2 = 0;
                    var jumlah_tingkat_3 = 0;
                    var jumlah_tingkat_4 = 0;
                    
                    var data_proporsi_rs_berdasarkan_tingkat = [];
                    var proporsi_rs_berdasarkan_tingkat = data['proporsi_rs_berdasarkan_tingkat'];
                    for(var key in proporsi_rs_berdasarkan_tingkat) {
                        if(key==0) { jumlah_tingkat_1 = proporsi_rs_berdasarkan_tingkat[key]['view_jumlah']; }
                        if(key==1) { jumlah_tingkat_2 = proporsi_rs_berdasarkan_tingkat[key]['view_jumlah']; }
                        if(key==2) { jumlah_tingkat_3 = proporsi_rs_berdasarkan_tingkat[key]['view_jumlah']; }
                        if(key==3) { jumlah_tingkat_4 = proporsi_rs_berdasarkan_tingkat[key]['view_jumlah']; }
                        
                        data_proporsi_rs_berdasarkan_tingkat[key] = {name: proporsi_rs_berdasarkan_tingkat[key]['nama'], y: eval(proporsi_rs_berdasarkan_tingkat[key]['jumlah']), visible: eval(proporsi_rs_berdasarkan_tingkat[key]['jumlah'])>0, color: proporsi_rs_berdasarkan_tingkat[key]['color'], label: proporsi_rs_berdasarkan_tingkat[key]['view_jumlah']};
                    }
                    
                    if(label_proporsi_rs_berdasarkan_tingkat!==undefined) {
                        label_proporsi_rs_berdasarkan_tingkat.destroy();
                    }
                    
                    label_proporsi_rs_berdasarkan_tingkat = chart_proporsi_rs_berdasarkan_tingkat.renderer.label('<table>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Tingkat I:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_tingkat_1+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Tingkat II:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_tingkat_2+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Tingkat III:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_tingkat_3+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah Tingkat IV:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_tingkat_4+'</td></tr>'+
                            '<tr style="border-top: thin solid;"><td style="padding-top: 3px;"><b><i>Total Rumah Sakit:</i></b>&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-top: 3px;"><b><i>'+data['proporsi_rs_berdasarkan_tingkat_total']+'</i></b></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '310px',
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
                
                    label_proporsi_rs_berdasarkan_tingkat.align(Highcharts.extend(label_jumlah_fktl.getBBox(), {
                        align: 'right',
                        x: 10, // offset
                        verticalAlign: 'top',
                        y: 10 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_rs_berdasarkan_tingkat.series[0].setData(data_proporsi_rs_berdasarkan_tingkat, true);
                    chart_proporsi_rs_berdasarkan_tingkat.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_rs_berdasarkan_tingkat.redraw();
                    
                    //JUMLAH RS BERDASARKAN KELAS
//                    var arr = [];
//                    var total_kelas_a = 0;
//                    var total_kelas_b = 0;
//                    var total_kelas_c = 0;
//                    var total_kelas_d = 0;
//                    
//                    var data_jumlah_rs_1 = [];
//                    var data_jumlah_rs_2 = [];
//                    var data_jumlah_rs = data['jumlah_rs_berdasarkan_kelas'];
//                    for(var key in data_jumlah_rs) {
//                        if(eval(data_jumlah_rs[key]['rs_pemerintah'])>0 || eval(data_jumlah_rs[key]['rs_swasta'])>0) {
//                            var i = arr.length;
//                            arr[i] = data_jumlah_rs[key]['segmen'];
//                            var persentase_pemerintah = eval(data_jumlah_rs[key]['rs_pemerintah'])/(eval(data_jumlah_rs[key]['rs_pemerintah'])+eval(data_jumlah_rs[key]['rs_swasta']))*100;
//                            var persentase_swasta = eval(data_jumlah_rs[key]['rs_swasta'])/(eval(data_jumlah_rs[key]['rs_pemerintah'])+eval(data_jumlah_rs[key]['rs_swasta']))*100;
//                            data_jumlah_rs_1[i] = {y: eval(data_jumlah_rs[key]['rs_pemerintah']), label: data_jumlah_rs[key]['rs_pemerintah_view'], percentage: persentase_pemerintah};
//                            data_jumlah_rs_2[i] = {y: eval(data_jumlah_rs[key]['rs_swasta']), label: data_jumlah_rs[key]['rs_swasta_view'], percentage: persentase_swasta};
//                            if(i==0) { total_kelas_a = data_jumlah_rs[key]['total_view']; }
//                            if(i==1) { total_kelas_b = data_jumlah_rs[key]['total_view']; }
//                            if(i==2) { total_kelas_c = data_jumlah_rs[key]['total_view']; }
//                            if(i==3) { total_kelas_d = data_jumlah_rs[key]['total_view']; }
//                            
//                        }
//                    }
//                    
//                    if(label_jumlah_rs_berdasarkan_kelas!==undefined) {
//                        label_jumlah_rs_berdasarkan_kelas.destroy();
//                    }
//                    
//                    label_jumlah_rs_berdasarkan_kelas = chart_jumlah_rs_berdasarkan_kelas.renderer.label('<table style="background-color: #fff;" >'+
//                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Kelas A:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_kelas_a+'</td></tr>'+
//                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Kelas B:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_kelas_b+'</td></tr>'+
//                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Kelas C:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_kelas_c+'</td></tr>'+
//                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Kelas D:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_kelas_d+'</td></tr>'+
//                            '</table>', null, null, null, null, null, true)
//                            
//                    .css({
//                        width: '310px',
//                        color: '#333',
//                        fontWeight: 'bold',
//                        fontSize: '10pt',
//                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//                    })
//                    .attr({
//                        'stroke': 'silver',
//                        'stroke-width': 2,
//                        'r': 5,
//                        'padding': 10
//                    })
//                    .add();
//                
//                    label_jumlah_rs_berdasarkan_kelas.align(Highcharts.extend(label_jumlah_rs_berdasarkan_kelas.getBBox(), {
//                        align: 'right',
//                        x: -10, // offset
//                        verticalAlign: 'top',
//                        y: 110 // offset
//                    }), null, 'spacingBox');
//
//                    chart_jumlah_rs_berdasarkan_kelas.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
//                    chart_jumlah_rs_berdasarkan_kelas.xAxis[0].setCategories(arr, true, true);
//                    
//                    chart_jumlah_rs_berdasarkan_kelas.series[0].setData(data_jumlah_rs_1);
//                    chart_jumlah_rs_berdasarkan_kelas.series[1].setData(data_jumlah_rs_2);
//                    chart_jumlah_rs_berdasarkan_kelas.redraw();
                    
                    //JUMLAH APOTIK OPTIK FKTP DAN FKRTL
                    var arr = [];
                    var data_jumlah = [];
                    var data_jumlah_rs = data['jumlah_apotik_fktp_fktl_optik'];
                    for(var key in data_jumlah_rs) {
                        var i = arr.length;
                        arr[i] = data_jumlah_rs[key]['segmen'];
                        data_jumlah[i] = {y: eval(data_jumlah_rs[key]['jumlah']), label: data_jumlah_rs[key]['jumlah_view']};
                    }
                    
                    /*if(label_jumlah_apotik_fktp_fktl_optik!==undefined) {
                        label_jumlah_apotik_fktp_fktl_optik.destroy();
                    }
                    
                    label_jumlah_apotik_fktp_fktl_optik = chart_jumlah_apotik_fktp_fktl_optik.renderer.label('<table style="background-color: #fff;" >'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Tingkat I:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_tingkat_1+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Tingkat II:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_tingkat_2+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Tingkat III:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_tingkat_3+'</td></tr>'+
                            '<tr><td style="padding-bottom: 2px;">Jumlah RS Tingkat IV:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+total_tingkat_4+'</td></tr>'+
                            '</table>', null, null, null, null, null, true)
                            
                    .css({
                        width: '310px',
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
                
                    label_jumlah_apotik_fktp_fktl_optik.align(Highcharts.extend(label_jumlah_apotik_fktp_fktl_optik.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 110 // offset
                    }), null, 'spacingBox');*/

                    chart_jumlah_apotik_fktp_fktl_optik.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_jumlah_apotik_fktp_fktl_optik.xAxis[0].setCategories(arr, true, true);
                    
                    chart_jumlah_apotik_fktp_fktl_optik.series[0].setData(data_jumlah);
                    chart_jumlah_apotik_fktp_fktl_optik.redraw();
                    
                    
                    //JUMLAH KUNJUNGAN RUJUKAN FKTP
                    var arr = [];
                    var data_kunjungan = [];
                    var data_rujukan = [];
                    var data_kelas = data['jumlah_kunjungan_rujukan_fktp'];
                    for(var key in data_kelas) {
                        if(eval(data_kelas[key]['kunjungan'])>0 || eval(data_kelas[key]['rujukan'])>0) {
                            var i = arr.length;
                            arr[i] = data_kelas[key]['nama_faskes'];
                            data_kunjungan[i] = {y: eval(data_kelas[key]['kunjungan']), label: data_kelas[key]['kunjungan_view']};
                            data_rujukan[i] = {y: eval(data_kelas[key]['rujukan']), label: data_kelas[key]['rujukan_view']};
                        }
                    }
                    

                    var periode_rasio_rujukan_fktp = data['periode_rasio_rujukan_fktp'];
                    chart_jumlah_kunjungan_rujukan_fktp.title.update({ text: 'Jumlah Kunjungan & Rujukan RJTP di FKTP sampai Bulan '+(periode_rasio_rujukan_fktp['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_rasio_rujukan_fktp['bulan']+' '+periode_rasio_rujukan_fktp['tahun']+(periode_rasio_rujukan_fktp['id']!=periode['id']?'</span>':'') });
                    chart_jumlah_kunjungan_rujukan_fktp.xAxis[0].setCategories(arr, true, true);

                    chart_jumlah_kunjungan_rujukan_fktp.series[0].setData(data_kunjungan);
                    chart_jumlah_kunjungan_rujukan_fktp.series[1].setData(data_rujukan);
                    chart_jumlah_kunjungan_rujukan_fktp.redraw();
                                        
                    //RASIO RUJUKAN FKTP
                    var arr = [];
                    var data_rasio = [];
                    var data_rasio_rujukan = data['rasio_rujukan_fktp'];
                    for(var key in data_rasio_rujukan) {
                        if(eval(data_rasio_rujukan[key]['rasio'])>0) {
                            var i = arr.length;
                            arr[i] = data_rasio_rujukan[key]['nama_faskes'];
                            data_rasio[i] = {y: eval(data_rasio_rujukan[key]['rasio']), label: data_rasio_rujukan[key]['rasio_view']};
                        }
                    }

                    chart_rasio_rujukan_fktp.title.update({ text: 'Rasio Rujukan RJTP di FKTP sampai  Bulan '+(periode_rasio_rujukan_fktp['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_rasio_rujukan_fktp['bulan']+' '+periode_rasio_rujukan_fktp['tahun']+(periode_rasio_rujukan_fktp['id']!=periode['id']?'</span>':'') });
                    chart_rasio_rujukan_fktp.xAxis[0].setCategories(arr, true, true);

                    chart_rasio_rujukan_fktp.series[0].setData(data_rasio);
                    chart_rasio_rujukan_fktp.redraw();
                    
                    
                    //RATE KUNJUNGAN FKTP
                    var arr = [];
                    var data_kunjungan = [];
                    var data_rate_kunjungan = data['rate_kunjungan_fktp'];
                    for(var key in data_rate_kunjungan) {
                        if(eval(data_rate_kunjungan[key]['kunjungan'])>0 || eval(data_rate_kunjungan[key]['rujukan'])>0) {
                            var i = arr.length;
                            arr[i] = data_rate_kunjungan[key]['nama_faskes'];
                            data_kunjungan[i] = {y: eval(data_rate_kunjungan[key]['kunjungan']), label: data_rate_kunjungan[key]['kunjungan_view']};
                        }
                    }

                    var periode_rate_kunjungan_fktp = data['periode_rate_kunjungan_fktp'];
                    chart_rate_kunjungan_fktp.title.update({ text: 'Rate Kunjungan Peserta di FKTP per Bulan Bulan '+(periode_rate_kunjungan_fktp['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_rate_kunjungan_fktp['bulan']+' '+periode_rate_kunjungan_fktp['tahun']+(periode_rate_kunjungan_fktp['id']!=periode['id']?'</span>':'') });
                    chart_rate_kunjungan_fktp.xAxis[0].setCategories(arr, true, true);

                    chart_rate_kunjungan_fktp.series[0].setData(data_kunjungan);
                    chart_rate_kunjungan_fktp.redraw();
                    
                    
                    //JUMLAH RUJUK BALIK
                    var arr = [];
                    var data_jumlah = [];
                    var data_jumlah_rs = data['jumlah_rujuk_balik'];
                    for(var key in data_jumlah_rs) {
                        var i = arr.length;
                        //console.log(data_jumlah_rs[key]['segmen']);
                        arr[i] = data_jumlah_rs[key]['segmen'];
                        data_jumlah[i] = {y: eval(data_jumlah_rs[key]['jumlah']), label: data_jumlah_rs[key]['jumlah_view']};
                    }
                    
                    var periode_rujuk_balik = data['periode_rujuk_balik'];
                    chart_jumlah_rujuk_balik.title.update({ text: 'Jumlah Peserta Program Rujuk Balik Bulan '+(periode_rujuk_balik['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_rujuk_balik['bulan']+' '+periode_rujuk_balik['tahun']+(periode_rujuk_balik['id']!=periode['id']?'</span>':'') });
                    chart_jumlah_rujuk_balik.xAxis[0].setCategories(arr, true, true);
                    
                    chart_jumlah_rujuk_balik.series[0].setData(data_jumlah);
                    chart_jumlah_rujuk_balik.redraw();
                    
                    //DISTRIBUSI PESERTA FKTP
                    var arr = [];
                    //var data_fktp = [];
                    var data_peserta = [];
                    var data_distribusi_peserta_fktp = data['distribusi_peserta_fktp'];
                    for(var key in data_distribusi_peserta_fktp) {
                        if(/*eval(data_distribusi_peserta_fktp[key]['jumlah_fktp'])>0 || */eval(data_distribusi_peserta_fktp[key]['jumlah_peserta'])>0) {
                            var i = arr.length;
                            arr[i] = data_distribusi_peserta_fktp[key]['nama_faskes'];
                            //data_fktp[i] = {y: eval(data_distribusi_peserta_fktp[key]['jumlah_fktp']), label: data_distribusi_peserta_fktp[key]['jumlah_fktp_view']};
                            data_peserta[i] = {y: eval(data_distribusi_peserta_fktp[key]['jumlah_peserta']), label: data_distribusi_peserta_fktp[key]['jumlah_peserta_view']};
                        }
                    }

                    var periode_distribusi_peserta_fktp = data['periode_distribusi_peserta_fktp'];                    
                    chart_distribusi_peserta_fktp.title.update({ text: 'Distribusi Jumlah Peserta Bulan '+(periode_distribusi_peserta_fktp['id']!=periode['id']?'<span class="blink" style="color: red;">':'')+periode_distribusi_peserta_fktp['bulan']+' '+periode_distribusi_peserta_fktp['tahun']+(periode_distribusi_peserta_fktp['id']!=periode['id']?'</span>':'') });
                    chart_distribusi_peserta_fktp.xAxis[0].setCategories(arr, true, true);

                    //chart_distribusi_peserta_fktp.series[0].setData(data_fktp);
                    chart_distribusi_peserta_fktp.series[0].setData(data_peserta);
                    chart_distribusi_peserta_fktp.redraw();
                    
                    
                } else {

                }
                $("body").mLoading('hide');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                $("body").mLoading('hide');
            } 
        });    
    };
    
    var load_tahun = function() {
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
    
    var load_bulan = function(tahun) {
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
                var option = '<option value="0">Nasional</option>';
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
                var option = '<option value="0">'+(propinsi>0?'-- Kabupaten --':'')+'</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'">'+topics[key]['name']+'</option>';
                }
                $(option).appendTo('#select_kabupaten');
            },
            error: function(jqXHR, textStatus, errorThrown) { 

            } 
        });
    };
    
    $("#select_kabupaten").prop('disabled', true);
    
    $('#select_tahun').on('change', function (e) {
        load_bulan(this.value);        
    });
    
    $('#btn_submit').on('click', function (e) {
        load_data($('#select_bulan').val(), $('#select_propinsi').val(), $('#select_kabupaten').val(), $('#select_tahun').val());
    });
    
    $('#select_propinsi').on('change', function (e) {
        $("#select_kabupaten").prop('disabled', this.value==0);
        load_kabupaten(this.value);
    });
    
    var chart_proporsi_fktl_fktp = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_fktl_fktp'
        },
        title: {
            text: 'Proporsi Fasilitas Kesehatan',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
                    }
                },
                showInLegend: false
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
    
    var chart_jumlah_apotik_fktp_fktl_optik = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'jumlah_apotik_fktp_fktl_optik'
        },
        title: {
            text: 'Jumlah Apotik dan Optik',
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
                    fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }            
        },
        yAxis: {
            gridLineWidth: 1,
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
                rotation: -35,
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
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,                   
                    format: 'Jumlah: {point.label}',
                    //distance: -70,
                    y: 2,
                    //color: '#ffff00',
                    outside: true,
                    align: 'center',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
            name: 'Jumlah',
            color: '#FF0000',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_pertumbuhan_faskes_fktl = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            //type: 'areaspline',
            zoomType: 'xy',
            renderTo: 'pertumbuhan_faskes_fktl'
        },
        title: {
            text: 'Pertumbuhan FKRTL',
            align: 'left'
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }, {
            min: 0,
            //max: 4,
            title: {
                text: 'Pertumbuhan',
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            opposite: true
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
                    rotation: -90,
                    //overflow: 'none',
                    //align: 'top',
                    y: -25,
                    //color: '#ffff00',
                    allowOverlap: true,
                    crop: true,
                    outside: true,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
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
                        fontSize: '14px',
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
            itemMarginTop: 5,
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
    
    var chart_pertumbuhan_faskes_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'areaspline',
            renderTo: 'pertumbuhan_faskes_fktp'
        },
        title: {
            text: 'Pertumbuhan FKTP',
            align: 'left'
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        }, {
            min: 0,
            //max: 4,
            title: {
                text: 'Pertumbuhan',
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
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            opposite: true
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
                    rotation: -90,
                    //overflow: 'none',
                    //align: 'top',
                    y: -25,
                    //color: '#ffff00',
                    allowOverlap: true,
                    crop: true,
                    outside: true,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
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
                        fontSize: '14px',
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
            itemMarginTop: 5,
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
    
    var chart_proporsi_fktp = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_fktp'
        },
        title: {
            text: 'Proporsi FKTP',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
    
    var chart_proporsi_fktl = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_fktl',
            marginTop: 120
        },
        title: {
            text: 'Proporsi FKRTL',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
    
    var chart_proporsi_rs_berdasarkan_kelas = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_rs_berdasarkan_kelas',
            marginTop: 120,
            marginRight: 120
            
        },
        title: {
            text: 'Proporsi Rumah Sakit Berdasarkan Kelas<br />(RS Pemerintah dan Swasta)',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
    
    var chart_proporsi_rs_berdasarkan_tingkat = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_rs_berdasarkan_tingkat',
            marginTop: 50,
            marginRight: 50
            
        },
        title: {
            text: 'Proporsi Rumah Sakit Berdasarkan Tingkat<br />(RS TNI dan Polri)',
            align: 'left'
        },
        subtitle: {
            text: ' ',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
    
//    var chart_jumlah_rs_berdasarkan_kelas = new Highcharts.Chart({ 
//        chart: {
//            plotBackgroundColor: null,
//            plotBorderWidth: null,
//            plotShadow: false,
//            type: 'bar',
//            renderTo: 'jumlah_rs_berdasarkan_kelas'
//        },
//        title: {
//            text: 'Jumlah Rumah Sakit Pemerintah dan Swasta berdasarkan Kelas',
//            align: 'left'
//        },
//        subtitle: {
//            text: ' ',
//            align: 'left'
//        },
//        xAxis: {
//            categories: [],
//            gridLineWidth: 1,
//            tickColor: '#fff',
//            labels: {
//                style: {
//                    color: '#333',
//                    fontSize: '12pt',
//                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//                }
//            },
//            title: {
//                style: {
//                    color: '#333',
//                    fontWeight: 'bold',
//                    fontSize: '9pt',
//                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//                }
//            }            
//        },
//        yAxis: {
//            gridLineWidth: 1,
//            title: {
//                text: 'Jumlah',
//                style: {
//                    color: '#333',
//                    fontWeight: 'bold',
//                    fontSize: '12pt',
//                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//                }
//            },
//            labels: {
//                overflow: 'justify',
//                rotation: -35,
//                formatter: function () {
//                    return Highcharts.numberFormat(eval(this.value), 0);
//                },
//                style: {
//                    color: '#333',
//                    fontWeight: 'bold',
//                    fontSize: '9pt',
//                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//                }
//            }
//        },
//        tooltip: {
//            pointFormat: '{series.name}: <b>{point.label}</b>'
//        },
//        plotOptions: {
//            /*series: {
//                stacking: 'normal'
//            },*/
//            bar: {
//                allowPointSelect: true,
//                cursor: 'pointer',
//                dataLabels: {
//                    enabled: true,                   
//                    format: '{point.label} ({point.percentage:.1f} %)',
//                    //distance: -70,
//                    y: 2,
//                    //color: '#ffff00',
//                    outside: true,
//                    align: 'left',
//                    style: {
//                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
//                        fontSize: '12px'
//                    }
//                },
//                showInLegend: true
//            }
//        }, 
//        legend: {
//            enabled: true,
//            layout: 'horizontal',
//            verticalAlign: 'top',
//            align:'center',
//            y: 50,
//            itemMarginTop: 5,
//            itemMarginBottom: 5,
//            itemStyle: {
//                fontSize: '13px',
//                color: '#333',
//                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
//            },
//            itemHoverStyle: {
//                color: '#039'
//            },
//            itemHiddenStyle: {
//                color: 'gray'
//            },
//            labelFormat: '{name}'
//        },
//        series: [{
//            name: 'Pemerintah',
//            color: '#0000FF',
//            colorByPoint: false,
//            data: []                        
//        }, {
//            name: 'Swasta',
//            color: '#FF0000',
//            colorByPoint: false,
//            data: []
//        }]
//    });
    
    var chart_jumlah_kunjungan_rujukan_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'jumlah_kunjungan_rujukan_fktp'
        },
        title: {
            text: 'Jumlah Kunjungan & Rujukan RJTP di FKTP',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: ''
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
            tickInterval: 2000000,
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
                    return Highcharts.numberFormat(eval(this.value/1000000), 0)+' jt';
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
                showInLegend: true
            }
        }, 
        legend: {
            enabled: true,
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
        series: [{
            name: 'Kunjungan',
            color: '#FF0000',
            colorByPoint: false,
            data: []            
        }, {
            name: 'Rujukan',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_rasio_rujukan_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'rasio_rujukan_fktp'
        },
        title: {
            text: 'Rasio Rujukan RJTP di FKTP',
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
            name: 'Rasio Rujukan',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_rate_kunjungan_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'rate_kunjungan_fktp'
        },
        title: {
            text: 'Rate Kunjungan Peserta di FKTP',
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
            name: 'Kunjungan',
            color: '#FF0000',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_jumlah_rujuk_balik = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'jumlah_rujuk_balik'
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
                    fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }            
        },
        yAxis: {
            gridLineWidth: 1,
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
                rotation: -35,
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
            pointFormat: '{series.name}: <b>{point.label}</b>'
        },
        plotOptions: {
            /*series: {
                stacking: 'normal'
            },*/
            column: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    allowOverlap: true,
                    enabled: true,                   
                    format: '{point.label}',
                    //distance: -70,
                    y: 2,
                    //color: '#ffff00',
                    outside: true,
                    align: 'center',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '16px'
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
            name: 'Jumlah',
            color: '#800080',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var chart_distribusi_peserta_fktp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'distribusi_peserta_fktp'
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
                    fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            title: {
                style: {
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }            
        },
        yAxis: {
            gridLineWidth: 1,
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
                rotation: -35,
                formatter: function () {
                    return Highcharts.numberFormat(eval(this.value)/1000000, 0)+' jt';
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
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,                   
                    //format: '{point.label} ({point.percentage:.1f} %)',
                    //distance: -70,
                    formatter:function(){
                        if(this.y > 0) {
                            return this.point.label;
                        }
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
                showInLegend: false
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
        series: [/*{
            name: 'Jumlah FKTP',
            color: '#FF0000',
            colorByPoint: false,
            data: []//,
            //visible: false
        }, */{
            name: 'Jumlah Peserta',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    load_data(0, 0, 0, 2018);
    load_tahun();
    load_bulan(2018);
    load_propinsi();
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
});