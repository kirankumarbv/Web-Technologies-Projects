var fb_address;
var fb_icon;
var fb_summary;
var fb_temperature;
var fb_unit;

/* Facebook post button */

window.fbAsyncInit = function() {
	FB.init({
		appId      : '650861211683682',
		xfbml      : true,
		version    : 'v2.5',
    });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
function feedPost(){	
    FB.login(function(response){
	if (response.authResponse){
        FB.ui({
            method: 'feed',
            name: "Current Weather in " + fb_address,
            link: "http://www.forecast.io",
            description: fb_summary + ", " + fb_temperature + fb_unit,
            picture: fb_icon,
            caption: "WEATHER INFORMATION FROM FORECAST IO ",
            display: "popup"
	   },function(response){ if(response && response.post_id){alert("Posted Successfully");} });
    }
    else{
        alert('Not Posted');
    }
	});
}



$( document ).ready(function() {
            $('#saddr').on('change keyup focusout',function(){	
                if($('#saddr').val().trim() != ""){
                    $('#errorStreet').css('visibility', 'hidden');
                }else{
                    $('#errorStreet').css('visibility', 'visible');
                }
	       });
	       $('#city').on('change keyup focusout',function(){
                if($('#city').val().trim() != ""){
                    $('#errorCity').css('visibility', 'hidden');
                }else{
                    $('#errorCity').css('visibility', 'visible');
                }
	       });
	       $('#state').on('change keyup focusout',function(){	
                if($('#state').val().trim() != ""){
                    $('#errorState').css('visibility', 'hidden');
                }else{
                    $('#errorState').css('visibility', 'visible');
                }
	       });
    
    $("#Clear").click(function(){
        $('#errorStreet').css('visibility','hidden');
        $('#errorCity').css('visibility','hidden');
        $('#errorState').css('visibility','hidden');
        $('#temperature').prop("checked",true);
        $('#saddr').val("");
        $('#city').val("");
        $('#state').val("");
        $('#outputId').css('visibility','hidden');
        $('#openLayerMap').html("");
    });
    });
    

function formValidator() {
    var saddr, city, state, temperature;
    var flag=true;
    
    saddr = $('#saddr').get(0);
    city = $('#city').get(0);
    state = $('#state').get(0);
    temperature = $('input[id="temperature"]:checked').val();
    
    if($.trim(saddr.value)=="") {
        flag=false;
        $('#errorStreet').css('visibility','visible');
    }
    
    if($.trim(city.value)=="") {
        flag=false;
        $('#errorCity').css('visibility','visible');
    }
    
    if($.trim(state.value)=="") {
        flag=false;
        $('#errorState').css('visibility','visible');
    }
    
    if(flag) {
        parseData(saddr.value,city.value,state.value,temperature);
    }
}

function icon_return(current_icon_name) {
    var current_icon;
    if(current_icon_name == "clear-day")
        current_icon = "clear.png";
    else if(current_icon_name == "clear-night")
        current_icon = "clear_night.png";
    else if(current_icon_name == "partly-cloudy-day")
        current_icon = "cloud_day.png";
    else if(current_icon_name == "partly-cloudy-night")
        current_icon = "cloud_night.png";
    else
        current_icon = current_icon_name+".png";
    return current_icon;
}

function parseData(saddr,city,state,temperature) {
        $.ajax({
            url : 'homework8.php',
            type : 'GET',
            dataType: 'json',
            data : {
            "saddr" :saddr,
            "city" : city,
            "state": state,
            "temperature": temperature
    },
    success : function(data) {
        
        $('#outputId').css('visibility','visible');
        var json_obj = jQuery.parseJSON(data);
            
        var latitude=json_obj.latitude;
        var longitude=json_obj.longitude;
        
        var current_summary=json_obj.currently.summary;
        var current_icon_name=json_obj.currently.icon;
        var current_icon=icon_return(current_icon_name);
        var current_icon="http://cs-server.usc.edu:45678/hw/hw8/images/"+current_icon;
        var current_temp = parseInt(json_obj.currently.temperature);
        var current_temp_max=parseInt(json_obj.daily.data[0].temperatureMax);
        var current_temp_min=parseInt(json_obj.daily.data[0].temperatureMin);
        
        var precip_no=json_obj.currently.precipIntensity;
        var current_precipitation;
                if(temperature == "si")
                    precip_no=precip_no/25.4;
        
                if(precip_no < 0.002)
                    current_precipitation="None";
                else if(precip_no < 0.017 )
                    current_precipitation="Very Light";
                else if(precip_no < 0.1)
                    current_precipitation="Light";
                else if(precip_no < 0.4)
                    current_precipitation="Moderate";
                else if(precip_no >= 0.4)
                    current_precipitation="Heavy";
        
        var precip_prob=json_obj.currently.precipProbability;
        var current_chance_of_rain=(parseInt(precip_prob*100))+"%";
        //var current_windspeed=(json_obj.currently.windSpeed).toFixed(2);
        var current_dewpoint=(json_obj.currently.dewPoint).toFixed(2);
        var current_humidity = (parseInt(json_obj.currently.humidity*100))+'%';
        //var current_visibility=(json_obj.currently.visibility).toFixed(2);
        var unit, pressure_unit, visibility_unit, windspeed_unit, dewpoint_unit;
        if(temperature == "si") {
            unit="&#176;C";
            var current_windspeed=isNaN(json_obj.currently.windSpeed)?'NA':(json_obj.currently.windSpeed).toFixed(2)+" m/s";
            current_dewpoint+="&#176;C";
            current_visibility+=" km";
            pressure_unit=" mb";
            var current_visibility=isNaN(json_obj.currently.visibility)?'NA':(json_obj.currently.visibility).toFixed(2)+" km"; 
            windspeed_unit = " m/s";
            dewpoint_unit= "&#176;C";
        } else {
            unit="&#176;F";
            var current_windspeed=isNaN(json_obj.currently.windSpeed)?'NA':(json_obj.currently.windSpeed).toFixed(2)+" mph";
            current_dewpoint+="&#176;F";
            var current_visibility=isNaN(json_obj.currently.visibility)?'NA':(json_obj.currently.visibility).toFixed(2)+" mi";
            pressure_unit=" hPa";
            visibility_unit = " mi";
            windspeed_unit = " mph";
            dewpoint_unit="&#176;F";

        }

        var sunrise=json_obj.daily.data[0].sunriseTime;
        var sunset=json_obj.daily.data[0].sunsetTime;
        timezone=json_obj.timezone;
        
        var inter_sunrise=moment.unix(sunrise);
        var final_sunrise=inter_sunrise.tz(timezone).format("hh:mm A");
        var inter_sunset=moment.unix(sunset);
        var final_sunset=inter_sunset.tz(timezone).format("hh:mm A");
        
        //FB Variables
        
        fb_address = city + ", " + state;
        fb_icon = current_icon;
        fb_summary = current_summary;
        fb_temperature = current_temp;
        fb_unit = unit;
        
        var tabOneOutput = "<div style='background-color:#F27E7F' class='row'>";
					tabOneOutput+="<div align=center class=' col-md-6 col-sm-6'><img style='display:block;width:130px;height:130px;margin-top:10px;' title='"+ current_summary +"' alt='"+ current_summary + "' src='" + current_icon + "'/></div>";
					tabOneOutput+="<div align='center' class='col-md-6'><span style='color:white'>" + current_summary + " in " + city + ", " + state + "<br>" + "<span style='font-size:60px;font-weight:800'>" + current_temp + "<sup style='font-size:18px;position:relative;top:-1.6em;'>" + unit + "</sup></span><br>" + "<div style='padding-bottom:3'><img style='display:inline-block;' src='http://cs-server.usc.edu:45678/hw/hw8/images/fb_icon.png' class='img-responsive pull-right' width=35px height=35px title= 'post' onclick=feedPost()> "+"</div><span style='color:blue;line-height:3'>L: " + current_temp_max + "&#176;</span>" + "<span style='color:black;line-height:3'> | </span>" + "<span style='color:green;line-height:3'>H: " +current_temp_min + "&#176;</span>" + "</div>";
					tabOneOutput+="</div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Precipitation</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_precipitation + "</div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Chance of Rain</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_chance_of_rain + "</div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Wind Speed</div><div class='col-md-5 col-xs-5 col-sm-5'>" + current_windspeed + "</div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Dew Point</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_dewpoint + "</div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Humidity</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_humidity + "</div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Visibility</div><div class='col-md-5 col-xs-5 col-sm-5'> " + current_visibility + " </div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F9F9F9' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunrise</div><div class='col-md-5 col-xs-5 col-sm-5'> " + final_sunrise + " </div></div></div>";
					tabOneOutput+="<div class='row'><div style='line-height: 250%;background-color:#F2DEDE' class='col-md-12 col-sm-12 col-xs-12'><div class='col-md-7 col-xs-7 col-sm-7' style='padding-left:0px; text-align:left'>Sunset</div><div class='col-md-5 col-xs-5 col-sm-5'> " + final_sunset + " </div></div></div>";
					$('#tabOneOutput').html(tabOneOutput);
        
        //Open Layer INIT function
        
        $(function() {
                        $('#openLayerMap').html("");
                        var mapnik = new OpenLayers.Layer.OSM();
						var map = new OpenLayers.Map({
                            div:"openLayerMap"});
						
		
						var layer_cloud = new OpenLayers.Layer.XYZ(
								"clouds",
								"http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
						);
						var layer_precipitation = new OpenLayers.Layer.XYZ(
								"precipitation",
								"http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
							{
								isBaseLayer: false,
								opacity: 0.7,
								sphericalMercator: true
							}
						);
						map.addLayers([mapnik, layer_precipitation, layer_cloud]);
						map.addControl(new OpenLayers.Control.LayerSwitcher());     
					
						var lonlat = new OpenLayers.LonLat(longitude, latitude).transform(
							new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
							map.getProjectionObject() // to Spherical Mercator Projection
						);
						map.setCenter( lonlat, 8 );		
						
						var markers = new OpenLayers.Layer.Markers( "Markers" );
						map.addLayer(markers);
						markers.addMarker(new OpenLayers.Marker(lonlat));
						
					});
        
        //Second tab generation
        
            var i=0;
            var tabTwoOutput="";
        
            $('#temperatureTwo').html("Temp("+unit+")");
            for(i=0;i<24;i++) {
                var ref_time=moment.unix(json_obj.hourly.data[i].time);
                var tabtwo_time=ref_time.tz(timezone).format('hh:mm A');
                var icon_name=json_obj.hourly.data[i].icon;
                var icon=icon_return(icon_name);
                icon="http://cs-server.usc.edu:45678/hw/hw8/images/"+icon;
                  
                tabTwoOutput+= "<div class='panel panel-default' style='margin:0px'>";
                tabTwoOutput+="<div class='panel-heading' style='background-color:white'>";
                tabTwoOutput+="<h4 class=\"panel-title\">";
                tabTwoOutput+="<div class='row' style='text-align:center'>";
                tabTwoOutput+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                tabTwoOutput+= tabtwo_time+"</a>";
                tabTwoOutput+= "</div>";  
                 
                tabTwoOutput+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
                tabTwoOutput+= "<img src='" + icon + "'alt='"+json_obj.hourly.data[i].icon+ "'style='width:50px;height:50px'</img>";
                tabTwoOutput+= "</div>"; 
                tabTwoOutput+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                tabTwoOutput+= parseInt((json_obj.hourly.data[i].cloudCover)*100) + "%";
                tabTwoOutput+= "</div>";   
                tabTwoOutput+="<div class='col-md-2 col-sm-2 col-xs-2 col-lg-2'>";
                tabTwoOutput+= (json_obj.hourly.data[i].temperature).toFixed(2);
                tabTwoOutput+= "</div>"; 
                tabTwoOutput+="<div class='col-md-3 col-sm-3 col-xs-3 col-lg-3'>";
                tabTwoOutput+=  "<a data-toggle='collapse' data-parent='#tabTwoOutout' href='#collapse"+i+"'>";
                tabTwoOutput+="<span class='glyphicon glyphicon-plus'></span></a>";
                tabTwoOutput+= "</div>"; 
                tabTwoOutput+= "</div>";     
                tabTwoOutput+= "</h4>";
                tabTwoOutput+= "</div>";
                tabTwoOutput+=" <div id='collapse"+i + "'class='panel-collapse collapse'>";
                tabTwoOutput+="<div class='panel-body' style='overflow:auto'>"
                tabTwoOutput+="<table class=table>";
                tabTwoOutput+="<tr style='background-color:white;font-size:13px'>";
                tabTwoOutput+="<th style='text-align:center'>Wind Speed</th>";
                tabTwoOutput+="<th style='text-align:center'>Humidity</th>";
                tabTwoOutput+="<th style='text-align:center'>Visibility</th>";
                tabTwoOutput+="<th style='text-align:center'>Pressure</th>";
                tabTwoOutput+="</tr>"; 
                tabTwoOutput+="<tr style='font-size:12px'>"; 
                tabTwoOutput+="<td style='text-align:center'>" + (isNaN(json_obj.hourly.data[i].windSpeed)?'NA':((json_obj.hourly.data[i].windSpeed).toFixed(2) + windspeed_unit)) ;
                tabTwoOutput+="</td>";
                 
                tabTwoOutput+="<td style='text-align:center'>" + (parseInt((json_obj.hourly.data[i].humidity)*100)) + "%";
                tabTwoOutput+="</td>";
                 
                tabTwoOutput+="<td style='text-align:center'>" + (isNaN(json_obj.hourly.data[i].visibility)?'NA':(json_obj.hourly.data[i].visibility + visibility_unit)) ;
                tabTwoOutput+="</td>";
                 
                tabTwoOutput+="<td style='text-align:center'>" + (isNaN(json_obj.hourly.data[i].pressure)?'NA':(json_obj.hourly.data[i].pressure + pressure_unit));
                tabTwoOutput+="</td>";
                
                tabTwoOutput+="</tr>";
                
                tabTwoOutput+="</table>";
                tabTwoOutput+= "</div>";
                tabTwoOutput+= "</div>";
                tabTwoOutput+="</div>";
             }
        
           $("#tabTwoOutout").html(tabTwoOutput);
        
        
        //Tab three generation
        
			var objDate;
			var elementValue;
			var day, date, month, month_date, image, min_temp, max_temp;
			var daily_values = json_obj.daily.data;
			for(i=1;i<daily_values.length;i++){
				objDate = new Date(daily_values[i].time*1000);
				day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][objDate.getDay()];
				month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][objDate.getMonth()];			
				date = objDate.getDate();
				month_date = month+" "+date;
				icon = icon_return(daily_values[i].icon);
                icon="http://cs-server.usc.edu:45678/hw/hw8/images/"+icon;
				min_temp = Math.floor(daily_values[i].temperatureMin)+"&deg";
				max_temp = Math.floor(daily_values[i].temperatureMax)+"&deg";
				
				elementValue="<h5>"+day+"<h5>"+month_date+"<br><img height='60px' width='60px' src='"+icon+"'><br>";
				elementValue+="Min<br>Temp<br>"+"<h3>"+min_temp+"<h5><br>Max<br>Temp<br>"+"<h3>"+max_temp;
				var id="#button"+i;
				$(id).html(elementValue);

				var daily_summary=daily_values[i].summary;
				var daily_temp_max=parseInt(json_obj.daily.data[0].temperatureMax);
				var daily_temp_min=parseInt(json_obj.daily.data[0].temperatureMin);
				
				var daily_windspeed=isNaN(json_obj.daily.data[i].windSpeed)?'NA':(((json_obj.daily.data[i].windSpeed).toFixed(2))+windspeed_unit);
				var daily_humidity = parseInt(json_obj.daily.data[i].humidity*100)+'%';
				var daily_visibility=isNaN(json_obj.daily.data[i].visibility)?'NA':(((json_obj.daily.data[i].visibility).toFixed(2))+visibility_unit);

				var sunrise=json_obj.daily.data[i].sunriseTime;
				var sunset=json_obj.daily.data[i].sunsetTime;
                var daily_pressure = isNaN(json_obj.daily.data[i].pressure)?'NA':((json_obj.daily.data[i].pressure).toFixed(2)+pressure_unit);
				var inter_sunrise=moment.unix(sunrise);
				var daily_sunrise=inter_sunrise.tz(timezone).format("hh:mm A");
				var inter_sunset=moment.unix(sunset);
				var daily_sunset=inter_sunset.tz(timezone).format("hh:mm A");
				modalText="Weather in "+$('#city').val().trim()+" on "+month_date;
				var id="#myModalLabel"+i;
				$(id).html(modalText);
				modalText="<div class='container-fluid'>\n<div class='row'><div class='col-md-12'><center><img height='150px' width='150px' src='"+icon+"' alt='"+daily_summary+"' title='"+daily_summary+"'></center></div></div>\n";
				modalText+="<div class='row'><div class='col-md-12'><h3><center>"+day+": <span style=\"color:#FFAB10\">"+daily_summary+"<span></center></h3></div></div>\n";
				modalText+="<div class='row'><div class='col-md-4'><center><h4>Sunrise Time</h4>"+daily_sunrise+"</center></div><div class='col-md-4'><center><h4>Sunset Time</h4>"+daily_sunset+"</center></div><div class='col-md-4'><center><h4>Humidity</h4>"+daily_humidity+"</center></div></div>\n";
				modalText+="<div class='row'><div class='col-md-4'><center><h4>Wind Speed</h4>"+daily_windspeed+"</center></div><div class='col-md-4'><center><h4>Visibility</h4>"+daily_visibility+"</center></div><div class='col-md-4'><center><h4>Pressure</h4>"+daily_pressure+"</center><br></div></div>\n";
				modalText+="</div>"
                var id="#myModalBody"+i;
				$(id).html(modalText);
			}
        
					
				},
				error:function(){
					alert('data sending failed');
				}
			});
	}