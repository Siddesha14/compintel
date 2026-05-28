const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ 
  connectionString: "yopostgresql://neondb_owner:npg_dD56LzFQMobN@ep-spring-math-apakecnn-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=requireur-neon-url-here",
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapLevelToOrder(level) {
  const map = {
    "intern": 1, "sde-1": 2, "sde1": 2, "l3": 2,
    "sde-2": 4, "sde2": 4, "l4": 4,
    "senior": 5, "l5": 5,
    "sde-3": 6, "sde3": 6, "l6": 6,
    "staff": 7, "l7": 7,
    "principal": 8, "l8": 8,
  };
  return map[level.toLowerCase()] ?? 3;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeCompanyName(name) {
  return name.toLowerCase()
    .replace(/\s+(india|inc|ltd|limited|pvt|technologies|tech)\.?$/i, "")
    .replace(/[^a-z0-9]/g, "").trim();
}

const companies = [
  { name: "Flipkart", type: "PRODUCT", industry: "ECOMMERCE" },
  { name: "Google India", type: "MNC", industry: "TECHNOLOGY" },
  { name: "Microsoft India", type: "MNC", industry: "TECHNOLOGY" },
  { name: "Razorpay", type: "UNICORN", industry: "FINTECH" },
  { name: "CRED", type: "UNICORN", industry: "FINTECH" },
  { name: "Groww", type: "UNICORN", industry: "FINTECH" },
  { name: "Swiggy", type: "UNICORN", industry: "ECOMMERCE" },
  { name: "PhonePe", type: "UNICORN", industry: "FINTECH" },
  { name: "Zepto", type: "STARTUP", industry: "ECOMMERCE" },
  { name: "Meesho", type: "UNICORN", industry: "ECOMMERCE" },
];

const salaryData = [
  { company: "Flipkart", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1600000, bonus: 200000, stockValue: 300000, dataYear: 2024 },
  { company: "Flipkart", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2800000, bonus: 400000, stockValue: 800000, dataYear: 2024 },
  { company: "Flipkart", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-3", yearsOfExp: 6, city: "Bangalore", baseSalary: 4500000, bonus: 700000, stockValue: 2000000, dataYear: 2024 },
  { company: "Flipkart", role: "Product Manager", roleCategory: "PRODUCT_MANAGEMENT", level: "SDE-2", yearsOfExp: 4, city: "Bangalore", baseSalary: 3200000, bonus: 500000, stockValue: 1000000, dataYear: 2024 },
  { company: "Flipkart", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2600000, bonus: 350000, stockValue: 700000, dataYear: 2024 },
  { company: "Google India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "L3", yearsOfExp: 1, city: "Bangalore", baseSalary: 2200000, bonus: 300000, stockValue: 1500000, dataYear: 2024 },
  { company: "Google India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "L4", yearsOfExp: 3, city: "Bangalore", baseSalary: 3500000, bonus: 600000, stockValue: 3000000, dataYear: 2024 },
  { company: "Google India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "L5", yearsOfExp: 6, city: "Bangalore", baseSalary: 5500000, bonus: 1000000, stockValue: 6000000, dataYear: 2024 },
  { company: "Google India", role: "Product Manager", roleCategory: "PRODUCT_MANAGEMENT", level: "L4", yearsOfExp: 4, city: "Hyderabad", baseSalary: 4000000, bonus: 700000, stockValue: 3500000, dataYear: 2024 },
  { company: "Google India", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "L4", yearsOfExp: 3, city: "Bangalore", baseSalary: 3800000, bonus: 600000, stockValue: 2800000, dataYear: 2024 },
  { company: "Microsoft India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Hyderabad", baseSalary: 1800000, bonus: 250000, stockValue: 500000, dataYear: 2024 },
  { company: "Microsoft India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Hyderabad", baseSalary: 3000000, bonus: 450000, stockValue: 1500000, dataYear: 2024 },
  { company: "Microsoft India", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "Senior", yearsOfExp: 6, city: "Hyderabad", baseSalary: 4800000, bonus: 800000, stockValue: 3500000, dataYear: 2024 },
  { company: "Microsoft India", role: "Product Manager", roleCategory: "PRODUCT_MANAGEMENT", level: "SDE-2", yearsOfExp: 4, city: "Hyderabad", baseSalary: 3400000, bonus: 500000, stockValue: 1800000, dataYear: 2024 },
  { company: "Razorpay", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1700000, bonus: 150000, stockValue: 400000, dataYear: 2024 },
  { company: "Razorpay", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 3200000, bonus: 400000, stockValue: 1200000, dataYear: 2024 },
  { company: "Razorpay", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "Senior", yearsOfExp: 5, city: "Bangalore", baseSalary: 4200000, bonus: 600000, stockValue: 2000000, dataYear: 2024 },
  { company: "Razorpay", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2800000, bonus: 300000, stockValue: 900000, dataYear: 2024 },
  { company: "CRED", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1900000, bonus: 200000, stockValue: 500000, dataYear: 2024 },
  { company: "CRED", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 3500000, bonus: 500000, stockValue: 1500000, dataYear: 2024 },
  { company: "CRED", role: "Product Manager", roleCategory: "PRODUCT_MANAGEMENT", level: "Senior", yearsOfExp: 4, city: "Bangalore", baseSalary: 4000000, bonus: 600000, stockValue: 2000000, dataYear: 2024 },
  { company: "Groww", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1600000, bonus: 150000, stockValue: 400000, dataYear: 2024 },
  { company: "Groww", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2900000, bonus: 350000, stockValue: 1000000, dataYear: 2024 },
  { company: "Groww", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "SDE-2", yearsOfExp: 2, city: "Bangalore", baseSalary: 2600000, bonus: 300000, stockValue: 800000, dataYear: 2024 },
  { company: "Swiggy", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1700000, bonus: 180000, stockValue: 350000, dataYear: 2024 },
  { company: "Swiggy", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 3000000, bonus: 400000, stockValue: 1100000, dataYear: 2024 },
  { company: "Swiggy", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-3", yearsOfExp: 6, city: "Bangalore", baseSalary: 4800000, bonus: 700000, stockValue: 2500000, dataYear: 2024 },
  { company: "PhonePe", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1800000, bonus: 200000, stockValue: 450000, dataYear: 2024 },
  { company: "PhonePe", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 3100000, bonus: 420000, stockValue: 1200000, dataYear: 2024 },
  { company: "PhonePe", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2700000, bonus: 320000, stockValue: 900000, dataYear: 2024 },
  { company: "Zepto", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Mumbai", baseSalary: 1900000, bonus: 250000, stockValue: 600000, dataYear: 2024 },
  { company: "Zepto", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Mumbai", baseSalary: 3400000, bonus: 450000, stockValue: 1500000, dataYear: 2024 },
  { company: "Meesho", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-1", yearsOfExp: 1, city: "Bangalore", baseSalary: 1500000, bonus: 150000, stockValue: 300000, dataYear: 2024 },
  { company: "Meesho", role: "Software Engineer", roleCategory: "SOFTWARE_ENGINEERING", level: "SDE-2", yearsOfExp: 3, city: "Bangalore", baseSalary: 2700000, bonus: 320000, stockValue: 900000, dataYear: 2024 },
  { company: "Meesho", role: "Data Scientist", roleCategory: "DATA_SCIENCE", level: "SDE-2", yearsOfExp: 2, city: "Bangalore", baseSalary: 2400000, bonus: 280000, stockValue: 700000, dataYear: 2024 },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const c of companies) {
    await prisma.company.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: {
        name: c.name,
        slug: slugify(c.name),
        normalizedName: normalizeCompanyName(c.name),
        companyType: c.type,
        industry: c.industry,
      },
    });
  }
  console.log("✅ Companies created");

  await prisma.salaryEntry.deleteMany();

  for (const entry of salaryData) {
    const company = await prisma.company.findFirst({
      where: { name: entry.company },
    });
    if (!company) continue;

    const totalComp = entry.baseSalary + entry.bonus + entry.stockValue;
    const levelOrder = mapLevelToOrder(entry.level);

    await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        role: entry.role,
        roleCategory: entry.roleCategory,
        level: entry.level,
        levelOrder,
        yearsOfExp: entry.yearsOfExp,
        city: entry.city,
        baseSalary: entry.baseSalary,
        bonus: entry.bonus,
        stockValue: entry.stockValue,
        totalComp,
        dataYear: entry.dataYear,
        workMode: "HYBRID",
        isAnonymous: true,
      },
    });
  }
  console.log("✅ Salary entries created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });