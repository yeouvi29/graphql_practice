import JobList from "../components/JobList";
import { useJobs } from "../lib/graphql/hooks";

function HomePage() {
  const { jobs, loading, error } = useJobs();

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="has-text-danger">Data unavailable</div>
      ) : (
        <JobList jobs={jobs} />
      )}
    </div>
  );
}

export default HomePage;
