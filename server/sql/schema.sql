CREATE DATABASE IF NOT EXISTS skillsphere;
USE skillsphere;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technologies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(80) NOT NULL,
  icon VARCHAR(20) DEFAULT '◈'
);

CREATE TABLE IF NOT EXISTS roadmap_topics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  technology_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  difficulty ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  estimated_hours DECIMAL(5,1) DEFAULT 2,
  order_no INT NOT NULL,
  FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  topic_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  type ENUM('FREE_VIDEO','FREE_ARTICLE','PAID_COURSE') NOT NULL,
  provider VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (topic_id) REFERENCES roadmap_topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  topic_id INT NOT NULL,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option CHAR(1) NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES roadmap_topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES roadmap_topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES roadmap_topics(id) ON DELETE CASCADE
);
