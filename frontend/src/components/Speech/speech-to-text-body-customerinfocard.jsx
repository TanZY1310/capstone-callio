function CustomerInfoCard({ data, customer }) {
  const name = customer?.name ?? data.customerName;
  // const dateTime = customer?.lastContact ?? data.customerCoversationDateTime;
  return (
    <div className="flex flex-col gap-3 p-2 w-108.75">
      <span className="font-bold text-2xl text-base-content">
        {name}
      </span>
      <span className="text-xs text-base-content/60">
        {data.customerCoversationDateTime}
      </span>
      <button className="btn btn-neutral btn-sm w-fit">
        Add to Lead Pipeline
      </button>
    </div>
  );
}
export default CustomerInfoCard;
