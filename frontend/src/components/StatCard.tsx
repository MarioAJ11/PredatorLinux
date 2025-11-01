interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon?: string;
}

export default function StatCard({ title, value, unit, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      {icon && <span className="text-4xl mb-2">{icon}</span>}
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-bold text-predator-blue">
        {value.toFixed(1)}
        <span className="text-lg ml-1">{unit}</span>
      </p>
    </div>
  );
}
