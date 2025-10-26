// Components/Card.jsx
export default function Card({ title, value, icon, isLoading }) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow hover:shadow-md transition">
      {isLoading ? (
        <div className="animate-pulse h-20 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon}
        </div>
      )}
    </div>
  );
}
