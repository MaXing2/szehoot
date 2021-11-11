-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2021. Nov 11. 16:48
-- Kiszolgáló verziója: 10.1.48-MariaDB-0+deb9u1
-- PHP verzió: 7.2.34-18+0~20210223.60+debian9~1.gbpb21322

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_category_names`
--

CREATE TABLE `test_category_names` (
  `id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `parent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_category_relation`
--

CREATE TABLE `test_category_relation` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_list`
--

CREATE TABLE `test_list` (
  `id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `test_name` varchar(45) NOT NULL,
  `question_num` int(11) NOT NULL,
  `valid` int(11) DEFAULT NULL,
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
  `pincode` int(11) NOT NULL,
  `online_count` int(5) NOT NULL,
  `classification` varchar(100) NOT NULL,
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
  `score` int(11) DEFAULT NULL,
  `extra_score` int(11) DEFAULT NULL,
  `extra_time` int(11) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
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
  `response_time` int(11) DEFAULT NULL,
  `u_id` int(11) DEFAULT NULL,
  `answer_number` int(11) DEFAULT NULL,
  `nick_name` varchar(45) DEFAULT NULL,
  `attempt_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `username` varchar(90) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `title` int(11) NOT NULL,
  `eduid` varchar(100) DEFAULT NULL,
  `gender` int(11) NOT NULL,
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastlogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `test_category_names`
--
ALTER TABLE `test_category_names`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `test_category_relation`
--
ALTER TABLE `test_category_relation`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`id`);

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
-- Megkötések a táblához `test_list`
--
ALTER TABLE `test_list`
  ADD CONSTRAINT `test_list_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Megkötések a táblához `test_process_list`
--
ALTER TABLE `test_process_list`
  ADD CONSTRAINT `test_process_list_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
