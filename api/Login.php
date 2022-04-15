<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = 0;
    $login = "";
    $email = "";
    $uniName = "";

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT User_ID, Login, Email, Uni_Name FROM Users WHERE Login = ? AND Password =  ?");
        $query->bind_param("ss", $inData["login"], $inData["password"]);
        $query->execute();

        $result = $query->get_result();

        //Check if user exists
        if($row = $result->fetch_assoc()){
            returnWithInfo($row["User_ID"], $row["Login"], $row["Email"], $row["Uni_Name"]);
        } else{
            returnWithError("No Records Found");
        }

        $conn->close();
        $query->close();
    }


    function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithInfo($userId, $login, $email, $uniName){
        $retInfo = '{"userId":' . $userId . ', "login":"' . $login . '", "email":"' . $email . '","uniName" :"' . $uniName . '", "error":""}';
        sendResultInfoAsJson($retInfo);
    }

    function returnWithError($err){
        $retInfo = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retInfo);
    }
?>