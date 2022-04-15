<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];
    $rsoId = $inData["rsoId"];
    $email = $inData["email"];


    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT * FROM RSO_Members WHERE RSO_ID = ? AND User_ID = ?");
        $query->bind_param("ii", $rsoId, $userId);
        $query->execute();

        $result = $query->get_result();

        //Check if user already exists
        if($row = $result->fetch_assoc()){
            returnWithError("User is already in RSO.");
        } else{
            $query = $conn->prepare("INSERT INTO RSO_Members (RSO_ID, User_ID, Email) VALUES (?, ?, ?)");
            $query->bind_param("iis", $rsoId, $userId, $email);
            $query->execute();

            $query->close();
            $conn->close();

            returnWithError("");
        }

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