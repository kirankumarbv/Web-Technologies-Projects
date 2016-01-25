<?php
    header('Content-type: application/json');
    $url="https://maps.google.com/maps/api/geocode/xml?address=".$_GET['saddr'].",".$_GET['city'].",".$_GET['state']."&key=    AIzaSyBFItW1Mit_GIEjo_sOSvkCW99DmI6rSgQ";
		$xml_data=simplexml_load_file($url);
        if ($xml_data->status != "OK") {
            echo "<script language=JavaScript> alert('XML Error! Invalid address\\nPlease provide correct input\\n');</script>";
        }
        $latitude= (string) $xml_data->result->geometry->location->lat;
        $longitude= (string) $xml_data->result->geometry->location->lng;
        $unit = $_GET['temperature'];
        $forecast_key= "073aae26e7fe69fa21ac117c249cc383";
        $forecast_url="https://api.forecast.io/forecast/".$forecast_key."/".$latitude.",".$longitude."?units=".$unit."&exclude=flags";
        $forecast_json = file_get_contents($forecast_url);
        echo json_encode($forecast_json);
?>
        