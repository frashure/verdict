-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema verdict
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `verdict` ;

-- -----------------------------------------------------
-- Schema verdict
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `verdict` ;
USE `verdict` ;

-- -----------------------------------------------------
-- Table `verdict`.`parties`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`parties` ;

CREATE TABLE IF NOT EXISTS `verdict`.`parties` (
  `party_id` VARCHAR(5) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `website` VARCHAR(45) NULL,
  PRIMARY KEY (`party_id`),
  UNIQUE INDEX `party_id_UNIQUE` (`party_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`candidates`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`candidates` ;

CREATE TABLE IF NOT EXISTS `verdict`.`candidates` (
  `candidate_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `party` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`candidate_id`),
  UNIQUE INDEX `candidate_id_UNIQUE` (`candidate_id` ASC) VISIBLE,
  INDEX `fk_candidates_parties1_idx` (`party` ASC) VISIBLE,
  INDEX `candidate_last_name` (`last_name` ASC) VISIBLE,
  CONSTRAINT `fk_candidates_parties1`
    FOREIGN KEY (`party`)
    REFERENCES `verdict`.`parties` (`party_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`users` ;

CREATE TABLE IF NOT EXISTS `verdict`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `party` VARCHAR(5) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_users_parties1_idx` (`party` ASC) VISIBLE,
  CONSTRAINT `fk_users_parties1`
    FOREIGN KEY (`party`)
    REFERENCES `verdict`.`parties` (`party_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`party_members`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`party_members` ;

CREATE TABLE IF NOT EXISTS `verdict`.`party_members` (
  `party_id` VARCHAR(5) NOT NULL,
  `candidate_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`party_id`),
  INDEX `fk_party_members_parties1_idx` (`party_id` ASC) VISIBLE,
  UNIQUE INDEX `uq_candidate_party` (`party_id` ASC) VISIBLE,
  INDEX `fk_party_members_candidates1_idx` (`candidate_id` ASC) VISIBLE,
  INDEX `fk_party_members_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_party_members_parties1`
    FOREIGN KEY (`party_id`)
    REFERENCES `verdict`.`parties` (`party_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_party_members_candidates1`
    FOREIGN KEY (`candidate_id`)
    REFERENCES `verdict`.`candidates` (`candidate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_party_members_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `verdict`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`legislatures`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`legislatures` ;

CREATE TABLE IF NOT EXISTS `verdict`.`legislatures` (
  `legislature_id` INT NOT NULL AUTO_INCREMENT,
  `state` CHAR(2) NOT NULL,
  `fed_state` CHAR(1) NOT NULL,
  `upper_lower` CHAR(1) NOT NULL,
  `name` VARCHAR(65) NOT NULL,
  PRIMARY KEY (`legislature_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`elections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`elections` ;

CREATE TABLE IF NOT EXISTS `verdict`.`elections` (
  `election_id` INT NOT NULL AUTO_INCREMENT,
  `election_type` VARCHAR(45) NOT NULL,
  `election_date` DATE NULL,
  `legislature_id` INT NOT NULL,
  `district` INT NULL,
  `party_id` VARCHAR(5) NULL,
  PRIMARY KEY (`election_id`),
  UNIQUE INDEX `election_id_UNIQUE` (`election_id` ASC) VISIBLE,
  INDEX `fk_elections_legislatures1_idx` (`legislature_id` ASC) VISIBLE,
  INDEX `fk_elections_parties1_idx` (`party_id` ASC) VISIBLE,
  CONSTRAINT `fk_elections_legislatures1`
    FOREIGN KEY (`legislature_id`)
    REFERENCES `verdict`.`legislatures` (`legislature_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_elections_parties1`
    FOREIGN KEY (`party_id`)
    REFERENCES `verdict`.`parties` (`party_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`election_candidates`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`election_candidates` ;

CREATE TABLE IF NOT EXISTS `verdict`.`election_candidates` (
  `candidates_candidate_id` INT NOT NULL,
  `elections_election_id` INT NOT NULL,
  PRIMARY KEY (`candidates_candidate_id`, `elections_election_id`),
  INDEX `fk_election_candidates_elections1_idx` (`elections_election_id` ASC) VISIBLE,
  CONSTRAINT `fk_election_candidates_candidates1`
    FOREIGN KEY (`candidates_candidate_id`)
    REFERENCES `verdict`.`candidates` (`candidate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_election_candidates_elections1`
    FOREIGN KEY (`elections_election_id`)
    REFERENCES `verdict`.`elections` (`election_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`election_results`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`election_results` ;

CREATE TABLE IF NOT EXISTS `verdict`.`election_results` (
  `candidate_id` INT NOT NULL,
  `election_id` INT NOT NULL,
  PRIMARY KEY (`candidate_id`, `election_id`),
  INDEX `fk_election_results_elections1_idx` (`election_id` ASC) VISIBLE,
  CONSTRAINT `fk_election_results_candidates1`
    FOREIGN KEY (`candidate_id`)
    REFERENCES `verdict`.`candidates` (`candidate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_election_results_elections1`
    FOREIGN KEY (`election_id`)
    REFERENCES `verdict`.`elections` (`election_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`endorsements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`endorsements` ;

CREATE TABLE IF NOT EXISTS `verdict`.`endorsements` (
  `user_id` INT NOT NULL,
  `candidate_id` INT NOT NULL,
  `election_id` INT NOT NULL,
  `date_endorsed` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`user_id`, `candidate_id`, `election_id`),
  INDEX `fk_endorsements_candidates1_idx` (`candidate_id` ASC) VISIBLE,
  INDEX `fk_endorsements_elections1_idx` (`election_id` ASC) VISIBLE,
  CONSTRAINT `fk_endorsements_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `verdict`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_endorsements_candidates1`
    FOREIGN KEY (`candidate_id`)
    REFERENCES `verdict`.`candidates` (`candidate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_endorsements_elections1`
    FOREIGN KEY (`election_id`)
    REFERENCES `verdict`.`elections` (`election_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`user_relationships`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`user_relationships` ;

CREATE TABLE IF NOT EXISTS `verdict`.`user_relationships` (
  `user1` INT NOT NULL,
  `user2` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `dateAdded` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`user1`, `user2`),
  INDEX `fk_userRelationships_users2_idx` (`user2` ASC) VISIBLE,
  CONSTRAINT `fk_userRelationships_users1`
    FOREIGN KEY (`user1`)
    REFERENCES `verdict`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_userRelationships_users2`
    FOREIGN KEY (`user2`)
    REFERENCES `verdict`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`endorsement_counts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`endorsement_counts` ;

CREATE TABLE IF NOT EXISTS `verdict`.`endorsement_counts` (
  `candidate_id` INT NOT NULL,
  `election_id` INT NOT NULL,
  `count_date` DATE NOT NULL,
  PRIMARY KEY (`candidate_id`, `election_id`, `count_date`),
  INDEX `fk_endorsement_counts_elections1_idx` (`election_id` ASC) VISIBLE,
  CONSTRAINT `fk_endorsement_counts_candidates1`
    FOREIGN KEY (`candidate_id`)
    REFERENCES `verdict`.`candidates` (`candidate_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_endorsement_counts_elections1`
    FOREIGN KEY (`election_id`)
    REFERENCES `verdict`.`elections` (`election_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `verdict`.`user_districts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `verdict`.`user_districts` ;

CREATE TABLE IF NOT EXISTS `verdict`.`user_districts` (
  `user_id` INT NOT NULL,
  `legislature_id` INT NOT NULL,
  `district` INT NULL,
  PRIMARY KEY (`user_id`, `legislature_id`),
  INDEX `fk_user_districts_legislatures1_idx` (`legislature_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_districts_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `verdict`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_districts_legislatures1`
    FOREIGN KEY (`legislature_id`)
    REFERENCES `verdict`.`legislatures` (`legislature_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `verdict`.`parties`
-- -----------------------------------------------------
START TRANSACTION;
USE `verdict`;
INSERT INTO `verdict`.`parties` (`party_id`, `name`, `website`) VALUES ('rep', 'Republican', NULL);
INSERT INTO `verdict`.`parties` (`party_id`, `name`, `website`) VALUES ('dem', 'Democratic', NULL);
INSERT INTO `verdict`.`parties` (`party_id`, `name`, `website`) VALUES ('lib', 'Libertarian', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `verdict`.`candidates`
-- -----------------------------------------------------
START TRANSACTION;
USE `verdict`;
INSERT INTO `verdict`.`candidates` (`candidate_id`, `first_name`, `last_name`, `party`) VALUES (1, 'Jo', 'Jorgensen', 'lib');
INSERT INTO `verdict`.`candidates` (`candidate_id`, `first_name`, `last_name`, `party`) VALUES (2, 'Donald', 'Trump', 'rep');
INSERT INTO `verdict`.`candidates` (`candidate_id`, `first_name`, `last_name`, `party`) VALUES (3, 'Joe', 'Biden', 'dem');

COMMIT;


-- -----------------------------------------------------
-- Data for table `verdict`.`legislatures`
-- -----------------------------------------------------
START TRANSACTION;
USE `verdict`;
INSERT INTO `verdict`.`legislatures` (`legislature_id`, `state`, `fed_state`, `upper_lower`, `name`) VALUES (1, 'US', 'f', 'u', 'President');
INSERT INTO `verdict`.`legislatures` (`legislature_id`, `state`, `fed_state`, `upper_lower`, `name`) VALUES (DEFAULT, 'VA', 'f', 'l', 'House of Representatives');
INSERT INTO `verdict`.`legislatures` (`legislature_id`, `state`, `fed_state`, `upper_lower`, `name`) VALUES (DEFAULT, 'VA', 'f', 'u', 'Senate');

COMMIT;


-- -----------------------------------------------------
-- Data for table `verdict`.`elections`
-- -----------------------------------------------------
START TRANSACTION;
USE `verdict`;
INSERT INTO `verdict`.`elections` (`election_id`, `election_type`, `election_date`, `legislature_id`, `district`, `party_id`) VALUES (1, 'g', '2020-11-03', 1, NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `verdict`.`election_candidates`
-- -----------------------------------------------------
START TRANSACTION;
USE `verdict`;
INSERT INTO `verdict`.`election_candidates` (`candidates_candidate_id`, `elections_election_id`) VALUES (1, 1);
INSERT INTO `verdict`.`election_candidates` (`candidates_candidate_id`, `elections_election_id`) VALUES (2, 1);
INSERT INTO `verdict`.`election_candidates` (`candidates_candidate_id`, `elections_election_id`) VALUES (3, 1);

COMMIT;

USE `verdict`;

DELIMITER $$

USE `verdict`$$
DROP TRIGGER IF EXISTS `verdict`.`candidates_add_party_member` $$
USE `verdict`$$
CREATE DEFINER = CURRENT_USER TRIGGER `verdict`.`candidates_add_party_member` AFTER INSERT ON `candidates` FOR EACH ROW
BEGIN
	IF (NEW.party IS NOT NULL) THEN
		INSERT INTO party_members (party_id, candidate_id) values (NEW.party, NEW.candidate_id);
    END IF;
END$$


DELIMITER ;
