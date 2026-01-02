
CREATE TABLE IF NOT EXISTS contents (
    id VARCHAR(255) PRIMARY KEY,
    news_id VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    content TEXT NOT NULL,

    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    CONSTRAINT unique_news_order UNIQUE (news_id, "order")
);

CREATE INDEX idx_contents_news_id ON contents(news_id);
CREATE INDEX idx_contents_order ON contents("order");

