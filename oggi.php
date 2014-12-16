<html data-ng-app="nonnoApp" data-auto-scroll>
    <head>
        <link rel="stylesheet" href="oggi.css<?php echo '?v=' . filemtime( 'oggi.css' ); ?>">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:700,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <script
            src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular.js">
        </script>
	<script
            src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular-touch.js">
        </script>
        <script
            src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular-route.js">
        </script>
        <script
            src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.18/angular-sanitize.js">
        </script>
        <script src="oggi.js<?php echo '?v=' . filemtime( 'oggi.js' ); ?>"></script>
    </head>
    <body oncontextmenu="return false;">
        <div ng-view></div>
    </body>
</html>
