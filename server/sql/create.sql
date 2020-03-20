set @AUTH_SALT = 'mysalt';

DROP DATABASE IF EXISTS `circade`;
DROP USER IF EXISTS 'circade';

CREATE DATABASE `circade`;
CREATE USER 'circade' IDENTIFIED BY 'circade';
GRANT USAGE ON *.* TO 'circade'@localhost IDENTIFIED BY 'circade';
GRANT ALL privileges ON `circade`.* TO 'circade'@localhost;
FLUSH PRIVILEGES;

USE `circade`;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(256) NOT NULL,
  password VARCHAR(1024) NOT NULL,
  CONSTRAINT `unique_email` UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  type ENUM('event', 'task', 'completed-task', 'flag') NOT NULL,
  entry TEXT NOT NULL,

  CONSTRAINT `fk_user_id`
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT

) ENGINE = InnoDB;

INSERT INTO users (email, password) VALUES ('me@alexholt.me', SHA(CONCAT('test', @AUTH_SALT)));
