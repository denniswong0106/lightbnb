const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT name, email, password, id
  FROM users
  WHERE email = $1
  ;`, [email])
  .then(res => {
    console.log('user object', res.rows[0]); 
    return Promise.resolve(res.rows[0]);
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT name, email, password, id
  FROM users
  WHERE id = $1
  ;`, [id])
  .then(res => {
    return Promise.resolve(res.rows[0]);
  })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3);
  `, [user.name, user.email, user.password])
  .then(res => {
    return Promise.resolve(user);
  })

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 
  AND end_date < now()::date
  
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2; 
  ;`, [guest_id, limit])
  .then(res => {
    return res.rows;
  })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function(options, limit = 10) {
  // This will be where we hold our search parameters
  const queryParams = [];

  // The basic string - this doesn't change
  // LEFT JOIN -- For owner-id only;

  const isOwnerId = ownerId => {
    if (ownerId) {
      return `LEFT`;
    } else {
      return ``;
    }
  };

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  ${isOwnerId(options.owner_id)}
  JOIN property_reviews ON properties.id = property_id
  `;

    const appendMultiQuery = (query, operator) => {
    if (queryParams.length > 1) {
      queryString += `AND ${query} ${operator} $${queryParams.length} `;
    } else {
      queryString += `WHERE ${query} ${operator} $${queryParams.length} `;
    }
  };

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    appendMultiQuery('owner_id', '=');
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    appendMultiQuery('cost_per_night', '>=');
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    appendMultiQuery('cost_per_night', '<=');
  }

  queryString += `GROUP BY properties.id `

  // We put HAVING after GROUP BY:
  if (options.minimum_rating) {
    queryParams.push(parseFloat(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // THis is where we add the given limit
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // Prints the final string and array of input params (ie $1, $2...)

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;






/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  const numOfQueriesString = array => {
    let string = '';
    for (const query in array) {
      let placeholderNum = parseInt(query) + 1;
      string += `$${placeholderNum}`;
      if (!(placeholderNum === array.length)) {
        string += ', '
      }
    };
    return string;
  } 

  queryString = `
  INSERT INTO properties 
  (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  ) 
  VALUES 
  (
    ${numOfQueriesString(queryParams)}
  ) RETURNING * `

  return pool.query(queryString, queryParams)
  .then(res => {
    return res.rows[0];
  })

}
exports.addProperty = addProperty;
