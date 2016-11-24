<?php
include 'highscore.php';

$highscore = new HighScore();
$highscore->setHeaders(); // set crossdomain headers

// check if parameters exist
if (!isset($_POST['game']) || !isset($_POST['limit']))
{
  $highscore->error('missing parameter');
}

// check if parameters are valid
$game = $_POST['game'];
$highscore->checkCharacters($game, 'gamename');

$limit = intval($_POST['limit']);
if ($limit <= 0)
{
  $highscore->error('invalid limit');
}

// save score into database
$highscore->connectDatabase();
$a = $highscore->get($game, $limit);

die(json_encode($a));