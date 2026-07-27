import { useEffect, useState } from 'react';

function Objections({ objection }) {
  // const [issue, setIssues] = useState();

  if (!objection || objection.length === 0) {
    return (
      <div className="card bg-base-100 p-5">
        <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
          Objections
        </h2>

        <p className="text-sm text-base-content/50">
          No objections logged yet.
        </p>
      </div>
    );
  }

  // useEffect(() => {
  //   const data = objection;
  //   setIssues(data);
  // }, []);

  const maxCount = objection[0]?.count || 1;

  return (
    <div className="card bg-base-100   p-5">
      <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
        Objections
      </h2>

      {objection.map((item) => (
        <div
          key={item.objection_type}
          className="alert alert-error alert-soft"
          style={{ marginBottom: '10px' }}
        >
          <span> {item.objection_type}</span>
          {/* <p>No Objections</p> */}
        </div>
      ))}
    </div>
  );
}

export default Objections;
