import React from "react";
import { Marquee } from "@/components/shadcn-space/animations/marquee";

const brandList: string[] = [
  // Companies worked & working
  "Foxconn Hon Hai Technology",
  "Indian Institute of Science (IISc)",
  "Bosch Automotive Electronics",
  "Wistron Infocomm",

  // Development, cloud & enterprise
  "GitHub",
  "Appwrite",
  "Supabase",
  "Oracle",
  "Google",
  "Laravel",

  // Hardware, EDA, testing & avionics tooling
  "KiCad EDA",
  "Altium Designer",
  "Arduino",
  "STM32 Microcontrollers",
  "NI LabVIEW",
  "SAP",
  "Oracle Agile PLM",
];

export const LogoCloud = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-background py-8 sm:py-8">
      <Marquee pauseOnHover className="[--duration:55s] [--gap:0rem] p-0">
        {brandList.map((name) => (
          <div key={name} className="flex items-center group cursor-default">
            <span className="whitespace-nowrap text-base sm:text-lg font-medium tracking-tight text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              {name}
            </span>
            <span
              aria-hidden="true"
              className="mx-6 sm:mx-10 size-1 rounded-full bg-border"
            />
          </div>
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
};

export default LogoCloud;