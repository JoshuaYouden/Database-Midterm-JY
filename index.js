const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  user: "postgres", //This _should_ be your username, as it's the default one Postgres uses
  host: "localhost",
  database: "postgres", //This should be changed to reflect your actual database
  password: "Boogedy43!", //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  // TODO: Add code to create Movies, Customers, and Rentals tables
  await pool.query(
    `CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY,
    movie_title TEXT,
    movie_year INT,
    movie_genre TEXT,
    movie_director TEXT
)
`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT
)
`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS rentals (
    customer_id INT REFERENCES customers(customer_id),
    movie_id INT REFERENCES movies(movie_id),
    rental_date DATE,
    return_date DATE,
    PRIMARY KEY (customer_id, movie_id)
)
`
  );
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  // TODO: Add code to insert a new movie into the Movies table
  await pool.query(
    `INSERT INTO movies (movie_title, movie_year, movie_genre, movie_director) VALUES ($1, $2, $3, $4)`,
    [title, year, genre, director]
  );
  console.log(
    `Movie "${title}" by ${director} in ${year} as ${genre} genre added successfully`
  );
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  // TODO: Add code to retrieve and print all movies from the Movies table
  const response = await pool.query(`SELECT * FROM movies`);

  response.rows.forEach((movie) => {
    console.log(
      `Movie ID: ${movie.movie_id}, Title: ${movie.movie_title}, Year: ${movie.movie_year}, Genre: ${movie.movie_genre}, Director: ${movie.movie_director}`
    );
  });
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  // TODO: Add code to update a customer's email address
  await pool.query(`UPDATE customers SET email = $1 WHERE customer_id = $2`, [
    newEmail,
    customerId,
  ]);

  console.log(`Customer ${customerId}'s email updated to ${newEmail}`);
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  // TODO: Add code to remove a customer and their rental history
  await pool.query(`DELETE FROM rentals WHERE customer_id = $1`, [customerId]);

  await pool.query(`DELETE FROM customers WHERE customer_id = $1`, [
    customerId,
  ]);
  console.log(
    `Customer ${customerId} and their rental history was removed successfully`
  );
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log("  show - Show all movies");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "show":
      await displayMovies();
      break;
    case "update":
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case "remove":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI();
