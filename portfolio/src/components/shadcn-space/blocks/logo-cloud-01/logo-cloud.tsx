import React from "react";
import Image from "next/image";
import { Marquee } from "@/components/shadcn-space/animations/marquee";

interface BrandItem {
  name: string;
  src: string;
}

const brandList: BrandItem[] = [
  // Companies Worked & Working (Official files uploaded by user)
  { name: "Foxconn Hon Hai Technology", src: "/foxconn.png" },
  { name: "Indian Institute of Science (IISc)", src: "/iisc.png" },
  { name: "Bosch Automotive Electronics", src: "/bosch.png" },
  { name: "Wistron Infocomm", src: "/wistron.png" },

  // Development, Cloud & Enterprise
  { name: "GitHub", src: "/github.svg" },
  { name: "Appwrite", src: "/appwrite.svg" },
  { name: "Supabase", src: "/supabase.svg" },
  { name: "Oracle", src: "/oracle.svg" },
  { name: "Google", src: "/google.svg" },
  { name: "Laravel", src: "/laravel.svg" },

  // Hardware, EDA, Testing & Avionics Tooling
  { name: "KiCad EDA", src: "/kicad.svg" },
  { name: "Altium Designer", src: "/altium.svg" },
  { name: "Arduino", src: "/arduino.svg" },
  { name: "STM32 Microcontrollers", src: "/stm32.svg" },
  { name: "NI LabVIEW", src: "/labview.svg" },
  { name: "SAP", src: "/sap.svg" },
  { name: "Oracle Agile PLM", src: "/agileplm.svg" },
];

export const LogoCloud = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-background py-6 sm:py-8 transition-colors duration-200">
      <Marquee pauseOnHover className="[--duration:36s] p-0">
        {brandList.map((item, index) => (
          <div
            key={index}
            className="flex items-center mr-8 sm:mr-12 lg:mr-16 group cursor-default"
          >
            <div className="h-10 sm:h-12 w-28 sm:w-36 rounded-xl bg-card px-3 py-1.5 flex items-center justify-center border border-border shadow-xs transition-all duration-200 group-hover:scale-105">
              <Image
                src={item.src}
                alt={`${item.name} logo`}
                width={100}
                height={32}
                loading="lazy"
                className="max-h-8 max-w-[100px] w-auto h-auto object-contain filter dark:brightness-100"
              />
            </div>
          </div>
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
};

export default LogoCloud;
