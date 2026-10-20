import { Marquee } from "@/components/shadcn-space/animations/marquee";

type BrandList = {
  image: string;
  lightimg: string;
  name: string;
};

export const LogoCloud = () => {
  const brandList: BrandList[] = [
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
      name: "Brand 1",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
      name: "Brand 2",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
      name: "Brand 3",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg",
      name: "Brand 4",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-5.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-5.svg",
      name: "Brand 5",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[rgba(39,39,42,0.8)] bg-[#000000] py-10 sm:py-12">
      <Marquee pauseOnHover className="[--duration:28s] p-0">
        {brandList.map((brand, index) => (
          <div key={index} className="flex items-center">
            <img
              src={brand.image}
              alt={brand.name}
              className="w-32 sm:w-36 h-7 sm:h-8 mr-10 lg:mr-20 dark:hidden opacity-60 hover:opacity-100 transition-opacity duration-200"
            />
            <img
              src={brand.lightimg}
              alt={brand.name}
              className="hidden dark:block w-32 sm:w-36 h-7 sm:h-8 mr-10 lg:mr-20 opacity-60 hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        ))}
      </Marquee>

      {/* Left gradient fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#000000] to-transparent z-10" />

      {/* Right gradient fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#000000] to-transparent z-10" />
    </div>
  );
};

export default LogoCloud;
