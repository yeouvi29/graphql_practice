import { getJobs, getJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    job: (_, { id }) => getJob(id),
    jobs: getJobs,
  },

  Job: {
    date: ({ createdAt }) => toISODate(createdAt),
    company: ({ companyId }) => getCompany(companyId),
  },
};

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
