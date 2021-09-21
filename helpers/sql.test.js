const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
  test("Works properly", () => {
    const result = sqlForPartialUpdate({ key: "value1" }, { colName: "col_name" });

    expect(result).toEqual({ setCols: '"key"=$1', values: ["value1"] });
  });
});
