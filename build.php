<html>
<body>

<?php
include 'connect.php';
?>

<?php

echo "===============";
echo "<br>creating tables";
echo "===============";



//create associative array of sql statements initiating database
$table = array();
$keys = array();


//create users table
$table['users'] = "CREATE TABLE users
(
user_id int NOT NULL auto_increment,
user_login CHAR(60),
user_first CHAR(30),
user_last CHAR(30),
user_email CHAR(255),
user_date CHAR(10),
user_time CHAR(10),
user_access INT,
user_groupID INT,
PRIMARY KEY (user_id),
UNIQUE KEY (user_login)
) ENGINE=InnoDB";

// create days table
$table['days'] = "CREATE TABLE days
(
day_id int NOT NULL auto_increment,
day_name CHAR(60),
day_date CHAR(10),
day_time CHAR(10),
day_permission INT,
day_userID INT,
PRIMARY KEY (group_id),
UNIQUE KEY (group_name)
) ENGINE=InnoDB";

//create lines table
$table['lines'] = "CREATE TABLE lines
(
line_id int NOT NULL auto_increment,
line_name CHAR(255),
line_path CHAR(255),
line_date CHAR(10),
line_time CHAR(10),
line_permission INT,
line_groupID INT,
line_userID INT,
line_parentID INT,
PRIMARY KEY (folder_id),
UNIQUE KEY(folder_path)
) ENGINE=InnoDB";

echo "<br>string made";
/// foreach ($table as $value)
///     {
///     echo "<p>========" . $value;
///     if (mysqli_query($con,$value))
///         {
///         echo "<br>...     Table created successfully";
///         }
///     else
///         {
///         echo "<br>Error creating table: " . mysqli_error($con);
///         }
///     }
    
///  $sql=array();
///  array_push($sql,"INSERT INTO users (user_login, user_first, user_last, user_email, user_access)
///  VALUES
///  ('tflaspoehler','Tim','Flaspoehler','tflaspoehler@gmail.com',1)");
///  mkdir('tflaspoehler');
///  
///  foreach ($sql as $value)
///      {
///      echo "<p>========" . $value;
///      if (mysqli_query($con,$value))
///          {
///          echo "<br>...     Something ADDED successfully";
///          }
///      else
///          {
///          echo "<br>Error creating something: " . mysqli_error($con);
///          }
///      }
exit;
?>

</body>
</html>
