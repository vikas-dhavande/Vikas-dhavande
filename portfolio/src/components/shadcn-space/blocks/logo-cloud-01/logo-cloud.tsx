import { Marquee } from "@/components/shadcn-space/animations/marquee";

type BrandList = {
  image: string;
  name: string;
};

export const LogoCloud = () => {
  const brandList: BrandList[] = [
    {
      image: "/foxconn.png",
      name: "Foxconn Hon Hai Technology",
    },
    {
      image: "/iisc.png",
      name: "Indian Institute of Science (IISc)",
    },
    {
      image: "/bosch.png",
      name: "Bosch Automotive Electronics",
    },
    {
      image: "/wistron.png",
      name: "Wistron Infocomm Manufacturing",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[rgba(39,39,42,0.8)] bg-[#000000] py-8 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mb-4 flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          Organizations &amp; Research Institutions
        </span>
        <span className="text-[11px] font-mono text-zinc-600">
          Aerospace • Avionics • Automotive • High-Speed SMT
        </span>
      </div>

      <Marquee pauseOnHover className="[--duration:24s] p-0">
        {brandList.map((brand, index) => (
          <div
            key={index}
            className="flex items-center gap-3 mr-12 lg:mr-20 group cursor-default"
          >
            <div className="h-10 sm:h-12 w-28 sm:w-36 rounded-xl bg-white/95 px-3 py-1.5 flex items-center justify-center border border-zinc-800 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-white">
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors hidden sm:inline-block">
              {brand.name}
            </span>
          </div>
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#000000] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#000000] to-transparent z-10" />
    </div>
  );
};

export default LogoCloud;
