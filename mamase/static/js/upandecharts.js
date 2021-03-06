
var icon = 'https://s3.amazonaws.com/mamase/static/images/location30.png'
var icon1 = 'https://s3.amazonaws.com/mamase/static/images/red_marker.png'
var daily = []
var monthly = []
var raw = []
var weather_station_name = ""
var weather_station = ""
var station_id = ""
var weather_variable = "Rain"
var weather_variable_id = '5'
var time_interval = "raw"
var month = 0
var month_text = "Jan"
var year = 2014
var aggr_variable = "avg"
var chart_type = 'category'
var id
var dt = new Date();
var myarry = [];
var datatype = 'raw'
var mylist = []
var variable_ids = []
var monthlyData = []
var batchMonthlyData 
var allchannels
var allrivers
var is_river = false //Used to check if we need to pull river data
var river_id 
var river_point_names = []
var river_point_ids = []
var river_point_dataids = []
var river_channels = []


          var station_type = 'WEATHER_STATION' //Define either a WEATHER_STATION or RIVER_DEPTH

          var Lat = -0.943496;
          var Lon = 35.424305;
          var Zoom = 8;
          var prevLatLong = [-0.943496,35.424305]
          var graph_description = 'Raw Data'
          var map
          var vectorLayer
          var container = document.getElementById('popup');
          var content = document.getElementById('popup-content');
          var closer = document.getElementById('popup-closer');

          closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
          };

          /**
           * Create an overlay to anchor the popup to the map.
           */
           var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            }
          }));

           var startdate = ""
           var enddate = ""
           var dataset = []
           var chart
           var table
           var coordinates = []
           var coordinate_names = []
           var station_ids = []
           var coordinate_ids = []


           var monthly_data = [
           ["Mulot", 25, 37, 32, 31, 37, 21, 22, 23, 33, 34, 23, 26, ],
           ["Kerook", 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, ],
           ["Govener's Camp", 21, 31, 22, 26, 25, 37, 23, 33, 34, 23, 32, 37, ],
           ["Mara Conservancy", 21, 22, 23, 33, 34, 23, 26, 25, 37, 32, 31, 37, ],
           ["Bomet", 25, 37, 32, 31, 37, 21, 22, 23, 33, 34, 23, 26, ],
           ["Narotia", 25, 37, 32, 31, 37, 21, 22, 23, 33, 34, 23, 26, ],
           ["Rekaro", 25, 37, 32, 31, 37, 21, 22, 23, 33, 34, 23, 26, ],
           ["Talek", 25, 37, 32, 31, 37, 21, 22, 23, 33, 34, 23, 26, ],
           ["Mara River", 21, 23, 33, 34, 37, 32, 31, 37, 21, 22, 23, 26, ],
           ];
           var daily_data = [
           ["Mulot", 2, 7, 12, 3, 7, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 3, 6, 31, 37, 21, 22, 23, 33, 7, 6],
           ["Kerook", 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 3, 6, 31, 37, 21, 22, 23, 33, 7, 6],
           ["Govener's Camp", 21, 31, 22, 26, 25, 37, 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 3, 6, 31, 37],
           ["Mara Conservancy", 21, 22, 23, 33, 21, 31, 22, 26, 25, 37, 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 34, 23, 26, 25],
           ["Bomet", 25, 37, 32, 31, 37, 21, 22, 23, 33, 21, 31, 22, 26, 25, 37, 33, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 21, 22, 23, 33, 34, 23, 26],
           ["Narotia", 25, 37, 32, 31, 21, 22, 23, 33, 21, 31, 22, 26, 25, 37, 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 34, 23, 26],
           ["Rekaro", 21, 22, 23, 33, 21, 31, 22, 26, 25, 37, 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 21, 22, 23, 33, 34, 23, 26],
           ["Talek", 25, 37, 32, 31, 37, 21, 2, 7, 12, 3, 7, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 3, 6, 31, 37, 21, 26],
           ["Mara River", 21, 2, 7, 12, 3, 7, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 3, 6, 31, 37, 21, 0, 37, 21, 22, 23, 26],
           ];
           var raw_data = [
           ["Mara Conservancy", 21, 22, 23, 33, 21, 31, 22, 26, 25, 37, 33, 34, 23, 26, 21, 11, 20, 2, 33, 34, 23, 26, 21, 22, 23, 25, 37, 32, 31, 37, 34, 23, 26, 25],
           ];
           var time1 = ['station', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
           var xaxis = ['station', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


          //// ----- Selet Aggregation Type
          function selectAggregation(selaggregation) {
            aggr_variable = selaggregation.value

            define_monthly_daily_data(newdata)
            plotMonthly_daily(mydata)
            changeDatatablesData();
          }


          ////Unload data before loading new data
          function refreshAndloadData() {
            myarry = [];
            newdata = [];
            variable_ids = [];
            pullData(id, month, year)
          }


          function reloadMap(Lon,Lat) {
            $('#map').empty()
            loadMap(Lon,Lat)
          }


          function refreshmap(Lon, Lat) {
            //$('#map').empty()
            //loadMap(Lon,Lat)
            var coordinates 
            var selectedStation

            map.getLayers().forEach(function(layer, i) {
              name = layer.get('name');
              if (name == 'coordinatesLayer'){//Map with all other coordinates
                coordinates = layer
              }
              if (name == 'selectedStationLayer'){//Map with all other coordinates
                selectedStation = layer
              }
            })
            map.removeLayer(coordinates);
            map.removeLayer(selectedStation);
            createMarker(Lon, Lat);
          }





          function table2csv(oTable, exportmode, tableElm) {
            var csv = '';
            var headers = [];
            var rows = [];

              //// Get header names
              $(tableElm + ' thead').find('th').each(function() {
                var $th = $(this);
                var text = $th.text();
                var header = '"' + text + '"';
                  //// headers.push(header); // original code
                  if (text != "") headers.push(header); //// actually datatables seems to copy my original headers so there ist an amount of TH cells which are empty
                });
              csv += headers.join(',') + "\n";

              //// get table data
              if (exportmode == "full") { //// total data
                var total = oTable.fnSettings().fnRecordsTotal()
                for (i = 0; i < total; i++) {
                  var row = oTable.fnGetData(i);
                  row = strip_tags(row);
                  rows.push(row);
                }
              } else { //// visible rows only
                $(tableElm + ' tbody tr:visible').each(function(index) {
                  var row = oTable.fnGetData(this);
                  row = strip_tags(row);
                  rows.push(row);
                })
              }
              csv += rows.join("\n");

              //// if a csv div is already open, delete it
              if ($('.csv-data').length) $('.csv-data').remove();
              //// open a div with a download link
              $('body').append('<div class="csv-data"><form enctype="multipart/form-data" method="post" action="/csv.php"><textarea class="form" name="csv">' + csv + '</textarea><input type="submit" class="submit" value="Download as file" /></form></div>');

            }

            if (is_loggedin == 'False'){
              isenabled = false;
            }
            else{
              isenabled = true;
            }

            table = $('#charttable').DataTable({
              dom: 'Bfrtip',
              buttons: [
                {
                    extend: 'csvHtml5',
                    enabled: isenabled,
                }
              //'csvHtml5',
              //'copyHtml5',
              //'excelHtml5',
              ],
              data: dataset,
              columns: [{
                title: "Station Name"
              }, {
                title: "Jan"
              }, {
                title: "Feb"
              }, {
                title: "Mar"
              }, {
                title: "Apr"
              }, {
                title: "May"
              }, {
                title: "Jun"
              }, {
                title: "Jul"
              }, {
                title: "Aug"
              }, {
                title: "Sep"
              }, {
                title: "Oct"
              }, {
                title: "Nov"
              }, {
                title: "Dec"
              }],
            });



          ////change station
          function selectStation(selstation) {
            weather_station = selstation.value;
            var selectedstationchoice = selstation.selectedOptions[0];
            weather_station_name = selectedstationchoice['label']
            station_id = selectedstationchoice['id'];
            id = weather_station

            is_river = false

            var tslink = document.getElementById("thingspeaklink");
            tslink.innerHTML = 'Data source: <a href="https://thingspeak.com/channels/'+station_id+'/">https://thingspeak.com/channels/'+station_id+'/</a>'

            if (datatype == 'raw') {
              refreshAndloadData(id, month, year)
            } else {
              drawGraph_monthly_daily(id, month, year, datatype)
            }
          }

          ////change river 
          function selectRiver(selriver) {
            weather_station = selriver.value;
            var selectedstationchoice = selriver.selectedOptions[0];
            weather_station_name = selectedstationchoice['label']
            station_id = selectedstationchoice['id'];
            river_id = weather_station

            is_river = true //To tell pull data to pull data by river id

            var tslink = document.getElementById("thingspeaklink");
            //tslink.innerHTML = 'Data source: <a href="https://thingspeak.com/channels/'+station_id+'/">https://thingspeak.com/channels/'+station_id+'/</a>'
            tslink.innerHTML = ''

            //How do I tell the function to pull river data
            if (datatype == 'raw') {
              refreshAndloadData(id, month, year)
            } else {
              drawGraph_monthly_daily(id, month, year, datatype)
            }
          }

        ////change station from the map
        function selectStationFromMap(station_id,station_name, data_id) {
            //Set Id and Name of current station to the selected station
            weather_station = station_id;
            weather_station_name = station_name;
            station_id = data_id;
            id = weather_station

            var tslink = document.getElementById("thingspeaklink");
            tslink.innerHTML = 'Data source: <a href="https://thingspeak.com/channels/'+station_id+'/">https://thingspeak.com/channels/'+station_id+'/</a>'

            //Change the selected item to the selected on
            $('#selectstation').val(station_id);
            
            if (datatype == 'raw') {
              refreshAndloadData(id, month, year)
            } else {
              drawGraph_monthly_daily(id, month, year, datatype)
            }
          }




          ////change weather variable
          function weatherVariable(selweather) {
            weather_variable = selweather.value;
            weather_variable_id = selweather[selweather.selectedIndex].id;
            //pullData(id,month,year)

                if (datatype == 'raw') {
                  pullData(id,month,year)
                } else {
                  drawGraph_monthly_daily(id, month, year, datatype)
                    }
              }





          ////change month
          function selectedMonth(selmonth) {
            month = selmonth.value - 1;
            
            if (datatype == 'raw') {
              refreshAndloadData(id, month, year)
            } else {
              drawGraph_monthly_daily(id, month, year, datatype)
            }
          }






          ////change year
          function selectedYear(selyear) {
            year = selyear.value;

            if (datatype == 'raw') {
              refreshAndloadData(id, month, year)
            } else {
              drawGraph_monthly_daily(id, month, year, datatype)
            }


          }





          ////change time interval  
          function timeInterval(interval) {
            datatype = interval.value;
            time_interval = datatype

            $("#selectaggregation").prop("disabled", false).css('opacity', 1);
            $("#selectriveraggregation").prop("disabled", false).css('opacity', 1);

            if (datatype == 'monthly') {
                  ////Disable month selection if monthly data is selected
                  $("#month").prop("disabled", true).css('opacity', 0.5);
                  $("#rivermonth").prop("disabled", true).css('opacity', 0.5);

                  ////redefine start and end dates to beging n end of year
                  ////to do

                } else {
                  $("#month").prop("disabled", false).css('opacity', 1);
                  $("#rivermonth").prop("disabled", false).css('opacity', 1);
                }


                if (datatype == 'raw') {
                  $("#selectaggregation").prop("disabled", true).css('opacity', 0.5);
                  $("#selectriveraggregation").prop("disabled", true).css('opacity', 0.5);

                  pullData(id,month,year)
                } else {
                  ////call data from API using time_interval
                  //// and start date, end date and  channel

                  ////pull data 
                  drawGraph_monthly_daily(id, month, year, datatype)
                      ////define plot data based on aggr and time step
                      ////define_monthly_daily_data()
                    }
                  }





          ////extract weather variable from myarry
          function defineNewdata() {
            //Implement an all view
            if (weather_variable == 'all'){
              newdata = []
              newdata = myarry

              return newdata
            }
            else {
              for (var i = 0; i < myarry.length; i++) {
                if (myarry[i][0] == weather_variable) {
                      ////select particular weather variable data 
                      newdata = []
                      newdata = [myarry[0], myarry[i]]

                      return newdata
                    }
                  }
                }
              }



              function getChannelCoordnates() {
                $.ajax({
                  type: 'GET',
                  url: "/mamase/channel/?type="+ station_type,
                  dataType: "json",
                  success: function(data) {
                    
                    allchannels = data.channels
                    allrivers = data.rivers
                    data = data.channels;

                    for (var x = 0; x < data.length; x++) {
                      coordinate_names.push(data[x].name)
                      station_ids.push(data[x].data_id)
                      coordinates.push([data[x].longitude,data[x].latitude])
                      coordinate_ids.push(data[x].id)                        
                    }
                      //load data
                      loadMap(Lon,Lat);   
                      //Load the channels dropdown before calling the data. 
                      //This should only be loaded during initialization or when display mode changes          
                      create_channel_items();//Also runs pull data
                    }
                  });
              }


          ////Get monthly data for chosen field and populate it on datatables
          function populateDatatables(selID) {
            if (selID != 'all'){
                  dataset = []
                  monthlyData = batchMonthlyData[weather_variable_id] //data.feed[0].monthly
                  channels = allchannels //data.channel
                  for (var x = 0; x < channels.length; x++) {
                    //Check if the channel has this field
                    for (var y = 0; y < channels[x].fields.length; y++){
                      if (channels[x].fields[y].field__id == weather_variable_id){
                        //Push the number of months this year.
                        temp_list = Array(13).fill('-')
                        temp_list[0] = channels[x].name                        
                        dataset.push(temp_list)
                        //eval('dataset.push(["' + channels[x].name + '",null,null,null,null,null,null,null,null,null,null,null,null])');
                      }
                    }                    
                  }            

                  try {
                    eval('tabledata = monthlyData.' + aggr_variable)
                  }
                  catch (err) {       
                    console.log(err)
                    alert("no data found");
                  }
                  for (var i = 0; i < tabledata.length; i++) {
                    for (var j = 0; j < dataset.length; j++) {
                      if (dataset[j][0] == tabledata[i].channelfield__channel__name) {
                                    //Get the value of the month and add one since it jan is represented as 0
                                    m = moment(tabledata[i].timestamp, 'YYYY-MM-DD').month() + 1
                                    //if there is no reading, add a dash.
                                    //Do a check for null values. Also do a check for missing data
                                    eval('tempreading = roundoff(tabledata[i].reading__' + aggr_variable+')')
                                    if (isNaN(tempreading)){
                                      tempreading = '-';
                                    }
                                    dataset[j][m] = tempreading                                  
                                  }
                                }
                              }
                              datatset = dataset.join(", ")

                              table.clear().rows.add(dataset).draw();


                         //   }
                         // });
            }
            else{
              table.clear().draw();
            }
          }

          ////Get monthly data for chosen field and populate it on datatables
          function changeDatatablesData() {
              dataset = []
              for (var x = 0; x < channels.length; x++) {
                //Check if the channel has this field
                for (var y = 0; y < channels[x].fields.length; y++){
                  if (channels[x].fields[y].field__id == weather_variable_id){
                    //Push the number of months this year.
                    temp_list = Array(13).fill('-')
                    temp_list[0] = channels[x].name                        
                    dataset.push(temp_list)
                    //eval('dataset.push(["' + channels[x].name + '",null,null,null,null,null,null,null,null,null,null,null,null])');
                  }
                }                    
              }            

              eval('tabledata = monthlyData.' + aggr_variable)
              for (var i = 0; i < tabledata.length; i++) {
                for (var j = 0; j < dataset.length; j++) {
                  if (dataset[j][0] == tabledata[i].channelfield__channel__name) {
                                //Get the value of the month and add one since it jan is represented as 0
                                m = moment(tabledata[i].timestamp, 'YYYY-MM-DD').month() + 1
                                //if there is no reading, add a dash.
                                //Do a check for null values. Also do a check for missing data
                                eval('tempreading = roundoff(tabledata[i].reading__' + aggr_variable+')')
                                if (isNaN(tempreading)){
                                  tempreading = '-';
                                }
                                dataset[j][m] = tempreading                                  
                              }
                            }
                          }
                          datatset = dataset.join(", ")

                          table.clear().rows.add(dataset).draw();

      }

          ////Get monthly data for chosen field and populate it on datatables
          function populateRainTempTable(weather_variable_id) {
                  dataset = []
                  //monthlyData = batchMonthlyData[weather_variable_id] //data.feed[0].monthly
                  monthlyData = batchMonthlyData[weather_variable_id]
                  channels = allchannels

                    for (var y = 0; y < channels[0].fields.length; y++){
                        //Push the number of months this year.
                        temp_list = Array(13).fill('-')
                        temp_list[0] = channels[0].fields[y].name                        
                        dataset.push(temp_list)                       
                    }                    
                  try {
                    eval('tabledata = monthlyData.' + aggr_variable)                    
                  }
                  catch (err) {       
                    console.log(err)
                    alert("no data found");
                  }
                  for (var i = 0; i < tabledata.length; i++) {
                    for (var j = 0; j < dataset.length; j++) {
                      if (dataset[j][0] == tabledata[i].channelfield__name) {
                                    //Get the value of the month and add one since it jan is represented as 0
                                    m = moment(tabledata[i].timestamp, 'YYYY-MM-DD').month() + 1
                                    //if there is no reading, add a dash.
                                    //Do a check for null values. Also do a check for missing data
                                    eval('tempreading = roundoff(tabledata[i].reading__' + aggr_variable+')')
                                    if (isNaN(tempreading)){
                                      tempreading = '-';
                                    }
                                    dataset[j][m] = tempreading
                                  }
                                }
                              }
                     for (var j = 0; j < dataset.length; j++) { //Just two loops in rain temp view
                          //Rename the first item in the list from fieldX to variable name
                          dataset[j][0] = channels[0].fields[j].field__name 
                      }

                          datatset = dataset.join(", ")
                          table.clear().rows.add(dataset).draw();         
          }          

          ////load existing weather variables
          function populateRiverPoints() {
            $('#selectriverpoint').empty(); 
            
                  ////create a list of existing fields, e.g rain, temp, humidity etc
                  mylist = []
                  for (var i = 0; i < river_channels.length; i++) {
                    myoption = river_channels[i]['name']
                    myid = river_channels[i]['id']
                    mydataid = river_channels[i]['data_id']

                    mylist.push(myoption)

                    $('#selectriverpoint').append($('<option>', {
                      label: myoption,
                      value: myid,
                      text: myoption,
                      id: mydataid
                    }));

                  }

              ////check whether current weather_variable in present in mylist
              ////if it does not, change weather_variable value to that of the first item in mylist
              var check = $.inArray(weather_variable, mylist)
              if (check == -1) {

                var e = document.getElementById("weathervariables");

                var strUser = e.options[e.selectedIndex].value;
                var strID = e.options[e.selectedIndex].id;
                weather_variable = strUser
                weather_variable_id = strID


              }
              ////select the appropriate text in the weather dropdown 
              var weather_text = weather_variable;
              $('#weathervariables option').filter(function() {

                return $(this).text() == weather_text;
              }).prop('selected', true);

            }



          ////load existing weather variables
          function populateWeathervariables(myarry) {
              $('#weathervariables').empty() //empty weather variable list

                  ////create a list of existing fields, e.g rain, temp, humidity etc
                  mylist = []
                  for (var i = 1; i < myarry.length; i++) {
                    myoption = myarry[i][0]
                    myid = variable_ids[i - 1]

                    mylist.push(myoption)

                    $('#weathervariables').append($('<option>', {
                      value: myoption,
                      text: myoption,
                      id: myid
                    }));

                  }

              ////check whether current weather_variable in present in mylist
              ////if it does not, change weather_variable value to that of the first item in mylist
              var check = $.inArray(weather_variable, mylist)
              if (check == -1) {              
                //for rain_temp show all variables on the chart. This is dirty but works
                if (station_type == 'RAIN_TEMP'){
                  weather_variable = 'all'
                }
                else{                
                  var e = document.getElementById("weathervariables");
                  var strUser = e.options[e.selectedIndex].value;
                  var strID = e.options[e.selectedIndex].id;
                  weather_variable = strUser
                  weather_variable_id = strID
                }

              }
              ////select the appropriate text in the weather dropdown 
              var weather_text = weather_variable;
              $('#weathervariables option').filter(function() {

                return $(this).text() == weather_text;
              }).prop('selected', true);

            }






          ////Load map
          function loadMap(Lon, Lat) {

            map = new ol.Map({
              target: 'map',
              overlays: [overlay],  
              view: new ol.View({
                projection: 'EPSG:3857',
                center: ol.proj.fromLonLat([Lon, Lat]),
                zoom: Zoom
              })
            });
            /**
             * Add a click handler to the map to render the popup.
             */
             map.on('singleclick', function(evt) {
              var feature_id
              var name = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                feature_id = feature.get('id')
                data_id = feature.get('data_id')
                return feature.get('name');
              });
              if (name){
                var coordinate = evt.coordinate;
                content.innerHTML = '<p>You are viewing:</p><code><a href="javascript.void(0);" onclick="selectStationFromMap(\''+feature_id+'\',\''+name+'\',\''+data_id+'\');return false;">' + name +'</a></code>';
                overlay.setPosition(coordinate);
              }              
            });

             var source2 = new ol.source.TileWMS({
              url: 'http://maps.mamase.org/geoserver/geonode/wms',
              params: {'LAYERS': 'geonode:river_utm36s'},
              serverType: 'geoserver',
            });

             var mamase_river = new ol.layer.Tile({
                //extent: ol.proj.transformExtent ([33.520563492664415,-2.1410073709074036,36.21835384204506,-0.1176646088719224],'EPSG:32736', 'EPSG:3857'),
                source: source2,
                name: 'mamaseriver',
                id: 4,
              });

             var osmlayer = new ol.layer.Tile({
              source: new ol.source.OSM(),
              name: 'osmlayer',
              id: 1,
            });

             map.addLayer(osmlayer);
             if (station_type == 'RIVER_DEPTH'){
              map.addLayer(mamase_river)
            }
            createMarker(Lon, Lat)
          }


          function createMarker(Lon, Lat) {
              ////define vector source
              var vectorSource = new ol.source.Vector({
                  ////create empty vector
                });

              ////create an icon and add to source vector
              var iconFeature = new ol.Feature({
                geometry: new
                ol.geom.Point(ol.proj.transform([Lon, Lat], 'EPSG:4326', 'EPSG:3857')),
                name: weather_station_name,
                data_id: station_id,
                id: weather_station,         
              });

              ////and add to source vector   
              vectorSource.addFeature(iconFeature);
              //features = [vectorSource]

              

              ////create the icon style
              var iconStyle = new ol.style.Style({
                image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                  anchor: [0.5, 4],
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'pixels',
                  opacity: 1,
                  src: icon1
                }))
              });



              ////add the feature vector to the layer vector, and apply a style to whole layer
              var selectedStationLayer = new ol.layer.Vector({
               source: vectorSource,
               style: iconStyle,
               name: 'selectedStationLayer',
               id: 2,
             });

              coordinatesLayer = addMarkersToMap();
              map.addLayer(selectedStationLayer);
              map.addLayer(coordinatesLayer);
            }



            function addMarkersToMap(){
              var coordinatesource = new ol.source.Vector({});
              ////This function will load other points to the vector
              for (var x = 0; x < coordinates.length; x++) {  
                if ( coordinates[x][0] != Lon && coordinates[x][1] != Lat ) {
                  var coordinateicon = new ol.Feature({
                    geometry: new
                    ol.geom.Point(ol.proj.transform(coordinates[x], 'EPSG:4326', 'EPSG:3857')),
                    name: coordinate_names[x],
                    data_id: station_ids[x],
                    id: coordinate_ids[x],
                  });
                  coordinatesource.addFeature(coordinateicon);
                //vectorSource.addFeature(coordinateicon);
                //features.push(coordinatesource)
              }                
            }

                            ////create the icon style
                            var coordinateStyle = new ol.style.Style({
                              image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                                anchor: [0.5, 4],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                opacity: 0.8,
                                src: icon
                              }))
                            });

                            var coordinatesLayer = new ol.layer.Vector({
                             source: coordinatesource,
                             style: coordinateStyle,
                             name: 'coordinatesLayer',
                             id: 3,
                           });
                            return coordinatesLayer;
                          }

          ////To add controls for river depth
          function loadRiverDepthView() {            
            $("#controls_div").hide();
            $("#river_depth_control_div").show();
            getChannelCoordnates();
          }




          ////To add controls for weather station depth
          function loadStationView() {  
            $("#controls_div").show();
            $("#river_depth_control_div").hide();
            $('#weathervariablecolumn').show();
            $('#weathervariableheader').show();
            getChannelCoordnates();
          }


          ////To add controls for rain temp view
          function loadRainTempView() {  
            $("#controls_div").show();
            $('#weathervariablecolumn').hide();
            $('#weathervariableheader').hide();
            $("#river_depth_control_div").hide();
            weather_variable = 'all'
            weather_variable_id = 'all'
            getChannelCoordnates();
          }

          function reinitialize(modevalue) {
            station_type = modevalue.value
            coordinates = []
            coordinate_names = []
            station_ids = []
            coordinate_ids =[]
            aggr_variable = 'avg'
            time_interval = 'raw'
            datatype = 'raw'

            $('#timeinterval option').filter(function() {
                 return $(this).val() == time_interval;
            }).prop('selected', true);

            $("#selectaggregation").prop("disabled", true).css('opacity', 0.5);
            $("#selectriveraggregation").prop("disabled", true).css('opacity', 0.5)
          }

          ////select display mode
          function selMode(modevalue) {            
            reinitialize(modevalue)
          
            if (station_type == 'WEATHER_STATION') {
              is_river = false
              loadStationView();
              //alert("No data at the moment");
            }
            else if (station_type == 'RIVER_DEPTH'){    
              is_river = true          
              loadRiverDepthView();  
              //alert("No data at the moment");            
            }
            else if (station_type == 'RAIN_TEMP') {
              is_river = false
              loadRainTempView();
            }
          }




          ////draw graph for monthly data
          function drawGraph() {
            chart = c3.generate({
              bindto: '#charter',
              data: {
                x: 'created',
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns: newdata,
              },
              tooltip: {
                      grouped: false //tooltip for one graph at a time
                    },
                    axis: {
                      x: {
                        type: 'timeseries',  
                        label: time_interval + ' data on ' + weather_station_name,                
                        tick: {
                          count: 5,
                          format: '%Y-%m-%d %H:%M:%S',
                          fit: true
                        }
                      },
                      y: {
                        label: weather_variable,
                      }
                    }
                  });
          }





          function drawGraph_monthly_daily(id, month, year, datatype) {

              ////Fxn to display loading image on load
              $("#spinner").bind("ajaxSend", function() {
                $(this).show();
              }).bind("ajaxStop", function() {
                $(this).hide();
              }).bind("ajaxError", function() {
                $(this).hide();
              });

              definenewdate(month, year)

              $.ajax({

                type: 'GET',
                url: "/mamase/api/feed/?channel=" + id + "&field=" + weather_variable_id + "&start=" + startdate + "&end=" + enddate + "&data=" + datatype + "&stationtype=" + station_type + '&tabledata=true',
                dataType: "json",

                success: function(data) {
                  channel = data.channel[0]

                  prevLatLong[0] = Lat
                  prevLatLong[1] = Lon

                  Lon = channel.longitude
                  Lat = channel.latitude

                  eval('var feeds = data.feed[0].' + datatype)
                  count = feeds.count
                  sum = feeds.sum
                  avg = feeds.average
                  min = feeds.min
                  max = feeds.max
                  count_len = count.length
                  
                  batchMonthlyData = data.monthlydata

                      //channel_obj = Object.keys(channel); //// convert to an object
                      len = channel.fields.length; //get length of obj


                      var created = ['created']
                      myarry = [];
                      variable_ids = [];
                      var myarry_min = []
                          ///
                          field = "";


                      for (var i = 0; i < len; i++) { //loop thru all fields

                          var fieldname = channel.fields[i].field__name ////Whereas the fields have specific names, they have labels on thingspeak. This shall be used to access data from the api e.g field1
                          var fieldlabel = channel.fields[i].name
                          var field = channel.fields[i].name
                          var fieldid = channel.fields[i].field__id
                          variable_ids.push(fieldid)
                          eval('var ' + field + ' = ["' + fieldname + '"];')

                          //field = 'field' + (1 + i),

                              ////define a variable field dynamically: for every field
                              ////define populate first array with field name, e.g "Rain"
                              //eval('var ' + field + ' = ["' + (channel.fields[i].field) + '"]');

                              $('#channeldesc').html(channel.description);
                              $('#channelname').html(channel.name);

                              var count = ['count']
                              var sum = ['sum']
                              var avg = ['avg']
                              var min = ['min']
                              var max = ['max']
                              eval('var ' + field + '__count = [""]');

                              for (var j = 0; j < count_len; j++) {

                              ////assign the value of the ith field to f1
                              ///Check if the item in the loop is of the same type e.g field1
                              if (fieldlabel == feeds.count[j].channelfield__name)
                              {
                                n = feeds.count[j].timestamp;

                              if (created.length <= count_len) { ////if created is shorter than myarry
                                created.push(n)
                              }
                              eval('var count_val =' + 'feeds.count[j].' + 'reading' + '__count');
                              eval('var sum_val =' + 'feeds.sum[j].' + 'reading' + '__sum');
                              eval('var avg_val =' + 'feeds.avg[j].' + 'reading' + '__avg');
                              eval('var max_val =' + 'feeds.max[j].' + 'reading' + '__max');
                              eval('var min_val =' + 'feeds.min[j].' + 'reading' + '__min');
                              count.push(count_val)
                              sum.push(sum_val)
                              max.push(max_val)
                              min.push(min_val)
                              avg.push(avg_val)
                            }
                              //else do nothing

                            }

                            if (myarry.length == 0) {
                              myarry.push(created)
                            }
                            var combined = [count, avg, sum, max, min]
                            eval(field + '.push(combined)');

                            eval('myarry.push(' + field + ')')


                          }

                          populateWeathervariables(myarry)
                          defineNewdata(myarry)

                          define_monthly_daily_data(newdata)
                          plotMonthly_daily(mydata)

                          if (station_type == 'RAIN_TEMP'){
                            console.log(weather_variable_id);
                            populateRainTempTable(weather_variable_id)
                          }
                          else{
                            populateDatatables(weather_variable_id)                            
                          }

                        }
                      })
}






          //Extracts data with the appropriate aggr
          function define_monthly_daily_data(newdata) {
            mydata = [myarry[0]];
            for (i = 0; i < 5; i++) {//why 5? Because of there are 5 agggregation variables
              if (station_type == 'RAIN_TEMP'){
                     for (var x = 1; x < newdata.length; x++) {//Ignore the first collumn of newdata                        
                       if (newdata[x][1][i][0] == aggr_variable) {
                         temp_list = newdata[x][1][i]  //To replate the aggregation label with the weather variable  
                         temp_list[0] = newdata[x][0]                      
                         mydata.push(temp_list)
                       }
                     }
                   }  
                   else{
                    if (newdata[1][1][i][0] == aggr_variable) {
                      temp_list = newdata[1][1][i]
                      temp_list[0] = newdata[1][0] 
                      mydata.push(temp_list)
                    }
                  }              
                }
                return mydata
              }





          ////Fxn to plot daily and monthly data
          function plotMonthly_daily(mydata) {
            var chart = c3.generate({
              bindto: '#charter',
              data: {
                x: 'created',
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns: mydata
              },
              tooltip: {
                      grouped: false ////one graph at a time
                    },
                    axis: {
                      x: {
                        type: 'timeseries',
                        label: time_interval + ' data on ' + weather_station_name,
                        tick: {
                          format: '%Y-%m-%d %H'
                        }
                      },
                      y: {
                        label: weather_variable,
                      }
                    }

                  });
          }





          function definenewdate(month, year) {
            if (datatype == "monthly") {  
              var start = moment([year]).format('YYYY-MM-DD');
              var end = moment([year]).add(1, "year").format('YYYY-MM-DD'); 

            } else {
              var start = moment([year, month]).format('YYYY-MM-DD');
              var end = moment([year, month]).add(1,"month").format('YYYY-MM-DD')
            }            

            startdate = start;
            enddate = end;

            myarry = []
            variable_ids = []
          }





          function drawDatatable(dataset) {


            $body = $("body");

            $(document).on({
              ajaxStart: function() {
                $body.addClass("loading");
              },
              ajaxStop: function() {
                $body.removeClass("loading");
              }
            });

            $(document).ready(function() {


            });
          }





          ////Fxn to pull data from the API
          function pullData(id,month,year) {
              ////Fxn to display loading image on load

              $("#spinner").bind("ajaxSend", function() {
                $(this).show();
              }).bind("ajaxStop", function() {
                $(this).hide();
              }).bind("ajaxError", function() {
                $(this).hide();
              });


              ////define start and end dates
              definenewdate(month, year);

              ////for testing
              ////datatype="monthly"

              //Define url here
              if (is_river == false){
               url = "/mamase/api/feed/?channel=" + id + "&field=" + weather_variable_id + "&start=" + startdate + "&end=" + enddate + "&data=" + datatype + "&stationtype=" + station_type + '&tabledata=true'
             }
             else{
               url = "/mamase/api/feed/?river=" + river_id +"&field=" + weather_variable_id +  "&start=" + startdate + "&end=" + enddate + "&data=" + datatype + "&stationtype=" + station_type + '&tabledata=true'
             }           

              ////pull data from api and (create myarry) 
              $.ajax({

                type: 'GET',

                url: url,
                dataType: "json",
                success: function(data) {

                  var channel = data.channel[0]

                  river_channels = data.channel

                  try {
                    prevLatLong[0] = Lat
                    prevLatLong[1] = Lon

                    Lon = channel.longitude
                    Lat = channel.latitude
                  } catch (err) {       
                    console.log(err)
                    alert("no data found");
                  }

                  var feeds = data.feed
                  batchMonthlyData = data.monthlydata
                  //allchannels = data.allchannels


                      //channel_obj = Object.keys(channel); //// convert to an object
                      var len = channel.fields.length
                      var created = ['created']
                          ///
                          var field = "";
                      for (var i = 0; i < len; i++) { ////loop thru all fields
                          var fieldname = channel.fields[i].field__name ////Whereas the fields have specific names, they have labels on thingspeak. This shall be used to access data from the api e.g field1

                          var field = channel.fields[i].name
                          //var fieldid = channel.fields[i].id
                          var fieldid = channel.fields[i].field__id
                          variable_ids.push(fieldid)
                          eval('var ' + field + ' = ["' + fieldname + '"];')//Confilicting variables?

                          for (var j = 0; j < feeds.length; j++) {

                            var n = feeds[j].timestamp_formatted;
                              if (created.length <= feeds.length) { ////if created is not in myarry
                                created.push(n);
                              }
                              try {
                                eval('var f1 =' + 'feeds[j].fields.' + field);                                
                                if (f1 === undefined){f1=null;}//Removing undefined data
                              } catch (err) {
                                console.log(err)
                                var f1 = null
                              }
                              eval(field + '.push(f1)');

                            }
                          if (myarry[0] == null) { ////if created is not in myarry
                            myarry.push(created)
                          }
                          eval('myarry.push(' + field + ')')
                              ////weather_variable="Temperature"
                            }

                      ////Disable non-existing weather Variables
                      populateWeathervariables(myarry)
                      if (is_river){
                        populateRiverPoints()
                      }
                      defineNewdata(myarry)
                      drawGraph(newdata)
                      //refreshmap(Lon, Lat)
                      reloadMap(Lon,Lat)
                      if (station_type == 'RAIN_TEMP'){
                            populateRainTempTable(weather_variable_id)
                          }
                          else{
                            populateDatatables(weather_variable_id)                            
                      }
                    },

                  });
            }

            function create_channel_items(){
              //Prepoplate the select button with available channels.
              //By default start with weather stations
              //Load data for the first weather station

              //$.ajax({
              //  type: 'GET',
              //  url: "/mamase/channel/?type="+ station_type,
              //  dataType: "json",
              //  success: function(data) {
                  var riverelement = document.getElementById('river'); 
                  if (station_type == 'RIVER_DEPTH'){
                    var stationselect = document.getElementById('selectriverpoint');                    
                  }
                  else{
                    var stationselect = document.getElementById('selectstation');
                  }                   
                  option = '';
                  riverlist = '';

                  rivers = allrivers
                  data = allchannels
                  river_point_ids = []
                  river_point_names = []
                  river_point_dataids = []


              //Load data for the first item in the list
              if (is_river == true){
                river_id = rivers[rivers.length-1]['id']
                id = river_point_ids[0]
                weather_station = i

                ///set the weather_station as the first variables
                weather_station_name = rivers[rivers.length-1]['name']
                station_id = data[data.length-1]['data_id'] 
                weather_variable_id = data[data.length-1]['fields'][0]['field__id']             
              }
              else{
                id = data[data.length-1]['id']
                weather_station = data[data.length-1]['id']

                ///set the weather_station as the first variables
                weather_station_name = data[data.length-1]['name']
                station_id = data[data.length-1]['data_id']
                weather_variable_id = data[data.length-1]['fields'][0]['field__id']
              }

              var tslink = document.getElementById("thingspeaklink");
              tslink.innerHTML = 'Data source: <a href="https://thingspeak.com/channels/'+station_id+'/">https://thingspeak.com/channels/'+station_id+'/</a>'

              //For some weird reason, seems the ID does not change when calling pull data.
              //Call it after this function              
              for (var i = data.length - 1; i >= 0; i--) {
                if (is_river == true) {
                  if (data[i]['name'].indexOf(weather_station_name) > -1){
                    option += '<option label="'+data[i]['name']+'" id="'+data[i]['data_id']+'" value="'+data[i]['id']+'">'+data[i]['name']+'</option>'
                    river_point_names.push(data[i]['name']);
                    river_point_ids.push(data[i]['id']);
                    river_point_dataids.push(data[i]['data_id']);
                  }
                }
                else{
                  option += '<option label="'+data[i]['name']+'" id="'+data[i]['data_id']+'" value="'+data[i]['id']+'">'+data[i]['name']+'</option>'                  
                } 
              }
              
              
              for (var i = rivers.length - 1; i >= 0; i--) {
                riverlist += '<option label="'+rivers[i].name+'" value="'+rivers[i].id+'">'+rivers[i].name+'</option>'
              }              

              stationselect.innerHTML = option;
              riverelement.innerHTML = riverlist

              if (is_river == true){                
                id = river_point_ids[0]
                weather_station = id
                weather_station_name = river_point_names[0]
                station_id = river_point_dataids[0]            
              }

              pullData(id,month,year,river_id);
              //}

              //});              
            }


            function strip_tags(html) {
              var tmp = document.createElement("div");
              tmp.innerHTML = html;
              return tmp.textContent || tmp.innerText;
            }


            function roundoff(num) 
            { return Math.round(num * 100) / 100  ;
            }


            $(document).ready(function($) {

              window.onload = function(e) {

          //// export only what is visible right now (filters & paginationapplied)
          $('#export_visible').click(function(event) {
            event.preventDefault();
            table2csv(oTable, 'visible', 'table.display');
          })





          //// export all table data
          $('#export_all').click(function(event) {
            event.preventDefault();
            table2csv(oTable, 'full', 'table.display');
          })



          ///Initialization stuff

          var asInitVals = new Array();

          getChannelCoordnates()

          $('#year option').filter(function() {

           return $(this).text() == year;
         }).prop('selected', true);


                  ////get current date
                  var dt = new Date();

                  ////split date to year and month
                  year = dt.getFullYear();
                  month = dt.getMonth();
                  
                  ////select the appropriate year in the year dropdown
                  $('#year option').filter(function() {

                    return $(this).text() == year;
                  }).prop('selected', true);

                  ////select the appropriate month in the month dropdown
                  $('#month option').filter(function() {

                    return $(this).val() == month + 1;
                  }).prop('selected', true);
                  
                  $('#rivermonth option').filter(function() {

                    return $(this).val() == month + 1;
                  }).prop('selected', true);

                  ////select the appropriate timeinterval in the timeinterval dropdown    
                  $('#timeinterval option').filter(function() {

                    return $(this).val() == time_interval;
                  }).prop('selected', true);

                  ////select the appropriate aggr in the timeinterval dropdown    
                  $('#selectaggregation option').filter(function() {

                    return $(this).val() == aggr_variable;
                  }).prop('selected', true);
                  $('#selectriveraggregation option').filter(function() {

                    return $(this).val() == aggr_variable;
                  }).prop('selected', true);

                  $("#selectaggregation").prop("disabled", true).css('opacity', 0.5);
                  $("#selectriveraggregation").prop("disabled", true).css('opacity', 0.5);

                  ////select the appropriate time interval in the timeinterval dropdown   
                  $('#timeinterval option').filter(function() {

                    return $(this).val() == datatype;
                  }).prop('selected', true);


                }
              });