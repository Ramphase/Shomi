<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];
    $uni_name = $inData["uni_name"];
    $sCount = $inData['sCount'];
    $state = $inData['state'];
    $desc = $inData['desc'];



    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT Is_SuperAdmin FROM Users WHERE User_ID=?");
        $query->bind_param("i", $userId);
        $query->execute();

        $result = $query->get_result();
        $row = $result->fetch_array(MYSQLI_ASSOC);
        //Check if User is Admin
        if($row["Is_SuperAdmin"] < 1){
            returnWithError("User is not a super admin");
        } else{
            $query = $conn->prepare("SELECT * FROM Universities WHERE Uni_Name = ?");
            $query->bind_param("s", $uni_name);
            $query->execute();
    
            $result = $query->get_result();
    
            //Check if user already exists
            if($row = $result->fetch_assoc()){
                returnWithError("University already exists");
            } else{
                $query = $conn->prepare("INSERT INTO Universities (Uni_Name, User_ID, sCount, State, Description) VALUES (?, ?, ?, ?, ?)");
                $query->bind_param("siiss", $uni_name, $userId, $sCount, $state, $desc);
                $query->execute();
    
                $query->close();
                $conn->close();
    
                returnWithError("");
            }

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