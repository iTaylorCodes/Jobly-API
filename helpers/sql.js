const { BadRequestError } = require("../expressError");

/** Helper function for update sql queries
 *
 * This creates the SET clause of a SQL update query.
 * The query is for updates that only change provided values.
 *
 * Accepts --> dataToUpdate being the req.body object with values to be updated
 *             jsToSql being an object where keys are js camelCase fields, and values the equivalent SQL column names
 *
 * Returns SQL object --> { setCols, values }
 *
 * Example --> {firstName: 'Aliya', age: 32} =>
 * { setCols: '"first_name"=$1', '"age"=$2',
 *   values: ['Aliya', 32] }
 *
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
