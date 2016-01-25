<html>
<head>
<style>
    table {
        border-collapse:collapse;
    }
</style>
    <title>Weather Forecast</title>
    <script language=JavaScript>
    function formValidator() {
        var streetaddress_filled = false;
        var city_filled = false;
        var state_filled  = false;
        var blank="";
        
        if(document.userInput.saddr.value.trim() != blank)
            streetaddress_filled = true;
        if(document.userInput.city.value.trim() != blank)
            city_filled = true;
        if(document.userInput.states.value != blank)
            state_filled = true;
        
        var alertstr = "";
        if(!streetaddress_filled)
            alertstr+="Please enter value for Street Address\n";
        if(!city_filled)
            alertstr+="Please enter value for City\n";
        if(!state_filled)
            alertstr+="Please enter value for State\n";
        
        if((!streetaddress_filled) || (!city_filled) || (!state_filled)) {
            alert(alertstr);
            return(false);
        }
    }
    function clearValues() {
        //Clear the input form
        userInput.saddr.value="";
        userInput.city.value="";
        document.getElementById("states").value="";
        document.getElementById("fahrenheit").checked=true;
        // Clear the output
        document.getElementById("outputTable").style.display='none';
    }
    </script>
</head>
<body>
    <center><strong>Forecast Search</strong></center><br>
    <table align="center" border=2 cellpadding="10">
        <tr><td>
    <form  name="userInput" method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']);?>">
    <table>
        <tr>
            <td>Street Address:* </td>
            <td><input type="text" name="saddr" value="<?php if(isset($_POST['saddr'])) { echo htmlentities($_POST['saddr']);}?>"><br></td>
        </tr>
        <tr>
            <td>City:* </td>
            <td><input type="text" name="city" value="<?php if(isset($_POST['city'])) { echo htmlentities($_POST['city']);}?>"><br></td>
        </tr>
        <tr>
            <td>State:* </td>
            <td><select name="states" id="states">
                    <option value="">Select your State...</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
					<option value="AZ">Arizona</option>
					<option value="AR">Arkansas</option>
					<option value="CA">California</option>
					<option value="CO">Colorado</option>
					<option value="CT">Connecticut</option>
					<option value="DE">Delaware</option>
					<option value="DC">District of Columbia</option>
					<option value="FL">Florida</option>
					<option value="GA">Georgia</option>
					<option value="HI">Hawaii</option>
					<option value="ID">Idaho</option>
					<option value="IL">Illinois</option>
					<option value="IN">Indiana</option>
					<option value="IA">Iowa</option>
					<option value="KS">Kansas</option>
					<option value="LA">Louisiana</option>
					<option value="ME">Maine</option>
					<option value="MD">Maryland</option>
					<option value="MA">Massachusetts</option>
					<option value="MI">Michigan</option>
					<option value="MN">Minnesota</option>
					<option value="MS">Mississippi</option>
					<option value="MO">Missouri</option>
					<option value="MT">Montana</option>
					<option value="NE">Nebraska</option>
					<option value="NV">Nevada</option>
					<option value="NH">New Hampshire</option>
					<option value="NJ">New Jersey</option>
					<option value="NM">New Mexico</option>
					<option value="NY">New York</option>
					<option value="NC">North Carolina</option>
					<option value="ND">North Dakota</option>
					<option value="OH">Ohio</option>
					<option value="OK">Oklahoma</option>
					<option value="OR">Oregon</option>
					<option value="PA">Pennsylvania</option>
					<option value="RI">Rhode Island</option>
					<option value="SC">South Carolina</option>
					<option value="SD">South Dakota</option>
					<option value="TN">Tennessee</option>
					<option value="TX">Texas</option>
					<option value="UT">Utah</option>
					<option value="VT">Vermont</option>
					<option value="VA">Virginia</option>
					<option value="WA">Washington</option>
					<option value="WV">West Virginia</option>
					<option value="WI">Wisconsin</option>
					<option value="WY">Wyoming</option>
            </select><br></td>
            </tr>
            <script> 
            document.getElementById("states").value = "<?php if(isset($_POST['states'])) {echo htmlentities($_POST['states']); } ?>" </script>
            <tr>
                <td>Degree:* </td>
                <td><label><input checked type="radio" name="temp" id="fahrenheit" value="us" <?php if(isset($_POST['temp']) && $_POST['temp'] == 'us') {echo "checked";}?> >Fahrenheit</input></label>
        <label><input type="radio" name="temp" value="si" <?php if (isset($_POST['temp']) && $_POST['temp']=='si'){ echo "checked";}?> >Celsius</input></label><br></td>
            </tr>
           <tr>
                <td />
                <td><label> <input type="submit" name="Search" value="Search" onClick="formValidator()"></label>
                <label><input type="button" name="clear" value="Clear" onClick="clearValues()"></input></label></td>
        </tr>
            <td>    * - Mandatory fields</td>
        </tr>
        <tr>
            <td />
            <td align="center"><a href="http://forecast.io/">Powered by Forecast.io</a></td>
        </tr>
    	</table>
    	</form>
</td></tr></table>
<?php
	if((isset($_POST['Search'])) && ((trim($_POST['saddr']) !== "")) && ((trim($_POST['city']) !== "")) && (!empty($_POST['states'])))
	{	
		$url="https://maps.google.com/maps/api/geocode/xml?address=".$_POST['saddr'].",".$_POST['city'].",".$_POST['states']."&key= AIzaSyBFItW1Mit_GIEjo_sOSvkCW99DmI6rSgQ";
		$xml_data=simplexml_load_file($url);
        if ($xml_data->status == "OK") {
            $latitude= (string) $xml_data->result->geometry->location->lat;
            $longitude= (string) $xml_data->result->geometry->location->lng;
            $unit = $_POST['temp'];
            $forecast_key= "073aae26e7fe69fa21ac117c249cc383";
            $forecast_url="https://api.forecast.io/forecast/".$forecast_key."/".$latitude.",".$longitude."?units=".$unit."&exclude=flags";
            $forecast_json = json_decode(file_get_contents($forecast_url));
            if (json_last_error() == JSON_ERROR_NONE) {
                $summary = (string) $forecast_json->currently->summary;
                $icon_name = (string) $forecast_json->currently->icon;
                if($icon_name == "clear-day")
                    $icon = "clear.png";
                else if($icon_name == "clear-night")
                    $icon = "clear_night.png";
                else if($icon_name == "partly-cloudy-day")
                    $icon = "cloud_day.png";
                else if($icon_name == "partly-cloudy-night")
                    $icon = "cloud_night.png";
                else
                    $icon = $icon_name.".png";
                $temp = (int) $forecast_json->currently->temperature;
                if($unit == "si")
                    $temp=$temp."&degC";
                else
                    $temp=$temp."&degF";

                $precip_no = (float) $forecast_json->currently->precipIntensity;
                if($unit == "si")
                    $precip_no = $precip_no/25.4;
                if($precip_no < 0.002)
                    $precipitation="None";
                else if($precip_no < 0.017 )
                    $precipitation="Very Light";
                else if($precip_no < 0.1)
                    $precipitation="Light";
                else if($precip_no < 0.4)
                    $precipitation="Moderate";
                else if($precip_no >= 0.4)
                    $precipitation="Heavy";
                $precip_no = (float) $forecast_json->currently->precipProbability;
                $chanceofrain = ((float)$precip_no*100).'%';
                $windspeed = ((int) $forecast_json->currently->windSpeed);
                if($unit == "si")
                    $windspeed.=" m/s";
                else
                    $windspeed.=" mph";
                $dewpoint = (int) $forecast_json->currently->dewPoint;
                if($unit == "si")
                    $dewpoint.="&degC";
                else
                    $dewpoint.="&degF";
                $precip_no = (float) $forecast_json->currently->humidity;
                $humidity = ((float)$precip_no*100).'%';
                $visibility = (int) $forecast_json->currently->visibility;
                if($unit == "si")
                    $visibility.=" kms";
                else
                    $visibility.=" mi";
                date_default_timezone_set($forecast_json->timezone);
                $sunrise = $forecast_json->daily->data[0]->sunriseTime;
                $sunrise = date('h:i A',$sunrise);
                $sunset = $forecast_json->daily->data[0]->sunsetTime;
                $sunset = date('h:i A',$sunset);

                        echo "<br><table id='outputTable' align='center' border=2 width='600px' height='55%'><tr><td>";
            echo "<table align='center' width='70%'><tr><th colspan=2 align='center'>$summary</th></tr>";
            echo "<tr><th colspan=2 align='center'>$temp</th></tr>";
            echo "<tr><th colspan=2 align='center'><img src=\"http://cs-server.usc.edu:45678/hw/hw6/images/".$icon."\" alt='".$summary."'"."title='".$summary."'></th></tr>";
            echo "<tr><td>Precipitation:</td><td>".$precipitation."</td></tr>";
            echo "<tr><td>Chance of Rain:</td><td>".$chanceofrain."</td></tr>";
            echo "<tr><td>Wind Speed:</td><td>".$windspeed." </td></tr>";
            echo "<tr><td>Dew Point:</td><td>".$dewpoint."</td></tr>";
            echo "<tr><td>Humidity:</td><td>".$humidity."</td></tr>";
            echo "<tr><td>Visibility:</td><td>".$visibility."</td></tr>";
            echo "<tr><td>Sunrise:</td><td>".$sunrise."</td></tr>";
            echo "<tr><td>Sunset:</td><td>".$sunset."</td></tr></table></td></tr></table>";
            }
            else {
                //json error;
                echo "<script language=JavaScript> alert('JSON Error\\nPlease provide correct input\\n');</script>";
            }
        }
        else {
            echo "<script language=JavaScript> alert('XML Error! Invalid address\\nPlease provide correct input\\n');</script>";
        }

	}
?>
    <noscript>
    </body>
</html>
