CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    movie_title TEXT,
    movie_year INT,
    movie_genre TEXT,
    movie_director TEXT
)

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT
)

CREATE TABLE rentals (
    customer_id INT REFERENCES customers(customer_id),
    movie_id INT REFERENCES movies(movie_id),
    rental_date DATE,
    return_date DATE,
    PRIMARY KEY (customer_id, movie_id)
)

INSERT INTO movies (movie_title, movie_year, movie_genre, movie_director) VALUES
('The Shawshank Redemption', 1994, 'Drama', 'Frank Darabont'),
('The Godfather', 1972, 'Crime', 'Francis Ford Coppola'),
('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino'),
('The Lord of the Rings: The Fellowship of the Ring', 2001, 'Action', 'Peter Jackson')

INSERT INTO customers (first_name, last_name, email, phone) VALUES
('Greg', 'Smith', 'greg.smith@example.com', '555-555-5555'),
('Thomas', 'Broma', 'thomas.broma@example.com', '666-666-6666'),
('Robert', 'Robertson', 'robert.robertson@example.com', '111-111-1111'),
('Brian', 'Arnold', 'brian.arnold@example.com', '888-888-8888'),
('Henry', 'Young', 'charlie.smith@example.com', '999-999-9999')

INSERT INTO rentals (customer_id, movie_id, rental_date, return_date) VALUES
(1, 1, '2023-01-01', '2023-01-10'),
(1, 2, '2023-01-02', NULL),
(2, 1, '2023-01-01', '2023-01-10'),
(2, 3, '2023-01-02', '2023-01-11'),
(2, 2, '2023-01-02', NULL),
(3, 3, '2023-01-03', '2023-01-12'),
(4, 4, '2023-01-04', NULL),
(5, 4, '2023-01-04', '2023-01-13'),
(5, 3, '2023-01-05', NULL),
(5, 5, '2023-01-05', '2023-01-14')

SELECT movies.movie_title FROM movies
JOIN rentals ON movies.movie_id = rentals.movie_id
JOIN customers ON customers.customer_id = rentals.customer_id
WHERE customers.email = 'thomas.broma@example.com' 

SELECT customers.first_name || ' ' || last_name AS full_name FROM customers
JOIN rentals ON customers.customer_id = rentals.customer_id
JOIN movies ON movies.movie_id = rentals.movie_id
WHERE movies.movie_title = 'The Dark Knight'

SELECT customers.first_name || ' ' || last_name AS full_name, rentals.rental_date, rentals.return_date FROM customers
JOIN rentals ON customers.customer_id = rentals.customer_id
JOIN movies ON movies.movie_id = rentals.movie_id
WHERE movies.movie_title = 'The Godfather'

SELECT customers.first_name || ' ' || last_name AS full_name, rental_date, movie_title FROM customers
JOIN rentals ON customers.customer_id = rentals.customer_id
JOIN movies ON movies.movie_id = rentals.movie_id
WHERE movies.movie_director = 'Francis Ford Coppola'

SELECT movies.movie_title FROM movies
JOIN rentals ON movies.movie_id = rentals.movie_id
WHERE rentals.return_date IS NULL