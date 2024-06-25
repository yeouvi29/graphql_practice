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
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unAuthorizedError("Missing authentication");
      }
      // console.log("[createJob] context:", context);
      const { companyId } = user;
      return createJob({ companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unAuthorizedError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No job found with ID " + id);
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw unAuthorizedError("Missing authentication");
      }

      const job = await updateJob({ id, title, description, companyId });

      if (!job) {
        throw notFoundError("No job found with ID " + id);
      }
    },
  },
  Company: {
    jobs: ({ id }) => getJobsByCompany(id),
  },
  Job: {
    date: ({ createdAt }) => toISODate(createdAt),
    company: (job, _args, { companyLoader }) => {
      return companyLoader.load(job.companyId);
    },
  },
};

function notFoundError(message) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function unAuthorizedError(message) {
  return new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
}

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
