import { useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "../lib/graphql/hooks";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [page, setPage] = useState(1);
  const { jobs, loading, error } = useJobs(
    JOBS_PER_PAGE,
    (page - 1) * JOBS_PER_PAGE
  );
  const totalPages = Math.ceil((jobs?.totalCount || 0) / JOBS_PER_PAGE);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="has-text-danger">Data unavailable</div>
      ) : (
        <JobList jobs={jobs.items} />
      )}
    </div>
  );
}

export default HomePage;
