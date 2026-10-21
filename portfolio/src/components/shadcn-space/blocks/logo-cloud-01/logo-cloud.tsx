import { Marquee } from "@/components/shadcn-space/animations/marquee";

export const LogoCloud = () => {
  const brandList = [
    // Companies Worked & Working (Official files uploaded by user)
    "/foxconn.png",
    "/iisc.png",
    "/bosch.png",
    "/wistron.png",

    // Development, Cloud & Enterprise
    "/github.svg",
    "/appwrite.svg",
    "/supabase.svg",
    "/oracle.svg",
    "/google.svg",
    "/laravel.svg",

    // Hardware, EDA, Testing & Avionics Tooling
    "/kicad.svg",
    "/altium.svg",
    "/arduino.svg",
    "/stm32.svg",
    "/labview.svg",
    "/sap.svg",
    "/agileplm.svg",
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[rgba(39,39,42,0.8)] bg-[#000000] py-6 sm:py-8">
      <Marquee pauseOnHover className="[--duration:36s] p-0">
        {brandList.map((image, index) => (
          <div
            key={index}
            className="flex items-center mr-8 sm:mr-12 lg:mr-16 group cursor-default"
          >
            <div className="h-10 sm:h-12 w-28 sm:w-36 rounded-xl bg-white/95 px-3 py-1.5 flex items-center justify-center border border-zinc-800 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-white">
              <img
                src={image}
                alt="Brand & Tool Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#000000] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#000000] to-transparent z-10" />
    </div>
  );
};

export default LogoCloud;
