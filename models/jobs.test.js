"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testJobs } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  let newJob = {
    companyHandle: "c1",
    title: "Test",
    salary: 100,
    equity: "0.1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: testJobs[0],
        title: "J1",
        salary: 5,
        equity: "0.5",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobs[1],
        title: "J2",
        salary: 6,
        equity: "0.6",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobs[2],
        title: "J3",
        salary: 7,
        equity: "0.7",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: search filter = min salary", async function () {
    let jobs = await Job.findAll({ minSalary: 7 });
    expect(jobs).toEqual([
      {
        id: testJobs[2],
        title: "J3",
        salary: 7,
        equity: "0.7",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: search filter = equity", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: testJobs[0],
        title: "J1",
        salary: 5,
        equity: "0.5",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobs[1],
        title: "J2",
        salary: 6,
        equity: "0.6",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobs[2],
        title: "J3",
        salary: 7,
        equity: "0.7",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });

  test("works: search filter = min salary & equity", async function () {
    let jobs = await Job.findAll({ minSalary: 6, hasEquity: true });
    expect(jobs).toEqual([
      {
        id: testJobs[1],
        title: "J2",
        salary: 6,
        equity: "0.6",
        companyHandle: "c1",
        companyName: "C1",
      },
      {
        id: testJobs[2],
        title: "J3",
        salary: 7,
        equity: "0.7",
        companyHandle: "c1",
        companyName: "C1",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(testJobs[0]);
    expect(job).toEqual({
      id: testJobs[0],
      title: "J1",
      salary: 5,
      equity: "0.5",
      company: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  let updateData = {
    title: "newTitle",
    salary: 100,
    equity: "0.9",
  };
  test("works", async function () {
    let job = await Job.update(testJobs[0], updateData);
    expect(job).toEqual({
      id: testJobs[0],
      companyHandle: "c1",
      title: "newTitle",
      salary: 100,
      equity: "0.9",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(testJobs[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(testJobs[0]);
    const res = await db.query("SELECT id FROM jobs WHERE id=$1", [testJobs[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
