const db = require("./db");

const Query = {
  company: (root, { id }) => db.companies.get(id),
  job: (root, { id }) => db.jobs.get(id), // {id} = args.id
  jobs: () => db.jobs.list(),
};

const Mutation = {
  // { user } = context.user
  createJob: (root, { input }, { user }) => {
    // check if user auth
    if (!user) {
      throw new Error("Unauthorized");
    }
    // job companyId is the same as the user (better with a select from the client)
    const id = db.jobs.create({ ...input, companyId: user.companyId });
    return db.jobs.get(id);
  },
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

const Job = {
  company: (job) => db.companies.get(job.companyId),
};

module.exports = { Query, Mutation, Job, Company };
