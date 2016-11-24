<?php

class HighScore
{
  private $pdo;

  function setHeaders()
  {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type');
  }

  function connectDatabase()
  {
    try
    {
      $this->pdo = new PDO('mysql:host=localhost;dbname=*', '*user', '*password');
      $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
    catch (PDOException $exception)
    {
      return false;
    }

    return true;
  }

  function submit($game, $name, $score)
  {
    $statement = $this->pdo->prepare("INSERT INTO scores (game, name, score) VALUES (:game, :name, :score)");

    if (!$statement->execute(array('game' => $game, 'name' => $name, 'score' => $score)))
    {
      $this->error('server error: db submit');
    }
  }

  function get($game, $limit)
  {
    $statement = $this->pdo->prepare("SELECT * FROM scores WHERE game = :game ORDER BY score DESC LIMIT :limit");

    if (!$statement->execute(array('game' => $game, 'limit' => $limit)))
    {
      $this->error('server error: db get');
    }

    $a =  [];
    while ($row = $statement->fetch())
    {
      $a[] = ['name' => $row['name'], 'score' => $row['score']];
    }

    return $a;
  }

  function checkCharacters($string, $err)
  {
    if (preg_match("/[^a-zA-Z0-9_]/", $string) != 0)
    {
      $this->error('invalid '.$err);
    }
  }

  function error($string)
  {
    die('{"error":"' . $string . '"}');
  }
}