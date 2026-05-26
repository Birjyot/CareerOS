'use client';

const ITEMS = [
  'AI Resume Scoring',
  'Interview Prep',
  'Smart Analytics',
  'Job Tracking',
  'AI Career Assistant',
  'Gmail Sync',
  'ATS Optimization',
  'Career Intelligence',
  'Cover Letter AI',
  'Mock Interviews',
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  // Duplicate for seamless loop
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="flex overflow-hidden select-none">
      <div
        className={`flex min-w-full shrink-0 gap-6 py-3 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
                boxShadow: `0 0 6px ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'}`,
              }}
            />
            {item}
          </span>
        ))}
      </div>
      {/* Clone for seamless wrap */}
      <div
        className={`flex min-w-full shrink-0 gap-6 py-3 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        aria-hidden
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
                boxShadow: `0 0 6px ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'}`,
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ScrollMarquee() {
  return (
    <section className="py-14 relative overflow-hidden">
      {/* Edge fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #050814, transparent)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #050814, transparent)',
        }}
      />

      <div className="flex flex-col gap-4">
        <MarqueeRow reverse={false} />
        <MarqueeRow reverse={true} />
      </div>
    </section>
  );
}
