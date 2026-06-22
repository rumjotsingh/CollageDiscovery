export interface CareerPath {
  slug: string;
  title: string;
  category: string;
  avgSalary: string;
  growth: "High" | "Medium" | "Stable";
  description: string;
  skills: string[];
  roadmap: { step: number; title: string; description: string }[];
  relatedCourses: string[];
}

export const CAREERS: CareerPath[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer",
    category: "Technology",
    avgSalary: "₹8–25 LPA",
    growth: "High",
    description: "Design, build, and maintain software systems across web, mobile, and cloud.",
    skills: ["DSA", "System Design", "Git", "One backend + one frontend stack"],
    roadmap: [
      { step: 1, title: "Foundation", description: "Learn programming (Python/Java) and CS fundamentals" },
      { step: 2, title: "Core CS", description: "Data structures, algorithms, DBMS, OS basics" },
      { step: 3, title: "Specialize", description: "Pick full-stack, backend, or mobile track" },
      { step: 4, title: "Projects + Internships", description: "Build portfolio and gain industry exposure" },
      { step: 5, title: "Placements", description: "Target product companies and startups via campus/off-campus" },
    ],
    relatedCourses: ["B.Tech CSE", "BCA", "MCA"],
  },
  {
    slug: "doctor",
    title: "Doctor (MBBS)",
    category: "Healthcare",
    avgSalary: "₹10–40 LPA",
    growth: "Stable",
    description: "Diagnose and treat patients; specialize via PG after MBBS.",
    skills: ["Biology", "Clinical knowledge", "Communication", "NEET preparation"],
    roadmap: [
      { step: 1, title: "NEET UG", description: "Clear NEET for MBBS admission" },
      { step: 2, title: "MBBS", description: "5.5 years including internship" },
      { step: 3, title: "Internship", description: "Rotating clinical internship" },
      { step: 4, title: "Specialization", description: "MD/MS via NEET PG or foreign pathways" },
    ],
    relatedCourses: ["MBBS", "BDS"],
  },
  {
    slug: "civil-services",
    title: "Civil Services (IAS/IPS)",
    category: "Government",
    avgSalary: "₹12–25 LPA + benefits",
    growth: "Stable",
    description: "Administrative leadership roles in Indian government.",
    skills: ["General studies", "Essay writing", "Optional subject depth", "Current affairs"],
    roadmap: [
      { step: 1, title: "Graduation", description: "Any recognized bachelor's degree" },
      { step: 2, title: "UPSC Prelims", description: "Objective GS + CSAT screening" },
      { step: 3, title: "Mains", description: "Descriptive papers + optional subject" },
      { step: 4, title: "Interview", description: "Personality test at UPSC" },
    ],
    relatedCourses: ["BA", "B.Sc", "B.Tech", "Any UG"],
  },
  {
    slug: "chartered-accountant",
    title: "Chartered Accountant",
    category: "Finance",
    avgSalary: "₹8–20 LPA",
    growth: "High",
    description: "Audit, taxation, and financial advisory for corporates and individuals.",
    skills: ["Accounting", "Tax law", "Audit", "Financial analysis"],
    roadmap: [
      { step: 1, title: "CA Foundation", description: "Entry level after Class 12" },
      { step: 2, title: "CA Intermediate", description: "Group exams + articleship eligibility" },
      { step: 3, title: "Articleship", description: "3 years practical training" },
      { step: 4, title: "CA Final", description: "Final certification exams" },
    ],
    relatedCourses: ["B.Com", "CA program"],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    category: "Technology",
    avgSalary: "₹10–30 LPA",
    growth: "High",
    description: "Extract insights from data using statistics, ML, and domain knowledge.",
    skills: ["Python", "Statistics", "ML", "SQL", "Visualization"],
    roadmap: [
      { step: 1, title: "Math + Stats", description: "Linear algebra, probability, statistics" },
      { step: 2, title: "Programming", description: "Python, pandas, scikit-learn" },
      { step: 3, title: "ML Projects", description: "Kaggle, real datasets, deployment basics" },
      { step: 4, title: "Degree / Bootcamp", description: "B.Tech, M.Tech Data Science, or MCA" },
    ],
    relatedCourses: ["B.Tech CSE", "M.Tech Data Science", "BCA"],
  },
];

export function getCareerBySlug(slug: string) {
  return CAREERS.find((c) => c.slug === slug);
}
