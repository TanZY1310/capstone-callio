function CustomerInfoCard({ data, customer }) {
  const name = customer?.name ?? data.customerName;
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="font-bold text-xl text-base-content">{name}</span>
      <span className="text-helper">{data.customerCoversationDateTime}</span>
      <button className="btn btn-neutral">Add to Lead Pipeline</button>
    </div>
  );
}
export default CustomerInfoCard;
