<?php
include 'highscore.php';

$highscore = new HighScore();
$highscore->setHeaders(); // set crossdomain headers

// check if parameters exist
if (!isset($_POST['game']) || !isset($_POST['name']) || !isset($_POST['score']))
{
  $highscore->error('missing parameter');
}

// check if parameters are valid
$game = $_POST['game'];
$highscore->checkCharacters($game, 'gamename');

$name = $_POST['name'];
$highscore->checkCharacters($name, 'name');

$score = intval($_POST['score']);
if ($score <= 0)
{
  $highscore->error('invalid score');
}

// save score into database
$highscore->connectDatabase();
$highscore->submit($game, $name, $score);

die('{}');