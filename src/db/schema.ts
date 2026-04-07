import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

// ──────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const userRelations = relations(users, ({ many, one }) => ({
  resources: many(resources),
  xp: one(userXp),
  expertProfile: one(expertProfiles),
  resourceViews: many(resourceViews),
}));

// ──────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    color: text("color").default("#009BFF"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name), uniqueIndex("slug_idx").on(t.slug)]
);

export const categoryRelations = relations(categories, ({ many }) => ({
  resources: many(resources),
}));

// ──────────────────────────────────────────────
// RESOURCES (replaces videos)
// ──────────────────────────────────────────────

export const resourceType = pgEnum("resource_type", [
  "video",
  "doc",
  "tutorial",
  "tool",
  "template",
]);

export const resourceVisibility = pgEnum("resource_visibility", ["public", "private"]);

export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: resourceType("type").notNull().default("doc"),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  visibility: resourceVisibility("visibility").notNull().default("private"),
  xpValue: integer("xp_value").default(10).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  tags: text("tags").array(),
  authorId: text("author_id"),
  authorName: text("author_name"),
  authorImageUrl: text("author_image_url"),
  authorRole: text("author_role"),
  authorTeam: text("author_team"),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resourceInsertSchema = createInsertSchema(resources);
export const resourceUpdateSchema = createUpdateSchema(resources);
export const resourceSelectSchema = createSelectSchema(resources);

export const resourceRelations = relations(resources, ({ one, many }) => ({
  user: one(users, {
    fields: [resources.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [resources.categoryId],
    references: [categories.id],
  }),
  views: many(resourceViews),
}));

// ──────────────────────────────────────────────
// USER XP
// ──────────────────────────────────────────────

export const userXp = pgTable("user_xp", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  totalXp: integer("total_xp").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: date("last_active_date"),
  level: integer("level").default(1).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userXpRelations = relations(userXp, ({ one }) => ({
  user: one(users, {
    fields: [userXp.userId],
    references: [users.id],
  }),
}));

// ──────────────────────────────────────────────
// RESOURCE VIEWS
// ──────────────────────────────────────────────

export const resourceViews = pgTable("resource_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resourceId: uuid("resource_id")
    .references(() => resources.id, { onDelete: "cascade" })
    .notNull(),
  completedAt: timestamp("completed_at"),
  watchDurationSeconds: integer("watch_duration_seconds"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const resourceViewRelations = relations(resourceViews, ({ one }) => ({
  user: one(users, {
    fields: [resourceViews.userId],
    references: [users.id],
  }),
  resource: one(resources, {
    fields: [resourceViews.resourceId],
    references: [resources.id],
  }),
}));

// ──────────────────────────────────────────────
// EXPERT PROFILES
// ──────────────────────────────────────────────

export const expertProfiles = pgTable("expert_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  displayName: text("display_name").notNull(),
  role: text("role"),
  team: text("team"),
  skills: text("skills").array(),
  bio: text("bio"),
  resourceCount: integer("resource_count").default(0).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expertProfileRelations = relations(expertProfiles, ({ one }) => ({
  user: one(users, {
    fields: [expertProfiles.userId],
    references: [users.id],
  }),
}));

export const expertProfileInsertSchema = createInsertSchema(expertProfiles);
export const expertProfileUpdateSchema = createUpdateSchema(expertProfiles);
export const expertProfileSelectSchema = createSelectSchema(expertProfiles);

// ──────────────────────────────────────────────
// XP EVENTS (audit log for XP awards)
// ──────────────────────────────────────────────

export const xpEvents = pgTable("xp_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  eventType: text("event_type").notNull(), // "view" | "complete" | "submit" | "first_submit" | "streak"
  xpAwarded: integer("xp_awarded").notNull(),
  resourceId: uuid("resource_id").references(() => resources.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
