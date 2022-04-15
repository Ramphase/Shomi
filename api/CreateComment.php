<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];
    $eventName = $inData["eventName"];
    $text = $inData["text"];
    $rating = $inData["rating"];

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("INSERT INTO Comments (Event_Name, User_ID, Text, Rating) VALUES (?, ?, ?, ?)");
        $query->bind_param("siss", $eventName, $userId, $text, $rating);
        $query->execute();

        returnWithError("");

    }

    function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError($err){
        $retInfo = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retInfo);
    }
?>