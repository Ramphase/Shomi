<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $searchResults = "";
	$searchCount = 0;
	$userId = $inData["userId"];
    $uniName = $inData["uniName"];
    $isPublic = true;
	$str = $inData["search"];

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

		$query = $conn->prepare("SELECT RSO_ID FROM RSO_Members WHERE User_ID=?");
		$query->bind_param("i", $userId);
		$query->execute();

		$result = $query->get_result();
		$groupConcat=array();

 		while($row = mysqli_fetch_array($result)){
    		$groupConcat[] = $row['RSO_ID'];
		}
		$rsoId_Joined = join(',',$groupConcat); 

		if($rsoId_Joined == null) $rsoId_Joined = 0;
		
        if($str == ""){ //search with empty string returns all available events
			$query = $conn->prepare("SELECT Event_Name, Date, Time, Description, Category, Phone_Number, Email FROM Events WHERE (Is_Public = 1 OR Uni_Name = ? OR RSO_ID IN ($rsoId_Joined))");
			$query->bind_param("s", $uniName);

		} else{

			$str = "%" . $inData["search"] . "%";

            if(preg_match('/\s/', $str)){
				$str = preg_replace('/\s/', '', $str);
			}
		
            $query = $conn->prepare("SELECT Event_Name, Date, Time, Description, Category, Phone_Number, Email FROM Events WHERE (Event_Name LIKE ?) AND (Is_Public = 1 OR Uni_Name = ? OR RSO_ID IN ($rsoId_Joined))"); 
			$query->bind_param("ss", $str, $uniName);
        }

        $query->execute();
		$result = $query->get_result();
		
        while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{';
			$searchResults .= '"eventName":"' . $row['Event_Name'] . '",';
			$searchResults .= '"date":"' . $row['Date'] . '",';
			$searchResults .= '"time":"' . $row['Time'] . '",';
			$searchResults .= '"desc":"' . $row['Description'] . '",';
			$searchResults .= '"category":"' . $row['Category'] . '",';
            $searchResults .= '"phoneNumber":"' . $row['Phone_Number'] . '",';
            $searchResults .= '"email":"' . $row['Email'] . '"';
			$searchResults .= '}';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$query->close();
		$conn->close();
	}
        

    function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithError($err){
        $retInfo = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retInfo);
    }

?>