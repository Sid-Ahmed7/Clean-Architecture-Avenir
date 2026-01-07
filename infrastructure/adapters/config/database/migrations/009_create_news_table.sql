CREATE TYPE news_category_enum AS ENUM ('OFFER', 'SECURITY', 'SAVINGS', 'INVESTMENT', 'CREDIT');
CREATE TYPE news_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category news_category_enum NOT NULL,
    priority news_priority_enum DEFAULT 'LOW' NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT title_length CHECK (char_length(title) >= 3)
);


CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_priority ON news(priority);
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_news_tags ON news USING GIN(tags);
