-- Exam Paper Management System - PostgreSQL schema

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  roll_no       VARCHAR(50)  NOT NULL,
  course        VARCHAR(100) NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_papers (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  subject       VARCHAR(100) NOT NULL,
  semester      VARCHAR(100) NOT NULL,
  description   TEXT,
  file_name     VARCHAR(255) NOT NULL,   -- original file name
  file_path     VARCHAR(255) NOT NULL,   -- saved name inside backend/uploads
  file_size     BIGINT       NOT NULL DEFAULT 0,
  mime_type     VARCHAR(100),
  uploaded_by   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  uploaded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS downloads (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER NOT NULL REFERENCES students(id)    ON DELETE CASCADE,
  paper_id      INTEGER NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_papers_subject    ON exam_papers(subject);
CREATE INDEX IF NOT EXISTS idx_downloads_student ON downloads(student_id);
CREATE INDEX IF NOT EXISTS idx_downloads_paper   ON downloads(paper_id);

-- ============================================================
-- v2: Departments + Folders (department-wise access)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,   -- student.course isi naam se match hota hai
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS folders (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (department_id, name)
);

ALTER TABLE exam_papers ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id) ON DELETE RESTRICT;
ALTER TABLE exam_papers ADD COLUMN IF NOT EXISTS folder_id     INTEGER REFERENCES folders(id)     ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_papers_department ON exam_papers(department_id);
CREATE INDEX IF NOT EXISTS idx_papers_folder     ON exam_papers(folder_id);
