import React from "react";

export function PhotoSection() {
  const mediaItems = [
    {
      id: "photo-1",
      title: "Interactive Studio Workspace",
      category: "Interface Design",
      aspect: "col-span-1 md:col-span-2",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      description: "Visual canvas designed with fluid micro-interactions and dark mode depth.",
      tag: "Live Experience",
    },
    {
      id: "photo-2",
      title: "Architecture & Data Engine",
      category: "Systems Engineering",
      aspect: "col-span-1",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
      description: "Built for scalable real-time streaming and edge response times.",
      tag: "Ultra-Fast",
    },
    {
      id: "photo-3",
      title: "Modular Component Ecosystem",
      category: "Design System",
      aspect: "col-span-1",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      description: "Reusable primitives styled with curated color spaces and glassmorphism.",
      tag: "Accessible",
    },
    {
      id: "photo-4",
      title: "Enterprise Multi-Tenant Security",
      category: "Security & Auth",
      aspect: "col-span-1 md:col-span-2",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200&auto=format&fit=crop&q=80",
      description: "Granular access policies, protected session cookies, and encrypted data layers.",
      tag: "Protected",
    },
  ];

  return (
    <section id="showcase" className="py-16 sm:py-24 border-t border-[rgba(39,39,42,0.8)]">
      <div className="w-full px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[#d4d4d8] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span>Media Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5]">
              Designed with precision down to the last pixel.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Placeholder media gallery illustrating how your product features, screenshots, and visual assets will be
            highlighted in your application.
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border border-[rgba(39,39,42,0.8)] bg-[#171717] transition-all duration-300 hover:border-[rgba(255,255,255,0.3)] hover:shadow-2xl ${item.aspect}`}
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[#000000]/60 px-3 py-1 text-[11px] font-medium text-[#F4F4F5] backdrop-blur-md">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6">
                <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-[#F4F4F5] mt-1 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
