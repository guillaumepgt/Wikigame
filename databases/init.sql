DROP TABLE IF EXISTS game_state;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS parties;

CREATE TABLE IF NOT EXISTS parties (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('waiting', 'started', 'finished') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    party_id CHAR(36),
    score INT DEFAULT 0,
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_state (
    id CHAR(36) PRIMARY KEY,
    party_id CHAR(36),
    first_page VARCHAR(255),
    last_page VARCHAR(255),
    scores JSON,
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE
);
