# Circade Server
Server code and database setup for the Circade journal.

## Initial Database Setup

```
CREATE DATABASE `circade`;
CREATE USER 'circade' IDENTIFIED BY 'circade';
GRANT USAGE ON *.* TO 'circade'@localhost IDENTIFIED BY 'circade';
GRANT ALL privileges ON `circade`.* TO 'circade'@localhost;
FLUSH PRIVILEGES;

CREATE TABLE user (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(1024) NOT NULL
  CONSTRAINT `unique_email`
    UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE entry (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  entry TEXT NOT NULL,

  CONSTRAINT `fk_user_id`
    FOREIGN KEY (user_id) REFERENCES user (id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,

  CONSTRAINT `unique_entry_per_day`
    UNIQUE (user_id, date)
) ENGINE = InnoDB;
```
