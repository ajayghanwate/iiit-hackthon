-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Teachers table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Embeddings table (Using pgvector)
CREATE TABLE IF NOT EXISTS student_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    embedding vector(4096), -- Adjust dimension if using a different model than VGG-Face
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id),
    subject TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id),
    status TEXT DEFAULT 'present',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Logs
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES attendance_sessions(id),
    teacher_id UUID REFERENCES teachers(id),
    status TEXT,
    present_count INT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stored Procedure for Vector Matching
CREATE OR REPLACE FUNCTION match_students (
  query_embedding vector(4096),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  student_id UUID,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.student_id,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM student_embeddings se
  WHERE 1 - (se.embedding <=> query_embedding) > match_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
