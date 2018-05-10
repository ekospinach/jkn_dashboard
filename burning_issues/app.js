//var server = 'http://djsn.go.id/djsn_server';
//var server = 'http://192.168.43.201/server_djsn';
var server = 'http://180.250.242.162/server_djsn';

$(function () {
    
    $(window).scroll(function () {
          //if you hard code, then use console
          //.log to determine when you want the 
          //nav bar to stick.  
        //console.log($(window).scrollTop());
        if ($(window).scrollTop() > $('#header_logo').height()) {
          $('#nav_bar').addClass('navbar-fixed');
        }
        if ($(window).scrollTop() < $('#header_logo').height()) {
          $('#nav_bar').removeClass('navbar-fixed');
        }
    });
    
//    $('.marquee').marquee({
//        //speed in milliseconds of the marquee
//        duration: 15000,
//        //gap in pixels between the tickers
//        gap: 50,
//        //time in milliseconds before the marquee will start animating
//        delayBeforeStart: 0,
//        //'left' or 'right'
//        direction: 'left',
//        //true or false - should the marquee be duplicated to show an effect of continues flow
//        duplicated: true
//    });
    
    var label_populasi = undefined;
    var label_jumlah_pbi = undefined;
    var label_total_peserta = undefined;
    var label_pertumbuhan_all = undefined;
    var label_pertumbuhan_pbi_non_pbi = undefined;
    var label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp = undefined;
    var label_pertumbuhan_ppu = undefined;
    var label_tidakaktif_total_peserta_all = undefined;
    var label_tidakaktif_total_peserta_non_pbi = undefined;
    var label_kelas_total_peserta_all = undefined;
    var label_kelas_total_peserta_non_pbi = undefined;
    
    var load_data = function(periode, propinsi, kabupaten, tahun) {
        $("body").mLoading();
        load_detail('ppu', periode, propinsi, kabupaten);
        
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsi",
            url: server+'/kepesertaan/proporsi.php?periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten+'&tahun='+tahun,
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    
                    //SUMMARY
                    var summary = data['summary'];
                    $('#jumlah').text(summary['jumlah']);
                    $('#cakupan').text(summary['cakupan']);
                    $('#pertumbuhan').text(summary['pertumbuhan']);
                    $('#pertumbuhan_rata').text(summary['pertumbuhan']);                    
                    $('#tidakaktif').text(summary['tidak_aktif']);
                    
                    if($('#select_bulan').val()==0) {
                        $("#pertumbuhan_rata_rata").show();
                        $("#pertumbuhan_saja").hide();            
                    } else {
                        $("#pertumbuhan_rata_rata").hide();
                        $("#pertumbuhan_saja").show();
                    }
        
                    //CAKUPAN MAP
                    var data_cakupan_map = [];
                    var cakupan_map = data['cakupan_map'];
                    for(var key in cakupan_map) {
                        //console.log(cakupan_map[key]['cakupan'] +"\t"+cakupan_map[key]['peserta']+"\t"+cakupan_map[key]['populasi']);
                        data_cakupan_map[key] = {
                            "hc-key": cakupan_map[key]['hc_key'],
                            "value": (eval(cakupan_map[key]['peserta'])/eval(cakupan_map[key]['populasi']))*100,
                            dataLabels: { x: eval(cakupan_map[key]['x']), y: eval(cakupan_map[key]['y']) }
                        };
                    }
                    peta_cakupan.series[0].setData(data_cakupan_map, true);
                    peta_cakupan.title.update({ text: 'Cakupan Kepesertaan'+($('#select_bulan').val()==0?' Tahun ':' Bulan '+periode['bulan']+' ') + periode['tahun'] });

                    //PROPORSI ALL
                    var data_proporsi_all = [];
                    var proporsi_all = data['proporsi_all'];
                    for(var key in proporsi_all) {
                        data_proporsi_all[key] = {name: proporsi_all[key]['nama'], y: eval(proporsi_all[key]['jumlah']), visible: eval(proporsi_all[key]['jumlah'])>0, color: proporsi_all[key]['color'], label: proporsi_all[key]['view_jumlah']};
                    }
                    chart_proporsi_all.series[0].setData(data_proporsi_all, true);
                    chart_proporsi_all.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    
                    var populasi = data['populasi'];                    
                    if(label_populasi!==undefined) {
                        label_populasi.destroy();
                    }
                    
                    label_populasi = chart_proporsi_all.renderer.label("Populasi: "+populasi)
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
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'bottom',
                        y: -50 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_all.redraw();
                    
                    //PROPORSI PBI DAN NON PBI
                    var data_proporsi_pbi_non_pbi = [];
                    var jumlah_pbi_pusat = 0;
                    var jumlah_pbi_jamkesda = 0;                    
                    var proporsi_pbi_non_pbi = data['proporsi_pbi_non_pbi'];
                    for(var key in proporsi_pbi_non_pbi) {
                        if(key==0) {
                            jumlah_pbi_pusat    = proporsi_pbi_non_pbi[key]['view_jumlah_pbi_pusat'];
                            jumlah_pbi_jamkesda = proporsi_pbi_non_pbi[key]['view_jumlah_pbi_jamkesda'];
                        }
                        data_proporsi_pbi_non_pbi[key] = {name: proporsi_pbi_non_pbi[key]['nama'], y: eval(proporsi_pbi_non_pbi[key]['jumlah']), visible: eval(proporsi_pbi_non_pbi[key]['jumlah'])>0, color: proporsi_pbi_non_pbi[key]['color'], label: proporsi_pbi_non_pbi[key]['view_jumlah']};
                    }
                    
                    if(label_jumlah_pbi!==undefined) {
                        label_jumlah_pbi.destroy();
                    }
                    
                    label_jumlah_pbi = chart_proporsi_pbi_non_pbi.renderer.label('<table><tr><td>PBI Pusat:</td><td align="right">'+jumlah_pbi_pusat+'</td></tr><tr><td>PBI Jamkesda:&nbsp;&nbsp;&nbsp;</td><td align="right">'+jumlah_pbi_jamkesda+'</td></tr></table>', null, null, null, null, null, true)
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
                
                    label_jumlah_pbi.align(Highcharts.extend(label_jumlah_pbi.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'bottom',
                        y: -50 // offset
                    }), null, 'spacingBox');
                        
                    chart_proporsi_pbi_non_pbi.series[0].setData(data_proporsi_pbi_non_pbi, true);
                    chart_proporsi_pbi_non_pbi.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_pbi_non_pbi.redraw();

                    //PROPORSI PBI PUSAT PBI JAMKESDA PPU PBPU BP
                    var data_proporsi_pusat_jamkesda_ppu_pbpu_bp = [];
                    var proporsi_pusat_jamkesda_ppu_pbpu_bp = data['proporsi_pusat_jamkesda_ppu_pbpu_bp'];
                    for(var key in proporsi_pusat_jamkesda_ppu_pbpu_bp) {
                        data_proporsi_pusat_jamkesda_ppu_pbpu_bp[key] = {segmen: proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['segmen'], name: proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['nama'], y: eval(proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['jumlah']), visible: eval(proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['jumlah'])>0, color: proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['color'], label: proporsi_pusat_jamkesda_ppu_pbpu_bp[key]['view_jumlah']};
                    }
                    chart_proporsi_pusat_jamkesda_ppu_pbpu_bp.series[0].setData(data_proporsi_pusat_jamkesda_ppu_pbpu_bp, true);
                    chart_proporsi_pusat_jamkesda_ppu_pbpu_bp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_proporsi_pusat_jamkesda_ppu_pbpu_bp.redraw();
                                       

                    //JENIS KELAMIN ALL
                    var data_jeniskelamin_all = [];
                    var jeniskelamin_all = data['jeniskelamin_all'];
                    var totalpeserta = 0;
                    for(var key in jeniskelamin_all) {
                        totalpeserta=jeniskelamin_all[key]['total_peserta'];
                        data_jeniskelamin_all[key] = {name: jeniskelamin_all[key]['nama'], y: eval(jeniskelamin_all[key]['jumlah']), color: jeniskelamin_all[key]['color'], label: jeniskelamin_all[key]['view_jumlah']};
                    }
                    
                    if(label_total_peserta!==undefined) {
                        label_total_peserta.destroy();
                    }
                    
                    label_total_peserta = chart_jeniskelamin_all.renderer.label("Total Peserta: "+totalpeserta)
                    .css({
                        width: '250px',
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

                    label_total_peserta.align(Highcharts.extend(label_total_peserta.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'bottom',
                        y: -150 // offset
                    }), null, 'spacingBox');
                        
                    chart_jeniskelamin_all.series[0].setData(data_jeniskelamin_all, true);
                    chart_jeniskelamin_all.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_jeniskelamin_all.redraw();
                    
                    //JENIS KELAMIN PBI NON PBI
                    var arr = [];
                    var data_jeniskelamin_1 = [];
                    var data_jeniskelamin_2 = [];
                    var data_jeniskelamin = data['jeniskelamin_pbi_non_pbi'];
                    for(var key in data_jeniskelamin) {
                        if(eval(data_jeniskelamin[key]['laki_laki'])>0 || eval(data_jeniskelamin[key]['perempuan'])>0) {
                            var i = arr.length;
                            arr[i] = data_jeniskelamin[key]['segmen'];
                            data_jeniskelamin_1[i] = {y: eval(data_jeniskelamin[key]['laki_laki']), label: data_jeniskelamin[key]['laki_laki_view']};
                            data_jeniskelamin_2[i] = {y: eval(data_jeniskelamin[key]['perempuan']), label: data_jeniskelamin[key]['perempuan_view']};
                        }
                    }

                    chart_jeniskelamin_pbi_non_pbi.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_jeniskelamin_pbi_non_pbi.xAxis[0].setCategories(arr, true, true);

                    chart_jeniskelamin_pbi_non_pbi.series[0].setData(data_jeniskelamin_1);
                    chart_jeniskelamin_pbi_non_pbi.series[1].setData(data_jeniskelamin_2);
                    chart_jeniskelamin_pbi_non_pbi.redraw();
                    
                    //JENIS KELAMIN PUSAT JAMKESDA PPU PBPU BP
                    var arr = [];
                    var data_jeniskelamin_1 = [];
                    var data_jeniskelamin_2 = [];
                    var data_jeniskelamin = data['jeniskelamin_pusat_jamkesda_ppu_pbpu_bp'];
                    for(var key in data_jeniskelamin) {
                        if(eval(data_jeniskelamin[key]['laki_laki'])>0 || eval(data_jeniskelamin[key]['perempuan'])>0) {
                            var i = arr.length;
                            arr[i] = data_jeniskelamin[key]['segmen'];
                            var persentase_laki_laki = eval(data_jeniskelamin[key]['laki_laki'])/(eval(data_jeniskelamin[key]['laki_laki'])+eval(data_jeniskelamin[key]['perempuan']))*100;
                            var persentase_perempuan = eval(data_jeniskelamin[key]['perempuan'])/(eval(data_jeniskelamin[key]['laki_laki'])+eval(data_jeniskelamin[key]['perempuan']))*100;
                            data_jeniskelamin_1[i] = {y: eval(data_jeniskelamin[key]['laki_laki']), label: data_jeniskelamin[key]['laki_laki_view'], percentage: persentase_laki_laki};
                            data_jeniskelamin_2[i] = {y: eval(data_jeniskelamin[key]['perempuan']), label: data_jeniskelamin[key]['perempuan_view'], percentage: persentase_perempuan};
                        }
                    }

                    jeniskelamin_pusat_jamkesda_ppu_pbpu_bp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    jeniskelamin_pusat_jamkesda_ppu_pbpu_bp.xAxis[0].setCategories(arr, true, true);
                    
                    jeniskelamin_pusat_jamkesda_ppu_pbpu_bp.series[1].setData(data_jeniskelamin_1);
                    jeniskelamin_pusat_jamkesda_ppu_pbpu_bp.series[0].setData(data_jeniskelamin_2);
                    jeniskelamin_pusat_jamkesda_ppu_pbpu_bp.redraw();

                    //JENIS KELAMIN PPU
                    var arr = [];
                    var data_jeniskelamin_1 = [];
                    var data_jeniskelamin_2 = [];
                    var data_jeniskelamin = data['jeniskelamin_ppu'];
                    for(var key in data_jeniskelamin) {
                        if(eval(data_jeniskelamin[key]['laki_laki'])>0 || eval(data_jeniskelamin[key]['perempuan'])>0) {
                            var i = arr.length;
                            arr[i] = data_jeniskelamin[key]['segmen'];
                            var persentase_laki_laki = eval(data_jeniskelamin[key]['laki_laki'])/(eval(data_jeniskelamin[key]['laki_laki'])+eval(data_jeniskelamin[key]['perempuan']))*100;
                            var persentase_perempuan = eval(data_jeniskelamin[key]['perempuan'])/(eval(data_jeniskelamin[key]['laki_laki'])+eval(data_jeniskelamin[key]['perempuan']))*100;
                            data_jeniskelamin_1[i] = {y: eval(data_jeniskelamin[key]['laki_laki']), label: data_jeniskelamin[key]['laki_laki_view'], percentage: persentase_laki_laki};
                            data_jeniskelamin_2[i] = {y: eval(data_jeniskelamin[key]['perempuan']), label: data_jeniskelamin[key]['perempuan_view'], percentage: persentase_perempuan};
                        }
                    }

                    jeniskelamin_ppu.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    jeniskelamin_ppu.xAxis[0].setCategories(arr, true, true);
                    
                    jeniskelamin_ppu.series[0].setData(data_jeniskelamin_2);
                    jeniskelamin_ppu.series[1].setData(data_jeniskelamin_1);
                    jeniskelamin_ppu.redraw();
                    
                    //NIK ALL
                    var data_nik_all = [];
                    var nik_all = data['nik_all'];
                    var totalpeserta = 0;
                    for(var key in nik_all) {
                        totalpeserta=nik_all[key]['total_peserta'];
                        data_nik_all[key] = {name: nik_all[key]['nama'], y: eval(nik_all[key]['jumlah']), color: nik_all[key]['color'], label: nik_all[key]['view_jumlah']};
                    }
                    
                    if(label_total_peserta!==undefined) {
                        label_total_peserta.destroy();
                    }
                    
                    label_total_peserta = chart_nik_all.renderer.label("Total Peserta: "+totalpeserta)
                    .css({
                        width: '250px',
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

                    label_total_peserta.align(Highcharts.extend(label_total_peserta.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'bottom',
                        y: -150 // offset
                    }), null, 'spacingBox');
                        
                    chart_nik_all.series[0].setData(data_nik_all, true);
                    chart_nik_all.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_nik_all.redraw();
                    
                    //NIK PBI NON PBI
                    var arr = [];
                    var data_nik_1 = [];
                    var data_nik_2 = [];
                    var data_nik = data['nik_pbi_non_pbi'];
                    for(var key in data_nik) {
                        if(eval(data_nik[key]['dengan_nik'])>0 || eval(data_nik[key]['tanpa_nik'])>0) {
                            var i = arr.length;
                            arr[i] = data_nik[key]['segmen'];
                            data_nik_1[i] = {y: eval(data_nik[key]['dengan_nik']), label: data_nik[key]['dengan_nik_view']};
                            data_nik_2[i] = {y: eval(data_nik[key]['tanpa_nik']), label: data_nik[key]['tanpa_nik_view']};
                        }
                    }

                    chart_nik_pbi_non_pbi.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_nik_pbi_non_pbi.xAxis[0].setCategories(arr, true, true);

                    chart_nik_pbi_non_pbi.series[0].setData(data_nik_1);
                    chart_nik_pbi_non_pbi.series[1].setData(data_nik_2);
                    chart_nik_pbi_non_pbi.redraw();
                    
                    //NIK PUSAT JAMKESDA PPU PBPU BP
                    var arr = [];
                    var data_nik_1 = [];
                    var data_nik_2 = [];
                    var data_nik = data['nik_pusat_jamkesda_ppu_pbpu_bp'];
                    for(var key in data_nik) {
                        if(eval(data_nik[key]['dengan_nik'])>0 || eval(data_nik[key]['tanpa_nik'])>0) {
                            var i = arr.length;
                            arr[i] = data_nik[key]['segmen'];
                            var persentase_dengan_nik = eval(data_nik[key]['dengan_nik'])/(eval(data_nik[key]['dengan_nik'])+eval(data_nik[key]['tanpa_nik']))*100;
                            var persentase_tanpa_nik = eval(data_nik[key]['tanpa_nik'])/(eval(data_nik[key]['dengan_nik'])+eval(data_nik[key]['tanpa_nik']))*100;
                            data_nik_1[i] = {y: eval(data_nik[key]['dengan_nik']), label: data_nik[key]['dengan_nik_view'], percentage: persentase_dengan_nik};
                            data_nik_2[i] = {y: eval(data_nik[key]['tanpa_nik']), label: data_nik[key]['tanpa_nik_view'], percentage: persentase_tanpa_nik};
                        }
                    }

                    nik_pusat_jamkesda_ppu_pbpu_bp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    nik_pusat_jamkesda_ppu_pbpu_bp.xAxis[0].setCategories(arr, true, true);
                    
                    nik_pusat_jamkesda_ppu_pbpu_bp.series[0].setData(data_nik_1);
                    nik_pusat_jamkesda_ppu_pbpu_bp.series[1].setData(data_nik_2);
                    nik_pusat_jamkesda_ppu_pbpu_bp.redraw();

                    //NIK PPU
                    var arr = [];
                    var data_nik_1 = [];
                    var data_nik_2 = [];
                    var data_nik = data['nik_ppu'];
                    for(var key in data_nik) {
                        if(eval(data_nik[key]['dengan_nik'])>0 || eval(data_nik[key]['tanpa_nik'])>0) {
                            var i = arr.length;
                            arr[i] = data_nik[key]['segmen'];
                            var persentase_dengan_nik = eval(data_nik[key]['dengan_nik'])/(eval(data_nik[key]['dengan_nik'])+eval(data_nik[key]['tanpa_nik']))*100;
                            var persentase_tanpa_nik = eval(data_nik[key]['tanpa_nik'])/(eval(data_nik[key]['dengan_nik'])+eval(data_nik[key]['tanpa_nik']))*100;
                            data_nik_1[i] = {y: eval(data_nik[key]['dengan_nik']), label: data_nik[key]['dengan_nik_view'], percentage: persentase_dengan_nik};
                            data_nik_2[i] = {y: eval(data_nik[key]['tanpa_nik']), label: data_nik[key]['tanpa_nik_view'], percentage: persentase_tanpa_nik};
                        }
                    }

                    nik_ppu.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    nik_ppu.xAxis[0].setCategories(arr, true, true);
                    
                    nik_ppu.series[0].setData(data_nik_1);
                    nik_ppu.series[1].setData(data_nik_2);
                    nik_ppu.redraw();
                    
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
                        name: 'Jumlah',
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
                    
                    label_pertumbuhan_all = chart_pertumbuhan_jumlah_peserta.renderer.label("Pertumbuhan"+($('#select_bulan').val()==0?" Rata-rata":"")+": "+ summary['pertumbuhan']+($('#select_bulan').val()==0?" jiwa":" %"))
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
                        align: 'right',
                        x: -80, // offset
                        verticalAlign: 'top',
                        y: 15 // offset
                    }), null, 'spacingBox');
                    
                    
                    chart_pertumbuhan_jumlah_peserta.addSeries({                        
                        name: 'Pertumbuhan',
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
                    
                    chart_pertumbuhan_jumlah_peserta.title.update({ text: "Pertumbuhan Jumlah Peserta" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_pertumbuhan_jumlah_peserta.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_jumlah_peserta.redraw();

                    //PERTUMBUHAN PBI dan NON PBI
                    var arr = [];
                    var data_timeline = [];
                    data_timeline['pbi'] = [];
                    data_timeline['non_pbi'] = [];
                    var topics = data['pertumbuhan_pbi_non_pbi'];
                    var min_jumlah = 0;
                    var pertumbuhan_rata_rata_pbi = data['pertumbuhan_rata_rata_pbi'];
                    var pertumbuhan_rata_rata_non_pbi = data['pertumbuhan_rata_rata_non_pbi'];
                    for(var key in topics) {
                        if(key==0) {
                            min_jumlah = eval(topics[key]['jumlah_pbi'])<eval(topics[key]['jumlah_non_pbi'])?eval(topics[key]['jumlah_pbi']):eval(topics[key]['jumlah_non_pbi']);
                        }
                        arr[key] = topics[key]['periode'];
                        data_timeline['pbi'][key] = {y: eval(topics[key]['jumlah_pbi']), label: topics[key]['view_jumlah_pbi']};
                        data_timeline['non_pbi'][key] = {y: eval(topics[key]['jumlah_non_pbi']), label: topics[key]['view_jumlah_non_pbi']};
                        
                        min_jumlah = (eval(topics[key]['jumlah_pbi'])<eval(topics[key]['jumlah_non_pbi'])?eval(topics[key]['jumlah_pbi']):eval(topics[key]['jumlah_non_pbi']))<min_jumlah?(eval(topics[key]['jumlah_pbi'])<eval(topics[key]['jumlah_non_pbi'])?eval(topics[key]['jumlah_pbi']):eval(topics[key]['jumlah_non_pbi'])):min_jumlah;
                    }

                    if(label_pertumbuhan_pbi_non_pbi!==undefined) {
                        label_pertumbuhan_pbi_non_pbi.destroy();
                    }
                    
                    label_pertumbuhan_pbi_non_pbi = chart_pertumbuhan_pbi_non_pbi.renderer.label('<table><tr><td colspan="2" height="25px" valign="top">Pertumbuhan'+($('#select_bulan').val()==0?" Rata-rata":"")+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br /></td></tr><tr><td>PBI:</td><td align="right">'+pertumbuhan_rata_rata_pbi+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr><tr><td>Non PBI:&nbsp;&nbsp;&nbsp;</td><td align="right">'+pertumbuhan_rata_rata_non_pbi+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr></table>', null, null, null, null, null, true)
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
                
                    label_pertumbuhan_pbi_non_pbi.align(Highcharts.extend(label_pertumbuhan_pbi_non_pbi.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'top',
                        y: 10 // offset
                    }), null, 'spacingBox');
                    
                    while(eval(chart_pertumbuhan_pbi_non_pbi.series.length) > 0) {
                        chart_pertumbuhan_pbi_non_pbi.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_pbi_non_pbi.addSeries({                        
                        name: 'PBI',
                        color: '#FF0000',
                        data: data_timeline['pbi']
                    }, false);

                    chart_pertumbuhan_pbi_non_pbi.addSeries({
                        name: 'NON PBI',
                        color: '#0000FF',
                        data: data_timeline['non_pbi']
                    }, false);

                    chart_pertumbuhan_pbi_non_pbi.yAxis[0].setExtremes(min_jumlah, null);
                    chart_pertumbuhan_pbi_non_pbi.title.update({ text: "Pertumbuhan Jumlah Peserta PBI dan non PBI" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_pertumbuhan_pbi_non_pbi.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_pbi_non_pbi.redraw();
                
                    //PERTUMBUHAN PBI_PUSAT JAMKESDA PPU PBPU BP
                    var arr = [];
                    var data_timeline = [];
                    data_timeline['pbi'] = [];
                    data_timeline['jamkesda'] = [];
                    data_timeline['ppu'] = [];
                    data_timeline['pbpu'] = [];
                    data_timeline['bp'] = [];
                    var topics = data['pertumbuhan_pusat_jamkesda_ppu_pbpu_bp'];
                    
                    var pertumbuhan_rata_rata_pbi_pusat = data['pertumbuhan_rata_rata_pbi_pusat'];
                    var pertumbuhan_rata_rata_jamkesda = data['pertumbuhan_rata_rata_jamkesda'];
                    var pertumbuhan_rata_rata_ppu = data['pertumbuhan_rata_rata_ppu'];
                    var pertumbuhan_rata_rata_pbpu = data['pertumbuhan_rata_rata_pbpu'];
                    var pertumbuhan_rata_rata_bp = data['pertumbuhan_rata_rata_bp'];
                    
                    var _array = [];
                    for(var key in topics) {
                        _array[_array.length] = eval(topics[key]['jumlah_pbi']);
                        _array[_array.length] = eval(topics[key]['jumlah_jamkesda']);
                        _array[_array.length] = eval(topics[key]['jumlah_ppu']);
                        _array[_array.length] = eval(topics[key]['jumlah_pbpu']);
                        _array[_array.length] = eval(topics[key]['jumlah_bp']);
                        
                        arr[key] = topics[key]['periode'];
                        data_timeline['pbi'][key] = {y: eval(topics[key]['jumlah_pbi']), label: topics[key]['view_jumlah_pbi']};
                        data_timeline['jamkesda'][key] = {y: eval(topics[key]['jumlah_jamkesda']), label: topics[key]['view_jumlah_jamkesda']};
                        data_timeline['ppu'][key] = {y: eval(topics[key]['jumlah_ppu']), label: topics[key]['view_jumlah_ppu']};
                        data_timeline['pbpu'][key] = {y: eval(topics[key]['jumlah_pbpu']), label: topics[key]['view_jumlah_pbpu']};
                        data_timeline['bp'][key] = {y: eval(topics[key]['jumlah_bp']), label: topics[key]['view_jumlah_bp']};
                    }
                    var min_jumlah = Math.min.apply(Math,_array); 
                    //alert(min_jumlah);
                    if(label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp!==undefined) {
                        label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp.destroy();
                    }
                    
                    label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp = chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.renderer.label(
                            '<table><tr><td colspan="5" height="25px" valign="top">Pertumbuhan'+($('#select_bulan').val()==0?" Rata-rata":"")+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>' +
                            '<tr><td>PBI Pusat:</td><td align="right">'+pertumbuhan_rata_rata_pbi_pusat+($('#select_bulan').val()==0?" jiwa":" %")+'</td> <td width="170px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>PBPU:&nbsp;&nbsp;</td><td align="right">'+pertumbuhan_rata_rata_pbpu+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr>'+
                            '<tr><td>PBI Jamkesda:&nbsp;&nbsp;</td><td align="right">'+pertumbuhan_rata_rata_jamkesda+($('#select_bulan').val()==0?" jiwa":" %")+'</td> <td width="170px">&nbsp;</td><td>BP:</td><td align="right">'+pertumbuhan_rata_rata_bp+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr>'+
                            '<tr><td>PPU:&nbsp;&nbsp;</td><td align="right">'+pertumbuhan_rata_rata_ppu+($('#select_bulan').val()==0?" jiwa":" %")+'</td> <td width="170px">&nbsp;</td><td></td><td align="right"></td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '810px',
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
                
                    label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp.align(Highcharts.extend(label_pertumbuhan_pbi_pusat_jamkesda_ppu_pbpu_bp.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'top',
                        y: 10 // offset
                    }), null, 'spacingBox');
                    
                    
                    while(eval(chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.series.length) > 0) {
                        chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.addSeries({                        
                        name: 'PBI Pusat',
                        color: '#FF0000',
                        data: data_timeline['pbi']
                    }, false);
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.addSeries({                        
                        name: 'Jamkesda',
                        color: '#0000FF',
                        data: data_timeline['jamkesda']
                    }, false);
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.addSeries({                        
                        name: 'PPU',
                        color: '#FFFF00',
                        data: data_timeline['ppu']
                    }, false);
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.addSeries({                        
                        name: 'PBPU',
                        color: '#800080',
                        data: data_timeline['pbpu']
                    }, false);
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.addSeries({                        
                        name: 'BP',
                        color: '#008000',
                        data: data_timeline['bp']
                    }, false);
                    
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.yAxis[0].setExtremes(min_jumlah, null);
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.title.update({ text: "Pertumbuhan Jumlah Peserta PBI Pusat, Jamkesda, PPU, PBPU, dan BP" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp.redraw();
                    
                    //PERTUMBUHAN PPU
                    var arr = [];
                    var data_timeline = [];
                    data_timeline['pemerintah'] = [];
                    data_timeline['swasta'] = [];
                    var topics = data['pertumbuhan_ppu'];
                    
                    var pertumbuhan_rata_rata_pemerintah = data['pertumbuhan_rata_rata_pemerintah'];
                    var pertumbuhan_rata_rata_swasta = data['pertumbuhan_rata_rata_swasta'];
                    
                    var _array = [];
                    for(var key in topics) {
                        _array[_array.length] = eval(topics[key]['jumlah_pemerintah']);
                        _array[_array.length] = eval(topics[key]['jumlah_swasta']);
                        
                        arr[key] = topics[key]['periode'];
                        data_timeline['pemerintah'][key] = {y: eval(topics[key]['jumlah_pemerintah']), label: topics[key]['view_jumlah_pemerintah']};
                        data_timeline['swasta'][key] = {y: eval(topics[key]['jumlah_swasta']), label: topics[key]['view_jumlah_swasta']};
                    }
                    var min_jumlah = Math.min.apply(Math,_array); 
                    //alert(min_jumlah);
                    if(label_pertumbuhan_ppu!==undefined) {
                        label_pertumbuhan_ppu.destroy();
                    }
                    
                    label_pertumbuhan_ppu = chart_pertumbuhan_ppu.renderer.label(
                            '<table><tr><td colspan="5" height="25px" valign="top">Pertumbuhan'+($('#select_bulan').val()==0?" Rata-rata":"")+':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>' +
                            '<tr><td>PPU Pemerintah:&nbsp;&nbsp;</td><td align="right">'+pertumbuhan_rata_rata_pemerintah+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr>'+
                            '<tr><td>PPU Swasta:</td><td align="right">'+pertumbuhan_rata_rata_swasta+($('#select_bulan').val()==0?" jiwa":" %")+'</td></tr></table>', null, null, null, null, null, true)
                    .css({
                        width: '810px',
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
                
                    label_pertumbuhan_ppu.align(Highcharts.extend(label_pertumbuhan_ppu.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'top',
                        y: 10 // offset
                    }), null, 'spacingBox');
                    
                    
                    while(eval(chart_pertumbuhan_ppu.series.length) > 0) {
                        chart_pertumbuhan_ppu.series[0].remove(true);
                    }
                    
                    chart_pertumbuhan_ppu.addSeries({                        
                        name: 'Pemerintah',
                        color: '#FF0000',
                        data: data_timeline['pemerintah']
                    }, false);
                    
                    chart_pertumbuhan_ppu.addSeries({                        
                        name: 'Swasta',
                        color: '#0000FF',
                        data: data_timeline['swasta']
                    }, false);
                    
                    chart_pertumbuhan_ppu.yAxis[0].setExtremes(min_jumlah, null);
                    chart_pertumbuhan_ppu.title.update({ text: "Pertumbuhan Jumlah Peserta PPU Pemerintah dan Swasta" +($('#select_bulan').val()==0?" Tahun ":" Bulan "+periode['bulan']+" ") + periode['tahun'] });
                    chart_pertumbuhan_ppu.xAxis[0].setCategories(arr, true, true);
                    chart_pertumbuhan_ppu.redraw();
                    
                    //TIDAK AKTIF ALL
                    var data_tidakaktif_all = [];
                    var tidakaktif_all = data['tidakaktif_all'];
                    var total_peserta_all = 0;
                    for(var key in tidakaktif_all) {
                        data_tidakaktif_all[key] = {name: tidakaktif_all[key]['nama'], plot: tidakaktif_all[key]['plot'], y: eval(tidakaktif_all[key]['jumlah']), color: tidakaktif_all[key]['color'], label: tidakaktif_all[key]['view_jumlah']};
                        total_peserta_all =  tidakaktif_all[key]['view_total_peserta'];
                    }
                    
                    if(label_tidakaktif_total_peserta_all!==undefined) {
                        label_tidakaktif_total_peserta_all.destroy();
                    }
                    
                    label_tidakaktif_total_peserta_all = chart_tidakaktif_all.renderer.label("Total Peserta: "+total_peserta_all)
                    .css({
                        width: '270px',
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

                    label_tidakaktif_total_peserta_all.align(Highcharts.extend(label_tidakaktif_total_peserta_all.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 70 // offset
                    }), null, 'spacingBox');
                    
                    chart_tidakaktif_all.series[0].setData(data_tidakaktif_all, true);
                    chart_tidakaktif_all.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_tidakaktif_all.redraw();
                    
                    //TIDAK AKTIF NON PBI
                    var data_tidakaktif_non_pbi = [];
                    var tidakaktif_non_pbi = data['tidakaktif_non_pbi'];
                    var total_peserta_non_pbi = 0;
                    for(var key in tidakaktif_non_pbi) {
                        data_tidakaktif_non_pbi[key] = {name: tidakaktif_non_pbi[key]['nama'], plot: tidakaktif_non_pbi[key]['plot'], y: eval(tidakaktif_non_pbi[key]['jumlah']), color: tidakaktif_non_pbi[key]['color'], label: tidakaktif_non_pbi[key]['view_jumlah']};
                        total_peserta_non_pbi =  tidakaktif_non_pbi[key]['view_total_peserta'];
                    }
                    
                    if(label_tidakaktif_total_peserta_non_pbi!==undefined) {
                        label_tidakaktif_total_peserta_non_pbi.destroy();
                    }
                    
                    label_tidakaktif_total_peserta_non_pbi = chart_tidakaktif_non_pbi.renderer.label("Total Peserta Non PBI: "+total_peserta_non_pbi)
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

                    label_tidakaktif_total_peserta_non_pbi.align(Highcharts.extend(label_tidakaktif_total_peserta_non_pbi.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'top',
                        y: 70 // offset
                    }), null, 'spacingBox');
                    
                    chart_tidakaktif_non_pbi.series[0].setData(data_tidakaktif_non_pbi, true);
                    chart_tidakaktif_non_pbi.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_tidakaktif_non_pbi.redraw();

                    //TIDAK AKTIF PPU PBPU BP
                    var arr = [];
                    var data_tidakaktif_1 = [];
                    var data_tidakaktif_2 = [];
                    var data_tidakaktif = data['tidakaktif_ppu_pbpu_bp'];
                    for(var key in data_tidakaktif) {
                        if(eval(data_tidakaktif[key]['jumlah_aktif'])>0 || eval(data_tidakaktif[key]['jumlah_tidak_aktif'])>0) {
                            var i = arr.length;
                            arr[i] = data_tidakaktif[key]['nama'];
                            var persentase_aktif       = eval(data_tidakaktif[key]['jumlah_aktif'])/(eval(data_tidakaktif[key]['jumlah_aktif'])+eval(data_tidakaktif[key]['jumlah_tidak_aktif']))*100;
                            var persentase_tidak_aktif = eval(data_tidakaktif[key]['jumlah_tidak_aktif'])/(eval(data_tidakaktif[key]['jumlah_aktif'])+eval(data_tidakaktif[key]['jumlah_tidak_aktif']))*100;
                            data_tidakaktif_1[i] = {y: eval(data_tidakaktif[key]['jumlah_aktif']), label: data_tidakaktif[key]['view_jumlah_aktif'], percentage: persentase_aktif};
                            data_tidakaktif_2[i] = {y: eval(data_tidakaktif[key]['jumlah_tidak_aktif']), label: data_tidakaktif[key]['view_jumlah_tidak_aktif'], percentage: persentase_tidak_aktif};
                        }
                    }

                    chart_tidakaktif_ppu_pbpu_bp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_tidakaktif_ppu_pbpu_bp.xAxis[0].setCategories(arr, true, true);
                    
                    chart_tidakaktif_ppu_pbpu_bp.series[0].setData(data_tidakaktif_1);
                    chart_tidakaktif_ppu_pbpu_bp.series[1].setData(data_tidakaktif_2);
                    chart_tidakaktif_ppu_pbpu_bp.redraw();
                    
                    //TIDAK AKTIF PPU
                    var arr = [];
                    var data_tidakaktif_1 = [];
                    var data_tidakaktif_2 = [];
                    var data_tidakaktif = data['tidakaktif_ppu'];
                    for(var key in data_tidakaktif) {
                        if(eval(data_tidakaktif[key]['jumlah_aktif'])>0 || eval(data_tidakaktif[key]['jumlah_tidak_aktif'])>0) {
                            var i = arr.length;
                            arr[i] = data_tidakaktif[key]['nama'];
                            var persentase_aktif       = eval(data_tidakaktif[key]['jumlah_aktif'])/(eval(data_tidakaktif[key]['jumlah_aktif'])+eval(data_tidakaktif[key]['jumlah_tidak_aktif']))*100;
                            var persentase_tidak_aktif = eval(data_tidakaktif[key]['jumlah_tidak_aktif'])/(eval(data_tidakaktif[key]['jumlah_aktif'])+eval(data_tidakaktif[key]['jumlah_tidak_aktif']))*100;
                            data_tidakaktif_1[i] = {y: eval(data_tidakaktif[key]['jumlah_aktif']), label: data_tidakaktif[key]['view_jumlah_aktif'], percentage: persentase_aktif};
                            data_tidakaktif_2[i] = {y: eval(data_tidakaktif[key]['jumlah_tidak_aktif']), label: data_tidakaktif[key]['view_jumlah_tidak_aktif'], percentage: persentase_tidak_aktif};
                        }
                    }

                    chart_tidakaktif_ppu.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_tidakaktif_ppu.xAxis[0].setCategories(arr, true, true);
                    
                    chart_tidakaktif_ppu.series[0].setData(data_tidakaktif_1);
                    chart_tidakaktif_ppu.series[1].setData(data_tidakaktif_2);
                    chart_tidakaktif_ppu.redraw();
                    
                    //KELAS PERAWATAN ALL                    
                    var data_kelas_all = [];
                    var kelas_all = data['kelas_all'];
                    var total_peserta_all = 0;
                    for(var key in kelas_all) {
                        data_kelas_all[key] = {name: kelas_all[key]['nama'], y: eval(kelas_all[key]['jumlah']), color: kelas_all[key]['color'], label: kelas_all[key]['view_jumlah']};
                        total_peserta_all =  kelas_all[key]['view_total_peserta'];
                    }
                    
                    if(label_kelas_total_peserta_all!==undefined) {
                        label_kelas_total_peserta_all.destroy();
                    }
                    
                    label_kelas_total_peserta_all = chart_kelas_all.renderer.label("Total Peserta: "+total_peserta_all)
                    .css({
                        width: '270px',
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

                    label_kelas_total_peserta_all.align(Highcharts.extend(label_kelas_total_peserta_all.getBBox(), {
                        align: 'right',
                        x: -30, // offset
                        verticalAlign: 'bottom',
                        y: -50 // offset
                    }), null, 'spacingBox');
                    
                    chart_kelas_all.series[0].setData(data_kelas_all, true);
                    chart_kelas_all.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_kelas_all.redraw();
                    
                    //KELAS PERAWATAN NON PBI
                    var arr = [];
                    var data_kelas_non_pbi = [];
                    var kelas_non_pbi = data['kelas_non_pbi'];
                    var total_peserta_non_pbi = 0;
                    for(var key in kelas_non_pbi) {
                        data_kelas_non_pbi[key] = {name: kelas_non_pbi[key]['nama'], y: eval(kelas_non_pbi[key]['jumlah']), color: kelas_non_pbi[key]['color'], label: kelas_non_pbi[key]['view_jumlah']};
                        total_peserta_non_pbi =  kelas_non_pbi[key]['view_total_peserta'];                    
                    }
                    
                    if(label_kelas_total_peserta_non_pbi!==undefined) {
                        label_kelas_total_peserta_non_pbi.destroy();
                    }
                    
                    label_kelas_total_peserta_non_pbi = chart_kelas_non_pbi.renderer.label("Total Peserta Non PBI: "+total_peserta_non_pbi)
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

                    label_kelas_total_peserta_non_pbi.align(Highcharts.extend(label_kelas_total_peserta_non_pbi.getBBox(), {
                        align: 'right',
                        x: -10, // offset
                        verticalAlign: 'bottom',
                        y: -50 // offset
                    }), null, 'spacingBox');
                    
                    chart_kelas_non_pbi.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_kelas_non_pbi.series[0].setData(data_kelas_non_pbi, true);
                    chart_kelas_non_pbi.redraw();
                    
                    //KELAS PERAWATAN PPU PBPU BP
                    var arr = [];
                    var data_kelas_1 = [];
                    var data_kelas_2 = [];
                    var data_kelas_3 = [];
                    var data_kelas = data['kelas_ppu_pbpu_bp'];
                    for(var key in data_kelas) {
                        if(eval(data_kelas[key]['kelas_1'])>0 || eval(data_kelas[key]['kelas_2'])>0 || eval(data_kelas[key]['kelas_3'])>0) {
                            var i = arr.length;
                            arr[i] = data_kelas[key]['segmen'];
                            var persentase_kelas_1 = eval(data_kelas[key]['kelas_1'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            var persentase_kelas_2 = eval(data_kelas[key]['kelas_2'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            var persentase_kelas_3 = eval(data_kelas[key]['kelas_3'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            
                            data_kelas_1[i] = {y: eval(data_kelas[key]['kelas_1']), label: data_kelas[key]['kelas_1_view'], percentage: persentase_kelas_1};
                            data_kelas_2[i] = {y: eval(data_kelas[key]['kelas_2']), label: data_kelas[key]['kelas_2_view'], percentage: persentase_kelas_2};
                            data_kelas_3[i] = {y: eval(data_kelas[key]['kelas_3']), label: data_kelas[key]['kelas_3_view'], percentage: persentase_kelas_3};
                        }
                    }

                    chart_kelas_ppu_pbpu_bp.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    chart_kelas_ppu_pbpu_bp.xAxis[0].setCategories(arr, true, true);

                    chart_kelas_ppu_pbpu_bp.series[0].setData(data_kelas_1);
                    chart_kelas_ppu_pbpu_bp.series[1].setData(data_kelas_2);
                    chart_kelas_ppu_pbpu_bp.series[2].setData(data_kelas_3);
                    chart_kelas_ppu_pbpu_bp.redraw();
                    
                    
                    //KELAS PERAWATAN PPU
                    var arr = [];
                    var data_kelas_1 = [];
                    var data_kelas_2 = [];
                    //var data_kelas_3 = [];
                    var data_kelas = data['kelas_ppu'];
                    for(var key in data_kelas) {
                        if(eval(data_kelas[key]['kelas_1'])>0 || eval(data_kelas[key]['kelas_2'])>0 || eval(data_kelas[key]['kelas_3'])>0) {
                            var i = arr.length;
                            arr[i] = data_kelas[key]['segmen'];
                            var persentase_kelas_1 = eval(data_kelas[key]['kelas_1'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            var persentase_kelas_2 = eval(data_kelas[key]['kelas_2'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            //var persentase_kelas_3 = eval(data_kelas[key]['kelas_3'])/(eval(data_kelas[key]['kelas_1'])+eval(data_kelas[key]['kelas_2'])+eval(data_kelas[key]['kelas_3']))*100;
                            
                            data_kelas_1[i] = {y: eval(data_kelas[key]['kelas_1']), label: data_kelas[key]['kelas_1_view'], percentage: persentase_kelas_1};
                            data_kelas_2[i] = {y: eval(data_kelas[key]['kelas_2']), label: data_kelas[key]['kelas_2_view'], percentage: persentase_kelas_2};
                            //data_kelas_3[i] = {y: eval(data_kelas[key]['kelas_3']), label: data_kelas[key]['kelas_3_view'], percentage: persentase_kelas_3};
                        }
                    }

                    kelas_ppu.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });
                    kelas_ppu.xAxis[0].setCategories(arr, true, true);

                    kelas_ppu.series[0].setData(data_kelas_1);
                    kelas_ppu.series[1].setData(data_kelas_2);
                    //kelas_ppu.series[2].setData(data_kelas_3);
                    kelas_ppu.redraw();
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
                var option = '<option value="0">-- Bulan --</option>';
                for(var key in topics) {
                    option+='<option value="'+topics[key]['id']+'"'+(topics[key]['selected']?'selected="selected"':'')+'>'+topics[key]['nama']+'</option>';
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
                var option = '<option value="0">-- Propinsi --</option>';
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
    
    var load_detail = function(segmen, periode, propinsi, kabupaten) {
        $.ajax({
            type: 'POST',
            crossDomain: true,
            jsonpCallback: "receiveproporsidetail",
            url: server+'/kepesertaan/proporsi_detail.php?segmen='+segmen+'&periode='+periode+'&propinsi='+propinsi+'&kabupaten='+kabupaten,
            //data: $('#daftar-form').serialize(),
            dataType: 'jsonp',
            success: function(data) {
                if(data['success']) {
                    var periode = data['periode'];
                    var topics = data['topics'];
                    
                    var data_detail = [];
                    var i = 0;
                    for(var key in topics) {
                        if(eval(topics[key]['jumlah'])>0) {
                            data_detail[i] = {name: topics[key]['nama'], y: eval(topics[key]['jumlah']), visible: eval(topics[key]['jumlah'])>0, label: topics[key]['view_jumlah']};
                            i++;
                        }
                    }
                    if(i<2) return;
                    
                    chart_proporsi_ppu.series[0].setData(data_detail);
                    chart_proporsi_ppu.title.update({ text: data['title'] });
                    chart_proporsi_ppu.subtitle.update({ text: 'Keadaan '+periode['bulan']+' '+periode['tahun'] });

                } else {

                }
            },
            error: function(jqXHR, textStatus, errorThrown) { 

            } 
        });
    };
    
    $("#select_kabupaten").prop('disabled', true);
    
    $('#select_tahun').on('change', function (e) {
        load_bulan(this.value);        
    });
    
    $("#pertumbuhan_saja").show();
    $("#pertumbuhan_rata_rata").hide();
    
    $('#btn_submit').on('click', function (e) {
        load_data($('#select_bulan').val(), $('#select_propinsi').val(), $('#select_kabupaten').val(), $('#select_tahun').val());
    });
    
    $('#select_propinsi').on('change', function (e) {
        $("#select_kabupaten").prop('disabled', this.value==0);
        load_kabupaten(this.value);
    });
    
    // Initiate the chart
    var peta_cakupan = new Highcharts.Map('map_canvas', {
        credits: {
            enabled: false
        },
        title : {
            text : 'Cakupan Kepesertaan'
        },

        subtitle : {
            text : ' '
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
            y: 30
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
            renderTo: 'proporsi_all'
        },
        title: {
            text: 'Kepesertaan',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
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

    var chart_proporsi_pbi_non_pbi = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_pbi_non_pbi'
        },
        title: {
            text: 'Kepesertaan PBI dan Non PBI',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
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
    
    var chart_proporsi_pusat_jamkesda_ppu_pbpu_bp = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_pusat_jamkesda_ppu_pbpu_bp'
        },
        title: {
            text: 'Kepesertaan PBI Pusat, PBI Jamkesda, PPU, PBPU, dan BP',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false,
                point: { 
                    events: { 
                        click: function() {
                            var periode = $('#select_periode').val()===null?0:$('#select_periode').val();
                            var propinsi = $('#select_propinsi').val()===null?0:$('#select_propinsi').val();
                            var kabupaten = $('#select_kabupaten').val()===null?0:$('#select_kabupaten').val();
        
                            load_detail(this.segmen, periode, propinsi, kabupaten);                            
                        }
                    } 
                }
                        
            }
        },
        series: [{
            colorByPoint: true,
            data: []
        }]
    });
    
    var chart_proporsi_ppu = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'proporsi_ppu'
        },
        title: {
            text: 'Kepesertaan Pekerja Penerima Upah (PPU)',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    //distance: -70,
                    //y: -10,
                    //color: '#fff',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize: '12px'
                    }
                },
                showInLegend: false
            }
        },
        series: [{
            name: 'Cakupan Peserta',
            colorByPoint: true,
            data: []
        }]
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
            renderTo: 'jeniskelamin_all'
        },
        title: {
            text: 'Kepesertaan Berdasarkan Jenis Kelamin',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
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
    
    var chart_jeniskelamin_pbi_non_pbi = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'jeniskelamin_pbi_non_pbi'
        },
        title: {
            text: 'Kepeserta PBI dan Non PBI berdasarkan Jenis Kelamin',
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
            series: {
                //stacking: 'normal'
            },
            bar: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,                   
                    format: '{point.label}',
                    distance: -70,
                    //y: -10,
                    color: '#000',
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
            name: 'Laki-laki',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }, {
            name: 'Perempuan',
            color: '#AF00AF',
            colorByPoint: false,
            data: []                        
        }]
    });
    
    var jeniskelamin_pusat_jamkesda_ppu_pbpu_bp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'jeniskelamin_pusat_jamkesda_ppu_pbpu_bp'
        },
        title: {
            text: 'Kepeserta PBI Pusat, Jamkesda, PPU, PBPU, dan BP berdasarkan Jenis Kelamin',
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
                    format: '{point.label}',
                    //distance: -70,
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
        series: [{
            name: 'Perempuan',
            color: '#AF00AF',
            colorByPoint: false,
            data: []                        
        }, {
            name: 'Laki-laki',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }]
    });
    
    var jeniskelamin_ppu = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'jeniskelamin_ppu'
        },
        title: {
            text: 'Kepeserta PPU berdasarkan Jenis Kelamin',
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
                    format: '{point.label}',
                    //distance: -70,
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
        series: [{
            name: 'Perempuan',
            color: '#AF00AF',
            colorByPoint: false,
            data: []                        
        }, {
            name: 'Laki-laki',
            color: '#00279C',
            colorByPoint: false,
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
            renderTo: 'nik_all'
        },
        title: {
            text: 'Kepesertaan Berdasarkan Kepemilikan NIK',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
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
    
    var chart_nik_pbi_non_pbi = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'nik_pbi_non_pbi'
        },
        title: {
            text: 'Kepeserta PBI dan Non PBI berdasarkan Kepemilikan NIK',
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
            series: {
                //stacking: 'normal'
            },
            bar: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,                   
                    format: '{point.label}',
                    distance: -70,
                    //y: -10,
                    color: '#000',
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
            name: 'Dengan NIK',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }, {
            name: 'Tanpa NIK',
            color: '#808080',
            colorByPoint: false,
            data: []                        
        }]
    });
    
    var nik_pusat_jamkesda_ppu_pbpu_bp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'nik_pusat_jamkesda_ppu_pbpu_bp'
        },
        title: {
            text: 'Kepeserta PBI Pusat, Jamkesda, PPU, PBPU, dan BP berdasarkan Kepemilikan NIK',
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
                    format: '{point.label}',
                    //distance: -70,
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
        series: [{
            name: 'Dengan NIK',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }, {
            name: 'Tanpa NIK',
            color: '#808080',
            colorByPoint: false,
            data: []                        
        }]
    });
    
    var nik_ppu = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'nik_ppu'
        },
        title: {
            text: 'Kepeserta PPU berdasarkan Kepemilikan NIK',
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
                    format: '{point.label}',
                    //distance: -70,
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
        series: [{
            name: 'Dengan NIK',
            color: '#00279C',
            colorByPoint: false,
            data: []
        }, {
            name: 'Tanpa NIK',
            color: '#808080',
            colorByPoint: false,
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
            renderTo: 'tidakaktif_all'
        },
        title: {
            text: 'Jumlah Peserta Aktif dan Tidak Aktif (Menunggak Iuran)',
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
                    format: '{point.plot}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
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
    
    var chart_tidakaktif_non_pbi = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'tidakaktif_non_pbi'
        },
        title: {
            text: 'Jumlah Peserta Aktif dan Tidak Aktif (Menunggak Iuran) Non PBI',
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
                    format: '{point.plot}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
            layout: 'horizontal',
            verticalAlign: 'top',
            align:'center',
            x: -110,
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
    
    
    var chart_tidakaktif_ppu_pbpu_bp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'tidakaktif_ppu_pbpu_bp'
        },
        title: {
            text: 'Jumlah Peserta Aktif dan Tidak Aktif (Menunggak Iuran) PPU, PBPU, dan Bukan Pekerja (BP)',
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
                            return this.point.label+ ' (' +Highcharts.numberFormat(this.percentage, 1)+' %)';
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
        series: [{
            name: 'Aktif',
            color: '#FF0000',
            colorByPoint: false,
            data: []                        
        }, {
            name: 'Tidak Aktif (Menunggak Iuran)',
            color: '#808080',
            colorByPoint: false,
            data: []
        }]
    });
    
    var chart_tidakaktif_ppu = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'tidakaktif_ppu'
        },
        title: {
            text: 'Jumlah Peserta Aktif dan Tidak Aktif (Menunggak Iuran) PPU',
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
                            return this.point.label+ ' (' +Highcharts.numberFormat(this.percentage, 1)+' %)';
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
        series: [{
            name: 'Aktif',
            color: '#FF0000',
            colorByPoint: false,
            data: []                        
        }, {
            name: 'Tidak Aktif (Menunggak Iuran)',
            color: '#808080',
            colorByPoint: false,
            data: []
        }]
    });
    
//    var chart_jumlah_peserta_propinsi = new Highcharts.Chart({ 
//        chart: {
//            plotBackgroundColor: null,
//            plotBorderWidth: null,
//            plotShadow: false,
//            type: 'column',
//            renderTo: 'jumlah_peserta_propinsi'
//        },
//        title: {
//            text: 'Jumlah Peserta Nasional',
//            align: 'left',
//            color: 'white'
//        },
//        subtitle: {
//            text: ' ',
//            align: 'left',
//            color: 'white'
//        },
//        xAxis: {
//            categories: [],           
//            gridLineWidth: 1,
//            tickColor: '#fff',
//            labels: {
//                rotation: -35,
//                style: {
//                    color: '#000',
//                    font: '9pt Trebuchet MS, Verdana, sans-serif'
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
//            min: 0,
//            gridLineWidth: 1,
//            title: {
//                text: 'jiwa',
//                align: 'high'
//            },
//            labels: {
//                overflow: 'justify'
//            }
//        },
//        tooltip: {
//            pointFormat: '{series.name}: <b>{point.label} jt</b>'
//        },
//        plotOptions: {
//            column: {
//                allowPointSelect: true,
//                cursor: 'pointer',
//                dataLabels: {
//                    enabled: true,
//                    format: '{point.label} jt',
//                    //rotation: -90,                    
//                    align: 'center',
//                    style: {
//                        fontSize: '10px',
//                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
//                        color: 'black'
//                    }
//                },
//                showInLegend: false
//            }
//        },
//        credits: {
//            enabled: false
//        },
//        series: [{
//            name: 'Propinsi',
//            colorByPoint: true,
//            data: []            
//        }]
//    });
    
    var chart_kelas_all = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kelas_all'
        },
        title: {
            text: 'Jumlah Peserta Berdasarkan Kelas Perawatan',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
            layout: 'vertical',
            verticalAlign: 'middle',
            align:'right',
            x: -50,
            y: 70,
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
    
    var chart_kelas_non_pbi = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            renderTo: 'kelas_non_pbi'
        },
        title: {
            text: 'Jumlah Peserta Non PBI berdasarkan Kelas Perawatan',
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
                    format: '{point.name}<br />{point.label}<br />({point.percentage:.1f} %)',
                    distance: -70,
                    y: -10,
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
            enabled: true,
            layout: 'vertical',
            verticalAlign: 'middle',
            align:'right',
            x: -100,
            y: 70,
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
    
    var chart_kelas_ppu_pbpu_bp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'kelas_ppu_pbpu_bp'
        },
        title: {
            text: 'Kepeserta PBI Pusat, Jamkesda, PPU, PBPU, dan BP berdasarkan Kelas Perawatan',
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
                            return this.point.label+ ' (' +Highcharts.numberFormat(this.percentage, 1)+' %)';
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
        series: [{
            name: 'Kelas 1',
            color: '#FF0000',
            colorByPoint: false,
            data: []            
        }, {
            name: 'Kelas 2',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }, {
            name: 'Kelas 3',
            color: '#008000',
            colorByPoint: false,
            data: []            
        }]
    });
    
    var kelas_ppu = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar',
            renderTo: 'kelas_ppu'
        },
        title: {
            text: 'Kepeserta PPU berdasarkan Kelas Perawatan',
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
                            return this.point.label+ ' (' +Highcharts.numberFormat(this.percentage, 1)+' %)';
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
        series: [{
            name: 'Kelas 1',
            color: '#FF0000',
            colorByPoint: false,
            data: []            
        }, {
            name: 'Kelas 2',
            color: '#0000FF',
            colorByPoint: false,
            data: []            
        }]
    });
    
    
    load_data(0, 0, 0, 2017);
    load_tahun();
    load_bulan(2017);
    load_propinsi();
    
    Highcharts.setOptions({
        lang: {
            thousandsSep: '.'
        }
    });
    
    var chart_pertumbuhan_jumlah_peserta = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType: 'xy',
            renderTo: 'pertumbuhan_jumlah_peserta'
        },
        title: {
            text: 'Pertubuhan Jumlah Peserta',
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
            //gridLineWidth: 1,
            min: 160000000,
            max: 200000000,
            //tickInterval: 20*1000000,
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
                    return Highcharts.numberFormat(this.value/1000000, 0) + ' Jt';
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
                    //fontWeight: 'bold',
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
    
    var chart_pertumbuhan_pbi_non_pbi = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pertumbuhan_pbi_non_pbi'
        },
        title: {
            text: 'Pertubuhan Jumlah Peserta PBI dan Bukan PBI',
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
        yAxis: {
            //gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
            tickInterval: 10*1000000,
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
                    return Highcharts.numberFormat(this.value/1000000, 0) + ' Jt';
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
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
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
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
    
    var chart_pertumbuhan_pusat_jamkesda_ppu_pbpu_bp = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pertumbuhan_pusat_jamkesda_ppu_pbpu_bp'
        },
        title: {
            text: 'Pertumbuhan Peserta PBI Pusat, Jamkesda, PPU, PBPU, dan BP',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'center'
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
        yAxis: {
            //gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
            tickInterval: 10*1000000,
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
                    return Highcharts.numberFormat(this.value/1000000, 0) + ' Jt';
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
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
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
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
    
    var chart_pertumbuhan_ppu = new Highcharts.Chart({ 
        credits: {
            enabled: false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            renderTo: 'pertumbuhan_ppu'
        },
        title: {
            text: 'Pertumbuhan Peserta PPU',
            align: 'center'
        },
        subtitle: {
            text: ' ',
            align: 'center'
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
        yAxis: {
            //gridLineWidth: 1,
            //min: 155*1000000,
            //max: 187*1000000,
            tickInterval: 10*1000000,
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
                    return Highcharts.numberFormat(this.value/1000000, 0) + ' Jt';
                },
                style: {
                    color: '#333',
                    //fontWeight: 'bold',
                    fontSize: '9pt',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                }
            }
        },
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
                        fontSize: '12px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif',
                        color: '#000'
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
    
});