const descriptionColors = {
  neutral: "text-slate-500",
  amber: "text-amber-700",
  rose: "text-rose-700",
};

function StatCard({ title, value, description, tone = "neutral" }) {
  const descriptionColor =
    descriptionColors[tone] || descriptionColors.neutral;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

      <p className={`mt-2 text-sm ${descriptionColor}`}>
        {description}
      </p>
    </div>
  );
}

export default StatCard;