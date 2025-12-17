
CREATE TYPE media_type_enum AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');

CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(255) PRIMARY KEY,
    news_id VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type media_type_enum NOT NULL,
    "order" INTEGER NOT NULL,
    alt_text VARCHAR(500) NOT NULL,
    caption TEXT,
    size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_news_id ON media(news_id);
CREATE INDEX idx_media_order ON media("order");
CREATE INDEX idx_media_type ON media(type);
