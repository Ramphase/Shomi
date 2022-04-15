<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];
    $uniName = $inData["uniName"];
    $eventName = $inData["eventName"];
    $date = $inData["date"];
    $time = $inData["time"];
    $desc = $inData["desc"];
    $category = $inData["category"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $isPublic = false;
    $rsoId = null;
    $uniName = null;

    if(isset($inData["isPublic"])){
        $isPublic = $inData["isPublic"];
    }

    if(isset($inData["uniName"])){
        $uniName = $inData["uniName"];
    }

    if(isset($inData["rsoId"])){
        $rsoId = $inData["rsoId"];
    }

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT * FROM Events WHERE Event_Name = ?");
        $query->bind_param("s", $eventName);
        $query->execute();

        $result = $query->get_result();

        //Check if user already exists
        if($row = $result->fetch_assoc()){
            returnWithError("This Event Already Exists");
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
    
                $query = $conn->prepare("INSERT INTO Events (Event_Name, Date, Time, Description, Category, Phone_Number, Email, Is_Public, Uni_Name, RSO_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $query->bind_param("sssssssisi", $eventName, $date, $time, $desc, $category, $phoneNumber, $email, $isPublic, $uniName, $rsoId);
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