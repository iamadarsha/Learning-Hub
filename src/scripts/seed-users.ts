import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, userXp, expertProfiles } from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const demoUsers = [
  {
    clerkId: "demo_sarah",
    name: "Sarah Chen",
    imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJrNGhHZGhMN0RHR0hiMHVnZ3BlUjRWVk1tQS5qcGcifQ",
  },
  {
    clerkId: "demo_alex",
    name: "Alex Rivera",
    imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJrNGhHZGhMN0RHR0hiMHVnZ3BlUjRWVk1tQS5qcGcifQ",
  },
  {
    clerkId: "demo_priya",
    name: "Priya Sharma",
    imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJrNGhHZGhMN0RHR0hiMHVnZ3BlUjRWVk1tQS5qcGcifQ",
  },
  {
    clerkId: "demo_marcus",
    name: "Marcus Johnson",
    imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJrNGhHZGhMN0RHR0hiMHVnZ3BlUjRWVk1tQS5qcGcifQ",
  },
  {
    clerkId: "demo_emma",
    name: "Emma Wilson",
    imageUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJrNGhHZGhMN0RHR0hiMHVnZ3BlUjRWVk1tQS5qcGcifQ",
  },
];

const demoXP = [
  { clerkId: "demo_sarah", totalXp: 1250, streak: 12, level: 5 },
  { clerkId: "demo_alex", totalXp: 780, streak: 5, level: 4 },
  { clerkId: "demo_priya", totalXp: 520, streak: 8, level: 3 },
  { clerkId: "demo_marcus", totalXp: 340, streak: 3, level: 3 },
  { clerkId: "demo_emma", totalXp: 180, streak: 1, level: 2 },
];

const demoExperts = [
  {
    clerkId: "demo_sarah",
    displayName: "Sarah Chen",
    role: "Senior AI Engineer",
    team: "Engineering",
    skills: ["Claude", "n8n", "Python", "LLM Fine-tuning"],
    bio: "Building AI-powered automation at Pattern. 5+ years in ML.",
    resourceCount: 14,
    isVerified: true,
  },
  {
    clerkId: "demo_alex",
    displayName: "Alex Rivera",
    role: "Creative Director",
    team: "Creative",
    skills: ["Figma", "Brand Design", "Motion", "3D"],
    bio: "Leading Pattern's visual identity and design systems.",
    resourceCount: 9,
    isVerified: true,
  },
  {
    clerkId: "demo_priya",
    displayName: "Priya Sharma",
    role: "Data Analyst",
    team: "Data",
    skills: ["Looker", "SQL", "Python", "Dashboards"],
    bio: "Turning data into actionable insights for the eComm team.",
    resourceCount: 7,
    isVerified: false,
  },
  {
    clerkId: "demo_marcus",
    displayName: "Marcus Johnson",
    role: "Conversion Specialist",
    team: "Conversion",
    skills: ["Amazon PPC", "Listing Optimization", "A/B Testing"],
    bio: "Optimizing Amazon listings for Pattern's brand portfolio.",
    resourceCount: 5,
    isVerified: true,
  },
  {
    clerkId: "demo_emma",
    displayName: "Emma Wilson",
    role: "Product Manager",
    team: "Product",
    skills: ["Roadmapping", "User Research", "Agile", "Notion"],
    bio: "Shipping internal tools that make Pattern teams faster.",
    resourceCount: 3,
    isVerified: false,
  },
];

async function seed() {
  console.log("Seeding demo users...");

  // Insert users
  const insertedUsers = await db
    .insert(users)
    .values(demoUsers)
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedUsers.length} users`);

  // Get all users for ID mapping
  const allUsers = await db.select().from(users);
  const userMap = Object.fromEntries(allUsers.map((u) => [u.clerkId, u.id]));

  // Insert XP
  console.log("Seeding XP data...");
  for (const xp of demoXP) {
    const userId = userMap[xp.clerkId];
    if (!userId) continue;
    await db
      .insert(userXp)
      .values({
        userId,
        totalXp: xp.totalXp,
        streak: xp.streak,
        level: xp.level,
        lastActiveDate: new Date().toISOString().split("T")[0],
      })
      .onConflictDoNothing();
  }

  // Insert expert profiles
  console.log("Seeding expert profiles...");
  for (const expert of demoExperts) {
    const userId = userMap[expert.clerkId];
    if (!userId) continue;
    const { clerkId, ...data } = expert;
    await db
      .insert(expertProfiles)
      .values({ ...data, userId })
      .onConflictDoNothing();
  }

  // Update seeded resources to have real user IDs
  console.log("Linking seed resources to demo users...");
  const { resources: resourcesTable } = await import("../db/schema");
  const { eq } = await import("drizzle-orm");

  // Assign resources to different demo users
  const assignments = [
    { authorId: "seed_user", newClerkId: "demo_sarah" },
  ];
  for (const { authorId, newClerkId } of assignments) {
    const userId = userMap[newClerkId];
    if (!userId) continue;
    const user = allUsers.find((u) => u.clerkId === newClerkId);
    if (!user) continue;
    await db
      .update(resourcesTable)
      .set({
        userId,
        authorId: newClerkId,
        authorName: user.name,
        authorImageUrl: user.imageUrl,
      })
      .where(eq(resourcesTable.authorId, authorId));
  }

  console.log("Demo users seeded!");
  process.exit(0);
}

seed().catch(console.error);
