<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SISMONEV TERPADU JKN | Aspek Keuangan</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.6 -->
  <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../dist/css/AdminLTE.kepesertaan.css">
  <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
  <link rel="stylesheet" href="../dist/css/skins/_all-skins.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="../plugins/iCheck/square/blue.css">
  <link rel="stylesheet" href="../dist/css/jquery.mloading.css">
  <style>
        .blink {
          animation: blink-animation 1s steps(5, start) infinite;
          -webkit-animation: blink-animation 1s steps(5, start) infinite;
        }
        @keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }
        @-webkit-keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }
        
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
              <!-- Small boxes (Stat box) -->

                <div id="header_logo" class="row">
                    <div class="col-lg-12 col-xs-12">
                        <img src="../dist/img/background_djsn.png" style="width: 100%;" />
                    </div>
                </div>
                
                <div id="nav_bar" class="row" style="margin: 0px 0px 0px 0px; ">
                    <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
                        <ul class="nav navbar-nav box-info">
                            <li><a href="../sismonev.php"><b>HOME</b></a></li>
                            <li><a href="../kepesertaan/"><b>KEPESERTAAN</b></a></li>
                            <li><a href="../pelayanan/"><b>PELAYANAN</b></a></li>
                            <li><a href="../organisasi/"><b>ORGANISASI</b></a></li>
                            <li><a href="../iuran/"><b>IURAN</b></a></li>
                            <li><a href="../pembayaran/"><b>PEMBAYARAN</b></a></li>
                            <li class="active" style="background-color: #EBF4FA;"><a href=""><b>KEUANGAN</b></a></li>
                        </ul>
                    </div>
                    
                    <div class="pull-right-container">
                        <div style="padding: 10px;">
                            <span class="label pull-right bg-green" style="padding: 5px;"><span id="hari_ini" style="font-size: 12px;"></span></span><span class="label pull-right">&nbsp;</span>
                            <span class="label pull-right bg-yellow" style="padding: 5px;"><span id="pengunjung" style="font-size: 12px;"></span></span>
                        </div>  
                    </div>
                    
                    <div class="col-lg-12 col-xs-12" style="border-top: 1px solid #D1D0CE;">
                        <div class="row">
                            <section class="col-lg-8 col-xs-12 content-header">
                                <h1>&nbsp;Aspek Keuangan</h1>
                                <br />
                            </section>

                            <div class="col-lg-4 col-xs-12">
                                <table style="width: 100%; margin-top: 10px;">
                                    <tr>
                                        <td width="30%">
                                            <!-- label> &nbsp;Periode: </label -->
                                            <div class="form-group">
                                                <select id="select_tahun" class="form-control" style="width: 100%;">
                                                </select>
                                            </div>
                                        </td>
                                        <td>&nbsp;&nbsp;&nbsp;</td><td width="70%">
                                            <!-- label> &nbsp;Periode: </label -->
                                            <div class="form-group">
                                                <select id="select_bulan" class="form-control" style="width: 100%;">
                                                </select>
                                            </div>
                                        </td>
                                        <td>&nbsp;&nbsp;&nbsp;</td>
                                        <td width="10%">
                                            <!-- label> &nbsp;Cari: </label -->
                                            <div class="form-group">                
                                                <div id="btn_submit" type="submit" class="btn btn-primary"><span style="font-weight: bold;">TAMPILKAN</span></div>                                                                    
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
                    <div class="col-lg-3 col-xs-6">
                        <div class="small-box bg-aqua">
                            <div class="inner">
                                <h3><span id="summary_1_nilai"></span><sup style="font-size: 20px"> <span id="summary_1_satuan"></span></sup></h3>
                                <p><span id="summary_1_nama"></span><span id="summary_1_blink" class="blink" style="font-weight: bold; color: red; display: none;"><br />Data <span id="text_summary_1_blink"></span></span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-6">
                        <div class="small-box bg-green">
                            <div class="inner">
                                <h3><span id="summary_2_nilai"></span><sup style="font-size: 20px"> <span id="summary_2_satuan"></span></sup></h3>
                                <p><span id="summary_2_nama"></span><span id="summary_2_blink" class="blink" style="font-weight: bold; color: red; display: none;"><br />Data <span id="text_summary_2_blink"></span></span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-6">
                        <div class="small-box bg-yellow">
                            <div class="inner">
                                <h3><span id="summary_3_nilai"></span><sup style="font-size: 20px"> <span id="summary_3_satuan"></span></sup></h3>
                                <p><span id="summary_3_nama"></span><span id="summary_3_blink" class="blink" style="font-weight: bold; color: red; display: none;"><br />Data <span id="text_summary_3_blink"></span></span></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-3 col-xs-6">
                        <!-- small box -->
                        <div class="small-box bg-red">
                            <div class="inner">
                                <h3><span id="summary_4_nilai"></span><sup style="font-size: 20px"> <span id="summary_4_satuan"></span></sup></h3>
                                <p><span id="summary_4_nama"></span><span id="summary_4_blink" class="blink" style="font-weight: bold; color: white; display: none;"><br />Data <span id="text_summary_4_blink"></span></span></p>
                            </div>
                        </div>
                    </div>
                </div>
              
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="pembayaran_pendapatan_periode"></div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="pendapatan_periode"></div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <div class="row">
                    <div class="col-lg-6 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="klaim_rasio_per_segmen_jumlah"></div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 col-xs-12">
                        <div class="box box-info">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height:540px;" id="klaim_rasio_per_segmen_persen"></div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="rasio_likuiditas_periode"></div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="cadangan_teknis_periode"></div>
                            </div>
                        </div>
                    </div>
                </div>
              
                
              
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="box box-danger">
                            <div class="tab-content no-padding">
                                <div style="width:100%; height: 540px;" id="cadangan_teknis"></div>
                            </div>
                        </div>
                    </div>
                </div>
              
                
              
            </section>
            <!-- /.content -->

        </div>
    </div>
    <!-- ./wrapper -->
    
    <!-- jQuery 2.2.3 -->
    <script src="../plugins/jQuery/jquery-2.2.3.min.js"></script>
    <script src="../dist/js/jquery.mloading.js"></script>
    <!-- jQuery UI 1.11.4 -->
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script>
      $.widget.bridge('uibutton', $.ui.button);
    </script>
    <!-- Bootstrap 3.3.6 -->
    <script src="../bootstrap/js/bootstrap.min.js"></script>

    <!-- AdminLTE for demo purposes -->
    <!-- script src="../dist/js/demo.js"></script -->

    <!-- iCheck -->
    <script type="text/javascript" src="../plugins/iCheck/icheck.min.js"></script>
    <script type="text/javascript" src="../dist/js/jquery.marquee_1.js"></script>
    <script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
    <script type="text/javascript" src="http://code.highcharts.com/modules/exporting.js"></script>
    <script>
        var ip_address = "<?=(!empty($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']));?>";        
    </script>
    
    <script src="../dist/js/server.js"></script>
    <script src="app.js"></script>    
    
</body>
</html>
