<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $eventName = $inData["eventName"];

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{

        $query = $conn->prepare("SELECT User_ID, Text, Rating FROM Comments WHERE Event_Name =?");
		$query->bind_param("s", $eventName);

        $query->execute();
		$result = $query->get_result();

		$count = mysqli_num_rows($result);
		if(mysqli_num_rows($result) > 0){
			while($row = mysqli_fetch_assoc($result)){
				$query2 = $conn->prepare("SELECT Login FROM Users WHERE User_ID=?");
				$query2->bind_param("i", $row['User_ID']);
				$query2->execute();
				$result2 = $query2->get_result();
				$row2 = mysqli_fetch_assoc($result2);

				$searchResults .= '{';
				$searchResults .= '"login":"' . $row2['Login'] . '",';
				$searchResults .= '"text":"' . $row['Text'] . '",';
				$searchResults .= '"rating":"' . $row['Rating'] . '"';
				$searchResults .= '}';
				$count--;
				if($count > 0){
					$searchResults .= ",";
				}
			}
		}

		returnWithInfo( $searchResults );
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

?>