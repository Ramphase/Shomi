<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $userId = $inData["userId"];

    $searchResults = "";
	$searchCount = 0;

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

		if($rsoId_Joined == null){
			$rsoId_Joined = 0;
			returnWithError("User is not in a RSO");
		} else{

			$query = $conn->prepare("SELECT RSO_ID, RSO_Name FROM RSO WHERE RSO_ID IN ($rsoId_Joined)");
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
				$searchResults .= '"rsoId":"' . $row['RSO_ID'] . '",';
				$searchResults .= '"rsoName":"' . $row['RSO_Name'] . '"';
				$searchResults .= '}';
			}

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