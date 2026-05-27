function getScoreColor(score) {
  if (score >= 80) return "text-pulse-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getScoreRingColor(score) {
  if (score >= 80) return "stroke-pulse-400";
  if (score >= 60) return "stroke-yellow-400";
  if (score >= 40) return "stroke-orange-400";
  return "stroke-red-400";
}

function getScoreBarColor(score) {
  if (score >= 80) return "bg-pulse-400";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

const circumference = 2 * Math.PI * 42;
const viewBox = 100;

export default function HealthScore({ score, size = "default" }) {
  const isLarge = size === "large";
  const svgSize = isLarge ? 130 : 104;
  const offset = circumference - (score / 100) * circumference;

  const scoreLabel =
    score >= 90 ? "Excellent" :
    score >= 80 ? "Great" :
    score >= 60 ? "Good" :
    score >= 40 ? "Needs Work" : "Critical";

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-200">Health Score</h3>
          <p className="text-[11px] text-dark-400 mt-0.5">Overall quality</p>
        </div>
        <span className={`badge ${score >= 60 ? "badge-green" : score >= 40 ? "badge-yellow" : "badge-red"}`}>
          {scoreLabel}
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBox} ${viewBox}`} fill="none">
            <circle
              cx={viewBox / 2} cy={viewBox / 2} r={42}
              stroke="currentColor" strokeWidth="8"
              className="text-dark-600/50"
            />
            <circle
              cx={viewBox / 2} cy={viewBox / 2} r={42}
              stroke="currentColor" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${isLarge ? "text-3xl" : "text-2xl"} font-extrabold ${getScoreColor(score)} tabular-nums`}>
              {score}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex justify-between text-xs">
          <span className="text-dark-400">Score</span>
          <span className="text-dark-200 font-semibold tabular-nums">{score}/100</span>
        </div>
        <div className="w-full h-1.5 bg-dark-600/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-dark-400/80 mt-3 leading-relaxed">
        {score >= 90 ? "Exceptional code quality with minimal issues" :
         score >= 80 ? "Healthy codebase with minor improvements available" :
         score >= 60 ? "Several areas need attention to improve quality" :
         score >= 40 ? "Significant improvements recommended" :
         "Critical issues detected requiring immediate attention"}
      </p>
    </div>
  );
}
