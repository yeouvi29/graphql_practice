import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { companyByIdQuery } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });

  // console.log("[CompanyPage] state:", data);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  return (
    <div>
      <h1 className="title">{data.company.name}</h1>
      <div className="box">{data.company.description}</div>
      <h2 className="title is-5">Jobs at {data.company.name}</h2>
      <JobList jobs={data.company.jobs} />
    </div>
  );
}

export default CompanyPage;
