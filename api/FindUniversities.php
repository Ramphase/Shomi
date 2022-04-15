<?php
    $inData = json_decode(file_get_contents('php://input'), true);

    $searchResults = "";

    $conn = new mysqli("localhost", "root", "root", "Shomi");

    if($conn->connect_error){

        returnWithError($conn->connect_error);

    } else{
        $query = "SELECT Uni_Name FROM Universities";
		$result = mysqli_query($conn, $query);


		$count = mysqli_num_rows($result);
		if(mysqli_num_rows($result) > 0){
			while($row = mysqli_fetch_assoc($result)){
				$searchResults .= '{';
				$searchResults .= '"uniName":"' . $row['Uni_Name'] . '"';
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