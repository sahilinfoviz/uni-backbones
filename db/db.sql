CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone VARCHAR(12) NOT NULL UNIQUE,
    isBlocked BOOLEAN DEFAULT false,
    iSDeleted BOOLEAN DEFAULT false,
    password TEXT,
    createdat timestamp without time zone default (now() at time zone 'utc'),
    LastUpdatedAt TIMESTAMPTZ
);

CREATE TABLE roles (
    id uuid PRIMARY KEY REFERENCES users(id),
    isTeacher BOOLEAN DEFAULT false,
    isStudent BOOLEAN DEFAULT false
);