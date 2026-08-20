-- ====================================================================
-- CAMPUS360 UNIVERSITY MANAGEMENT SYSTEM - SEED DATA
-- ====================================================================

-- All users have password: 'password123'
-- Bcrypt Hash: $2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq

-- Clear existing data (handled by schema.sql dropping tables, but good practice to clean)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE complaints;
TRUNCATE TABLE notifications;
TRUNCATE TABLE notices;
TRUNCATE TABLE fees;
TRUNCATE TABLE timetable;
TRUNCATE TABLE marks;
TRUNCATE TABLE exam_schedule;
TRUNCATE TABLE rooms;
TRUNCATE TABLE exams;
TRUNCATE TABLE study_materials;
TRUNCATE TABLE submissions;
TRUNCATE TABLE assignments;
TRUNCATE TABLE attendance;
TRUNCATE TABLE faculty_subjects;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE subjects;
TRUNCATE TABLE faculty;
TRUNCATE TABLE students;
TRUNCATE TABLE courses;
TRUNCATE TABLE departments;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 1. USERS SEED
-- ====================================================================
-- ID range: 1-100
-- 1 Admin (ID: 1)
-- 2 HODs (ID: 2-3)
-- 5 Faculty (ID: 4-8)
-- 20 Students (ID: 9-28)
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
(1, 'System Admin', 'admin@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'ADMIN', 'ACTIVE'),

-- HODs
(2, 'Dr. Rajesh Kumar', 'rajesh.kumar@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'HOD', 'ACTIVE'),
(3, 'Dr. Amit Sharma', 'amit.sharma@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'HOD', 'ACTIVE'),

-- Faculty
(4, 'Dr. Priya Patel', 'priya.patel@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'FACULTY', 'ACTIVE'),
(5, 'Prof. Vikram Singh', 'vikram.singh@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'FACULTY', 'ACTIVE'),
(6, 'Dr. Sunita Rao', 'sunita.rao@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'FACULTY', 'ACTIVE'),
(7, 'Prof. K. Viswanathan', 'k.viswanathan@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'FACULTY', 'ACTIVE'),
(8, 'Dr. Anil Mehta', 'anil.mehta@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'FACULTY', 'ACTIVE'),

-- Students
(9, 'Aarav Mehta', 'aarav.mehta@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(10, 'Aditya Sen', 'aditya.sen@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(11, 'Ananya Iyer', 'ananya.iyer@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(12, 'Arjun Reddy', 'arjun.reddy@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(13, 'Devendra Joshi', 'devendra.joshi@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(14, 'Diya Kapoor', 'diya.kapoor@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(15, 'Ishaan Nair', 'ishaan.nair@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(16, 'Kavya Pillai', 'kavya.pillai@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(17, 'Nikhil Verma', 'nikhil.verma@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(18, 'Pranav Bhat', 'pranav.bhat@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(19, 'Rohan Das', 'rohan.das@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(20, 'Riya Sharma', 'riya.sharma@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(21, 'Sai Kiran', 'sai.kiran@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(22, 'Siddharth Roy', 'siddharth.roy@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(23, 'Sneha Gupta', 'sneha.gupta@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(24, 'Tanvi Bose', 'tanvi.bose@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(25, 'Utkarsh Mishra', 'utkarsh.mishra@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(26, 'Varun Desai', 'varun.desai@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(27, 'Yash Vardhan', 'yash.vardhan@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE'),
(28, 'Zoya Khan', 'zoya.khan@campus360.edu', '$2a$10$dsP2PxLDdi717zhovPMipuShAgDKyQCFvrX1h2ro/aKYAWvqblmjq', 'STUDENT', 'ACTIVE');

-- ====================================================================
-- 2. DEPARTMENTS SEED
-- ====================================================================
INSERT INTO departments (id, name, code, hod_id) VALUES
(1, 'Computer Science & Engineering', 'CSE', 2),
(2, 'Electrical & Electronics Engineering', 'EEE', 3),
(3, 'Mechanical Engineering', 'ME', NULL); -- ME department has no HOD assigned yet

-- ====================================================================
-- 3. COURSES SEED
-- ====================================================================
INSERT INTO courses (id, name, code, department_id, duration_years) VALUES
(1, 'Bachelor of Technology in Computer Science', 'BTECH-CSE', 1, 4),
(2, 'Master of Technology in Computer Science', 'MTECH-CSE', 1, 2),
(3, 'Bachelor of Technology in Electrical Engineering', 'BTECH-EEE', 2, 4),
(4, 'Bachelor of Technology in Mechanical Engineering', 'BTECH-ME', 3, 4);

-- ====================================================================
-- 4. FACULTY SEED
-- ====================================================================
-- Note: HODs are also registered as faculty members
INSERT INTO faculty (id, user_id, faculty_id, department_id, designation, joining_date) VALUES
(1, 2, 'FAC-CSE-001', 1, 'Professor & HOD', '2015-06-15'),
(2, 3, 'FAC-EEE-001', 2, 'Professor & HOD', '2016-08-20'),
(3, 4, 'FAC-CSE-002', 1, 'Associate Professor', '2018-01-10'),
(4, 5, 'FAC-CSE-003', 1, 'Assistant Professor', '2020-07-01'),
(5, 6, 'FAC-EEE-002', 2, 'Assistant Professor', '2021-09-15'),
(6, 7, 'FAC-EEE-003', 2, 'Lecturer', '2022-01-15'),
(7, 8, 'FAC-ME-001', 3, 'Professor', '2014-05-10');

-- ====================================================================
-- 5. STUDENTS SEED
-- ====================================================================
-- 20 Students distributed across different courses and semesters
INSERT INTO students (id, user_id, student_id, department_id, course_id, semester, batch, date_of_birth, gender, phone, address, admission_date) VALUES
(1, 9, 'STU-CSE-2023-01', 1, 1, 5, '2023-2027', '2005-04-12', 'MALE', '9876543210', '123 Tech Park Road, Bangalore', '2023-08-01'),
(2, 10, 'STU-CSE-2023-02', 1, 1, 5, '2023-2027', '2005-08-20', 'MALE', '9876543211', '456 Silicon Valley, Hyderabad', '2023-08-01'),
(3, 11, 'STU-CSE-2023-03', 1, 1, 5, '2023-2027', '2005-11-05', 'FEMALE', '9876543212', '789 Coding St, Pune', '2023-08-01'),
(4, 12, 'STU-CSE-2024-01', 1, 1, 3, '2024-2028', '2006-02-14', 'MALE', '9876543213', '12 Bytes Lane, Chennai', '2024-08-01'),
(5, 13, 'STU-CSE-2024-02', 1, 1, 3, '2024-2028', '2006-06-25', 'MALE', '9876543214', '78 Loop Road, Delhi', '2024-08-01'),
(6, 14, 'STU-CSE-2024-03', 1, 1, 3, '2024-2028', '2006-10-30', 'FEMALE', '9876543215', '34 Array Ave, Mumbai', '2024-08-01'),
(7, 15, 'STU-CSE-2025-01', 1, 1, 1, '2025-2029', '2007-01-15', 'MALE', '9876543216', '101 Stack Path, Noida', '2025-08-01'),
(8, 16, 'STU-CSE-2025-02', 1, 1, 1, '2025-2029', '2007-05-18', 'FEMALE', '9876543217', '56 Heap Way, Kolkata', '2025-08-01'),

(9, 17, 'STU-MTC-2025-01', 1, 2, 1, '2025-2027', '2003-09-12', 'MALE', '9876543218', '74 Research Blvd, Bangalore', '2025-08-01'),
(10, 18, 'STU-MTC-2025-02', 1, 2, 1, '2025-2027', '2003-12-05', 'MALE', '9876543219', '85 Thesis Circle, Mysore', '2025-08-01'),

(11, 19, 'STU-EEE-2023-01', 2, 3, 5, '2023-2027', '2005-02-18', 'MALE', '9876543220', '45 Current Ave, Kochi', '2023-08-01'),
(12, 20, 'STU-EEE-2023-02', 2, 3, 5, '2023-2027', '2005-07-22', 'FEMALE', '9876543221', '89 Voltage Lane, Trivandrum', '2023-08-01'),
(13, 21, 'STU-EEE-2024-01', 2, 3, 3, '2024-2028', '2006-05-08', 'MALE', '9876543222', '12 Ohm St, Madurai', '2024-08-01'),
(14, 22, 'STU-EEE-2024-02', 2, 3, 3, '2024-2028', '2006-08-14', 'MALE', '9876543223', '23 Capacitor Rd, Coimbatore', '2024-08-01'),
(15, 23, 'STU-EEE-2025-01', 2, 3, 1, '2025-2029', '2007-03-24', 'FEMALE', '9876543224', '90 Resistor Dr, Bangalore', '2025-08-01'),
(16, 24, 'STU-EEE-2025-02', 2, 3, 1, '2025-2029', '2007-06-11', 'FEMALE', '9876543225', '12 Inductor Rd, Salem', '2025-08-01'),

(17, 25, 'STU-ME-2023-01', 3, 4, 5, '2023-2027', '2005-01-30', 'MALE', '9876543226', '5 Gear Way, Chennai', '2023-08-01'),
(18, 26, 'STU-ME-2023-02', 3, 4, 5, '2023-2027', '2005-09-02', 'MALE', '9876543227', '9 Piston Rd, Bangalore', '2023-08-01'),
(19, 27, 'STU-ME-2024-01', 3, 4, 3, '2024-2028', '2006-11-20', 'MALE', '9876543228', '74 Turbine Ave, Vellore', '2024-08-01'),
(20, 28, 'STU-ME-2025-01', 3, 4, 1, '2025-2029', '2007-09-09', 'FEMALE', '9876543229', '8 Thermodynamics Rd, Trichy', '2025-08-01');

-- ====================================================================
-- 6. SUBJECTS SEED
-- ====================================================================
-- Subjects mapped to Courses, Semesters
INSERT INTO subjects (id, name, code, department_id, course_id, semester, credits) VALUES
-- CSE 5th Semester (BTECH-CSE)
(1, 'Database Management Systems', 'CS-501', 1, 1, 5, 4),
(2, 'Computer Networks', 'CS-502', 1, 1, 5, 4),
(3, 'Formal Languages & Automata Theory', 'CS-503', 1, 1, 5, 3),

-- CSE 3rd Semester (BTECH-CSE)
(4, 'Data Structures & Algorithms', 'CS-301', 1, 1, 3, 4),
(5, 'Digital Electronics', 'CS-302', 1, 1, 3, 3),

-- CSE 1st Semester (BTECH-CSE)
(6, 'Programming in C', 'CS-101', 1, 1, 1, 4),
(7, 'Calculus & Linear Algebra', 'MA-101', 1, 1, 1, 4),

-- MTECH CSE 1st Semester
(8, 'Advanced Algorithms', 'MCS-101', 1, 2, 1, 4),
(9, 'Machine Learning foundations', 'MCS-102', 1, 2, 1, 4),

-- EEE 5th Semester (BTECH-EEE)
(10, 'Control Systems', 'EE-501', 2, 3, 5, 4),
(11, 'Power Systems I', 'EE-502', 2, 3, 5, 4),

-- EEE 3rd Semester (BTECH-EEE)
(12, 'Network Analysis', 'EE-301', 2, 3, 3, 4),
(13, 'Electrical Machines I', 'EE-302', 2, 3, 3, 4),

-- EEE 1st Semester (BTECH-EEE)
(14, 'Basic Electrical Engineering', 'EE-101', 2, 3, 1, 4),

-- ME 5th Semester (BTECH-ME)
(15, 'Design of Machine Elements', 'ME-501', 3, 4, 5, 4),
(16, 'Heat & Mass Transfer', 'ME-502', 3, 4, 5, 4);

-- ====================================================================
-- 7. ENROLLMENTS SEED
-- ====================================================================
-- CSE 5th Semester (Students 1-3 enrolled in subjects 1, 2, 3)
INSERT INTO enrollments (student_id, subject_id, academic_year, semester, status) VALUES
(1, 1, '2025-2026', 5, 'ENROLLED'), (1, 2, '2025-2026', 5, 'ENROLLED'), (1, 3, '2025-2026', 5, 'ENROLLED'),
(2, 1, '2025-2026', 5, 'ENROLLED'), (2, 2, '2025-2026', 5, 'ENROLLED'), (2, 3, '2025-2026', 5, 'ENROLLED'),
(3, 1, '2025-2026', 5, 'ENROLLED'), (3, 2, '2025-2026', 5, 'ENROLLED'), (3, 3, '2025-2026', 5, 'ENROLLED'),

-- CSE 3rd Semester (Students 4-6 enrolled in subjects 4, 5)
(4, 4, '2025-2026', 3, 'ENROLLED'), (4, 5, '2025-2026', 3, 'ENROLLED'),
(5, 4, '2025-2026', 3, 'ENROLLED'), (5, 5, '2025-2026', 3, 'ENROLLED'),
(6, 4, '2025-2026', 3, 'ENROLLED'), (6, 5, '2025-2026', 3, 'ENROLLED'),

-- CSE 1st Semester (Students 7-8 enrolled in subjects 6, 7)
(7, 6, '2025-2026', 1, 'ENROLLED'), (7, 7, '2025-2026', 1, 'ENROLLED'),
(8, 6, '2025-2026', 1, 'ENROLLED'), (8, 7, '2025-2026', 1, 'ENROLLED'),

-- EEE 5th Semester (Students 11-12 enrolled in subjects 10, 11)
(11, 10, '2025-2026', 5, 'ENROLLED'), (11, 11, '2025-2026', 5, 'ENROLLED'),
(12, 10, '2025-2026', 5, 'ENROLLED'), (12, 11, '2025-2026', 5, 'ENROLLED'),

-- ME 5th Semester (Students 17-18 enrolled in subjects 15, 16)
(17, 15, '2025-2026', 5, 'ENROLLED'), (17, 16, '2025-2026', 5, 'ENROLLED'),
(18, 15, '2025-2026', 5, 'ENROLLED'), (18, 16, '2025-2026', 5, 'ENROLLED');

-- ====================================================================
-- 8. FACULTY SUBJECTS SEED
-- ====================================================================
INSERT INTO faculty_subjects (faculty_id, subject_id, academic_year, semester) VALUES
-- CSE mapping
(1, 1, '2025-2026', 5), -- Dr. Rajesh Kumar (HOD) teaches DBMS
(3, 2, '2025-2026', 5), -- Dr. Priya Patel teaches Computer Networks
(4, 3, '2025-2026', 5), -- Prof. Vikram Singh teaches Automata
(3, 4, '2025-2026', 3), -- Dr. Priya Patel teaches DSA
(4, 5, '2025-2026', 3), -- Prof. Vikram Singh teaches Digital Electronics
(4, 6, '2025-2026', 1), -- Prof. Vikram Singh teaches C Prog

-- EEE mapping
(2, 10, '2025-2026', 5), -- Dr. Amit Sharma (HOD) teaches Control Systems
(5, 11, '2025-2026', 5), -- Dr. Sunita Rao teaches Power Systems
(6, 12, '2025-2026', 3), -- Prof. K. Viswanathan teaches Network Analysis

-- ME mapping
(7, 15, '2025-2026', 5); -- Dr. Anil Mehta teaches Machine Design

-- ====================================================================
-- 9. ROOMS SEED
-- ====================================================================
INSERT INTO rooms (id, room_number, building, capacity, room_type) VALUES
(1, 'CR-101', 'Science Block A', 60, 'CLASSROOM'),
(2, 'CR-102', 'Science Block A', 60, 'CLASSROOM'),
(3, 'LH-201', 'Administrative Block', 120, 'SEMINAR_HALL'),
(4, 'CS-LAB-01', 'IT Center', 40, 'LAB'),
(5, 'EE-LAB-01', 'Engineering Annex', 40, 'LAB'),
(6, 'ME-SHED-01', 'Workshop Annex', 50, 'LAB');

-- ====================================================================
-- 10. TIMETABLE SEED
-- ====================================================================
INSERT INTO timetable (course_id, semester, subject_id, faculty_id, room_id, day_of_week, start_time, end_time) VALUES
-- CSE 5th Semester (BTECH-CSE)
-- Monday: DBMS 09:00 - 10:00 (Room 1, Faculty 1)
(1, 5, 1, 1, 1, 'MONDAY', '09:00:00', '10:00:00'),
-- Monday: Networks 10:00 - 11:00 (Room 1, Faculty 3)
(1, 5, 2, 3, 1, 'MONDAY', '10:00:00', '11:00:00'),
-- Monday: Automata 11:15 - 12:15 (Room 1, Faculty 4)
(1, 5, 3, 4, 1, 'MONDAY', '11:15:00', '12:15:00'),
-- Wednesday: DBMS Lab (IT Center Lab 1) 14:00 - 16:00
(1, 5, 1, 1, 4, 'WEDNESDAY', '14:00:00', '16:00:00'),

-- EEE 5th Semester (BTECH-EEE)
-- Monday: Control Systems 09:00 - 10:00 (Room 2, Faculty 2)
(3, 5, 10, 2, 2, 'MONDAY', '09:00:00', '10:00:00'),
-- Wednesday: Power Systems 10:00 - 11:00 (Room 2, Faculty 5)
(3, 5, 11, 5, 2, 'WEDNESDAY', '10:00:00', '11:00:00');

-- ====================================================================
-- 11. ATTENDANCE SEED
-- ====================================================================
-- CSE DBMS attendance for 2026-08-01
INSERT INTO attendance (student_id, subject_id, faculty_id, date, status) VALUES
(1, 1, 1, '2026-08-01', 'PRESENT'),
(2, 1, 1, '2026-08-01', 'PRESENT'),
(3, 1, 1, '2026-08-01', 'ABSENT'), -- Student 3 absent

-- CSE DBMS attendance for 2026-08-02
(1, 1, 1, '2026-08-02', 'PRESENT'),
(2, 1, 1, '2026-08-02', 'PRESENT'),
(3, 1, 1, '2026-08-02', 'PRESENT'),

-- CSE Computer Networks attendance for 2026-08-01
(1, 2, 3, '2026-08-01', 'PRESENT'),
(2, 2, 3, '2026-08-01', 'ABSENT'),
(3, 2, 3, '2026-08-01', 'PRESENT');

-- ====================================================================
-- 12. ASSIGNMENTS SEED
-- ====================================================================
INSERT INTO assignments (id, subject_id, faculty_id, title, description, deadline, attachment_url) VALUES
(1, 1, 1, 'Normalization & Normal Forms', 'Explain 1NF, 2NF, 3NF, and BCNF with practical database tables and design schemas.', '2026-08-15 23:59:59', '/uploads/assignments/dbms_assign_1.pdf'),
(2, 2, 3, 'Subnetting & IP Addressing Routing', 'Calculate subnet masks, CIDR routes, and gateway addresses for the attached topology map.', '2026-08-20 23:59:59', '/uploads/assignments/networks_assign_1.pdf'),
(3, 10, 2, 'Transfer Functions & Laplace representation', 'Solve the frequency response parameters for the open loop system representation.', '2026-08-18 17:00:00', NULL);

-- ====================================================================
-- 13. SUBMISSIONS SEED
-- ====================================================================
INSERT INTO submissions (assignment_id, student_id, submission_url, submitted_at, marks, feedback, status) VALUES
-- DBMS submissions
(1, 1, '/uploads/submissions/stu1_assign1.pdf', '2026-08-10 14:30:20', 9.50, 'Excellent documentation of BCNF anomalies.', 'GRADED'),
(1, 2, '/uploads/submissions/stu2_assign1.pdf', '2026-08-11 09:12:00', 8.00, 'Good designs, but missed transitive dependency descriptions.', 'GRADED'),
(1, 3, '/uploads/submissions/stu3_assign1.pdf', '2026-08-14 22:45:10', NULL, NULL, 'SUBMITTED'), -- Graded status null

-- Networks submission
(2, 1, '/uploads/submissions/stu1_assign2.pdf', '2026-08-12 18:20:00', NULL, NULL, 'SUBMITTED');

-- ====================================================================
-- 14. STUDY MATERIALS SEED
-- ====================================================================
INSERT INTO study_materials (subject_id, faculty_id, title, description, file_url) VALUES
(1, 1, 'Introduction to SQL & Relational Algebra', 'Lecture notes covering basic SELECT queries, joins, groupings, and division operators.', '/uploads/materials/sql_basics.pdf'),
(1, 1, 'Transaction Management & Concurrency Control', 'Covers ACID properties, schedule serializability, 2PL, and deadlocks.', '/uploads/materials/transactions.pptx'),
(2, 3, 'OSI Reference Model & Physical Layer', 'Covers functions of each OSI layer, fiber channels, and hardware encodings.', '/uploads/materials/osi_model.pdf');

-- ====================================================================
-- 15. EXAMS SEED
-- ====================================================================
INSERT INTO exams (id, name, exam_type, academic_year, semester, start_date, end_date) VALUES
(1, 'Odd Semester Midterm Exams', 'MIDTERM', '2025-2026', 5, '2026-09-10', '2026-09-15'),
(2, 'Odd Semester Final Theory Exams', 'FINAL', '2025-2026', 5, '2026-11-20', '2026-11-30');

-- ====================================================================
-- 16. EXAM SCHEDULE SEED
-- ====================================================================
INSERT INTO exam_schedule (exam_id, subject_id, exam_date, start_time, end_time, room_id) VALUES
-- Midterm schedules (Exam ID: 1)
(1, 1, '2026-09-10', '10:00:00', '12:00:00', 1), -- DBMS in CR-101
(1, 2, '2026-09-11', '10:00:00', '12:00:00', 2), -- Networks in CR-102
(1, 10, '2026-09-10', '14:00:00', '16:00:00', 3); -- Control Systems in LH-201

-- ====================================================================
-- 17. MARKS SEED
-- ====================================================================
INSERT INTO marks (student_id, subject_id, exam_id, internal_marks, midterm_marks, practical_marks, final_marks, total_marks, grade, grade_point) VALUES
-- Midterm marks (Exam ID: 1) for DBMS (Subject 1)
(1, 1, 1, 18.50, 42.00, 19.00, 0.00, 79.50, 'B+', 8.0),
(2, 1, 1, 17.00, 38.00, 18.00, 0.00, 73.00, 'B', 7.0),
(3, 1, 1, 19.00, 45.00, 19.50, 0.00, 83.50, 'A', 9.0);

-- ====================================================================
-- 18. FEES SEED
-- ====================================================================
INSERT INTO fees (student_id, academic_year, semester, total_amount, paid_amount, due_amount, due_date, status) VALUES
(1, '2025-2026', 5, 25000.00, 25000.00, 0.00, '2025-08-31', 'PAID'),
(2, '2025-2026', 5, 25000.00, 15000.00, 10000.00, '2025-08-31', 'PARTIAL'),
(3, '2025-2026', 5, 25000.00, 0.00, 25000.00, '2025-08-31', 'UNPAID'),
(4, '2025-2026', 3, 22000.00, 22000.00, 0.00, '2025-08-31', 'PAID');

-- ====================================================================
-- 19. NOTICES SEED
-- ====================================================================
INSERT INTO notices (title, description, created_by, target_role, target_department, publish_date, expiry_date) VALUES
('Academic Fee Submission Extension', 'The deadline for odd semester tuition fee submission has been extended to August 31, 2026 without late fee charges.', 1, 'ALL', NULL, '2026-08-01', '2026-08-31'),
('CSE Workshop on Cyber Security', 'A seminar on Web Application Vulnerabilities & Threat models will be conducted on August 10, 2026 in LH-201.', 2, 'STUDENT', 1, '2026-08-03', '2026-08-11'),
('Faculty Meeting: Syllabus Review', 'All faculty members of the CSE department must attend the review session at 15:00 in HOD Cabin.', 2, 'FACULTY', 1, '2026-08-04', '2026-08-06');

-- ====================================================================
-- 20. NOTIFICATIONS SEED
-- ====================================================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(9, 'New Assignment Created', 'Dr. Rajesh Kumar published Assignment 1: Normalization & Normal Forms for DBMS.', 'ASSIGNMENT', false),
(9, 'Grade Updated', 'Your score for DBMS midterm has been published.', 'GRADE', true),
(10, 'Fee Warning Due', 'You have a pending outstanding balance of $10,000. Please clear it by August 31.', 'FEE', false);

-- ====================================================================
-- 21. COMPLAINTS SEED
-- ====================================================================
INSERT INTO complaints (student_id, subject, description, status, response) VALUES
(1, 'Hostel Wi-Fi Connectivity', 'The internet speed in Block B hostel is very slow (less than 1 Mbps) and drops frequently.', 'OPEN', NULL),
(2, 'Lab-01 Machine Upgrades', 'Several systems in CS-LAB-01 have corrupted database installations which fail SQL commands.', 'IN_PROGRESS', 'System technician has been assigned to reinstall standard packages.'),
(3, 'DBMS Midterm Mark Recount', 'I received a copy showing 45 marks but the dashboard totals show 35. Please verify.', 'RESOLVED', 'The internal record error has been corrected. Total marks updated in the database.');

-- ====================================================================
-- 22. AUDIT LOGS SEED
-- ====================================================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES
(1, 'CREATE_USER', 'users', 9, 'Admin registered new student Aarav Mehta (STU-CSE-2023-01)'),
(1, 'CREATE_COURSE', 'courses', 1, 'Admin added course Bachelor of Technology in Computer Science'),
(2, 'PUBLISH_NOTICE', 'notices', 2, 'HOD CSE published notice regarding Cyber Security Seminar'),
(4, 'SUBMIT_GRADES', 'marks', 1, 'Dr. Priya Patel uploaded midterm marks for DBMS (Subject CS-501)');
