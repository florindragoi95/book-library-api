-- Insert categories
INSERT INTO category ("name", "parentCategoryId") VALUES ('Fiction', NULL);
INSERT INTO category ("name", "parentCategoryId") VALUES ('Science Fiction', 1);
INSERT INTO category ("name", "parentCategoryId") VALUES ('Fantasy', 1);
INSERT INTO category ("name", "parentCategoryId") VALUES ('Non-fiction', NULL);
INSERT INTO category ("name", "parentCategoryId") VALUES ('Biography', 4);
INSERT INTO category ("name", "parentCategoryId") VALUES ('Self-help', 4);

-- Insert books
    INSERT INTO book (name, author, "categoryId", description)
VALUES
    ('The Great Gatsby', 'F. Scott Fitzgerald', 1, 'A classic novel of the Jazz Age'),
    ('Dune', 'Frank Herbert', 2, 'A science fiction epic set on the desert planet of Arrakis'),
    ('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 3, 'The first book in the Harry Potter series'),
    ('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 4, 'A non-fiction book exploring the history of humankind'),
    ('Becoming', 'Michelle Obama', 5, 'A memoir by the former First Lady of the United States'),
    ('Atomic Habits', 'James Clear', 6, 'A self-help book about building good habits and breaking bad ones');
