<?php
function RandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
		<link rel="stylesheet" href="styles/bootstrap/bootstrap.min.css">
		<link rel="stylesheet" href="styles/main_styles.css">
	</head>
	<body>	
	<form action="index.php" method="post">
		<div class="container fastjoin">
			<div class="card mt-5">
			<div class="card-header">
			<div class="row justify-content-center">
				<div class="col-8">
					<h5 style="text-align: right" class="card-title">Gyors belépés</h5>
				</div>
				<div class="col-4">
					<span style="width: 30px; height: 30px;" class="iconify" data-icon="mdi:run-fast" data-inline="false"></span>
				</div>
			</div>


			</div>
				<div class="form-group mb-3 mt-2"> 
					<label class="form-label" for="joinpin"><b>Pinkód</b></label>
					<input class="form-control" type="text" pattern="[0-9]{5}" placeholder="Formátum: 00000" name="joinpin" required>
				</div>
				<div class="form-group mb-3"> 
					<label class="form-label" for="nickname"><b>Becenév</b></label>
					<input class="form-control" type="text" placeholder="Írj be egy tetszőleges becenevet" name="nickname" required>
				</div>
				<button class="btn btn-primary mt-2" type="submit">Csatlakozás</button>
			</div>
			<?php
			if (isset($_POST['joinpin'])) {
				$azonosito = RandomString();
				setcookie("azonosito", $azonosito);
				if (isset($_COOKIE["azonosito"])) {
				echo "<div class='alert alert-success' role='alert'>
						<p>A cookie sikeresen létrehozva:</br>
						Név: azonosito </br>
						Érték: $azonosito </p> 
					</div>'";
				}
			}

			?>


	</form>
	</body>
</html>