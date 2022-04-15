<?php
    $inData = json_decode(file_get_contents('php://input'), true);
    $login = $inData["login"];
    $password = $inData["password"];
    $email = $inData["email"];
    $uniName = $inData["uniName"];

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
        $query->bind_param("s", $login);
        $query->execute();

        $result = $query->get_result();

        //Check if user already exists
        if($row = $result->fetch_assoc()){
            returnWithError("Login is already taken.");
        } else{
            $query = $conn->prepare("INSERT INTO Users (Login, Password, Email, Uni_Name) VALUES (?, ?, ?, ?)");
            $query->bind_param("ssss", $login, $password, $email, $uniName);
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