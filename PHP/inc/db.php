<?php
//sql kapcsolat
    $connect = mysqli_connect("localhost","nyilvantarto","szechenyi","nyilvantarto");
    if (mysqli_connect_errno()){
        echo "Sql hiba: " . mysqli_connect_error();
    }
?>
