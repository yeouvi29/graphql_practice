import { useState, useEffect } from "react";

import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      const jobs = await getJobs();
      setJobs(jobs);
    })();
  }, []);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      {jobs.length === 0 && <p>Loading...</p>}
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
