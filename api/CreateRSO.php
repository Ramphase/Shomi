<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];
    $uniName = $inData["uniName"];
    $rsoName = $inData["rsoName"];

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT * FROM RSO WHERE RSO_Name = ?");
        $query->bind_param("s", $rsoName);
        $query->execute();

        $result = $query->get_result();

        //Check if user already exists
        if($row = $result->fetch_assoc()){
            returnWithError("This RSO Already Exists");
        } else{
            $query = $conn->prepare("SELECT Is_Admin FROM Users WHERE User_ID=?");
            $query->bind_param("i", $userId);
            $query->execute();
    
            $result = $query->get_result();
            $row = $result->fetch_array(MYSQLI_ASSOC);
            //Check if User is Admin
            if($row["Is_Admin"] < 1){
                returnWithError("User is not an admin");
            } else{
    
                $query = $conn->prepare("INSERT INTO RSO (RSO_Name, Uni_Name, User_ID) VALUES (?, ?, ?)");
                $query->bind_param("ssi", $rsoName, $uniName, $userId);
                $query->execute();

                //Grab RSO_ID
                $query = $conn->prepare("SELECT RSO_ID FROM RSO WHERE RSO_Name = ?");
                $query->bind_param("s", $rsoName);
                $query->execute();

                $result = $query->get_result();
                $row = $result->fetch_array(MYSQLI_ASSOC);
                $rsoId = $row['RSO_ID'];

                //Grab User Email
                $query = $conn->prepare("SELECT Email FROM Users WHERE User_ID = ?");
                $query->bind_param("i", $userId);
                $query->execute();

                $result = $query->get_result();
                $row = $result->fetch_array(MYSQLI_ASSOC);
                $email = $row['Email'];

                //Insert into RSO Members
                $query = $conn->prepare("INSERT INTO RSO_Members (RSO_ID, User_ID, Email) VALUES (?, ?, ?)");
                $query->bind_param("iis", $rsoId, $userId, $email);
                $query->execute();
        
                $conn->close();
                $query->close();
        
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