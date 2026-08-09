-- ======================================================================
-- GYMKHANA - Gym Subscription, Workout Plan & Diet Management System
-- MySQL 8.0+ DDL Script
-- Database Schema Architecture (3NF Normalized)
-- ======================================================================

CREATE DATABASE IF NOT EXISTS gymkhana_db;
USE gymkhana_db;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS progress_records;
DROP TABLE IF EXISTS diet_meals;
DROP TABLE IF EXISTS diet_plans;
DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS workout_plans;
DROP TABLE IF EXISTS member_subscriptions;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TRAINER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Trainers Table
CREATE TABLE trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    bio TEXT,
    experience_years INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_trainer_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Members Table
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    trainer_id INT DEFAULT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    emergency_contact VARCHAR(100),
    height_cm DECIMAL(5, 2) DEFAULT 170.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    INDEX idx_member_user (user_id),
    INDEX idx_member_trainer (trainer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Subscription Plans Table
CREATE TABLE subscription_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    features JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Member Subscriptions Table
CREATE TABLE member_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRING_SOON', 'EXPIRED') DEFAULT 'ACTIVE',
    payment_status ENUM('PAID', 'PENDING', 'FAILED') DEFAULT 'PAID',
    payment_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    INDEX idx_sub_member (member_id),
    INDEX idx_sub_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Workout Plans Table
CREATE TABLE workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    member_id INT DEFAULT NULL, -- NULL means master template
    created_by INT NOT NULL,     -- user_id (Admin or Trainer)
    is_template BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wp_member (member_id),
    INDEX idx_wp_template (is_template)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Workout Exercises Table
CREATE TABLE workout_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_id INT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    exercise_name VARCHAR(120) NOT NULL,
    target_muscle VARCHAR(80) NOT NULL,
    sets INT NOT NULL DEFAULT 3,
    reps VARCHAR(50) NOT NULL DEFAULT '10-12',
    rest_seconds INT NOT NULL DEFAULT 60,
    notes TEXT,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    INDEX idx_we_plan (workout_plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Diet Plans Table
CREATE TABLE diet_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    daily_calorie_target INT DEFAULT 2000,
    protein_target_g INT DEFAULT 150,
    carbs_target_g INT DEFAULT 200,
    fat_target_g INT DEFAULT 65,
    member_id INT DEFAULT NULL, -- NULL means master template
    created_by INT NOT NULL,     -- user_id (Admin or Trainer)
    is_template BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dp_member (member_id),
    INDEX idx_dp_template (is_template)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Diet Meals Table
CREATE TABLE diet_meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    diet_plan_id INT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    meal_time VARCHAR(50) NOT NULL, -- e.g. Breakfast, Lunch, Snack, Dinner
    meal_name VARCHAR(150) NOT NULL,
    calories INT NOT NULL DEFAULT 0,
    protein INT NOT NULL DEFAULT 0,
    carbs INT NOT NULL DEFAULT 0,
    fat INT NOT NULL DEFAULT 0,
    FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE,
    INDEX idx_dm_plan (diet_plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Progress Records Table
CREATE TABLE progress_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    record_date DATE NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,       -- in kg
    body_fat_pct DECIMAL(4, 1),
    chest_in DECIMAL(4, 1),
    waist_in DECIMAL(4, 1),
    arms_in DECIMAL(4, 1),
    bmi DECIMAL(4, 1),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_pr_member (member_id),
    INDEX idx_pr_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
