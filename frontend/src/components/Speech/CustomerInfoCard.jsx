function CustomerInfoCard({ data, customer }) {
  const name = customer?.cust_name ?? data?.customerName;
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="font-bold text-xl text-base-content">{name}</span>
      <span className="text-helper">{data?.customerCoversationDateTime}</span>
    </div>
  );
}
export default CustomerInfoCard;
