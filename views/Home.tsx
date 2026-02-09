
import React from 'react';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Build Your Dream House with <span className="text-orange-500 underline decoration-orange-200">Confidence</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Submit your construction plans and get accurate, professional cost estimates from verified structural and civil engineers in hours, not weeks.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onGetStarted}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-100 transform active:scale-95 transition-all"
            >
              Start Planning Now
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Learn More
            </button>
          </div>
          <div className="flex items-center gap-8 pt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">500+</span>
              <span className="text-sm text-slate-500">Verified Engineers</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">12k+</span>
              <span className="text-sm text-slate-500">Estimates Delivered</span>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -inset-4 bg-orange-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
          <img 
            src="https://picsum.photos/seed/construction/800/600" 
            alt="Construction Planning" 
            className="rounded-3xl shadow-2xl border-4 border-white transform hover:rotate-1 transition-transform duration-500"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <i className="fas fa-check"></i>
              </div>
              <p className="text-sm font-bold text-slate-800">Estimate Received!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-pencil-ruler', title: 'Plan Project', desc: 'Define your area, rooms, and requirements in our easy step-by-step wizard.' },
          { icon: 'fa-users', title: 'Expert Match', desc: 'Our platform notifies the best structural engineers suited for your specific project needs.' },
          { icon: 'fa-chart-pie', title: 'Cost Breakdown', desc: 'Receive detailed reports including labor, material, and logistical overheads.' }
        ].map((feat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-orange-50 text-orange-500 w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6">
              <i className={`fas ${feat.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
