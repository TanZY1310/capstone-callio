import { useEffect, useState } from "react";

function Objections() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const data = ["Too Expensive", "Not Interested", "Wrong Area"];
    setIssues(data);
  }, []);

  return (
    <div>
      <h2 style={{ padding: "10px" }}>Primary Objections</h2>

      {issues.map((item) => (
        <div className="badge badge-outline badge-error">{item}</div>
      ))}
    </div>
  );
}

export default Objections;
