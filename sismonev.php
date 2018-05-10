<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SISMONEV TERPADU JKN</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.6 -->
  <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="dist/css/AdminLTE.kepesertaan.css">
  <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
  <link rel="stylesheet" href="dist/css/skins/_all-skins.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="plugins/iCheck/square/blue.css">
  <style>
        #nav_bar {
            background: #fff;
            border-bottom: 3px solid #08c;
        }
        
        .navbar-fixed {
            position: fixed;
            background: #fff;
            width: 100%;
            left: 0;
            top: 0;
            z-index: 999999999999;
            border-bottom: 3px solid #08c;
        }

        .marquee {
            overflow: hidden;        
            padding: 4px;
            overflow: hidden;
            font-size: 18px;
            color: #000;
            font-family: "Verdana", Helvetica, sans-serif;
            -webkit-font-smoothing: antialiased;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.004);
        }

  </style>
  
  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
</head>

<body class="skin-blue sidebar-mini wysihtml5-supported sidebar-collapse">
    <div class="wrapper">
        <div class="content-wrapper">
    
            <!-- Main content -->
            <section class="content">
                
                <div id="header_logo" class="row">
                    <div class="col-lg-12 col-xs-12">
                        <img src="dist/img/background_djsn.png" style="width: 100%;" />
                    </div>
                </div>
                
                <div id="nav_bar" class="row" style="margin: 0px 0px 0px 0px; ">
                    <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
                        <ul class="nav navbar-nav box-info">
                            <li class="active" style="background-color: #EBF4FA;"><a href=""><b>BERANDA</b></a></li>
                            <li><a href="kepesertaan/"><b>KEPESERTAAN</b></a></li>
                            <li><a href="pelayanan/"><b>PELAYANAN</b></a></li>
                            <li><a href="organisasi/"><b>ORGANISASI</b></a></li>
                            <li><a href="../iuran/"><b>IURAN</b></a></li>
                            <li><a href="../pembayaran/"><b>PEMBAYARAN</b></a></li>
                            <li><a href="../keuangan/"><b>KEUANGAN</b></a></li>
                        </ul>
                    </div>
                    <div class="pull-right-container">
                        <div style="padding: 10px;">
                            <span class="label pull-right bg-green" style="padding: 5px;"><span id="hari_ini" style="font-size: 12px;"></span></span><span class="label pull-right">&nbsp;</span>
                            <span class="label pull-right bg-yellow" style="padding: 5px;"><span id="pengunjung" style="font-size: 12px;"></span></span>
                        </div>  
                    </div>
                    <div class="col-lg-12 col-xs-12" style="border-top: 1px solid #D1D0CE; display: none; ">
                        <div class="row">
                            <section class="col-lg-6 col-xs-12 content-header">
                                <h1>&nbsp;Home</h1>
                            </section>

                            <div class="col-lg-6 col-xs-12">
                                <table style="width: 100%; margin-top: 10px;">
                                    <tr>
                                        <td width="30%">
                                            <!-- label> &nbsp;Periode: </label -->
                                            <div class="form-group">
                                                <select id="select_periode" class="form-control" style="width: 100%;">
                                                </select>
                                            </div>
                                        </td>
                                        <td>&nbsp;&nbsp;&nbsp;</td>
                                        <td width="33%">
                                            <!-- label> &nbsp;Propinsi: </label -->
                                            <div class="form-group">
                                                <select id="select_propinsi" class="form-control" style="width: 100%;">
                                                </select>
                                            </div>
                                        </td>
                                        <td>&nbsp;&nbsp;&nbsp;</td>
                                        <td width="37%">
                                            <!-- label> &nbsp;Kabupaten: </label -->
                                            <div class="form-group">                
                                                <select id="select_kabupaten" class="form-control" style="width: 100%;">
                                                </select>                            
                                            </div>
                                        </td>                                
                                    </tr>
                                </table>
                            </div>                            
                        </div>
                    </div>                    
                </div>
                
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        &nbsp;
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="map_canvas"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- div class="row">
                    <div class="col-lg-3 col-xs-12">
                        <div class="small-box bg-aqua">
                            <div class="inner">
                                <h3><span id="jumlah">171,939,254</span></h3>

                                <p>Total Peserta</p>
                            </div>

                            <div class="icon">
                                <i class="ion ion-pie-graph"></i>
                            </div>

                            <a href="kepesertaan/" class="small-box-footer">View detail <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-12">
                        <div class="small-box bg-green">
                            <div class="inner">
                                <h3><span id="cakupan">22,776</span></h3>

                                <p>Fasilitas Kesehatan</p>
                            </div>

                            <div class="icon chart-responsive">
                                <canvas id="pieChartCakupan" height="85" width="85"></canvas>
                            </div>

                            <a href="pelayanan/" class="small-box-footer">View detail <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-12">
                        <div class="small-box bg-yellow">
                            <div class="inner">
                                <h3><span id="pertumbuhan">&nbsp;</span><sup style="font-size: 20px"> </sup></h3>
                                <h3><span id="pertumbuhan">&nbsp;</span></h3>

                                <p>&nbsp;</p>
                            </div>

                            <div class="icon chart-responsive">
                                <canvas id="pieChartPertumbuhan" height="85" width="85"></canvas>
                            </div>

                            <a href="#" class="small-box-footer">View detail <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-12">
                        <div class="small-box bg-red">
                            <div class="inner">
                                <h3><span id="tidakaktif">&nbsp;</span><sup style="font-size: 20px"> </sup></h3>

                              <p>&nbsp;</p>
                            </div>

                            <div class="icon chart-responsive">
                                <canvas id="pieChartTidakaktif" height="85" width="85"></canvas>
                            </div>

                            <a href="#" class="small-box-footer">View detail <i class="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div -->
                
                <div class="row">
                    <div class="col-lg-4 col-xs-12">
                        <div class="box box-info">
                            <div class="box-header with-border">
                                <h3 class="box-title">Kepesertaan</h3>
                            </div>
                            
                            <!-- /.box-header -->
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Jumlah Peserta</span></td>
                                                <td align="right"><span id="jumlah" style="font-size: 16px;">&nbsp;</span> </td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Cakupan</span></td>
                                                <td align="right"><span id="cakupan" style="font-size: 16px;">&nbsp;</span> </td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Pertumbuhan</span></td>
                                                <td align="right"><span id="pertumbuhan" style="font-size: 16px;">&nbsp;</span> </td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Perserta Tidak Aktif</span></td>
                                                <td align="right"><span id="tidakaktif" style="font-size: 16px;">&nbsp;</span> </td>
                                            </tr>
                                      </tbody>
                                    </table>                                  
                              </div>
                              <!-- /.table-responsive -->
                            </div>
                            <!-- /.box-body -->
                            <div class="box-footer clearfix">
                              <a href="kepesertaan/index.php" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                            <!-- /.box-footer -->
                        </div>                                   
                    </div>
                    <div class="col-lg-4 col-xs-12">
                        <div class="box box-warning">
                            <div class="box-header with-border">
                                <h3 class="box-title">Pelayanan</h3>
                            </div>
                            
                            <!-- /.box-header -->
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Jumlah Faskes</span></td>
                                                <td align="right"><span id="pelayanan_jumlah" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Jumlah FKTP</span></td>
                                                <td align="right"><span id="jumlah_fktp" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Jumlah FKTL</span></td>
                                                <td align="right"><span id="jumlah_fktl" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Jumlah Kunjungan</span></td>
                                                <td align="right"><span id="jumlah_kunjungan" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                  
                              </div>
                              <!-- /.table-responsive -->
                            </div>
                            <!-- /.box-body -->
                            <div class="box-footer clearfix">
                              <a href="pelayanan/index.php" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                            <!-- /.box-footer -->
                        </div>                                   
                    </div>
                    
                    <div class="col-lg-4 col-xs-12">
                        <div class="box box-info">
                            <div class="box-header with-border">
                                <h3 class="box-title">Organisasi</h3>
                            </div>
                            
                            <!-- /.box-header -->
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Kantor Pusat</span></td>
                                                <td align="right"><span style="font-size: 16px;">1</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Divisi Regional</span></td>
                                                <td align="right"><span style="font-size: 16px;">13</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Kantor Cabang</span></td>
                                                <td align="right"><span style="font-size: 16px;">124</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">KLOK</span></td>
                                                <td align="right"><span style="font-size: 16px;">391</span></td>
                                            </tr>                                            
                                      </tbody>
                                    </table>
                                  
                              </div>
                              <!-- /.table-responsive -->
                            </div>
                            <!-- /.box-body -->
                            <div class="box-footer clearfix">
                              <a href="organisasi/index.php" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                            <!-- /.box-footer -->
                        </div>                                   
                    </div>
                    
                    <!-- div class="col-lg-4 col-xs-12">
                        <div class="box box-warning">
                            <div class="box-header with-border">
                                <h3 class="box-title">Iuran</h3>
                            </div>
                            
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Iuran</span></td>
                                                <td align="right"><span style="font-size: 16px;">Rp. 5.142 T</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Jatuh Tempo</span></td>
                                                <td align="right"><span style="font-size: 16px;">Rp. 2.776 T</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Penerimaan Iuran</span></td>
                                                <td align="right"><span style="font-size: 16px;">Rp. 2.365 T</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Iuran Rata-rata</span></td>
                                                <td align="right"><span style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                      </tbody>
                                    </table>
                                  
                              </div>
                            </div>
                            
                            <div class="box-footer clearfix">
                              <a href="iuran/public/" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                            
                        </div>                                   
                    </div -->
                    
                    <!-- div class="col-lg-4 col-xs-12">
                        <div class="box box-info">
                            <div class="box-header with-border">
                                <h3 class="box-title">Keuangan</h3>
                            </div>
                            
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Pendapatan</span></td>
                                                <td align="right"><span id="pendapatan" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Beban</span></td>
                                                <td align="right"><span id="beban" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Hutang</span></td>
                                                <td align="right"><span id="hutang" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Aset</span></td>
                                                <td align="right"><span id="aset" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                      </tbody>
                                    </table>
                                  
                              </div>
                            </div>
                            
                            <div class="box-footer clearfix">
                              <a href="keuangan/index.html" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                        
                        </div>                                   
                    </div -->
                    
                    <!-- div class="col-lg-4 col-xs-12">
                        <div class="box box-warning">
                            <div class="box-header with-border">
                                <h3 class="box-title">Pembayaran</h3>
                            </div>
                            
                            <div class="box-body">
                                <div class="table-responsive">
                                    <table class="table no-margin no-border">
                                        <tbody>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Pembayaran</span></td>
                                                <td align="right"><span id="pembayaran"  style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Total Kasus</span></td>
                                                <td align="right"><span id="kasus" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Kapitasi</span></td>
                                                <td align="right"><span id="kapitasi" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                            <tr>
                                                <td><span style="font-size: 16px; ">Rasio</span></td>
                                                <td align="right"><span id="rasio" style="font-size: 16px;">&nbsp;</span></td>
                                            </tr>
                                      </tbody>
                                    </table>
                                  
                              </div>
                            </div>
                            <div class="box-footer clearfix">
                              <a href="pembayaran/index.html" class="btn btn-sm btn-info btn-flat pull-right">View Detail</a>
                            </div>
                        </div>                                   
                    </div -->                                        
                </div>
                
                
                
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                                <li class="pull-left header"><i class="fa fa-inbox"></i> Kepesertaan</li>
                            </ul>
                            <ul class="nav nav-tabs pull-left">
                                <li class="active"><a href="#kepesertaan-proporsi" data-toggle="tab">Proporsi</a></li>
                                <li><a href="#kepesertaan-pertumbuhan" data-toggle="tab">Pertumbuhan</a></li>
                                <li><a href="#kepesertaan-jeniskelamin" data-toggle="tab">Jenis Kelamin</a></li>
                                <li><a href="#kepesertaan-kelas" data-toggle="tab">Kelas Perawatan</a></li>
                                <li><a href="#kepesertaan-nik" data-toggle="tab">Identitas Peserta (NIK)</a></li>
                                <li><a href="#kepesertaan-tidakaktif" data-toggle="tab">Tidak Aktif</a></li>
                            </ul>

                            <div class="tab-content no-padding">
                                <div class="chart tab-pane active" id="kepesertaan-proporsi" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="kepesertaan-pertumbuhan" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="kepesertaan-jeniskelamin" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="kepesertaan-kelas" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="kepesertaan-nik" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="kepesertaan-tidakaktif" style="position: relative; height:460px;"></div>
                            </div>
                        </div>                                                            
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                                <li class="pull-left header"><i class="fa fa-inbox"></i> Pelayanan</li>
                            </ul>
                            <ul class="nav nav-tabs pull-left">
                                <li class="active"><a href="#proporsi_fktl_fktp" data-toggle="tab">Proporsi</a></li>
                                <li><a href="#proporsi_rs_berdasarkan_kelas" data-toggle="tab">Kelas Pelayanan</a></li>
                                <li><a href="#proporsi_rs_berdasarkan_tingkat" data-toggle="tab">Tingkat Pelayanan</a></li>
                                <li><a href="#distribusi_peserta_fktp" data-toggle="tab">Distribusi Peserta</a></li>
                            </ul>

                            <div class="tab-content no-padding">
                                <div class="chart tab-pane active" id="proporsi_fktl_fktp" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="proporsi_rs_berdasarkan_kelas" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="proporsi_rs_berdasarkan_tingkat" style="position: relative; height:460px;"></div>
                                <div class="chart tab-pane" id="distribusi_peserta_fktp" style="position: relative; height:460px;"></div>
                            </div>
                        </div>                                    
                    </div>
                    
                </div>
                
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                                <li class="pull-left header"><i class="fa fa-inbox"></i> Organisasi</li>
                            </ul>
                            <ul class="nav nav-tabs pull-left">
                                <li class="active"><a href="#map_canvas_cabang" data-toggle="tab">Kantor Cabang</a></li>
                                <li><a href="#map_canvas_divre" data-toggle="tab">Divisi Regional</a></li>
                                
                            </ul>

                            <div class="tab-content no-padding">
                                <div class="chart tab-pane active" id="map_canvas_cabang" style="position: relative; width: 100%; height:540px;"></div>
                                <div class="chart tab-pane" id="map_canvas_divre" style="position: relative; width: 100%; height:540px;"></div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 100%;" id="pertumbuhan_faskes_fktp"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-6 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 100%;" id="fktl"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-6 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 100%;" id="pertumbuhan_faskes_fktl"></div>
                            </div>
                        </div>
                    </div>
                </div -->
                
                
            </section>
        </div>
    </div>
    <!-- ./wrapper -->
    
    <!-- jQuery 2.2.3 -->
    <script src="plugins/jQuery/jquery-2.2.3.min.js"></script>
    <!-- jQuery UI 1.11.4 -->
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script>
      $.widget.bridge('uibutton', $.ui.button);
    </script>
    <!-- Bootstrap 3.3.6 -->
    <script src="bootstrap/js/bootstrap.min.js"></script>

    <!-- iCheck -->
    <script type="text/javascript" src="plugins/iCheck/icheck.min.js"></script>
    <script type="text/javascript" src="dist/js/jquery.marquee_1.js"></script>

    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnJaD1W6xwO3QMUHL1KI97H07VMEo8xqM&sensor=false"></script>
    <script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
    <script type="text/javascript" src="http://code.highcharts.com/modules/exporting.js"></script>
    
    <script src="http://cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js"></script>
    <script type="text/javascript" src="https://code.highcharts.com/maps/modules/map.js"></script>
    <script type="text/javascript" src="https://code.highcharts.com/maps/modules/exporting.js"></script>
    <script src="dist/js/id-all.js"></script>
    <script>
        var ip_address = "<?=(!empty($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']));?>";        
    </script>
    <script src="dist/js/server.js"></script>
    <script src="app.js"></script>
</body>
</html>