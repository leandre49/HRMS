export default function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const formatter = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const displayValue = typeof value === 'number' && title !== 'Total Employees'
    ? formatter.format(value)
    : value;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-3 rounded-lg ${colorMap[color] || colorMap.primary}`}>
          <span className="text-2xl">{icon}</span>
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
