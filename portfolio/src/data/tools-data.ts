export interface EngineeringTool {
  id: string;
  name: string;
  category: "Embedded & Firmware" | "Testing & HIL" | "Hardware & EDA" | "Instrumentation & SMT" | "Software & PLM";
  tagline: string;
  description: string;
  tags: string[];
  roleUsed: string; // e.g. "IISc Aerospace / Foxconn", "Bosch Automotive", "Wistron SMT"
  link?: string;
  iconType: "terminal" | "cpu" | "circuit" | "activity" | "database" | "tool";
  featured?: boolean;
}

export const TOOLS_CATEGORIES = [
  "All",
  "Embedded & Firmware",
  "Testing & HIL",
  "Hardware & EDA",
  "Instrumentation & SMT",
  "Software & PLM",
] as const;

export type ToolCategory = (typeof TOOLS_CATEGORIES)[number];

export const ENGINEERING_TOOLS: EngineeringTool[] = [
  {
    id: "tool-canoe",
    name: "Vector CANoe & CANalyzer",
    category: "Testing & HIL",
    tagline: "Automotive & Aerospace Bus Telemetry, CAN/LIN/Ethernet Simulation",
    description:
      "Comprehensive test environment for analyzing bus communications, simulating ECU nodes, and validating distributed real-time networks in aerospace and automotive architectures.",
    tags: ["CAN FD", "Diagnostic (UDS)", "HIL Simulation", "CAPL Scripting"],
    roleUsed: "Bosch Automotive & IISc Aerospace",
    link: "https://www.vector.com",
    iconType: "activity",
    featured: true,
  },
  {
    id: "tool-stm32cube",
    name: "STM32CubeIDE & HAL/LL",
    category: "Embedded & Firmware",
    tagline: "Bare-Metal C/C++ Firmware & FreeRTOS Development",
    description:
      "Primary embedded development environment for ARM Cortex-M microcontrollers. Used for configuring DMA streams, clock trees, hardware timers, and peripheral interrupts for low-latency avionics nodes.",
    tags: ["ARM Cortex-M", "FreeRTOS", "DMA", "Bare-Metal C/C++"],
    roleUsed: "Foxconn & IISc Aerospace",
    link: "https://www.st.com",
    iconType: "cpu",
    featured: true,
  },
  {
    id: "tool-labview",
    name: "NI LabVIEW & TestStand",
    category: "Testing & HIL",
    tagline: "Automated Hardware-in-the-Loop (HIL) Test Instrumentation",
    description:
      "Engineered automated test suites interfacing with PXI chassis, DAQ modules, and power supplies for dynamic environmental qualification and automated sensor regression suites.",
    tags: ["PXI Chassis", "Automated DAQ", "Fault Injection", "HIL Systems"],
    roleUsed: "IISc Aerospace & Foxconn",
    link: "https://www.ni.com",
    iconType: "activity",
    featured: true,
  },
  {
    id: "tool-matlab",
    name: "MATLAB & Simulink",
    category: "Testing & HIL",
    tagline: "Mathematical Modeling, Control Algorithms & Data Analytics",
    description:
      "Used for telemetry curve fitting, sensor noise filtering (Kalman Filters), control loop stability analysis, and automated parsing of large HIL binary telemetry logs.",
    tags: ["Simulink", "Data Telemetry", "Signal Processing", "Sensor Fusion"],
    roleUsed: "IISc Aerospace & Foxconn",
    link: "https://www.mathworks.com",
    iconType: "terminal",
    featured: true,
  },
  {
    id: "tool-ict-fpt",
    name: "In-Circuit Test (ICT) & Flying Probe (FPT)",
    category: "Instrumentation & SMT",
    tagline: "Component-Level PCBA Production Test & Boundary Scan",
    description:
      "Operating Teradyne/Keysight ICT fixture beds and Takaya Flying Probe testers to inspect short/open circuits, component tolerances, passive impedances, and IC functional voltages on mass-production automotive boards.",
    tags: ["ICT Beds", "Flying Probe", "Boundary Scan", "RCA Playbooks"],
    roleUsed: "Bosch Automotive Electronics",
    iconType: "circuit",
    featured: true,
  },
  {
    id: "tool-altium",
    name: "Altium Designer",
    category: "Hardware & EDA",
    tagline: "High-Density Multi-Layer PCB Layout & High-Speed Impedance Control",
    description:
      "Schematic capture and multi-layer PCB routing with controlled impedance differential pairs, power plane stackups, EMI shielding ground pours, and IPC compliant footprint libraries.",
    tags: ["Multi-Layer PCB", "Differential Routing", "Stackup Planning", "EMI/EMC"],
    roleUsed: "Aerospace Subsystems & Avionics",
    link: "https://www.altium.com",
    iconType: "circuit",
    featured: true,
  },
  {
    id: "tool-spi-aoi",
    name: "Koh Young SPI & CyberOptics 3D AOI",
    category: "Instrumentation & SMT",
    tagline: "High-Speed Solder Paste & Optical Inspection Calibration",
    description:
      "Calibrating inline 3D solder paste height inspection and automated optical inspection systems on high-throughput surface mount technology lines to eliminate solder bridging and tombstoning.",
    tags: ["3D SPI", "3D AOI", "SMT Telemetry", "IPC-A-610"],
    roleUsed: "Wistron Infocomm MLB SMT",
    iconType: "tool",
    featured: false,
  },
  {
    id: "tool-saleae",
    name: "Saleae Logic Pro 16",
    category: "Instrumentation & SMT",
    tagline: "High-Speed Digital Protocol & Timing Analysis",
    description:
      "Deep protocol decoding across SPI, I2C, UART, CAN, and proprietary serial buses. Used for troubleshooting peripheral timing jitter, clock edge skew, and bus contention.",
    tags: ["Logic Decoding", "SPI / I2C", "Bus Timing", "Hardware Sniffing"],
    roleUsed: "Avionics Subsystems Testbed",
    link: "https://www.saleae.com",
    iconType: "activity",
    featured: false,
  },
  {
    id: "tool-python-canoe",
    name: "Python (CAN / Serial Automation)",
    category: "Embedded & Firmware",
    tagline: "Custom Testbed Automation, SocketCAN & Firmware Flashing",
    description:
      "Authored modular test scripts utilizing python-can, pyserial, and pyvisa to control programmable laboratory power supplies, trigger signal generators, and record flight telemetry.",
    tags: ["python-can", "pyVISA", "SocketCAN", "Automated Flashing"],
    roleUsed: "Foxconn & IISc Aerospace",
    iconType: "terminal",
    featured: true,
  },
  {
    id: "tool-kicad",
    name: "KiCad EDA Suite",
    category: "Hardware & EDA",
    tagline: "Open-Source Schematics & Fast Rapid-Prototyping",
    description:
      "Used for developing sensor breakout modules, instrumentation interface cards, and level-shifter test jigs with rapid turnarounds.",
    tags: ["Open Source", "Schematic Capture", "Rapid Prototyping"],
    roleUsed: "Lab Test Jig Prototyping",
    link: "https://www.kicad.org",
    iconType: "circuit",
    featured: false,
  },
  {
    id: "tool-sap",
    name: "SAP-PP / SAP-MM & Agile PLM",
    category: "Software & PLM",
    tagline: "Production Planning, Bill of Materials (BOM) & ECR Lifecycle",
    description:
      "Managing complex multi-level Engineering Bills of Materials (BOMs), executing Engineering Change Requests (ECRs), and synchronizing manufacturing trial runs across tier-1 plants.",
    tags: ["BOM Governance", "ECR / ECO", "SAP-PP", "SAP-MM", "Agile PLM"],
    roleUsed: "Bosch Automotive Electronics",
    iconType: "database",
    featured: false,
  },
  {
    id: "tool-ipc610",
    name: "IPC-A-610 & J-STD-001 Standards",
    category: "Software & PLM",
    tagline: "Acceptability of Electronic Assemblies & Class-3 High Reliability",
    description:
      "Enforcing Class 3 military and automotive electronic workmanship criteria across component soldering, barrel fill percentages, minimum solder heights, and conformal coating.",
    tags: ["Class 3 Standards", "SMT Quality", "Conformal Coating", "Defect Segregation"],
    roleUsed: "Bosch & Wistron Manufacturing",
    iconType: "tool",
    featured: false,
  },
];
