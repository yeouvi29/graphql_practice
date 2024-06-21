import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [{ company, isLoading, isError }, setState] = useState({
    company: null,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    if (!companyId) {
      return;
    }
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, isLoading: false, isError: false });
      } catch (error) {
        console.error("Error loading company", error);
        setState({ company: null, isLoading: false, isError: true });
      }
    })();
  }, [companyId]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
