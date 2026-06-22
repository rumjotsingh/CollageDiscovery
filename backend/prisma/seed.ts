import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const SEED_LIMIT = 200;

interface DatasetRow {
  FIELD1: number;
  College_Name: string;
  State: string;
  UG_fee: string;
  PG_fee: string;
  Rating: string;
  Academic: string;
  Accommodation: string;
  Faculty: string;
  Infrastructure: string;
  Placement: string;
  Social_Life: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFee(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10) || 0;
}

function parseScore(value: string): number {
  return parseFloat(value) || 0;
}

function normalizeState(state: string): string {
  return state
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function extractLocation(name: string, state: string): string {
  const parts = name.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }

  const knownCities = [
    'Madras', 'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru',
    'Hyderabad', 'Pune', 'Kolkata', 'Trichy', 'Tiruchirappalli',
    'Kanchipuram', 'Vellore', 'Indore', 'Kanpur', 'Roorkee', 'Guwahati',
    'Rourkela', 'Warangal', 'Surathkal', 'Manipal', 'Pilani',
  ];

  for (const city of knownCities) {
    if (name.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }

  return state;
}

function collegeSlug(name: string, fieldId: number): string {
  const base = slugify(name) || 'college';
  return `${base}-${fieldId}`;
}

async function main() {
  console.log('Seeding database from Indian Engineering Colleges dataset...');

  const datasetPath = path.join(
    __dirname,
    '../src/data/Indian_Engineering_Colleges_Dataset.json',
  );
  const allRows: DatasetRow[] = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  const rows = allRows.slice(0, SEED_LIMIT);
  console.log(`Loaded ${allRows.length} colleges from dataset, seeding ${rows.length} for testing`);

  await prisma.comparisonCollege.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 12);

  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.user.create({
        data: {
          name: `Student ${i + 1}`,
          email: `student${i + 1}@collegeapp.in`,
          password: hashedPassword,
        },
      }),
    ),
  );

  const courseNames = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech Civil', 'M.Tech'];
  const BATCH_SIZE = 25;

  for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, rows.length);
    const operations = [];

    for (let i = batchStart; i < batchEnd; i++) {
      const row = rows[i];
      const name = row.College_Name.trim();
      const state = normalizeState(row.State);
      const location = extractLocation(name, state);
      const ugFees = parseFee(row.UG_fee);
      const pgFees = parseFee(row.PG_fee);
      const ratingRaw = parseScore(row.Rating);
      const rating = parseFloat((ratingRaw / 2).toFixed(1));
      const placementScore = parseScore(row.Placement);
      const slug = collegeSlug(name, row.FIELD1);

      operations.push(
        prisma.college.create({
          data: {
            name,
            slug,
            location,
            state,
            fees: ugFees,
            pgFees,
            rating,
            academicScore: parseScore(row.Academic),
            accommodationScore: parseScore(row.Accommodation),
            facultyScore: parseScore(row.Faculty),
            infrastructureScore: parseScore(row.Infrastructure),
            placementScore,
            socialLifeScore: parseScore(row.Social_Life),
            overview: `${name} is an engineering institution in ${location}, ${state}. Rated ${ratingRaw}/10 overall with strong scores across academics, faculty, infrastructure, and placements. UG fees: ₹${ugFees.toLocaleString('en-IN')}/year.`,
            courses: {
              create: courseNames.slice(0, 3 + (i % 3)).map((courseName, idx) => ({
                name: courseName,
                duration: courseName.startsWith('M.') ? '2 Years' : '4 Years',
                fees: Math.round(ugFees * (0.9 + idx * 0.05)),
              })),
            },
            placement: {
              create: {
                averagePackage: parseFloat((placementScore * 2.5).toFixed(1)),
                highestPackage: parseFloat((placementScore * 5).toFixed(1)),
                placementPercentage: parseFloat((placementScore * 10).toFixed(1)),
              },
            },
          },
        }),
      );
    }

    await prisma.$transaction(operations);
    console.log(`  Seeded ${batchEnd}/${rows.length} colleges...`);
  }

  console.log(`Done! Seeded ${rows.length} of ${allRows.length} colleges and 5 demo users.`);
  console.log('Demo login: student1@collegeapp.in / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
