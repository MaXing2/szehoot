-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2021. Dec 21. 11:06
-- Kiszolgáló verziója: 10.1.48-MariaDB-0+deb9u1
-- PHP verzió: 7.2.34-18+0~20210223.60+debian9~1.gbpb21322

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `szehoot`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`max`@`%` PROCEDURE `CreateCategoryRelation` (IN `test_id` INT(11), IN `subcat_id` INT(11))  BEGIN
INSERT INTO test_category_relation (category_id, test_id) VALUES (subcat_id, test_id);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `CreateMainCat` (IN `user_id` INT(11), IN `test_name` VARCHAR(11))  BEGIN
INSERT INTO test_category_names (u_id, name) VALUES (user_id, test_name);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `CreateProcess` (IN `test_id` INT(11), IN `mode` INT(11), IN `pincode` INT(11), IN `start_date` DATETIME, IN `end_date` DATETIME, IN `classification` VARCHAR(255))  BEGIN
INSERT INTO test_process_list (test_id, mode, pincode, start_date, end_date, classification) VALUES (test_id, mode, pincode, start_date, end_date, classification);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `CreateSubCat` (IN `user_id` INT(11), IN `cat_name` VARCHAR(255), IN `maincat_id` INT(11))  BEGIN
INSERT INTO test_category_names (u_id, name, parent) VALUES (user_id, cat_name, maincat_id);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `CreateTest` (IN `u_id` INT(11), IN `test_name` VARCHAR(255), IN `valid` BIT)  BEGIN
INSERT INTO test_list (u_id, test_name, question_num, valid) VALUES (u_id, test_name, '0', valid);
SELECT LAST_INSERT_ID() as test_id from test_list LIMIT 1;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DeleteMainCat` (IN `maincat_id` INT(11), IN `user_id` INT(11))  BEGIN
DELETE FROM test_category_names WHERE test_category_names.parent = maincat_id;
DELETE FROM test_category_names WHERE test_category_names.id = maincat_id AND test_category_names.u_id = user_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DeleteProcess` (IN `process_id` INT(11))  BEGIN
DELETE FROM test_process_list WHERE test_process_list.id = process_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DeleteSubCat` (IN `cat_id` INT(11), IN `user_id` INT(11))  BEGIN
DELETE FROM test_category_names WHERE test_category_names.id = cat_id AND test_category_names.u_id = user_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DeleteTest` (IN `test_id` INT(11))  BEGIN
DELETE FROM test_list WHERE test_list.id = test_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DeleteUser` (IN `username` VARCHAR(255))  BEGIN
DELETE FROM users WHERE users.username=username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `DuplicateTest` (IN `test_name` VARCHAR(150), IN `test_id` INT(5), IN `cat_id` INT(5))  BEGIN
INSERT INTO test_list (u_id, test_name, question_num) SELECT u_id, test_name, question_num FROM test_list WHERE id=test_id;
SELECT @new_test_id := LAST_INSERT_ID() as test_id from test_list LIMIT 1;
INSERT INTO test_category_relation (category_id, test_id) VALUES (cat_id, @new_test_id); 
INSERT INTO test_questions (test_id, question, answer_1, answer_2, answer_3, answer_4, correct_answer_no, time, score, extra_score, extra_time, type, image, question_number) 
SELECT @new_test_id, question, answer_1, answer_2, answer_3, answer_4, correct_answer_no, time, score, extra_score, extra_time, type, image, question_number FROM test_questions WHERE test_questions.test_id = test_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetAllCategorys` (IN `username` VARCHAR(100))  BEGIN
SELECT test_category_names.id, test_category_names.parent, test_category_names.name, COUNT(CASE WHEN test_category_relation.test_id IS NOT NULL then 1 END) as TestCount
	FROM test_category_names
    JOIN users ON users.uid = test_category_names.u_id
    LEFT JOIN test_category_relation ON test_category_relation.category_id = test_category_names.id
    WHERE users.username = username
    GROUP BY test_category_names.id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetAllProcess` (IN `username` VARCHAR(100))  BEGIN
SELECT *, test_process_list.id as process_id, test_list.id as test_id
    FROM test_process_list
    JOIN test_list ON test_list.id = test_process_list.test_id
    JOIN users ON users.uid = test_list.u_id
    WHERE users.username = username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetAllTest` (IN `username` VARCHAR(100))  BEGIN
	SELECT *, test_list.id as test_id, test_category_names.name as subcat_name, maincat.name as maincat_name FROM test_list
    JOIN users ON users.uid = test_list.u_id
    JOIN test_category_relation ON test_category_relation.test_id = test_list.id
    JOIN test_category_names ON test_category_names.id = test_category_relation.category_id
    JOIN test_category_names as maincat ON maincat.id = test_category_names.parent
    WHERE users.username = username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetFullFilledCountByUser` (IN `username` VARCHAR(255))  BEGIN
SELECT COUNT(*) as fullfilledCount
FROM test_process_list
JOIN test_list ON test_list.id = test_process_list.test_id
JOIN users ON users.uid = test_list.u_id
JOIN test_results ON test_results.process_id = test_process_list.id
WHERE (test_results.answer_number = test_list.question_num-1 AND users.username = username);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetFullfilledCountPerProcessByUser` (IN `username` VARCHAR(255))  BEGIN
SELECT test_process_list.id as process_id, COUNT(*) as fullfilledCount
FROM test_process_list
JOIN test_list ON test_list.id = test_process_list.test_id
JOIN users ON users.uid = test_list.u_id
JOIN test_results ON test_results.process_id = test_process_list.id

WHERE test_results.answer_number = test_list.question_num-1 AND users.username = username
GROUP BY test_process_list.id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetLast5Process` (IN `username` VARCHAR(255))  BEGIN
    SELECT *, test_process_list.id as process_id, test_list.id as test_id
        FROM test_process_list
        JOIN test_list ON test_list.id = test_process_list.test_id
        JOIN users ON users.uid = test_list.u_id
        WHERE users.username = username
        ORDER BY process_id DESC
        LIMIT 5;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetLast5Test` (IN `username` VARCHAR(100))  BEGIN
SELECT *, test_list.id as test_id, test_category_names.name as subcat_name, maincat.name as maincat_name FROM test_list
    JOIN users ON users.uid = test_list.u_id
    JOIN test_category_relation ON test_category_relation.test_id = test_list.id
    JOIN test_category_names ON test_category_names.id = test_category_relation.category_id
    JOIN test_category_names as maincat ON maincat.id = test_category_names.parent
    WHERE users.username = username
    ORDER BY modified_date DESC
    LIMIT 5;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetMainCategorys` (IN `username` VARCHAR(255))  BEGIN
	SELECT *  FROM test_category_names
    JOIN users ON users.uid = test_category_names.u_id WHERE users.username = username AND test_category_names.parent is NULL;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetMyFullFilledCountByUser` (IN `username` VARCHAR(255))  BEGIN
SELECT COUNT(*) as fullfilledCount,
COUNT(CASE test_process_list.mode WHEN '0' THEN 1 ELSE NULL END) as gyakorloCount,
COUNT(CASE test_process_list.mode WHEN '2' THEN 1 ELSE NULL END) as vizsgaCount,
COUNT(CASE test_process_list.mode WHEN '3' THEN 1 ELSE NULL END) as vizsgavCount
FROM test_process_list
JOIN test_list ON test_list.id = test_process_list.test_id
JOIN test_results ON test_results.process_id = test_process_list.id
JOIN users ON users.uid = test_results.u_id
WHERE (test_results.answer_number = test_list.question_num-1 AND users.username = username);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetProcessByIDnUser` (IN `username` VARCHAR(255), IN `process_id` INT(11))  BEGIN
SELECT 
test_process_list.mode, test_process_list.id as process_id,
test_list.test_name as test_name, 
test_list.question_num, SUM(test_questions.score) as all_point, 
SUM(test_questions.extra_score) as all_extrapoint, 
SEC_TO_TIME(ROUND(SUM(test_questions.time),0)) as max_time,
test_process_list.classification


    FROM test_process_list
    JOIN test_list ON test_list.id = test_process_list.test_id
    JOIN test_questions ON test_questions.test_id = test_list.id
    JOIN users ON users.uid = test_list.u_id
    WHERE (users.username = username) AND (test_process_list.id = process_id)
    GROUP BY test_process_list.id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetProcessByPincode` (IN `pincode` CHAR(6))  BEGIN
SELECT *, test_process_list.id as process_id
FROM test_process_list 
JOIN test_list ON test_list.id = test_process_list.test_id
WHERE test_process_list.pincode = pincode;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetProcessCount` (IN `username` VARCHAR(255))  BEGIN
SELECT COUNT(test_process_list.id) as processCount
    FROM test_process_list
    JOIN test_list ON test_list.id = test_process_list.test_id
    JOIN users ON users.uid = test_list.u_id
    WHERE users.username = username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetQuestionCount` (IN `username` VARCHAR(255))  BEGIN
SELECT COUNT(test_questions.id) as questionCount
FROM test_list
JOIN users ON users.uid = test_list.u_id
JOIN test_questions ON test_questions.test_id = test_list.id
WHERE users.username = username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetRandomNonExistentAttemptId` ()  BEGIN
SELECT attemptId
FROM (SELECT substring(MD5(RAND()),1,10) as attemptId) x
WHERE attemptId NOT IN (SELECT attempt_id FROM test_results);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetRandomNonExistentPincode` ()  BEGIN
SELECT Pincode
FROM (SELECT LPAD(FLOOR(RAND() * 999999.99), 6, RAND() * 999999.99) as Pincode) x
WHERE Pincode NOT IN (SELECT pincode FROM test_process_list);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetResultsAttemptIdByUsernProcessId` (IN `username` VARCHAR(255), IN `process_id` INT(11))  BEGIN
SELECT *
FROM test_process_list
JOIN test_results ON test_results.process_id = test_process_list.id
JOIN users ON users.uid = test_results.u_id
WHERE test_process_list.id = process_id AND users.username = username 
ORDER BY test_results.answer_number DESC
LIMIT 1;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetResultsByAttemptID` (IN `attempt_id` VARCHAR(255))  BEGIN
SELECT *, reached_point+reached_extrapoint as summed_points FROM (
SELECT
ROUND(SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers THEN test_questions.score ELSE '0' END) / SUM(test_questions.score) *100,0) as "result_percentage", 
SUM(test_questions.score) as "all_point", SUM(test_questions.extra_score) as "all_extrapoint", 
SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers THEN test_questions.score ELSE '0' END) as reached_point, 
SEC_TO_TIME(ROUND(SUM(test_results.response_time),1)) as 'time', 
ROUND(SUM(test_results.response_time),1) as 'time2', 
SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers AND test_results.response_time <= test_questions.extra_time THEN test_questions.extra_score ELSE '0' END) as reached_extrapoint


FROM test_results
JOIN test_process_list ON test_process_list.id = test_results.process_id
JOIN test_list ON test_list.id = test_process_list.test_id
JOIN test_questions ON test_questions.question_number = test_results.answer_number AND test_questions.test_id = test_process_list.test_id
WHERE test_results.attempt_id = attempt_id
GROUP BY test_results.attempt_id) x;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetResultsByProcessID` (IN `process_id` INT(11))  BEGIN
SELECT *, reached_point+reached_extrapoint as summed_points FROM (
SELECT
users.uid as user_id,
CONCAT(users.lastname, " ", users.firstname) as full_name, 
users.username, MIN(test_results.ts) as start_date, MAX(test_results.ts) as end_date, 
users.eduid, ROUND(SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers THEN test_questions.score ELSE '0' END) / SUM(test_questions.score) *100,0) as "result_percentage", 
SUM(test_questions.score) as "all_point", SUM(test_questions.extra_score) as "all_extrapoint", 
SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers THEN test_questions.score ELSE '0' END) as reached_point, 
SEC_TO_TIME(ROUND(SUM(test_results.response_time),1)) as 'time', 
ROUND(SUM(test_results.response_time),1) as 'time2', 
SUM(CASE WHEN test_questions.correct_answer_no = test_results.answers AND test_results.response_time <= test_questions.extra_time THEN test_questions.extra_score ELSE '0' END) as reached_extrapoint


FROM test_results
JOIN users ON users.uid = test_results.u_id
JOIN test_process_list ON test_process_list.id = test_results.process_id
JOIN test_list ON test_list.id = test_process_list.test_id
JOIN test_questions ON test_questions.question_number = test_results.answer_number AND test_questions.test_id = test_process_list.test_id
WHERE test_results.process_id = process_id
GROUP BY users.username) x
ORDER BY summed_points desc;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetSubCategorys` (IN `username` VARCHAR(255))  BEGIN
	SELECT *  FROM test_category_names
    JOIN users ON users.uid = test_category_names.u_id WHERE users.username = username AND test_category_names.parent IS NOT NULL;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetTestByIDnUser` (IN `username` VARCHAR(255), IN `test_id` INT(11))  BEGIN
SELECT *, CAST(valid AS INTEGER) as valid_int
    FROM test_list
    JOIN users ON users.uid = test_list.u_id
    WHERE (users.username = username) AND (test_list.id = test_id);
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetTestCount` (IN `username` VARCHAR(255))  SELECT COUNT(test_list.id) as testCount
    FROM test_list
    JOIN users ON users.uid = test_list.u_id
    WHERE users.username = username$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetTestCountBySubCat` (IN `subcat_id` INT(11))  BEGIN
SELECT Count(*) as TestCount FROM test_category_names
JOIN test_category_relation ON test_category_relation.category_id = test_category_names.id
WHERE test_category_relation.category_id = subcat_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `GetUserData` (IN `username` VARCHAR(255))  BEGIN
SELECT * FROM users WHERE users.username = username;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `MoveTest` (IN `test_id` INT(11), IN `cat_id` INT(11))  BEGIN
UPDATE test_category_relation SET test_category_relation.category_id=cat_id WHERE test_category_relation.test_id = test_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `RenameCategory` (IN `category_id` INT(11), IN `name` VARCHAR(255), IN `user_id` INT(11))  BEGIN
UPDATE test_category_names SET test_category_names.name = name
WHERE test_category_names.id = category_id && test_category_names.u_id = user_id;
END$$

CREATE DEFINER=`max`@`%` PROCEDURE `RenameTest` (IN `test_id` INT(11), IN `new_test_name` VARCHAR(255))  BEGIN
UPDATE test_list SET test_list.test_name = new_test_name WHERE test_list.id = test_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_category_names`
--

CREATE TABLE `test_category_names` (
  `id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Eseményindítók `test_category_names`
--
DELIMITER $$
CREATE TRIGGER `DeleteRelations` AFTER DELETE ON `test_category_names` FOR EACH ROW DELETE FROM test_category_relation
WHERE test_category_relation.category_id = OLD.id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_category_relation`
--

CREATE TABLE `test_category_relation` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Eseményindítók `test_category_relation`
--
DELIMITER $$
CREATE TRIGGER `DeleteTests` AFTER DELETE ON `test_category_relation` FOR EACH ROW DELETE FROM test_list
    WHERE test_list.id = OLD.test_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_list`
--

CREATE TABLE `test_list` (
  `id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `question_num` int(11) NOT NULL,
  `valid` bit(1) NOT NULL,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_process_list`
--

CREATE TABLE `test_process_list` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `mode` tinyint(1) NOT NULL,
  `pincode` char(6) NOT NULL,
  `online_count` int(11) NOT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_questions`
--

CREATE TABLE `test_questions` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question` text,
  `answer_1` text,
  `answer_2` text,
  `answer_3` text,
  `answer_4` text,
  `correct_answer_no` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `score` tinyint(4) DEFAULT NULL,
  `extra_score` tinyint(4) DEFAULT NULL,
  `extra_time` int(11) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `question_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_results`
--

CREATE TABLE `test_results` (
  `id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `answers` int(11) DEFAULT NULL,
  `ts` datetime NOT NULL,
  `response_time` float DEFAULT NULL,
  `u_id` int(11) DEFAULT NULL,
  `answer_number` int(11) DEFAULT NULL,
  `nick_name` varchar(255) DEFAULT NULL,
  `attempt_id` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `title` tinyint(4) NOT NULL,
  `eduid` varchar(255) DEFAULT NULL,
  `gender` tinyint(4) NOT NULL,
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastlogin` datetime DEFAULT NULL,
  `resetkey` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `test_category_names`
--
ALTER TABLE `test_category_names`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`);

--
-- A tábla indexei `test_category_relation`
--
ALTER TABLE `test_category_relation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `test_id` (`test_id`);

--
-- A tábla indexei `test_list`
--
ALTER TABLE `test_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`);

--
-- A tábla indexei `test_process_list`
--
ALTER TABLE `test_process_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- A tábla indexei `test_questions`
--
ALTER TABLE `test_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- A tábla indexei `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`) USING BTREE,
  ADD KEY `process_id` (`process_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `test_category_names`
--
ALTER TABLE `test_category_names`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `test_category_relation`
--
ALTER TABLE `test_category_relation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `test_list`
--
ALTER TABLE `test_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `test_process_list`
--
ALTER TABLE `test_process_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `test_questions`
--
ALTER TABLE `test_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `test_results`
--
ALTER TABLE `test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `test_category_names`
--
ALTER TABLE `test_category_names`
  ADD CONSTRAINT `test_category_names_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE;

--
-- Megkötések a táblához `test_category_relation`
--
ALTER TABLE `test_category_relation`
  ADD CONSTRAINT `test_category_relation_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_list` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `test_list`
--
ALTER TABLE `test_list`
  ADD CONSTRAINT `test_list_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Megkötések a táblához `test_process_list`
--
ALTER TABLE `test_process_list`
  ADD CONSTRAINT `test_process_list_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_list` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `test_questions`
--
ALTER TABLE `test_questions`
  ADD CONSTRAINT `test_questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_list` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `test_results_ibfk_2` FOREIGN KEY (`process_id`) REFERENCES `test_process_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
