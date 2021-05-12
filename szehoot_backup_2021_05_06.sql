-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2021. Máj 06. 14:05
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
  `name` text NOT NULL
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
  `u_id` int(11) DEFAULT NULL,
  `test_id` int(11) NOT NULL,
  `test_name` varchar(45) DEFAULT NULL,
  `question_num` int(11) NOT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `test_list`
--

INSERT INTO `test_list` (`id`, `u_id`, `test_id`, `test_name`, `question_num`, `created_date`) VALUES
(1, NULL, 1111, 'Kerdeseim', 12, NULL),
(2, NULL, 78945, 'Tortenelem', 7, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_process_list`
--

CREATE TABLE `test_process_list` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `mode` tinyint(1) NOT NULL,
  `pincode` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `u_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `test_process_list`
--

INSERT INTO `test_process_list` (`id`, `test_id`, `mode`, `pincode`, `start_date`, `end_date`, `u_id`) VALUES
(1, 1, 1, 1111, '2021-04-22 16:26:38', '2021-04-22 16:26:38', 0);

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
  `type` tinyint(1) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
  `question_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `test_questions`
--

INSERT INTO `test_questions` (`id`, `test_id`, `question`, `answer_1`, `answer_2`, `answer_3`, `answer_4`, `correct_answer_no`, `time`, `score`, `type`, `image`, `question_number`) VALUES
(1, 1111, 'Melyik évben született Newton?', '1730', '1643', '1673', '1813', 2, 30, 500, 4, '', 1),
(2, 1111, 'Melyik élőlény él az északi sarkon?', 'Elefánt', 'Oroszlán', 'Teve', 'Medve', 4, 45, 300, 4, '', 2),
(3, 1111, 'Ki a legnagyobb autógyártó cég a világon?', 'Wolsvagen', 'BMW', 'Ford', 'Toyota', 4, 25, 400, 4, '', 3),
(4, 78945, 'Mikor koronázták meg Szent Istvánt', '1101', '1000', '1001', '999', 3, 30, 200, 4, '', 1),
(5, 1111, 'Melyik nem igaz az eretnekekre?', 'Istentagadók', 'Hivatalos katolikus tanokat elutasították', 'Szembefordultak az egyházzal', 'Új tanokat, gondolatokat hirdetők', 1, 30, 400, 4, '', 4),
(6, 1111, 'Milyen nyelven oktattak a középkori egyetemeken?', 'görögül', 'latinul', 'anyanyelven', 'angolul', 2, 25, 1000, 4, '', 5),
(7, 1111, 'A felsoroltak közül, mi Görögország jellegzetes itala?', 'Beherovka', 'Vodka', 'Ouzo', 'Pálinka', 3, 75, 800, 4, '', 6),
(8, 1111, 'Milyen intézmény a Harry Poter-könyvekben szereplő Azkaban?', 'Iskola', 'Múzeum', 'Stadion', 'Börtön', 4, 30, 500, 4, '', 7),
(9, 78945, 'Mikor halt ki az Árpád-ház?', '1301', '1331', '1308', '1241', 1, 20, 400, 4, '', 2),
(10, 1111, 'India fővárosa Új-Delhi ?', 'Igaz', 'Hamis', NULL, NULL, 1, 15, 600, 2, '', 8),
(11, 78945, 'Ki volt a gőzgép feltalálója?', 'Robert Fulton', 'George Stephenson', 'James Watt', 'Thomas Edison', 3, 20, 350, 4, '', 3),
(12, 78945, 'I. Károly a Tudor-házból származó angol uralkdó volt ?', 'Igaz', 'Hamis', NULL, NULL, 2, 12, 500, 2, '', 4),
(13, 1111, 'Mi a rubeola magyar neve?', 'Ragyaverés', 'Rózsabimbó', 'Rózsahimlő', NULL, 3, 15, 500, 3, '', 9),
(14, 78945, 'Melyik évben adta ki II. András király az aranybullát?', NULL, NULL, NULL, NULL, 1222, 10, 400, 1, '', 5),
(15, 1111, 'Milyen címmel jelent meg az ABBA együttes 1974-es lemeze?', 'Ring Ring', 'Waterloo', 'ABBA', 'Voulez-Vous', 2, 16, 600, 4, '', 10),
(16, 1111, 'Kik voltak magyar feltalálók?', 'Albert Einstein', 'Rubik Ernő', 'Neumann János', 'Jedlik Ányos', 234, 15, 800, 5, '', 11),
(17, 78945, 'Melyik évben tört ki az első világháború?', NULL, NULL, NULL, NULL, 1914, 10, 700, 1, '', 6),
(18, 78945, 'Melyik országok tartoztak az Antanthoz?', 'Kína', 'Japán Császárság', 'Osztrák–Magyar Monarchia', 'Brit Birodalom', 24, 20, 300, 5, '', 7),
(19, 1111, 'Melyik évben jelent meg az album?', NULL, NULL, NULL, NULL, 1995, 20, 1000, 1, 'https://cdn.pixabay.com/photo/2021/04/03/12/25/lone-tree-6147402_960_720.jpg', 12);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_results`
--

CREATE TABLE `test_results` (
  `id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `answers` int(11) DEFAULT NULL,
  `ts` datetime NOT NULL,
  `u_id` int(11) DEFAULT NULL,
  `answer_number` int(11) DEFAULT NULL
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
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastlogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `email`, `regdate`, `lastlogin`) VALUES
(1, 'admin', '$2b$10$SUpnBcrOlDJ1TdlX69v.eOCcTNA14Hlx6Izasw6Lc6Xk4DXKHhHuq', 'admin@szehoot.hu', '2021-03-27 16:18:04', '2021-03-27 16:14:49'),
(2, 'test', 'teszt', 'asd@asd.hu', '2021-03-28 16:48:43', NULL),
(3, 'asd', 'asd', 'asd@asd.hu', '2021-03-28 16:50:56', NULL),
(4, 'dsa', 'dsa', 'asd@dsa.hu', '2021-03-28 16:52:30', NULL),
(5, 'asd2', '$2b$10$ENjpmn652Ze4c5dodXKWHe5jWn2sfyImlymeDcvzR1X2u8YUvPZmi', 'asd@asd.hu', '2021-03-28 16:56:45', NULL),
(6, 'teszt', '$2b$10$598WDG8fbDh1S4iBnz/xVOxQAYJx4uf4oKhjSgTMDpzE.1Pbj20be', 'teszt@teszt.hu', '2021-03-28 17:50:41', NULL),
(7, 'david', '$2b$10$GOiubm9.Ljn9tS6PSdE4JeRCWEPDPSaYq0Gd5PfhI3eqInBU4ryEi', 'david@gmail.com', '2021-03-28 18:48:10', NULL),
(8, 'asds', '$2b$10$x4A83ZzCnbRP.I70OARfH.RPN6I/4rP9M.pdMR/R7ZuzgB5DNuvAG', 'asd@asd.dhu', '2021-03-28 20:34:10', NULL),
(10, 'asdasd', '$2b$10$/hvsla55J0azqu1ZsljjteROB0AMqUnADh8MAfGK2Ren7YoufYg7W', 'asd@dsa.hus', '2021-03-29 09:49:16', NULL),
(11, 'teszt0', '$2b$10$POXZ2uUP.n2mUomvIGzO3eiBWwGQiRZVqqGYLSbNnv0LwAqMsAuJO', '', '2021-03-29 09:49:42', NULL),
(12, 'asdasdss', '$2b$10$kzBLDJGPveTb2.f232cS0O6qCNrnTCeBD9z.oI4UxqsoWNtUa5HZu', 'asdasd@dsadas.hu', '2021-03-29 09:58:47', NULL),
(13, 'felh1', '$2b$10$ysZTwXd7n6mKUodupZC3G.5GWVBBNV642Xft0spBJxVX518C1RpPG', 'mukodik@gmail.com', '2021-03-29 10:00:48', NULL),
(14, 'felhs', '$2b$10$ewxZ.eCBykKSYxnwySo5oeGzOmnQ5iUSPHE/0ZldSb.Ct5rRZ4HMi', 'dsa@asd.hu', '2021-03-29 10:03:05', NULL),
(15, 'asddsa', '$2b$10$smDsZocne1ipQapVM.P/Y.HxB8upjsrlqiFhh81oQ.8d3xwe4drEO', 's', '2021-03-29 10:25:42', NULL),
(16, 'asddsadasdasd', '$2b$10$ijyQtj.c/eXZFl.3vXpQLutXbocoukHYKBhS21Idfn9dD02hKj0by', 'asdasd@asdasdasd.hu', '2021-03-29 18:27:50', NULL),
(17, 'asdasdasd', '$2b$10$9Nc7XXKNMix4qEZNgH1jkOPXM51flrJ.W7vgcmE1d/5RX5.E4TTv.', 'asdasd@asd.hu', '2021-04-06 11:53:37', NULL),
(18, 'asdasdasdasdasd', '$2b$10$KOveFv6vBRfFGYDezpznnujF43uvho0xd/RXBfYGw04wYHrsVWmt2', 'asdasdasd@asad.hu', '2021-04-06 12:29:04', NULL),
(19, 'dinnyemag', '$2b$10$J/HPjjLRy8ELbydm.F3ybeEkYloAC0oWj8d.Ht8VtC8DrifUTa6Gu', 'asdasd@asdasd.hu', '2021-04-06 13:37:01', NULL),
(20, 'asdasdasdasd', '$2b$10$.DWytdV7.z2EqUZ6QbLJEuEW35czMlFVs8ovnqIn2enphZu1h4haS', 'asd@asdasdasdasd.hu', '2021-04-07 20:38:37', NULL),
(21, 'asdasdasdasdasdasd', '$2b$10$AQH1Vu8e7JmcR6OPnSx.0eqX.3J3iFgRKrmGbetZ.klOVtYaAJmZC', 'asdasd@dsadasd.hu', '2021-04-08 17:12:36', NULL),
(22, 'dfsdfsdfsdf', '$2b$10$pnTBPp1y.30EHlzFlE68VODEo1KCrbMk1wZFjBPlitf3B4BVUf.W6', 'teszt@asdasdasdasd.hu', '2021-04-09 11:45:59', NULL),
(23, '2asds', '$2b$10$RSJw3SbLEeAhPZ0GsHmYjeedjuwBkeACq3s9nhWRSSyBDCV6BzUqK', 'asd@asd.husssssss', '2021-04-22 19:09:11', NULL),
(24, 'nagygabor', '$2b$10$UZhbW/qpBwt/GEQxxQ6HU.1VSzrQeE5CA5yCllAX7xbCt3KNBto4.', 'gabor@gmail.com', '2021-05-04 17:15:24', NULL);

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
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `test_process_list`
--
ALTER TABLE `test_process_list`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `test_process_list`
--
ALTER TABLE `test_process_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `test_questions`
--
ALTER TABLE `test_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `test_results`
--
ALTER TABLE `test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
