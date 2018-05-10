$(function () {
    
    var H = Highcharts,
        map = H.maps['countries/id/id-all'],
        chart;
    
    var label_populasi = undefined;
    var label_pertumbuhan_all = undefined;
    var label_total_peserta = undefined;
    var label_total_peserta_jenis_kelamin = undefined;
    var label_tidakaktif_total_peserta_all = undefined;
    var label_kelas_total_peserta_all = undefined;
    
    var label_jumlah_fktl_fktp = undefined;
    var label_jumlah_fktp = undefined;
    var label_jumlah_fktl = undefined;
    var label_proporsi_rs_berdasarkan_kelas = undefined;
    var label_proporsi_rs_berdasarkan_tingkat = undefined;
    
    var load_data = function(periode, propinsi, kabupaten) {
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/analysis/proporsi.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    
                    
                    var periode = data['periode'];
                    
                    var summary_kepesertaan = data['summary_kepesertaan'];
                    $('#jumlah').text(summary_kepesertaan['jumlah']);
                    $('#cakupan').text(summary_kepesertaan['cakupan']+" %");
                    $('#pertumbuhan').text(summary_kepesertaan['pertumbuhan']);
                    $('#tidakaktif').text(summary_kepesertaan['tidak_aktif']);
    
                    var summary_pelayanan = data['summary_pelayanan'];
                    $('#pelayanan_jumlah').text(summary_pelayanan['jumlah']);
                    $('#jumlah_fktp').text(summary_pelayanan['jumlah_fktp']);
                    $('#jumlah_fktl').text(summary_pelayanan['jumlah_fktl']);
                    $('#jumlah_kunjungan').text(summary_pelayanan['jumlah_kunjungan']);

                    var summary_keuangan = data['summary_keuangan'];
                    $('#pendapatan').text(summary_keuangan['aset']);
                    $('#beban').text(summary_keuangan['beban']);
                    $('#hutang').text(summary_keuangan['hutang']);
                    $('#aset').text(summary_keuangan['aset']);
    
                    var summary_pembayaran = data['summary_pembayaran'];
                    $('#pembayaran').text(summary_pembayaran['pembayaran']);
                    $('#kasus').text(summary_pembayaran['kasus']);
                    $('#kapitasi').text(summary_pembayaran['kapitasi']);
                    $('#rasio').text(summary_pembayaran['rasio']);
    
                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 

            } 
        });    
    };
    
    var load_data_membership = function(periode, propinsi, kabupaten) {
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivemembers",
            url: server+'/analysis/membership.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {

                    var periode = data['periode'];
                    
                    //CAKUPAN MAP
                    var data_cakupan_map = [];
                    var cakupan_map = data['cakupan_map'];
                    for(var key in cakupan_map) {
                        data_cakupan_map[key] = {
                            "hc-key": cakupan_map[key]['hc_key'],
                            "value": (eval(cakupan_map[key]['peserta'])/eval(cakupan_map[key]['populasi']))*100,
                            dataLabels: { x: eval(cakupan_map[key]['x']), y: eval(cakupan_map[key]['y']) }
                        };
                    }
                    peta_cakupan.series[0].setData(data_cakupan_map, true);
                    peta_cakupan.title.update({ text: 'Cakupan Kepesertaan '+periode['bulan']+' '+periode['tahun'] });

                    //PROPORSI ALL
                    var data_proporsi_all = [];
                    var proporsi_all = data['kepesertaan_proporsi'];
                    for(var key in proporsi_all) {
                        data_proporsi_all[key] = {name: proporsi_all[key]['nama'], y: eval(proporsi_all[key]['jumlah']), visible: eval(proporsi_all[key]['jumlah'])>0, color: proporsi_all[key]['color'], label: proporsi_all[key]['view_jumlah']};
                    }
                    chart_proporsi_all.series[0].setData(data_proporsi_all, true);
                    chart_proporsi_all.title.update({ text: 'Proporsi Kepesertaan Bulan '+periode['bulan']+' '+periode['tahun'] });
                    
                    var populasi = data['populasi'];                    
                    if(label_populasi!==undefined) {
                        label_populasi.destroy();
                    }
                    
                    label_populasi = chart_proporsi_all.renderer.label("Populasi: "+populasi+" Jiwa")
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

                    label_populasi.align(Highcharts.extend(label_populasi.getBBox(), {
                        align: 'center',
                        //x: -30, // offset
                        verticalAlign: 'bottom' //,
                        //y: 10 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_all.redraw();
                    
                    //PERTUMBUHAN ALL
                    var arr = [];
                    var data_jumlah = [];
                    var data_tumbuh = [];                    
                    var topics = data['pertumbuhan_all'];
                    for(var key in topics) {
                        arr[key] = topics[key]['periode'];
                        data_jumlah[key] = {y: eval(topics[key]['jumlah']), label: topics[key]['view_jumlah']};
                        data_tumbuh[key] = {y: eval(topics[key]['persentase']), label: topics[key]['view_persentase']};
                    }

                    while(eval(chart_pertumbuhan_all.series.length) > 0) {
                        chart_pertumbuhan_all.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_all.addSeries({                        
                        name: 'Jumlah',
                        type: 'column',
                        color: '#FF0000',
                        data: data_jumlah
                    }, false);
                    
                    chart_pertumbuhan_all.addSeries({                        
                        name: 'Pertumbuhan',
                        type: 'areaspline',
                        color: '#0000FF',
                        yAxis: 1,
                        data: data_tumbuh
                    }, false);
                    
                    chart_pertumbuhan_all.title.update({ text: 'Perkembangan Kepesertaan Hingga '+periode['bulan']+' '+periode['tahun'] });
                    chart_pertumbuhan_all.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_all.redraw();
                    
                    //JENIS KELAMIN ALL
                    var data_jeniskelamin_all = [];
                    var jeniskelamin_all = data['jeniskelamin_all'];
                    for(var key in jeniskelamin_all) {
                        data_jeniskelamin_all[key] = {name: jeniskelamin_all[key]['nama'], y: eval(jeniskelamin_all[key]['jumlah']), color: jeniskelamin_all[key]['color'], label: jeniskelamin_all[key]['view_jumlah']};
                    }
                    
                    var periode_jk = data['periode_jk'];
                    chart_jeniskelamin_all.series[0].setData(data_jeniskelamin_all, true);
                    chart_jeniskelamin_all.title.update({ text: 'Kepesertaan Berdasarkan Jenis Kelamin Bulan '+periode_jk['bulan']+' '+periode_jk['tahun'] });
                    chart_jeniskelamin_all.redraw();
                    
                    //KELAS PERAWATAN ALL                    
                    var data_kelas_all = [];
                    var kelas_all = data['kelas_all'];
                    for(var key in kelas_all) {
                        data_kelas_all[key] = {name: kelas_all[key]['nama'], y: eval(kelas_all[key]['jumlah']), color: kelas_all[key]['color'], label: kelas_all[key]['view_jumlah']};
                    }
                    
                    chart_kelas_all.series[0].setData(data_kelas_all, true);
                    chart_kelas_all.title.update({ text: 'Kepesertaan Berdasarkan Kelas Perawatan Bulan '+periode['bulan']+' '+periode['tahun'] });
                    chart_kelas_all.redraw();
                    
                    //NIK ALL
                    var data_nik_all = [];
                    var nik_all = data['nik_all'];
                    for(var key in nik_all) {
                        data_nik_all[key] = {name: nik_all[key]['nama'], y: eval(nik_all[key]['jumlah']), color: nik_all[key]['color'], label: nik_all[key]['view_jumlah']};
                    }
                    
                    var periode_nik = data['periode_nik'];
                    chart_nik_all.series[0].setData(data_nik_all, true);
                    chart_nik_all.title.update({ text: 'Kepesertaan Dilengkapi Dengan NIK Bulan '+periode_nik['bulan']+' '+periode_nik['tahun'] });
                    chart_nik_all.redraw();
                    
                    
                    //TIDAK AKTIF ALL
                    var data_tidakaktif_all = [];
                    var tidakaktif_all = data['tidakaktif_all'];
                    for(var key in tidakaktif_all) {
                        data_tidakaktif_all[key] = {name: tidakaktif_all[key]['nama'], plot: tidakaktif_all[key]['plot'], y: eval(tidakaktif_all[key]['jumlah']), color: tidakaktif_all[key]['color'], label: tidakaktif_all[key]['view_jumlah']};
                    }
                    
                    chart_tidakaktif_all.series[0].setData(data_tidakaktif_all, true);
                    chart_tidakaktif_all.title.update({ text: 'Kepesertaan Tidak Aktif (Menunggak Iuran) Bulan '+periode['bulan']+' '+periode['tahun'] });
                    chart_tidakaktif_all.redraw();
                    
                    
                    
                    
                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_data_membership('', 0, 0);
            } 
        });    
    };
    
    
    var load_data_pelayanan = function(periode, propinsi, kabupaten) {
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receivepelayanans",
            url: server+'/analysis/pelayanan.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {

                    var periode = data['periode'];
                    
                    //PROPORSI FKTL FKTP DAN APOTIK
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
                            '<tr><td style="padding-bottom: 2px;">Jumlah FKTL:&nbsp;&nbsp;&nbsp;</td><td align="right" style="padding-bottom: 2px;">'+jumlah_fktl+'</td></tr>'+
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
                
                    label_proporsi_rs_berdasarkan_kelas.align(Highcharts.extend(label_proporsi_rs_berdasarkan_kelas.getBBox(), {
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
                
                    label_proporsi_rs_berdasarkan_tingkat.align(Highcharts.extend(label_proporsi_rs_berdasarkan_tingkat.getBBox(), {
                        align: 'right',
                        x: 10, // offset
                        verticalAlign: 'top',
                        y: 10 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_rs_berdasarkan_tingkat.series[0].setData(data_proporsi_rs_berdasarkan_tingkat, true);
                    chart_proporsi_rs_berdasarkan_tingkat.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_rs_berdasarkan_tingkat.redraw();
                    
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

                    chart_distribusi_peserta_fktp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_distribusi_peserta_fktp.xAxis[0].setCategories(arr, true, true);

                    //chart_distribusi_peserta_fktp.series[0].setData(data_fktp);
                    chart_distribusi_peserta_fktp.series[0].setData(data_peserta);
                    chart_distribusi_peserta_fktp.redraw();
                    
                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_data_membership('', 0, 0);
            } 
        });    
    };
    
    var load_data_organisasi = function(periode, propinsi, kabupaten) {
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveorganisasis",
            url: server+'/analysis/organisasi.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    
                    var periode = data['periode'];
                    
                    //CAKUPAN MAP
                    var data_cakupan_map = [];
                    var cakupan_map = data['cakupan_map_cabang'];
                    for(var key in cakupan_map) {
                        //console.log(cakupan_map[key]['cakupan'] +"\t"+cakupan_map[key]['peserta']+"\t"+cakupan_map[key]['populasi']);
                        data_cakupan_map[key] = {
                            "hc-key": cakupan_map[key]['hc_key'],
                            "value": (eval(cakupan_map[key]['peserta'])/eval(cakupan_map[key]['populasi']))*100,
                            dataLabels: { x: eval(cakupan_map[key]['x']), y: eval(cakupan_map[key]['y']) }
                        };
                    }
                    peta_cakupan_cabang.series[0].setData(data_cakupan_map, true);
                    peta_cakupan_divre.series[0].setData(data_cakupan_map, true);
                    
                    //KANTOR CABANG
                    var data_cabang_map = [];
                    var cabang_map = data['cabang'];
                    for(var key in cabang_map) {
                        //console.log(cabang_map[key]['nama'] +"\t"+cabang_map[key]['lat']+"\t"+cabang_map[key]['lon']);
                        data_cabang_map[key] = {
                            "nama": cabang_map[key]['nama'],
                            "lat": eval(cabang_map[key]['lat']),
                            "lon": eval(cabang_map[key]['lon'])
                        };
                    }
                    peta_cakupan_cabang.series[2].setData(data_cabang_map, true);
                    
                    //DIVISI REGIONAL
                    var data_divre_map = [];
                    var divre_map = data['divre'];
                    for(var key in divre_map) {
                        data_divre_map[key] = {
                            "nama": divre_map[key]['nama'],
                            "lat": eval(divre_map[key]['lat']),
                            "lon": eval(divre_map[key]['lon'])
                        };
                    }
                    peta_cakupan_divre.series[2].setData(data_divre_map, true);
                    
                    peta_cakupan_cabang.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    peta_cakupan_divre.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    
                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 

            } 
        });    
    };
    
    var peta_cakupan_cabang = new Highcharts.Map('map_canvas_cabang', {
        credits: {
            enabled: false
        },
        title : {
            text : 'Sebaran Kantor Cabang'
        },

        subtitle : {
            text : 'Kondisi Bulan'
        },

        colorAxis: {
            dataClasses: [{
                to: 65,
                color: "#FF0000"
            }, {
                from: 65,
                to: 95,
                color: "#FFFF00"
            }, {
                from: 95,
                color: "#00FF00"
            }]
        },
    
        legend: {
            layout: 'horizontal',
            verticalAlign: 'top',
            align: 'center',
            floating: true,
            valueDecimals: 0,
            valueSuffix: ' %',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14,
            y: 50
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            },
            enableMouseWheelZoom: false
        },
        series : [{
            data : [],
            mapData: map,
            joinBy: 'hc-key',
            name: 'Cakupan Peserta',
            states: {
                /*hover: {
                    color: '#C5C5C5'
                }*/
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                allowOverlap: true,
                crop: true,
                outside: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                    color: '#fff'
                }
            },
            tooltip: {
                pointFormat: '   {point.name}: <b>{point.value:.1f} %</b>'
            }        
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Kantor Cabang',
            color: '#0000ff',
            data: []
        }]
    });
    
    
    var peta_cakupan_divre = new Highcharts.Map('map_canvas_divre', {
        credits: {
            enabled: false
        },
        
        title : {
            text : 'Sebaran Divisi Regional'
        },

        subtitle : {
            text : 'Kondisi Bulan'
        },

        colorAxis: {
            dataClasses: [{
                to: 65,
                color: "#FF0000"
            }, {
                from: 65,
                to: 95,
                color: "#FFFF00"
            }, {
                from: 95,
                color: "#00FF00"
            }]
        },
    
        legend: {
            layout: 'horizontal',
            verticalAlign: 'top',
            align: 'center',
            floating: true,
            valueDecimals: 0,
            valueSuffix: ' %',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14,
            y: 50
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            },
            enableMouseWheelZoom: false
        },
        series : [{
            data : [],
            mapData: map,
            joinBy: 'hc-key',
            name: 'Cakupan Peserta',
            states: {
                /*hover: {
                    color: '#C5C5C5'
                }*/
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                allowOverlap: true,
                crop: true,
                outside: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                    color: '#fff'
                }
            },
            tooltip: {
                pointFormat: '   {point.name}: <b>{point.value:.1f} %</b>'
            }        
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Divisi Regional',
            color: '#0000ff',
            data: []
        }]
    });
    
    var peta_cakupan = new Highcharts.Map('map_canvas', {
        credits: {
            enabled: false
        },
        
        title : {
            text : ''
        },

        subtitle: {
            style: {
                display: 'none'
            }
        },
        
        colorAxis: {
            dataClasses: [{
                to: 65,
                color: "#FF0000"
            }, {
                from: 65,
                to: 95,
                color: "#FFFF00"
            }, {
                from: 95,
                color: "#00FF00"
            }]
        },
    
        legend: {
            layout: 'horizontal',
            verticalAlign: 'top',
            align: 'center',
            floating: true,
            valueDecimals: 0,
            valueSuffix: ' %',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            symbolRadius: 0,
            symbolHeight: 14,
            y: 50
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'top'
            },
            enableMouseWheelZoom: false
        },
        series : [{
            data : [],
            mapData: Highcharts.maps['countries/id/id-all'],
            joinBy: 'hc-key',
            name: 'Cakupan Peserta',
            states: {
                hover: {
                    color: '#C5C5C5'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                allowOverlap: true,
                crop: true,
                outside: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                    color: '#fff'
                }
            },
            tooltip: {
                pointFormat: '   {point.name}: <b>{point.value:.1f} %</b>'
            }
        }]
    });
    
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
                var option = '<option value="0">NASIONAL</option>';
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
    
    var load_periode = function() {
        $("#select_periode").val('');
        $("#select_periode").empty();
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveperiodedatastore",
            url: server+'/store/periodeDataStore.php',
            dataType: 'jsonp',
            success: function(data) {
                var topics = data['topics'];
                var option = '';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'"'+(topics[key]['selected']?'selected="selected"':'')+'>'+topics[key]['periode']+'</option>';
                }
                $(option).appendTo('#select_periode');
            },
            error: function(jqXHR, textStatus, errorThrown) { 
                load_periode();
            } 
        });
    };
    
    $("#select_kabupaten").prop('disabled', true);
    
    $('#select_periode').on('change', function (e) {
        var periode = this.value;
        var propinsi = $('#select_propinsi').val()===null?0:$('#select_propinsi').val();
        var kabupaten = $('#select_kabupaten').val()===null?0:$('#select_kabupaten').val();
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
        load_data_membership(periode, propinsi, kabupaten);
        load_data_pelayanan(periode, propinsi, kabupaten);
        load_data_organisasi(periode, propinsi, kabupaten);
    });
    
    $('#select_propinsi').on('change', function (e) {
        $("#select_kabupaten").prop('disabled', this.value==0);
        load_kabupaten(this.value);
        
        var periode = $('#select_periode').val()===null?0:$('#select_periode').val();
        var propinsi = this.value;
        var kabupaten = $('#select_kabupaten').val()===null?0:$('#select_kabupaten').val();
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
        load_data_membership(periode, propinsi, kabupaten);
        load_data_pelayanan(periode, propinsi, kabupaten);
        load_data_organisasi(periode, propinsi, kabupaten);
    });
    
    $('#select_kabupaten').on('change', function (e) {
        var periode = $('#select_periode').val()===null?0:$('#select_periode').val();
        var propinsi = $('#select_propinsi').val()===null?0:$('#select_propinsi').val();
        var kabupaten = this.value;
        //alert(periode + ' | ' + propinsi + ' | ' + kabupaten);
        load_data(periode, propinsi, kabupaten);
        load_data_membership(periode, propinsi, kabupaten);
        load_data_pelayanan(periode, propinsi, kabupaten);
        load_data_organisasi(periode, propinsi, kabupaten);
    });
    
    load_data('', 0, 0);
    load_data_membership('', 0, 0);
    load_data_pelayanan('', 0, 0);
    load_data_organisasi('', 0, 0);
    load_propinsi();
    load_periode();
    
    var chart_proporsi_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kepesertaan-proporsi',
            marginBottom: 70
        },
        title: {
            text: ''
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
                    color: '#fff',
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
    
    var chart_pertumbuhan_all = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'kepesertaan-pertumbuhan'
        },
        title: {
            text: '',
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
                    //fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
        yAxis: [{
            gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
            title: {
                text: 'Jumlah (Juta)',
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    //fontSize: '12pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            },
            labels: {
                overflow: 'justify',
                formatter: function () {
                    return Highcharts.numberFormat(this.value/1000000, 0);
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    //fontSize: '12pt',
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
                    //fontWeight: 'bold',
                    //fontSize: '12pt',
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
                    align: 'center',
                    style: {
                        fontSize: '14px',
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
                fontSize: '12px',
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
    
    var chart_jeniskelamin_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kepesertaan-jeniskelamin'
        },
        title: {
            text: '',
            align: 'center'
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
                    color: '#fff',
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
            verticalAlign: 'middle',
            align:'right',
            x: -10,
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
    
    var chart_nik_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kepesertaan-nik'
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
        tooltip: {
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
                    y: -10,
                    color: '#fff',
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
            verticalAlign: 'middle',
            align:'right',
            x: -10,
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
    
    var chart_kelas_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kepesertaan-kelas'
        },
        title: {
            text: '',
            align: 'center'            
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
                    color: '#fff',
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
            //y: 70,
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
    
    var chart_tidakaktif_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kepesertaan-tidakaktif'
        },
        title: {
            text: '',
            align: 'center'
        },
        subtitle: {
            style: {
                display: 'none'
            }
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
                    format: '{point.plot}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    x: -10,
                    color: '#fff',
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
            x: -70,
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
            colorByPoint: true,
            data: []
        }]
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
            text: '',
            align: 'left',
            style: {
                display: 'none'
            }
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
            text: '',
            align: 'left',
            style: {
                display: 'none'
            }
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
            text: '',
            align: 'left',
            style: {
                display: 'none'
            }
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
            text: '',
            align: 'left',
            style: {
                display: 'none'
            }
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
    
    
    
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    
});