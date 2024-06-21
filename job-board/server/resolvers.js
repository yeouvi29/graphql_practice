import { GraphQLError } from "graphql";
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    company: async (_, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError(`Company not found: ${id}`);
      }
      return company;
    },
    job: async (_, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`Job not found: ${id}`);
      }
      return job;
    },
    jobs: getJobs,
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // TODO: will change later
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { id }) => deleteJob(id),
    updateJob: (_root, { input: { id, title, description } }) =>
      updateJob({ id, title, description }),
  },
  Company: {
    jobs: ({ id }) => getJobsByCompany(id),
  },
  Job: {
    date: ({ createdAt }) => toISODate(createdAt),
    company: ({ companyId }) => getCompany(companyId),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
