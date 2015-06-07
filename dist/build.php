<?php

header('Content-Type: application/javascript');

$path = '../src/';
$files = [];

array_push($files, 'bindings.js');
array_push($files, 'bindings-types.js');

echo "(function(){\r\n";

for ($i=0; $i < count($files); $i++) { 
	readfile($path.$files[$i]);
	echo "\r\n";
}

echo "\r\n})()";

?>