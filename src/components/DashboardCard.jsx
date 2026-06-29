import "./DashboardCard.css";

export default function DashboardCard({
  value,
  title
}) {
  return (
    <div className="dashboard-card">
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}