import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          CO₂ Reduction Planner
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plan, track, and achieve your organization's carbon reduction goals with comprehensive emissions management and tactical planning.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/register"
            className="px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-bold text-lg transition-colors"
          >
            Get Started Free
          </Link>
          <Link 
            href="/login"
            className="px-8 py-4 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 font-semibold text-lg transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Track Emissions</h3>
            <p className="text-gray-600">
              Organize emissions by Scope 1, 2, and 3 categories with detailed baseline tracking
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Plan Reductions</h3>
            <p className="text-gray-600">
              Create reduction tactics with timelines, costs, and implementation strategies
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Visualize Progress</h3>
            <p className="text-gray-600">
              See projected emissions vs. targets with interactive charts and forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
