import { useEffect, useState } from "react";

function Objections() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const data = [
      "Too Expensive",
      "Not Interested",
      "Wrong Area",
      "Call Back Later",
      "Wrong Number",
    ];
    setIssues(data);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      {issues.map((item, index) => (
        <span key={index} className="badge badge-soft badge-error">
          {item}
        </span>
      ))}
    </div>
  );
}

export default Objections;
