import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
  createHttpLink,
  gql,
} from "@apollo/client";
// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const customLink = new ApolloLink((operation, forward) => {
  // console.log("[authLink] operation: ", operation);
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

// export async function createJob({ title, description }) {
//   const { data } = await apolloClient.mutate({
//     mutation: createJobMutation,
//     variables: {
//       input: { title, description },
//     },
//     update: (cache, { data }) => {
//       // console.log("[createJob] result:", result);
//       cache.writeQuery({
//         query: jobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });

//   return data.job;
// }

export async function updateJob({ id, title, description }) {
  const mutation = gql`
    mutation CreateJob($input: UpdateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { id, title, description } },
  });

  return data.job;
}

export async function deleteJob(id) {
  const mutation = gql`
    mutation DeleteJob($id: ID!) {
      job: deleteJob(id: $id) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({ mutation, variables: id });
  return data.job;
}

// export async function getCompany(id) {

//   const { data } = await apolloClient.query({ query: companyByIdQuery, variables: { id } });
//   return data.company;
// }

// export async function getJob(id) {
//   const {
//     data: { job },
//   } = await apolloClient.query({ query: jobByIdQuery, variables: { id } });
//   return job;
// }

// export async function getJobs() {
//   const {
//     data: { jobs },
//   } = await apolloClient.query({
//     query: jobsQuery,
//     fetchPolicy: "cache-first",
//   });
//   return jobs;
// }
