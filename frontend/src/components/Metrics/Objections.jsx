import { useEffect, useState } from 'react';

function Objections({ objection }) {
  const [issue, setIssues] = useState();

  if (!objection || objection.length === 0) {
    return (
      <div className="card bg-base-100 p-5">
        <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
          Top Objections
        </h2>
        <p className="text-base-content/60 text-sm" style={{ padding: '5px' }}>
          No objections logged yet.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const data = objection;
    setIssues(data);
  }, []);

  return (
    <div className="card bg-base-100   p-5">
      <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
        Top Objections
      </h2>

      {objection.map((item) => (
        <div
          key={item.objection_type}
          className="badge badge-md badge-soft badge-error"
          style={{ marginBottom: '10px' }}
        >
          {item.objection_type}
          {/* <p>No Objections</p> */}
        </div>
      ))}
    </div>
  );
}

export default Objections;
