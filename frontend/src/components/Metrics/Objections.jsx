import { useEffect, useState } from "react";

function Objections() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const data = ["Too Expensive", "Not Interested", "Wrong Area"];
    setIssues(data);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="font-semibold text-base-content">Primary Objections</h2>
      <div className="flex flex-wrap gap-2">
        {issues.map((item, index) => (
          <span key={index} className="badge badge-error badge-outline">{item}</span>
        ))}
      </div>
    </div>
  );
}

export default Objections;
