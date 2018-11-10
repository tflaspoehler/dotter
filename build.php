<html>
<body>

<?php
include 'testconnect.php';
?>

<?php

echo "===============";
echo "<br>creating tables";
echo "===============";



//Create array of sql statements initiating database
$table = array();
$keys = array();


//Create Members Table
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

//Create Groups Table
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

//Create Folders Table
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

//Create Uploads Table
$table['uploads'] = "CREATE TABLE uploads
(
upload_id int NOT NULL auto_increment,
upload_permission INT,
upload_date CHAR(10),
upload_time CHAR(10),
upload_userID INT,
upload_groupID INT,
upload_folderID INT,
PRIMARY KEY (upload_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE uploads ADD CONSTRAINT upload_groupID_refs FOREIGN KEY (upload_groupID) REFERENCES groups (group_id)",
"ALTER TABLE uploads ADD CONSTRAINT upload_userID_refs FOREIGN KEY (upload_userID) REFERENCES users (user_id)",
"ALTER TABLE uploads ADD CONSTRAINT upload_folderID_refs FOREIGN KEY (upload_folderID) REFERENCES folders (folder_id)"
);

//Create Files Table
$table['files'] = "CREATE TABLE files
(
file_id int NOT NULL auto_increment,
file_name CHAR(255),
file_date CHAR(10),
file_time CHAR(10),
file_versionID int DEFAULT 1,
file_permission INT,
file_folderID INT,
file_groupID INT,
file_uploadID INT,
file_userID INT,
PRIMARY KEY (file_id),
UNIQUE KEY (file_name, file_folderID)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE files ADD CONSTRAINT file_groupID_refs FOREIGN KEY (file_groupID) REFERENCES groups (group_id)",
"ALTER TABLE files ADD CONSTRAINT file_folderID_refs FOREIGN KEY (file_folderID) REFERENCES folders (folder_id)",
"ALTER TABLE files ADD CONSTRAINT file_uploadID_refs FOREIGN KEY (file_uploadID) REFERENCES uploads (upload_id)",
"ALTER TABLE files ADD CONSTRAINT file_userID_refs FOREIGN KEY (file_userID) REFERENCES users (user_id)",
"ALTER TABLE files ADD CONSTRAINT file_versionID_refs FOREIGN KEY (file_versionID) REFERENCES versions (version_id)"
);

//Create Comments Table
$table['comments'] = "CREATE TABLE comments
(
comment_id int NOT NULL auto_increment,
comment TEXT(1024),
comment_date char(10),
comment_time char(10),
comment_userID INT,
comment_fileID INT,
comment_uploadID INT,
comment_folderID INT,
PRIMARY KEY (comment_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE comments ADD CONSTRAINT comment_fileID_refs FOREIGN KEY (comment_fileID) REFERENCES files (file_id)",
"ALTER TABLE comments ADD CONSTRAINT comment_folderID_refs FOREIGN KEY (comment_folderID) REFERENCES folders (folder_id)",
"ALTER TABLE comments ADD CONSTRAINT comment_uploadID_refs FOREIGN KEY (comment_uploadID) REFERENCES uploads (upload_id)",
"ALTER TABLE comments ADD CONSTRAINT comment_userID_refs FOREIGN KEY (comment_userID) REFERENCES users (user_id)"
);

//Create Membership Table
$table['membership'] = "CREATE TABLE membership
(
membership_id int NOT NULL auto_increment,
membership_userID INT,
membership_groupID INT,
PRIMARY KEY (membership_id),
UNIQUE KEY (membership_userID, membership_groupID)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE membership ADD CONSTRAINT membership_groupID_refs FOREIGN KEY (membership_groupID) REFERENCES groups (group_id)",
"ALTER TABLE membership ADD CONSTRAINT membership_userID_refs FOREIGN KEY (membership_userID) REFERENCES users (user_id)"
);

//Create UploadShare Table
$table['uploadShare'] = "CREATE TABLE uploadShare
(
uploadShare_id int NOT NULL auto_increment,
uploadShare_uploadID INT,
uploadShare_userID INT,
PRIMARY KEY (uploadShare_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE uploadShare ADD CONSTRAINT uploadShare_uploadID_refs FOREIGN KEY (uploadShare_uploadID) REFERENCES uploads (upload_id)",
"ALTER TABLE uploadShare ADD CONSTRAINT uploadShare_userID_refs FOREIGN KEY (uploadShare_userID) REFERENCES users (user_id)"
);

//Create FileShare Table
$table['fileShare'] = "CREATE TABLE fileShare
(
fileShare_id int NOT NULL auto_increment,
fileShare_fileID INT,
fileShare_userID INT,
PRIMARY KEY (fileShare_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE fileShare ADD CONSTRAINT fileShare_fileID_refs FOREIGN KEY (fileShare_fileID) REFERENCES files (file_id)",
"ALTER TABLE fileShare ADD CONSTRAINT fileShare_userID_refs FOREIGN KEY (fileShare_userID) REFERENCES users (user_id)"
);

//Create folderShare Table
$table['folderShare'] = "CREATE TABLE folderShare
(
folderShare_id int NOT NULL auto_increment,
folderShare_folderID INT,
folderShare_userID INT,
PRIMARY KEY (folderShare_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE folderShare ADD CONSTRAINT folderShare_folderID_refs FOREIGN KEY (folderShare_folderID) REFERENCES folders (folder_id)",
"ALTER TABLE folderShare ADD CONSTRAINT folderShare_userID_refs FOREIGN KEY (folderShare_userID) REFERENCES users (user_id)"
);

//Create versions Table
$table['versions'] = "CREATE TABLE versions
(
version_id int auto_increment,
version_number INT,
version_fileID INT,
version_parentID INT,
PRIMARY KEY (version_id)
) ENGINE=InnoDB";
array_push($keys,
"ALTER TABLE versions ADD CONSTRAINT version_fileID_refs FOREIGN KEY (version_fileID) REFERENCES files (file_id)",
"ALTER TABLE versions ADD CONSTRAINT version_parentID_refs FOREIGN KEY (version_parentID) REFERENCES files (file_id)"
);

echo "<br>string made";
foreach ($table as $value)
    {
    echo "<p>========" . $value;
    if (mysqli_query($con,$value))
        {
        echo "<br>...     Table created successfully";
        }
    else
        {
        echo "<br>Error creating table: " . mysqli_error($con);
        }
    }

foreach ($keys as $value)
    {
    echo "<p>========" . $value;
    if (mysqli_query($con,$value))
        {
        echo "<br>...     Table altered successfully";
        }
    else
        {
        echo "<br>Error creating alteration: " . mysqli_error($con);
        }
    }
    
$sql=array();
array_push($sql,"INSERT INTO users (user_login, user_first, user_last, user_email, user_access)
VALUES
('tflaspoehl3','Tim','Flaspoehler','tflaspoehler@gmail.com',1)");
array_push($sql,"INSERT INTO groups (group_name, group_permission, group_userID)
VALUES
('tflaspoehl3',1,1)");
array_push($sql,"INSERT INTO folders (folder_path, folder_name, folder_permission, folder_groupID, folder_userID)
VALUES
('uploads/tflaspoehl3','tflaspoehl3',1,1,1)");
mkdir('uploads/tflaspoehl3');
array_push($sql,"UPDATE groups SET group_folderID=1 WHERE group_id=1");
array_push($sql,"INSERT INTO membership (membership_userID, membership_groupID)
VALUES
(1,1)");

foreach ($sql as $value)
    {
    echo "<p>========" . $value;
    if (mysqli_query($con,$value))
        {
        echo "<br>...     Something ADDED successfully";
        }
    else
        {
        echo "<br>Error creating something: " . mysqli_error($con);
        }
    }
header('Location: folder.php?fid=1');
exit;
?>

</body>
</html>
