import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, serial, bigint, date, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(), // Using text instead of jsonb for compatibility
    expire: timestamp("expire").notNull(),
  }
);

// Users table for Replit Auth integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).notNull().default("tech"), // admin, tech - custom field for business logic
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer table - matching exact MySQL structure
export const customer = pgTable("customer", {
  custindex: serial("custindex").primaryKey(),
  cust_ID: integer("cust_ID"),
  has_gen: varchar("has_gen", { length: 10 }),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  type: varchar("type", { length: 30 }).notNull().default("generator"),
  Customer_Name: varchar("Customer_Name", { length: 100 }),
  first_name: varchar("first_name", { length: 30 }),
  last_name: varchar("last_name", { length: 30 }),
  Business: varchar("Business", { length: 60 }),
  Site_Address: varchar("Site_Address", { length: 200 }),
  s_address_1: varchar("s_address_1", { length: 50 }),
  s_address_2: varchar("s_address_2", { length: 50 }),
  s_city: varchar("s_city", { length: 50 }),
  s_state: varchar("s_state", { length: 50 }),
  s_zip: varchar("s_zip", { length: 50 }),
  s_country: varchar("s_country", { length: 50 }),
  miles: integer("miles").default(0),
  billing_same_site: varchar("billing_same_site", { length: 3 }),
  Billing_Address: varchar("Billing_Address", { length: 200 }),
  b_address_1: varchar("b_address_1", { length: 50 }),
  b_address_2: varchar("b_address_2", { length: 50 }),
  b_city: varchar("b_city", { length: 50 }),
  b_state: varchar("b_state", { length: 50 }),
  b_zip: varchar("b_zip", { length: 50 }),
  b_country: varchar("b_country", { length: 50 }),
  b_notes: text("b_notes"),
  Email: varchar("Email", { length: 100 }),
  Cell_Phone: varchar("Cell_Phone", { length: 14 }),
  Home_Phone: varchar("Home_Phone", { length: 14 }),
  Notes: varchar("Notes", { length: 2500 }),
  drive_admin: varchar("drive_admin", { length: 300 }).notNull().default("NEED admin link"),
  drive_field: varchar("drive_field", { length: 350 }).notNull().default("Need Field Link"),
  maint_agree: varchar("maint_agree", { length: 50 }).notNull().default("no"),
  list_as: varchar("list_as", { length: 100 }),
  site_name: varchar("site_name", { length: 200 }),
  site_contact: varchar("site_contact", { length: 50 }),
  sc_name: varchar("sc_name", { length: 200 }),
  sc_number: varchar("sc_number", { length: 200 }),
  sc_email: varchar("sc_email", { length: 200 }),
  cf_name: varchar("cf_name", { length: 200 }),
  cf_link: varchar("cf_link", { length: 350 }),
  cf2_name: varchar("cf2_name", { length: 250 }),
  cf2_link: varchar("cf2_link", { length: 300 }),
});

// Service calls table - matching exact MySQL structure
export const service_call = pgTable("service_call", {
  service_index: serial("service_index").primaryKey(),
  service_ID: bigint("service_ID", { mode: 'number' }).notNull(),
  order_status: varchar("order_status", { length: 30 }),
  repair_ID: varchar("repair_ID", { length: 20 }).default("no"),
  cust_ID: integer("cust_ID").notNull(),
  gen_ID: integer("gen_ID").notNull(),
  start_date: date("start_date"),
  start_time: varchar("start_time", { length: 30 }),
  end_date: varchar("end_date", { length: 20 }),
  end_time: varchar("end_time", { length: 30 }),
  l_start: varchar("l_start", { length: 25 }),
  l_end: varchar("l_end", { length: 25 }),
  close_time: varchar("close_time", { length: 35 }),
  onsite_labor: varchar("onsite_labor", { length: 25 }),
  travel_miles: integer("travel_miles"),
  service_order_type: varchar("service_order_type", { length: 25 }),
  run_hrs: integer("run_hrs"),
  work_performed: text("work_performed"),
  work_needed: text("work_needed").notNull().default("None"),
  gen_functioning: varchar("gen_functioning", { length: 5 }),
  rtn_to_site: varchar("rtn_to_site", { length: 5 }),
  reason_to_rtn: varchar("reason_to_rtn", { length: 2500 }).default("None"),
  est_time: integer("est_time").notNull().default(0),
  cust_aware: text("cust_aware"),
  notes_cust_aware: varchar("notes_cust_aware", { length: 1500 }),
  parts_needed: varchar("parts_needed", { length: 1250 }),
  gen_type: varchar("gen_type", { length: 10 }),
  assigned_tech: varchar("assigned_tech", { length: 30 }),
  complete_date: varchar("complete_date", { length: 30 }),
  field_complete: varchar("field_complete", { length: 25 }),
  office_complete: varchar("office_complete", { length: 25 }),
  support_called: varchar("support_called", { length: 4 }),
});

// Maintenance orders table - matching exact MySQL structure
export const maint = pgTable("maint", {
  maint_index: serial("maint_index").primaryKey(),
  maint_ID: bigint("maint_ID", { mode: 'number' }).notNull(),
  order_type: varchar("order_type", { length: 25 }).notNull().default("Maint"),
  cust_ID: integer("cust_ID").notNull(),
  gen_ID: integer("gen_ID").notNull(),
  start_date: varchar("start_date", { length: 20 }),
  start_time: varchar("start_time", { length: 30 }),
  end_date: varchar("end_date", { length: 20 }),
  end_time: varchar("end_time", { length: 30 }),
  l_start: varchar("l_start", { length: 25 }),
  l_end: varchar("l_end", { length: 25 }),
  close_time: varchar("close_time", { length: 35 }),
  onsite_labor: varchar("onsite_labor", { length: 25 }),
  travel_miles: integer("travel_miles"),
  maint_order_type: varchar("maint_order_type", { length: 25 }),
  run_hrs: integer("run_hrs"),
  work_performed: text("work_performed"),
  work_needed: text("work_needed").notNull().default("None"),
  gen_functioning: varchar("gen_functioning", { length: 5 }),
  rtn_to_site: varchar("rtn_to_site", { length: 5 }),
  reason_to_rtn: varchar("reason_to_rtn", { length: 2500 }).default("None"),
  est_time: integer("est_time").notNull().default(0),
  cust_aware: text("cust_aware"),
  notes_cust_aware: varchar("notes_cust_aware", { length: 1500 }),
  parts_needed: varchar("parts_needed", { length: 1250 }),
  gen_type: varchar("gen_type", { length: 10 }),
  assigned_tech: varchar("assigned_tech", { length: 30 }),
  complete_date: varchar("complete_date", { length: 30 }),
  field_complete: varchar("field_complete", { length: 25 }),
  office_complete: varchar("office_complete", { length: 25 }),
  support_called: varchar("support_called", { length: 4 }),
});

// Parts table - matching exact MySQL structure
export const parts = pgTable("parts", {
  partindex: serial("partindex").primaryKey(),
  part_ID: integer("part_ID").notNull(),
  cust_ID: varchar("cust_ID", { length: 25 }),
  service_ID: varchar("service_ID", { length: 25 }),
  maint_ID: varchar("maint_ID", { length: 50 }),
  tech_requesting: varchar("tech_requesting", { length: 50 }).notNull().default("Need"),
  part_num: varchar("part_num", { length: 125 }),
  manu: varchar("manu", { length: 125 }),
  req_date: varchar("req_date", { length: 45 }).notNull().default("empty"),
  order_date: varchar("order_date", { length: 25 }),
  order_processed: varchar("order_processed", { length: 65 }).notNull().default("Not Ordered"),
  ship_date: varchar("ship_date", { length: 25 }),
  po_num: varchar("po_num", { length: 30 }),
  manu_order_num: varchar("manu_order_num", { length: 50 }),
  del_date: varchar("del_date", { length: 30 }),
  qty: integer("qty"),
  tracking_num: varchar("tracking_num", { length: 30 }),
  ship_co: varchar("ship_co", { length: 30 }),
  part_notes: varchar("part_notes", { length: 2500 }).notNull().default("No Notes"),
  order_complete: varchar("order_complete", { length: 25 }).default("Open"),
  est_repair: varchar("est_repair", { length: 2500 }),
  repair_notes: varchar("repair_notes", { length: 2500 }),
  part_cost: varchar("part_cost", { length: 55 }).notNull(),
  part_msrp: varchar("part_msrp", { length: 55 }).notNull(),
  ship_cost: varchar("ship_cost", { length: 55 }).notNull(),
  est_needed: varchar("est_needed", { length: 55 }),
  office_note: varchar("office_note", { length: 2500 }),
});

// Quotes table - matching exact MySQL structure
// Updated quotes table matching current database structure
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quote_id: varchar("quote_id", { length: 50 }),
  customer_id: integer("customer_id"),
  description: text("description"),
  quote_amount: varchar("quote_amount", { length: 50 }),
  quote_status: varchar("quote_status", { length: 30 }).default("open"),
  field_comp_date: timestamp("field_comp_date"),
  valid_until: timestamp("valid_until"),
  equipment_info: text("equipment_info"),
  labor_estimate: varchar("labor_estimate", { length: 50 }),
  material_estimate: varchar("material_estimate", { length: 50 }),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  // Quote-to-Install conversion tracking
  converted_to_install: boolean("converted_to_install").default(false),
  install_order_id: integer("install_order_id"),
  approval_date: timestamp("approval_date"),
  approved_by: varchar("approved_by", { length: 255 }),
});

// Install Orders table - Core workflow for converting quotes to installations
export const installOrders = pgTable("install_orders", {
  id: serial("id").primaryKey(),
  quote_id: integer("quote_id"),
  order_number: varchar("order_number", { length: 50 }).unique().notNull(),
  customer_id: integer("customer_id").notNull(),
  status: varchar("status", { length: 30 }).default("pending"),
  scheduled_date: date("scheduled_date"),
  estimated_completion: date("estimated_completion"),
  assigned_technician: varchar("assigned_technician", { length: 100 }),
  assigned_crew: text("assigned_crew"), // JSON array of technician IDs
  install_type: varchar("install_type", { length: 50 }), // 'new_install', 'replacement', 'upgrade'
  generator_info: jsonb("generator_info"), // Equipment details from quote
  installation_notes: text("installation_notes"),
  material_cost: real("material_cost"),
  labor_cost: real("labor_cost"),
  total_cost: real("total_cost"),
  deposit_amount: real("deposit_amount"),
  balance_due: real("balance_due"),
  permit_info: text("permit_info"),
  inspection_required: boolean("inspection_required").default(true),
  inspection_date: date("inspection_date"),
  completion_date: date("completion_date"),
  customer_signature_url: varchar("customer_signature_url", { length: 500 }),
  final_inspection_notes: text("final_inspection_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  created_by: varchar("created_by", { length: 255 }),
  approved_by: varchar("approved_by", { length: 255 }),
});

// Install Order Timeline - Track installation progress through stages
export const installOrderTimeline = pgTable("install_order_timeline", {
  id: serial("id").primaryKey(),
  install_order_id: integer("install_order_id"),
  stage: varchar("stage", { length: 50 }).notNull(), // 'quote_approved', 'materials_ordered', 'scheduled', 'in_progress', 'inspection', 'completed'
  status: varchar("status", { length: 30 }).notNull(), // 'pending', 'in_progress', 'completed', 'blocked'
  notes: text("notes"),
  scheduled_date: date("scheduled_date"),
  completed_date: date("completed_date"),
  completed_by: varchar("completed_by", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});

// Zod schemas for quotes and install orders
export const insertQuoteSchema = createInsertSchema(quotes).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type SelectQuote = typeof quotes.$inferSelect;

export const insertInstallOrderSchema = createInsertSchema(installOrders).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertInstallOrder = z.infer<typeof insertInstallOrderSchema>;
export type SelectInstallOrder = typeof installOrders.$inferSelect;

export const insertInstallTimelineSchema = createInsertSchema(installOrderTimeline).omit({ 
  id: true, 
  created_at: true 
});
export type InsertInstallTimeline = z.infer<typeof insertInstallTimelineSchema>;
export type SelectInstallTimeline = typeof installOrderTimeline.$inferSelect;

// ============== CUSTOMER LIFECYCLE MANAGEMENT SYSTEM ==============
// Complete tracking: Lead → Quote → Install → Maintenance → Removal

// Customer Lifecycle Stages - Master record for tracking complete journey
export const customerLifecycle = pgTable("customer_lifecycle", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").notNull(),
  current_stage: varchar("current_stage", { length: 50 }).default("lead"), // 'lead', 'quote', 'install', 'active', 'maintenance', 'removal'
  lead_date: date("lead_date"),
  quote_date: date("quote_date"), 
  install_date: date("install_date"),
  activation_date: date("activation_date"),
  first_maintenance_date: date("first_maintenance_date"),
  removal_scheduled_date: date("removal_scheduled_date"), // For 7-10 year lifecycle
  removal_date: date("removal_date"),
  lifecycle_notes: text("lifecycle_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Install Inventory Tracking - Track parts used during installation
export const installInventory = pgTable("install_inventory", {
  id: serial("id").primaryKey(),
  install_order_id: integer("install_order_id"),
  part_number: varchar("part_number", { length: 100 }).notNull(),
  part_name: varchar("part_name", { length: 255 }).notNull(),
  quantity_used: integer("quantity_used").notNull(),
  unit_cost: real("unit_cost"),
  total_cost: real("total_cost"),
  supplier: varchar("supplier", { length: 100 }),
  warranty_info: text("warranty_info"),
  installation_notes: text("installation_notes"),
  installed_by: varchar("installed_by", { length: 255 }),
  installed_at: timestamp("installed_at").defaultNow(),
});

// Installation Checklist - Ensure all necessary steps completed
export const installationChecklist = pgTable("installation_checklist", {
  id: serial("id").primaryKey(),
  install_order_id: integer("install_order_id"),
  checklist_category: varchar("checklist_category", { length: 50 }).notNull(), // 'pre_install', 'electrical', 'mechanical', 'testing', 'final'
  step_name: varchar("step_name", { length: 255 }).notNull(),
  step_description: text("step_description"),
  is_required: boolean("is_required").default(true),
  is_completed: boolean("is_completed").default(false),
  completed_by: varchar("completed_by", { length: 255 }),
  completed_at: timestamp("completed_at"),
  notes: text("notes"),
  photo_urls: text("photo_urls"), // JSON array of image URLs
  created_at: timestamp("created_at").defaultNow(),
});

// Generator Equipment Lifecycle - Track installed equipment through entire lifecycle
export const equipmentLifecycle = pgTable("equipment_lifecycle", {
  id: serial("id").primaryKey(),
  customer_id: integer("customer_id").notNull(),
  generator_serial: varchar("generator_serial", { length: 100 }).unique(),
  manufacturer: varchar("manufacturer", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  fuel_type: varchar("fuel_type", { length: 50 }),
  power_rating: varchar("power_rating", { length: 50 }),
  install_date: date("install_date"),
  warranty_start: date("warranty_start"),
  warranty_end: date("warranty_end"),
  last_maintenance: date("last_maintenance"),
  next_maintenance_due: date("next_maintenance_due"),
  maintenance_interval_months: integer("maintenance_interval_months").default(12),
  total_runtime_hours: integer("total_runtime_hours").default(0),
  status: varchar("status", { length: 50 }).default("active"), // 'active', 'needs_service', 'scheduled_removal', 'removed'
  removal_reason: varchar("removal_reason", { length: 100 }), // 'end_of_life', 'upgrade', 'customer_request'
  estimated_removal_date: date("estimated_removal_date"), // 7-10 years from install
  removal_value_estimate: real("removal_value_estimate"),
  replacement_recommended: boolean("replacement_recommended").default(false),
  equipment_notes: text("equipment_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Maintenance History with Parts Tracking
export const maintenanceHistory = pgTable("maintenance_history", {
  id: serial("id").primaryKey(),
  equipment_id: integer("equipment_id"),
  customer_id: integer("customer_id").notNull(),
  maintenance_type: varchar("maintenance_type", { length: 50 }).notNull(), // 'routine', 'emergency', 'warranty', 'inspection'
  service_date: date("service_date").notNull(),
  technician_id: varchar("technician_id", { length: 255 }),
  runtime_hours: integer("runtime_hours"),
  work_performed: text("work_performed"),
  issues_found: text("issues_found"),
  recommendations: text("recommendations"),
  next_service_due: date("next_service_due"),
  labor_cost: real("labor_cost"),
  parts_cost: real("parts_cost"),
  total_cost: real("total_cost"),
  customer_signature_url: varchar("customer_signature_url", { length: 500 }),
  service_notes: text("service_notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Parts Used in Maintenance
export const maintenanceParts = pgTable("maintenance_parts", {
  id: serial("id").primaryKey(),
  maintenance_id: integer("maintenance_id"),
  part_number: varchar("part_number", { length: 100 }).notNull(),
  part_name: varchar("part_name", { length: 255 }).notNull(),
  quantity_used: integer("quantity_used").notNull(),
  unit_cost: real("unit_cost"),
  total_cost: real("total_cost"),
  supplier: varchar("supplier", { length: 100 }),
  warranty_months: integer("warranty_months"),
  part_condition: varchar("part_condition", { length: 50 }), // 'new', 'refurbished', 'warranty_replacement'
  installation_notes: text("installation_notes"),
});

// Lead Management - Track prospects before they become quotes
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  lead_source: varchar("lead_source", { length: 100 }), // 'website', 'referral', 'advertising', 'cold_call'
  contact_name: varchar("contact_name", { length: 255 }).notNull(),
  company_name: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  property_type: varchar("property_type", { length: 50 }), // 'residential', 'commercial', 'industrial'
  generator_interest: varchar("generator_interest", { length: 100 }), // 'standby', 'portable', 'commercial'
  estimated_budget: real("estimated_budget"),
  urgency: varchar("urgency", { length: 50 }), // 'immediate', 'within_month', 'within_quarter', 'research'
  lead_notes: text("lead_notes"),
  assigned_to: varchar("assigned_to", { length: 255 }),
  status: varchar("status", { length: 50 }).default("new"), // 'new', 'contacted', 'quoted', 'lost', 'converted'
  converted_to_quote_id: integer("converted_to_quote_id"),
  last_contact_date: date("last_contact_date"),
  next_follow_up: date("next_follow_up"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ============== EMPLOYEE TIME TRACKING & CERTIFICATION SYSTEM ==============
// Comprehensive tracking: Login → Travel → Onsite → Paperwork → Support → Certifications

// Employee Time Entries - Core time tracking for all activities
export const employeeTimeEntries = pgTable("employee_time_entries", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  work_date: date("work_date").notNull(),
  entry_type: varchar("entry_type", { length: 50 }).notNull(), // 'clock_in', 'clock_out', 'travel', 'onsite', 'paperwork', 'support_call', 'break'
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time"),
  duration_minutes: integer("duration_minutes"),
  location: text("location"), // GPS coordinates or address
  customer_id: integer("customer_id"), // For onsite work
  service_call_id: integer("service_call_id"), // Link to specific service call
  install_order_id: integer("install_order_id"), // Link to installation
  travel_from: text("travel_from"),
  travel_to: text("travel_to"),
  travel_miles: real("travel_miles"),
  activity_description: text("activity_description"),
  notes: text("notes"),
  is_billable: boolean("is_billable").default(true),
  hourly_rate: real("hourly_rate"),
  overtime_multiplier: real("overtime_multiplier").default(1.0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Daily Time Summaries - Aggregated daily totals for payroll
export const dailyTimeSummaries = pgTable("daily_time_summaries", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  work_date: date("work_date").notNull(),
  clock_in_time: timestamp("clock_in_time"),
  clock_out_time: timestamp("clock_out_time"),
  total_hours: real("total_hours").default(0),
  travel_hours: real("travel_hours").default(0),
  onsite_hours: real("onsite_hours").default(0),
  paperwork_hours: real("paperwork_hours").default(0),
  support_hours: real("support_hours").default(0),
  break_hours: real("break_hours").default(0),
  overtime_hours: real("overtime_hours").default(0),
  billable_hours: real("billable_hours").default(0),
  total_miles: real("total_miles").default(0),
  gross_pay: real("gross_pay").default(0),
  status: varchar("status", { length: 30 }).default("active"), // 'active', 'submitted', 'approved', 'paid'
  submitted_at: timestamp("submitted_at"),
  approved_by: varchar("approved_by", { length: 255 }),
  approved_at: timestamp("approved_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Support Call Tracking - Track time spent with manufacturer support
export const supportCallTracking = pgTable("support_call_tracking", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  customer_id: integer("customer_id"),
  service_call_id: integer("service_call_id"),
  manufacturer: varchar("manufacturer", { length: 100 }).notNull(), // 'Generac', 'Kohler', 'Cummins', 'Caterpillar'
  support_type: varchar("support_type", { length: 50 }).notNull(), // 'technical', 'warranty', 'parts', 'training'
  issue_description: text("issue_description"),
  support_ticket_number: varchar("support_ticket_number", { length: 100 }),
  call_start: timestamp("call_start").notNull(),
  call_end: timestamp("call_end"),
  duration_minutes: integer("duration_minutes"),
  resolution_status: varchar("resolution_status", { length: 50 }), // 'resolved', 'escalated', 'pending', 'follow_up_needed'
  resolution_notes: text("resolution_notes"),
  follow_up_required: boolean("follow_up_required").default(false),
  follow_up_date: date("follow_up_date"),
  created_at: timestamp("created_at").defaultNow(),
});

// Manufacturer Certifications - Track technician certifications
export const manufacturerCertifications = pgTable("manufacturer_certifications", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 100 }).notNull(), // 'Generac', 'Kohler', 'Cummins', 'Caterpillar'
  certification_type: varchar("certification_type", { length: 100 }).notNull(), // 'installation', 'service', 'warranty', 'advanced'
  certification_level: varchar("certification_level", { length: 50 }), // 'basic', 'intermediate', 'advanced', 'master'
  certificate_number: varchar("certificate_number", { length: 100 }),
  issue_date: date("issue_date").notNull(),
  expiration_date: date("expiration_date"),
  renewal_required: boolean("renewal_required").default(true),
  renewal_reminder_date: date("renewal_reminder_date"),
  training_location: varchar("training_location", { length: 255 }),
  instructor_name: varchar("instructor_name", { length: 255 }),
  certificate_url: varchar("certificate_url", { length: 500 }), // Link to digital certificate
  status: varchar("status", { length: 30 }).default("active"), // 'active', 'expired', 'suspended', 'revoked'
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Employee Skills Matrix - Track capabilities and authorizations
export const employeeSkills = pgTable("employee_skills", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  skill_category: varchar("skill_category", { length: 50 }).notNull(), // 'electrical', 'mechanical', 'plumbing', 'concrete'
  skill_name: varchar("skill_name", { length: 100 }).notNull(),
  proficiency_level: varchar("proficiency_level", { length: 30 }).notNull(), // 'novice', 'intermediate', 'expert', 'master'
  authorized_for_solo_work: boolean("authorized_for_solo_work").default(false),
  requires_supervision: boolean("requires_supervision").default(true),
  date_acquired: date("date_acquired").notNull(),
  verified_by: varchar("verified_by", { length: 255 }),
  verification_date: date("verification_date"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Employee Location Tracking - GPS tracking for field work
export const employeeLocationHistory = pgTable("employee_location_history", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy_meters: real("accuracy_meters"),
  address: text("address"),
  activity_type: varchar("activity_type", { length: 50 }), // 'traveling', 'onsite', 'office', 'warehouse'
  customer_id: integer("customer_id"),
  service_call_id: integer("service_call_id"),
  speed_mph: real("speed_mph"),
  heading_degrees: real("heading_degrees"),
  created_at: timestamp("created_at").defaultNow(),
});

// Paperwork Time Tracking - Track administrative work
export const paperworkTracking = pgTable("paperwork_tracking", {
  id: serial("id").primaryKey(),
  employee_id: varchar("employee_id", { length: 255 }).notNull(),
  paperwork_type: varchar("paperwork_type", { length: 50 }).notNull(), // 'service_report', 'time_sheet', 'expense_report', 'inspection_form'
  customer_id: integer("customer_id"),
  service_call_id: integer("service_call_id"),
  install_order_id: integer("install_order_id"),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time"),
  duration_minutes: integer("duration_minutes"),
  form_name: varchar("form_name", { length: 255 }),
  completion_status: varchar("completion_status", { length: 30 }).default("in_progress"), // 'in_progress', 'completed', 'submitted', 'approved'
  digital_form_url: varchar("digital_form_url", { length: 500 }),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Messages table - matching exact MySQL structure
export const messages = pgTable("messages", {
  taskindex: serial("taskindex").primaryKey(),
  task_ID: bigint("task_ID", { mode: 'number' }).notNull(),
  reply_ID: varchar("reply_ID", { length: 20 }),
  reply_note: varchar("reply_note", { length: 2500 }),
  cust_ID: varchar("cust_ID", { length: 20 }),
  date_posted: varchar("date_posted", { length: 20 }).default(sql`CURRENT_TIMESTAMP`),
  date_made: varchar("date_made", { length: 25 }),
  date_due: varchar("date_due", { length: 25 }),
  task_type: varchar("task_type", { length: 50 }),
  author: varchar("author", { length: 40 }),
  brian: varchar("brian", { length: 30 }).notNull().default("no"),
  jean: varchar("jean", { length: 30 }).notNull().default("no"),
  jeremy: varchar("jeremy", { length: 30 }).notNull().default("no"),
  brandon: varchar("brandon", { length: 30 }).notNull().default("no"),
  subject: varchar("subject", { length: 30 }),
  task_det: varchar("task_det", { length: 3500 }),
  follow_up: varchar("follow_up", { length: 50 }),
  assign_to: varchar("assign_to", { length: 150 }),
  archive: varchar("archive", { length: 20 }),
  acknowledge: varchar("acknowledge", { length: 20 }),
  date_ack: varchar("date_ack", { length: 25 }),
});

// Tasks table - matching exact MySQL structure
export const tasks = pgTable("tasks", {
  taskindex: serial("taskindex").primaryKey(),
  task_ID: bigint("task_ID", { mode: 'number' }).notNull(),
  reply_ID: varchar("reply_ID", { length: 20 }),
  reply_note: varchar("reply_note", { length: 2500 }),
  cust_ID: varchar("cust_ID", { length: 20 }),
  date_posted: varchar("date_posted", { length: 20 }).default(sql`CURRENT_TIMESTAMP`),
  date_made: varchar("date_made", { length: 25 }),
  date_due: varchar("date_due", { length: 25 }),
  task_type: varchar("task_type", { length: 50 }),
  author: varchar("author", { length: 40 }),
  brian: varchar("brian", { length: 30 }).notNull().default("no"),
  jean: varchar("jean", { length: 30 }).notNull().default("no"),
  jeremy: varchar("jeremy", { length: 30 }).notNull().default("no"),
  brandon: varchar("brandon", { length: 30 }).notNull().default("no"),
  subject: varchar("subject", { length: 30 }),
  task_det: varchar("task_det", { length: 3500 }),
  follow_up: varchar("follow_up", { length: 50 }),
  assign_to: varchar("assign_to", { length: 150 }),
  archive: varchar("archive", { length: 20 }),
  acknowledge: varchar("acknowledge", { length: 20 }),
  date_ack: varchar("date_ack", { length: 25 }),
});

// Announcements table - matching exact MySQL structure
export const announcements = pgTable("announcements", {
  taskindex: serial("taskindex").primaryKey(),
  task_ID: bigint("task_ID", { mode: 'number' }).notNull(),
  reply_ID: varchar("reply_ID", { length: 20 }),
  reply_note: varchar("reply_note", { length: 2500 }),
  cust_ID: varchar("cust_ID", { length: 20 }),
  date_posted: varchar("date_posted", { length: 20 }).default(sql`CURRENT_TIMESTAMP`),
  date_made: varchar("date_made", { length: 25 }),
  date_due: varchar("date_due", { length: 25 }),
  task_type: varchar("task_type", { length: 50 }),
  author: varchar("author", { length: 40 }),
  brian: varchar("brian", { length: 30 }).notNull().default("no"),
  jean: varchar("jean", { length: 30 }).notNull().default("no"),
  jeremy: varchar("jeremy", { length: 30 }).notNull().default("no"),
  brandon: varchar("brandon", { length: 30 }).notNull().default("no"),
  subject: varchar("subject", { length: 30 }),
  task_det: varchar("task_det", { length: 3500 }),
  follow_up: varchar("follow_up", { length: 50 }),
  assign_to: varchar("assign_to", { length: 150 }),
  archive: varchar("archive", { length: 20 }),
  acknowledge: varchar("acknowledge", { length: 20 }),
  date_ack: varchar("date_ack", { length: 25 }),
});

// Generator table - matching exact MySQL structure
export const generator = pgTable("generator", {
  genindex: serial("genindex").primaryKey(),
  gen_ID: integer("gen_ID"),
  gen_status: varchar("gen_status", { length: 30 }).notNull().default("active"),
  cust_ID: integer("cust_ID"),
  survey_index: integer("survey_index"),
  make_brand: varchar("make_brand", { length: 50 }),
  other_brand: varchar("other_brand", { length: 13 }),
  model_spec: varchar("model_spec", { length: 30 }),
  fuel_type: varchar("fuel_type", { length: 30 }),
  gen_power: varchar("gen_power", { length: 30 }),
  gen_installed: varchar("gen_installed", { length: 30 }),
  gen_maint: varchar("gen_maint", { length: 30 }),
  ts_size: varchar("ts_size", { length: 30 }),
  ts_brand: varchar("ts_brand", { length: 30 }),
  gen_notes: text("gen_notes"),
});

// Relations based on foreign keys in MySQL
export const customerRelations = relations(customer, ({ many }) => ({
  serviceCalls: many(service_call),
  maintenance: many(maint),
  parts: many(parts),
  quotes: many(quotes),
  generators: many(generator),
}));

export const serviceCallRelations = relations(service_call, ({ one }) => ({
  customer: one(customer, {
    fields: [service_call.cust_ID],
    references: [customer.cust_ID],
  }),
  generator: one(generator, {
    fields: [service_call.gen_ID],
    references: [generator.gen_ID],
  }),
}));

export const maintRelations = relations(maint, ({ one }) => ({
  customer: one(customer, {
    fields: [maint.cust_ID],
    references: [customer.cust_ID],
  }),
  generator: one(generator, {
    fields: [maint.gen_ID],
    references: [generator.gen_ID],
  }),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  customer: one(customer, {
    fields: [quotes.customer_id],
    references: [customer.custindex],
  }),
}));

export const generatorRelations = relations(generator, ({ one, many }) => ({
  customer: one(customer, {
    fields: [generator.cust_ID],
    references: [customer.cust_ID],
  }),
  serviceCalls: many(service_call),
  maintenance: many(maint),
}));

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertCustomerSchema = createInsertSchema(customer).omit({
  custindex: true,
});

export const insertServiceCallSchema = createInsertSchema(service_call).omit({
  service_index: true,
});

export const insertMaintenanceSchema = createInsertSchema(maint).omit({
  maint_index: true,
});

export const insertPartsSchema = createInsertSchema(parts).omit({
  partindex: true,
});

export const insertLegacyQuoteSchema = createInsertSchema(quotes).omit({
  quoteindex: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  taskindex: true,
  date_posted: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  taskindex: true,
  date_posted: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  taskindex: true,
  date_posted: true,
});

export const insertGeneratorSchema = createInsertSchema(generator).omit({
  genindex: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Customer = typeof customer.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type ServiceCall = typeof service_call.$inferSelect;
export type InsertServiceCall = z.infer<typeof insertServiceCallSchema>;

export type Maintenance = typeof maint.$inferSelect;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;

export type Parts = typeof parts.$inferSelect;
export type InsertParts = z.infer<typeof insertPartsSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertLegacyQuote = z.infer<typeof insertLegacyQuoteSchema>;

// ============== ALL ZOD SCHEMAS (defined after tables to avoid initialization errors) ==============

// Customer Lifecycle Management Schemas
export const insertCustomerLifecycleSchema = createInsertSchema(customerLifecycle).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertCustomerLifecycle = z.infer<typeof insertCustomerLifecycleSchema>;
export type SelectCustomerLifecycle = typeof customerLifecycle.$inferSelect;

export const insertInstallInventorySchema = createInsertSchema(installInventory).omit({ 
  id: true, 
  installed_at: true 
});
export type InsertInstallInventory = z.infer<typeof insertInstallInventorySchema>;
export type SelectInstallInventory = typeof installInventory.$inferSelect;

export const insertInstallationChecklistSchema = createInsertSchema(installationChecklist).omit({ 
  id: true, 
  created_at: true 
});
export type InsertInstallationChecklist = z.infer<typeof insertInstallationChecklistSchema>;
export type SelectInstallationChecklist = typeof installationChecklist.$inferSelect;

export const insertEquipmentLifecycleSchema = createInsertSchema(equipmentLifecycle).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertEquipmentLifecycle = z.infer<typeof insertEquipmentLifecycleSchema>;
export type SelectEquipmentLifecycle = typeof equipmentLifecycle.$inferSelect;

export const insertMaintenanceHistorySchema = createInsertSchema(maintenanceHistory).omit({ 
  id: true, 
  created_at: true 
});
export type InsertMaintenanceHistory = z.infer<typeof insertMaintenanceHistorySchema>;
export type SelectMaintenanceHistory = typeof maintenanceHistory.$inferSelect;

export const insertMaintenancePartsSchema = createInsertSchema(maintenanceParts).omit({ 
  id: true 
});
export type InsertMaintenanceParts = z.infer<typeof insertMaintenancePartsSchema>;
export type SelectMaintenanceParts = typeof maintenanceParts.$inferSelect;

export const insertLeadSchema = createInsertSchema(leads).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type SelectLead = typeof leads.$inferSelect;

// Employee Time Tracking & Certification Schemas
export const insertEmployeeTimeEntrySchema = createInsertSchema(employeeTimeEntries).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertEmployeeTimeEntry = z.infer<typeof insertEmployeeTimeEntrySchema>;
export type SelectEmployeeTimeEntry = typeof employeeTimeEntries.$inferSelect;

export const insertDailyTimeSummarySchema = createInsertSchema(dailyTimeSummaries).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertDailyTimeSummary = z.infer<typeof insertDailyTimeSummarySchema>;
export type SelectDailyTimeSummary = typeof dailyTimeSummaries.$inferSelect;

export const insertSupportCallTrackingSchema = createInsertSchema(supportCallTracking).omit({ 
  id: true, 
  created_at: true 
});
export type InsertSupportCallTracking = z.infer<typeof insertSupportCallTrackingSchema>;
export type SelectSupportCallTracking = typeof supportCallTracking.$inferSelect;

export const insertManufacturerCertificationSchema = createInsertSchema(manufacturerCertifications).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});
export type InsertManufacturerCertification = z.infer<typeof insertManufacturerCertificationSchema>;
export type SelectManufacturerCertification = typeof manufacturerCertifications.$inferSelect;

export const insertEmployeeSkillSchema = createInsertSchema(employeeSkills).omit({ 
  id: true, 
  created_at: true 
});
export type InsertEmployeeSkill = z.infer<typeof insertEmployeeSkillSchema>;
export type SelectEmployeeSkill = typeof employeeSkills.$inferSelect;

export const insertEmployeeLocationHistorySchema = createInsertSchema(employeeLocationHistory).omit({ 
  id: true, 
  created_at: true 
});
export type InsertEmployeeLocationHistory = z.infer<typeof insertEmployeeLocationHistorySchema>;
export type SelectEmployeeLocationHistory = typeof employeeLocationHistory.$inferSelect;

export const insertPaperworkTrackingSchema = createInsertSchema(paperworkTracking).omit({ 
  id: true, 
  created_at: true 
});
export type InsertPaperworkTracking = z.infer<typeof insertPaperworkTrackingSchema>;
export type SelectPaperworkTracking = typeof paperworkTracking.$inferSelect;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Generator = typeof generator.$inferSelect;
export type InsertGenerator = z.infer<typeof insertGeneratorSchema>;

// New tables for Remote Monitoring System

// User addons subscription table
export const userAddons = pgTable("user_addons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  addonType: varchar("addon_type", { length: 50 }).notNull(),
  enabled: boolean("enabled").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  pricingTier: varchar("pricing_tier", { length: 20 }).notNull(),
  monthlyPrice: real("monthly_price").notNull(),
  setupFee: real("setup_fee").default(0),
});

// Generator monitoring data table
export const generatorMonitoringData = pgTable("generator_monitoring_data", {
  id: serial("id").primaryKey(),
  generatorId: varchar("generator_id", { length: 50 }).notNull(),
  customerId: integer("customer_id").notNull(),
  provider: varchar("provider", { length: 30 }).notNull(), // watchlink, generac, kohler, etc.
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: varchar("status", { length: 30 }).notNull(),
  
  // Core monitoring metrics
  fuelLevel: real("fuel_level"),
  batteryVoltage: real("battery_voltage"),
  engineTemperature: real("engine_temperature"),
  oilPressure: real("oil_pressure"),
  engineHours: real("engine_hours"),
  exerciseHours: real("exercise_hours"),
  
  // Power metrics  
  voltageL1: real("voltage_l1"),
  voltageL2: real("voltage_l2"),
  voltageL3: real("voltage_l3"),
  frequency: real("frequency"),
  powerOutput: real("power_output"),
  loadPercentage: real("load_percentage"),
  
  // Environmental
  ambientTemperature: real("ambient_temperature"),
  humidity: real("humidity"),
  
  // Status flags
  isOnUtilityPower: boolean("is_on_utility_power"),
  isOnGeneratorPower: boolean("is_on_generator_power"),
  isExercising: boolean("is_exercising"),
  hasActiveAlarms: boolean("has_active_alarms"),
  lastCommunication: timestamp("last_communication"),
  
  // Provider-specific data
  providerData: jsonb("provider_data"),
});

// Monitoring alerts table
export const monitoringAlerts = pgTable("monitoring_alerts", {
  id: serial("id").primaryKey(),
  generatorId: varchar("generator_id", { length: 50 }).notNull(),
  customerId: integer("customer_id").notNull(),
  provider: varchar("provider", { length: 30 }).notNull(),
  alertType: varchar("alert_type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: varchar("acknowledged_by", { length: 100 }),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by", { length: 100 }),
  
  // Threshold information
  thresholdValue: real("threshold_value"),
  actualValue: real("actual_value"),
  unit: varchar("unit", { length: 20 }),
  
  // Actions taken
  serviceOrderCreated: integer("service_order_created"), // Links to service_call.service_index
  notificationsSent: text("notifications_sent"), // JSON array of notification methods
  
  // Provider-specific alert data
  providerAlertId: varchar("provider_alert_id", { length: 100 }),
  providerData: jsonb("provider_data"),
});

// Alert thresholds configuration table
export const alertThresholds = pgTable("alert_thresholds", {
  id: serial("id").primaryKey(),
  generatorId: varchar("generator_id", { length: 50 }).notNull(),
  alertType: varchar("alert_type", { length: 50 }).notNull(),
  enabled: boolean("enabled").notNull().default(true),
  
  // Threshold configuration
  lowWarning: real("low_warning"),
  lowCritical: real("low_critical"),
  highWarning: real("high_warning"),
  highCritical: real("high_critical"),
  
  // Action configuration
  createServiceOrder: boolean("create_service_order").default(false),
  notifyCustomer: boolean("notify_customer").default(false),
  notifyTechnicians: boolean("notify_technicians").default(true),
  emailRecipients: text("email_recipients"), // JSON array
  smsRecipients: text("sms_recipients"), // JSON array
  
  // Timing configuration
  delayMinutes: integer("delay_minutes").default(0),
  repeatIntervalMinutes: integer("repeat_interval_minutes").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Monitoring provider configurations
export const monitoringProviders = pgTable("monitoring_providers", {
  id: serial("id").primaryKey(),
  providerId: varchar("provider_id", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  apiEndpoint: varchar("api_endpoint", { length: 200 }),
  requiresApiKey: boolean("requires_api_key").notNull().default(true),
  apiKeyConfigured: boolean("api_key_configured").notNull().default(false),
  supportedGeneratorModels: text("supported_generator_models"), // JSON array
  supportedMetrics: text("supported_metrics"), // JSON array
  pollingIntervalSeconds: integer("polling_interval_seconds").notNull().default(300),
  maxHistoryDays: integer("max_history_days").notNull().default(90),
  enabled: boolean("enabled").notNull().default(true),
  lastPolled: timestamp("last_polled"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer portal authentication and access
export const customerPortalUsers = pgTable("customer_portal_users", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 30 }).notNull().default("primary"), // primary, secondary, billing, maintenance
  
  // Access permissions
  canViewMonitoring: boolean("can_view_monitoring").notNull().default(true),
  canViewServiceHistory: boolean("can_view_service_history").notNull().default(true),
  canRequestService: boolean("can_request_service").notNull().default(true),
  canViewInvoices: boolean("can_view_invoices").notNull().default(false),
  canScheduleAppointments: boolean("can_schedule_appointments").notNull().default(false),
  
  // Security
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  
  // Notifications preferences
  emailNotifications: boolean("email_notifications").notNull().default(true),
  smsNotifications: boolean("sms_notifications").notNull().default(false),
  alertNotifications: boolean("alert_notifications").notNull().default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer portal sessions
export const customerPortalSessions = pgTable("customer_portal_sessions", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").notNull(),
  customerId: integer("customer_id").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer portal activity log
export const customerPortalActivity = pgTable("customer_portal_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  customerId: integer("customer_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  resourceId: varchar("resource_id", { length: 50 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Scheduling system tables
export const technicianSchedules = pgTable("technician_schedules", {
  id: serial("id").primaryKey(),
  technicianId: varchar("technician_id", { length: 50 }).notNull(),
  date: date("date").notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM
  endTime: varchar("end_time", { length: 5 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  currentLocation: jsonb("current_location"), // { latitude, longitude, address }
  serviceRadius: integer("service_radius").notNull().default(50), // miles
  skills: text("skills"), // JSON array
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scheduledAppointments = pgTable("scheduled_appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceOrderId: integer("service_order_id"),
  maintenanceOrderId: integer("maintenance_order_id"),
  quoteId: integer("quote_id"),
  customerId: integer("customer_id").notNull(),
  technicianId: varchar("technician_id", { length: 50 }).notNull(),
  
  appointmentType: varchar("appointment_type", { length: 30 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("scheduled"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  
  // Scheduling details
  scheduledDate: date("scheduled_date").notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // minutes
  
  // Location and travel
  customerLocation: jsonb("customer_location").notNull(), // { latitude, longitude, address }
  travelTimeToCustomer: integer("travel_time_to_customer"), // minutes
  travelDistanceMiles: real("travel_distance_miles"),
  
  // Details
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  requiredSkills: text("required_skills"), // JSON array
  estimatedParts: text("estimated_parts"), // JSON array
  
  // Customer preferences
  customerPreferredTimes: text("customer_preferred_times"), // JSON array
  customerTimeZone: varchar("customer_time_zone", { length: 50 }).notNull().default("America/New_York"),
  customerNotes: text("customer_notes"),
  
  // Calendar integration
  calendarEventId: varchar("calendar_event_id", { length: 100 }),
  calendarProvider: varchar("calendar_provider", { length: 30 }),
  
  // Completion tracking
  actualStartTime: varchar("actual_start_time", { length: 5 }),
  actualEndTime: varchar("actual_end_time", { length: 5 }),
  completionNotes: text("completion_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 50 }).notNull(),
  lastModifiedBy: varchar("last_modified_by", { length: 50 }),
});

// Relations for new monitoring tables
export const userAddonsRelations = relations(userAddons, ({ one }) => ({
  user: one(users, {
    fields: [userAddons.userId],
    references: [users.id],
  }),
}));

export const generatorMonitoringDataRelations = relations(generatorMonitoringData, ({ one }) => ({
  customer: one(customer, {
    fields: [generatorMonitoringData.customerId],
    references: [customer.cust_ID],
  }),
}));

export const monitoringAlertsRelations = relations(monitoringAlerts, ({ one }) => ({
  customer: one(customer, {
    fields: [monitoringAlerts.customerId],
    references: [customer.cust_ID],
  }),
  serviceOrder: one(service_call, {
    fields: [monitoringAlerts.serviceOrderCreated],
    references: [service_call.service_index],
  }),
}));

export const alertThresholdsRelations = relations(alertThresholds, ({ one }) => ({
  generator: one(generator, {
    fields: [alertThresholds.generatorId],
    references: [generator.gen_ID],
  }),
}));

export const customerPortalUsersRelations = relations(customerPortalUsers, ({ one, many }) => ({
  customer: one(customer, {
    fields: [customerPortalUsers.customerId],
    references: [customer.cust_ID],
  }),
  sessions: many(customerPortalSessions),
  activities: many(customerPortalActivity),
}));

export const customerPortalSessionsRelations = relations(customerPortalSessions, ({ one }) => ({
  user: one(customerPortalUsers, {
    fields: [customerPortalSessions.userId],
    references: [customerPortalUsers.id],
  }),
  customer: one(customer, {
    fields: [customerPortalSessions.customerId],
    references: [customer.cust_ID],
  }),
}));

export const customerPortalActivityRelations = relations(customerPortalActivity, ({ one }) => ({
  user: one(customerPortalUsers, {
    fields: [customerPortalActivity.userId],
    references: [customerPortalUsers.id],
  }),
  customer: one(customer, {
    fields: [customerPortalActivity.customerId],
    references: [customer.cust_ID],
  }),
}));

export const scheduledAppointmentsRelations = relations(scheduledAppointments, ({ one }) => ({
  customer: one(customer, {
    fields: [scheduledAppointments.customerId],
    references: [customer.cust_ID],
  }),
  serviceOrder: one(service_call, {
    fields: [scheduledAppointments.serviceOrderId],
    references: [service_call.service_index],
  }),
  maintenanceOrder: one(maint, {
    fields: [scheduledAppointments.maintenanceOrderId],
    references: [maint.maint_index],
  }),
  quote: one(quotes, {
    fields: [scheduledAppointments.quoteId],
    references: [quotes.quoteindex],
  }),
}));

// Zod schemas for new tables
export const insertUserAddonSchema = createInsertSchema(userAddons).omit({
  id: true,
  subscribedAt: true,
});

export const insertGeneratorMonitoringDataSchema = createInsertSchema(generatorMonitoringData).omit({
  id: true,
  timestamp: true,
});

export const insertMonitoringAlertSchema = createInsertSchema(monitoringAlerts).omit({
  id: true,
  timestamp: true,
});

export const insertAlertThresholdSchema = createInsertSchema(alertThresholds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMonitoringProviderSchema = createInsertSchema(monitoringProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type UserAddon = typeof userAddons.$inferSelect;
export type InsertUserAddon = z.infer<typeof insertUserAddonSchema>;

export type GeneratorMonitoringData = typeof generatorMonitoringData.$inferSelect;
export type InsertGeneratorMonitoringData = z.infer<typeof insertGeneratorMonitoringDataSchema>;

export type MonitoringAlert = typeof monitoringAlerts.$inferSelect;
export type InsertMonitoringAlert = z.infer<typeof insertMonitoringAlertSchema>;

export type AlertThreshold = typeof alertThresholds.$inferSelect;
export type InsertAlertThreshold = z.infer<typeof insertAlertThresholdSchema>;

export type MonitoringProvider = typeof monitoringProviders.$inferSelect;
export type InsertMonitoringProvider = z.infer<typeof insertMonitoringProviderSchema>;

// Zod schemas for customer portal and scheduling tables
export const insertCustomerPortalUserSchema = createInsertSchema(customerPortalUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerPortalSessionSchema = createInsertSchema(customerPortalSessions).omit({
  createdAt: true,
});

export const insertCustomerPortalActivitySchema = createInsertSchema(customerPortalActivity).omit({
  id: true,
  timestamp: true,
});

export const insertTechnicianScheduleSchema = createInsertSchema(technicianSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduledAppointmentSchema = createInsertSchema(scheduledAppointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for customer portal and scheduling tables
export type CustomerPortalUser = typeof customerPortalUsers.$inferSelect;
export type InsertCustomerPortalUser = z.infer<typeof insertCustomerPortalUserSchema>;

export type CustomerPortalSession = typeof customerPortalSessions.$inferSelect;
export type InsertCustomerPortalSession = z.infer<typeof insertCustomerPortalSessionSchema>;

export type CustomerPortalActivity = typeof customerPortalActivity.$inferSelect;
export type InsertCustomerPortalActivity = z.infer<typeof insertCustomerPortalActivitySchema>;

export type TechnicianSchedule = typeof technicianSchedules.$inferSelect;
export type InsertTechnicianSchedule = z.infer<typeof insertTechnicianScheduleSchema>;

export type ScheduledAppointment = typeof scheduledAppointments.$inferSelect;
export type InsertScheduledAppointment = z.infer<typeof insertScheduledAppointmentSchema>;

// Installation Configuration and Wizard System
export const installationConfig = pgTable("installation_config", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  configKey: varchar("config_key", { length: 100 }).notNull(),
  configValue: text("config_value"),
  isEncrypted: boolean("is_encrypted").default(false).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'google', 'monitoring', 'addons', 'company'
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'configured', 'verified', 'error'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Installation Steps Tracking
export const installationSteps = pgTable("installation_steps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  stepName: varchar("step_name", { length: 100 }).notNull(),
  stepCategory: varchar("step_category", { length: 50 }).notNull(), // 'google', 'company', 'addons', 'monitoring'
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'in_progress', 'completed', 'skipped', 'error'
  data: jsonb("data").default({}),
  errorMessage: text("error_message"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Installation Wizard Configuration - tracks overall progress
export const installationWizard = pgTable("installation_wizard", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  currentStep: varchar("current_step", { length: 100 }).notNull().default("welcome"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  
  // Google Integration Configuration
  googleMapsEnabled: boolean("google_maps_enabled").default(false).notNull(),
  googleCalendarEnabled: boolean("google_calendar_enabled").default(false).notNull(),
  googleWorkspaceEnabled: boolean("google_workspace_enabled").default(false).notNull(),
  
  // Addon Selections
  selectedAddons: text("selected_addons"), // JSON array of addon types
  pricingTier: varchar("pricing_tier", { length: 20 }).default("starter").notNull(),
  
  // Company Configuration
  companyConfigured: boolean("company_configured").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Zod schemas for installation tables
export const insertInstallationConfigSchema = createInsertSchema(installationConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInstallationStepSchema = createInsertSchema(installationSteps).omit({
  id: true,
  createdAt: true,
});

export const insertInstallationWizardSchema = createInsertSchema(installationWizard).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for installation tables
export type InstallationConfig = typeof installationConfig.$inferSelect;
export type InsertInstallationConfig = z.infer<typeof insertInstallationConfigSchema>;

export type InstallationStep = typeof installationSteps.$inferSelect;
export type InsertInstallationStep = z.infer<typeof insertInstallationStepSchema>;

export type InstallationWizard = typeof installationWizard.$inferSelect;
export type InsertInstallationWizard = z.infer<typeof insertInstallationWizardSchema>;

// Parts Request Workflow - Enhanced for inventory planning
export const partsRequests = pgTable("parts_requests", {
  id: serial("id").primaryKey(),
  requestNumber: varchar("request_number", { length: 50 }).notNull().unique(),
  
  // Request Details
  requestedBy: varchar("requested_by", { length: 100 }).notNull(), // Technician
  customerId: integer("customer_id"),
  customerName: varchar("customer_name", { length: 200 }),
  serviceOrderId: integer("service_order_id"),
  maintenanceOrderId: integer("maintenance_order_id"),
  
  // Part Information
  partNumber: varchar("part_number", { length: 125 }),
  manufacturer: varchar("manufacturer", { length: 125 }),
  partDescription: text("part_description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  urgency: varchar("urgency", { length: 20 }).notNull().default("standard"), // emergency, urgent, standard
  
  // Request Status Workflow
  status: varchar("status", { length: 30 }).notNull().default("tech_requested"), 
  // tech_requested → warehouse_review → vendor_ordered → received → assigned_to_tech → transferred_to_vehicle → completed
  
  // Warehouse Management
  warehouseManagerId: varchar("warehouse_manager_id", { length: 100 }),
  warehouseReviewDate: timestamp("warehouse_review_date"),
  warehouseNotes: text("warehouse_notes"),
  inStockQuantity: integer("in_stock_quantity").default(0),
  needsOrdering: boolean("needs_ordering").default(true),
  
  // Vendor Ordering
  vendorName: varchar("vendor_name", { length: 100 }),
  poNumber: varchar("po_number", { length: 50 }),
  orderDate: timestamp("order_date"),
  expectedDelivery: timestamp("expected_delivery"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  
  // Cost Information
  partCost: real("part_cost"),
  shippingCost: real("shipping_cost"),
  totalCost: real("total_cost"),
  
  // Physical Location Tracking
  currentLocation: varchar("current_location", { length: 50 }).default("pending"), 
  // pending → warehouse_stock → tech_bin → vehicle → customer_site → returned
  technicianBin: varchar("technician_bin", { length: 50 }),
  vehicleAssignment: varchar("vehicle_assignment", { length: 50 }),
  
  // Final Disposition
  finalStatus: varchar("final_status", { length: 30 }),
  // sold_to_customer, kept_vehicle_stock, returned_to_warehouse, warranty_replacement
  completionNotes: text("completion_notes"),
  
  // Timestamps
  requestDate: timestamp("request_date").defaultNow().notNull(),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Communication Forms - Replacing WPForms
export const businessForms = pgTable("business_forms", {
  id: serial("id").primaryKey(),
  formType: varchar("form_type", { length: 50 }).notNull(), // phone_message, emergency_request, startup, warranty, etc
  formNumber: varchar("form_number", { length: 50 }).notNull(),
  
  // Associated Records
  customerId: integer("customer_id"),
  serviceOrderId: integer("service_order_id"),
  generatorId: integer("generator_id"),
  technicianId: varchar("technician_id", { length: 100 }),
  
  // Form Data (JSON structure varies by form type)
  formData: jsonb("form_data").notNull(),
  
  // Processing Status
  status: varchar("status", { length: 30 }).notNull().default("submitted"),
  processedBy: varchar("processed_by", { length: 100 }),
  processedAt: timestamp("processed_at"),
  
  // Email/Communication Tracking
  emailSent: boolean("email_sent").default(false),
  emailRecipients: text("email_recipients"), // JSON array
  smsNotifications: boolean("sms_notifications").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Form Templates - Store form configurations
export const formTemplates = pgTable("form_templates", {
  id: serial("id").primaryKey(),
  formType: varchar("form_type", { length: 50 }).notNull().unique(),
  formName: varchar("form_name", { length: 100 }).notNull(),
  description: text("description"),
  
  // Form Configuration
  fields: jsonb("fields").notNull(), // Field definitions
  emailTemplate: text("email_template"),
  emailSubject: varchar("email_subject", { length: 200 }),
  
  // Business Logic
  autoCreateServiceOrder: boolean("auto_create_service_order").default(false),
  requiredApproval: boolean("required_approval").default(false),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod schemas for new forms tables
export const insertPartsRequestSchema = createInsertSchema(partsRequests).omit({
  id: true,
  requestDate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessFormSchema = createInsertSchema(businessForms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFormTemplateSchema = createInsertSchema(formTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for forms tables
export type PartsRequest = typeof partsRequests.$inferSelect;
export type InsertPartsRequest = z.infer<typeof insertPartsRequestSchema>;

export type BusinessForm = typeof businessForms.$inferSelect;
export type InsertBusinessForm = z.infer<typeof insertBusinessFormSchema>;

export type FormTemplate = typeof formTemplates.$inferSelect;
export type InsertFormTemplate = z.infer<typeof insertFormTemplateSchema>;

// Tenant Configuration System - Full Customization
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  subdomain: varchar("subdomain", { length: 50 }).notNull().unique(),
  
  // Business Settings
  timezone: varchar("timezone", { length: 50 }).notNull().default("America/New_York"),
  businessType: varchar("business_type", { length: 50 }).notNull().default("generator_service"),
  
  // Subscription & Features
  subscriptionTier: varchar("subscription_tier", { length: 20 }).notNull().default("starter"),
  enabledAddons: text("enabled_addons"), // JSON array
  
  // Contact Information
  primaryContact: varchar("primary_contact", { length: 200 }),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Customizable Vocabularies (Dropdowns, Status Lists, etc.)
export const tenantVocabularies = pgTable("tenant_vocabularies", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  category: varchar("category", { length: 50 }).notNull(), // urgency_levels, statuses, manufacturers, etc.
  
  // Vocabulary Configuration
  items: jsonb("items").notNull(), // Array of {value, label, color?, order?, isActive?}
  allowCustomValues: boolean("allow_custom_values").default(false),
  isRequired: boolean("is_required").default(true),
  
  // Metadata
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Customizable Field Labels & Terminology
export const tenantFieldLabels = pgTable("tenant_field_labels", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  fieldKey: varchar("field_key", { length: 100 }).notNull(), // customer_name, service_order, etc.
  
  // Customization
  label: varchar("label", { length: 200 }).notNull(),
  placeholder: varchar("placeholder", { length: 300 }),
  helpText: text("help_text"),
  isVisible: boolean("is_visible").default(true),
  isRequired: boolean("is_required").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Reporting & Analytics System
export const maintenanceContracts = pgTable("maintenance_contracts", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  customerId: integer("customer_id").notNull().references(() => customer.cust_ID),
  
  // Contract Details
  contractNumber: varchar("contract_number", { length: 50 }).notNull(),
  contractType: varchar("contract_type", { length: 50 }).notNull(), // annual, biannual, quarterly
  status: varchar("status", { length: 30 }).notNull().default("active"), // active, suspended, cancelled, expired
  
  // Service Schedule
  serviceFrequency: varchar("service_frequency", { length: 30 }).notNull(), // monthly, quarterly, biannual, annual
  lastServiceDate: date("last_service_date"),
  nextServiceDue: date("next_service_due").notNull(),
  daysUntilDue: integer("days_until_due"), // Calculated field
  
  // Contract Terms
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  autoRenew: boolean("auto_renew").default(true),
  
  // Pricing
  contractValue: real("contract_value").notNull(),
  billingFrequency: varchar("billing_frequency", { length: 20 }).notNull().default("annual"),
  
  // Services Included
  includedServices: text("included_services"), // JSON array
  emergencyCallsIncluded: integer("emergency_calls_included").default(0),
  emergencyCallsUsed: integer("emergency_calls_used").default(0),
  
  // Contact & Assignment
  primaryTechnician: varchar("primary_technician", { length: 100 }),
  accountManager: varchar("account_manager", { length: 100 }),
  
  // Notes
  contractNotes: text("contract_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Generator Service History - Enhanced for Reporting
export const serviceHistory = pgTable("service_history", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  generatorId: integer("generator_id").notNull().references(() => generator.gen_ID),
  customerId: integer("customer_id").notNull().references(() => customer.cust_ID),
  
  // Service Details
  serviceType: varchar("service_type", { length: 50 }).notNull(), // maintenance, repair, emergency, installation
  serviceDate: date("service_date").notNull(),
  technicianId: varchar("technician_id", { length: 100 }).notNull(),
  
  // Performance Metrics
  responseTime: integer("response_time"), // Hours from request to arrival
  serviceTime: integer("service_time"), // Minutes on site
  resolution: varchar("resolution", { length: 50 }), // completed, partial, follow_up_required
  
  // Maintenance Tracking
  engineHoursAtService: real("engine_hours_at_service"),
  nextServiceRecommended: date("next_service_recommended"),
  partsReplaced: text("parts_replaced"), // JSON array
  
  // Customer Satisfaction
  customerRating: integer("customer_rating"), // 1-5 scale
  customerFeedback: text("customer_feedback"),
  
  // Financial
  laborCost: real("labor_cost"),
  partsCost: real("parts_cost"),
  totalCost: real("total_cost"),
  
  // Related Records
  serviceOrderId: integer("service_order_id"),
  maintenanceOrderId: integer("maintenance_order_id"),
  contractId: integer("contract_id").references(() => maintenanceContracts.id),
  
  createdAt: timestamp("created_at").defaultNow()
});

// Business Metrics & KPIs
export const businessMetrics = pgTable("business_metrics", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  metricDate: date("metric_date").notNull(),
  metricType: varchar("metric_type", { length: 50 }).notNull(),
  
  // Metric Values
  value: real("value").notNull(),
  targetValue: real("target_value"),
  previousValue: real("previous_value"),
  
  // Additional Data
  metadata: jsonb("metadata"), // Additional metric-specific data
  
  createdAt: timestamp("created_at").defaultNow()
});

// Zod schemas for new tables
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantVocabularySchema = createInsertSchema(tenantVocabularies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantFieldLabelSchema = createInsertSchema(tenantFieldLabels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceContractSchema = createInsertSchema(maintenanceContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceHistorySchema = createInsertSchema(serviceHistory).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessMetricSchema = createInsertSchema(businessMetrics).omit({
  id: true,
  createdAt: true,
});

// Types for new tables
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type TenantVocabulary = typeof tenantVocabularies.$inferSelect;
export type InsertTenantVocabulary = z.infer<typeof insertTenantVocabularySchema>;

export type TenantFieldLabel = typeof tenantFieldLabels.$inferSelect;
export type InsertTenantFieldLabel = z.infer<typeof insertTenantFieldLabelSchema>;

export type MaintenanceContract = typeof maintenanceContracts.$inferSelect;
export type InsertMaintenanceContract = z.infer<typeof insertMaintenanceContractSchema>;

export type ServiceHistory = typeof serviceHistory.$inferSelect;
export type InsertServiceHistory = z.infer<typeof insertServiceHistorySchema>;

export type BusinessMetric = typeof businessMetrics.$inferSelect;
export type InsertBusinessMetric = z.infer<typeof insertBusinessMetricSchema>;

// User Roles & Permissions System - Fully Customizable
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  
  // Role Definition
  roleName: varchar("role_name", { length: 50 }).notNull(), // super_admin, admin, office, etc.
  displayName: varchar("display_name", { length: 100 }).notNull(), // "Service Technician", "Warehouse Manager"
  description: text("description"),
  
  // Role Properties
  isSystemRole: boolean("is_system_role").default(false), // Cannot be deleted
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(100), // Lower number = higher priority
  
  // Visual
  colorCode: varchar("color_code", { length: 10 }), // Hex color for badges
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Permissions Registry - Define what actions are possible
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  
  // Permission Definition
  permissionKey: varchar("permission_key", { length: 100 }).notNull().unique(), // view_customers, edit_service_calls, etc.
  permissionName: varchar("permission_name", { length: 150 }).notNull(), // "View Customer Records"
  description: text("description"),
  
  // Organization
  category: varchar("category", { length: 50 }).notNull(), // customers, service_calls, maintenance, reports, etc.
  subcategory: varchar("subcategory", { length: 50 }), // create, read, update, delete, approve
  
  // Properties
  isSystemPermission: boolean("is_system_permission").default(true), // Cannot be deleted
  requiresApproval: boolean("requires_approval").default(false), // Some actions need manager approval
  
  createdAt: timestamp("created_at").defaultNow()
});

// Role Permissions Mapping - Which roles have which permissions
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  roleId: integer("role_id").notNull().references(() => userRoles.id),
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  
  // Permission Settings
  isGranted: boolean("is_granted").default(true),
  canDelegate: boolean("can_delegate").default(false), // Can assign this permission to others
  expiresAt: timestamp("expires_at"), // Temporary permissions
  
  // Audit Trail
  grantedBy: varchar("granted_by", { length: 100 }), // Who assigned this permission
  grantedAt: timestamp("granted_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow()
});

// User Role Assignments - Which users have which roles
export const userRoleAssignments = pgTable("user_role_assignments", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  userId: varchar("user_id", { length: 100 }).notNull(), // From Replit auth
  roleId: integer("role_id").notNull().references(() => userRoles.id),
  
  // Assignment Details
  assignedBy: varchar("assigned_by", { length: 100 }), // Who assigned this role
  assignedAt: timestamp("assigned_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Temporary role assignments
  
  // Status
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Permission Requests - Users can request additional permissions
export const permissionRequests = pgTable("permission_requests", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull().references(() => tenants.id),
  
  // Request Details
  requestedBy: varchar("requested_by", { length: 100 }).notNull(), // User ID
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  justification: text("justification"), // Why they need this permission
  
  // Request Status
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, denied
  reviewedBy: varchar("reviewed_by", { length: 100 }), // Who approved/denied
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  
  // Temporary Permission Details (if approved)
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod schemas for new tables
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
  createdAt: true,
});

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  createdAt: true,
});

export const insertUserRoleAssignmentSchema = createInsertSchema(userRoleAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPermissionRequestSchema = createInsertSchema(permissionRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

export type UserRoleAssignment = typeof userRoleAssignments.$inferSelect;
export type InsertUserRoleAssignment = z.infer<typeof insertUserRoleAssignmentSchema>;

export type PermissionRequest = typeof permissionRequests.$inferSelect;
export type InsertPermissionRequest = z.infer<typeof insertPermissionRequestSchema>;