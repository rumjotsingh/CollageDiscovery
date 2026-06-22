/** Static exam catalog — UI contracts for exams module */
export interface Exam {
  slug: string;
  name: string;
  category: string;
  conductingBody: string;
  frequency: string;
  eligibility: string;
  applicationMonth: string;
  examMonth: string;
  mode: "Online" | "Offline" | "Hybrid";
  description: string;
  subjects: string[];
}

export const EXAMS: Exam[] = [
  {
    slug: "jee-main",
    name: "JEE Main",
    category: "Engineering",
    conductingBody: "NTA",
    frequency: "Twice a year",
    eligibility: "Class 12 with PCM",
    applicationMonth: "Nov–Dec",
    examMonth: "Jan & Apr",
    mode: "Online",
    description: "National entrance for B.Tech admissions to NITs, IIITs, and other participating institutes.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    slug: "jee-advanced",
    name: "JEE Advanced",
    category: "Engineering",
    conductingBody: "IIT",
    frequency: "Once a year",
    eligibility: "Top JEE Main rank holders",
    applicationMonth: "May",
    examMonth: "May–Jun",
    mode: "Online",
    description: "Gateway to IIT undergraduate programs.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    slug: "neet-ug",
    name: "NEET UG",
    category: "Medical",
    conductingBody: "NTA",
    frequency: "Once a year",
    eligibility: "Class 12 with PCB",
    applicationMonth: "Feb–Mar",
    examMonth: "May",
    mode: "Offline",
    description: "Single national entrance for MBBS, BDS, AYUSH courses in India.",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  {
    slug: "cat",
    name: "CAT",
    category: "Management",
    conductingBody: "IIM",
    frequency: "Once a year",
    eligibility: "Bachelor's degree",
    applicationMonth: "Aug–Sep",
    examMonth: "Nov",
    mode: "Online",
    description: "Common Admission Test for MBA/PGP at IIMs and top B-schools.",
    subjects: ["VARC", "DILR", "QA"],
  },
  {
    slug: "gate",
    name: "GATE",
    category: "Engineering",
    conductingBody: "IISc / IIT",
    frequency: "Once a year",
    eligibility: "Bachelor's / final year",
    applicationMonth: "Aug–Oct",
    examMonth: "Feb",
    mode: "Online",
    description: "For M.Tech admissions and PSU recruitment.",
    subjects: ["Core engineering discipline"],
  },
  {
    slug: "clat",
    name: "CLAT",
    category: "Law",
    conductingBody: "NLU Consortium",
    frequency: "Once a year",
    eligibility: "Class 12",
    applicationMonth: "Jul–Nov",
    examMonth: "Dec",
    mode: "Offline",
    description: "Common Law Admission Test for NLU undergraduate law programs.",
    subjects: ["English", "GK", "Legal Reasoning", "Logical Reasoning", "Maths"],
  },
];

export function getExamBySlug(slug: string) {
  return EXAMS.find((e) => e.slug === slug);
}
