import { 
  users, customer, service_call, maint, parts, quotes, messages, tasks, announcements, generator,
  userAddons, generatorMonitoringData, monitoringAlerts, alertThresholds, monitoringProviders,
  customerPortalUsers, customerPortalSessions, customerPortalActivity,
  technicianSchedules, scheduledAppointments,
  installationConfig, installationSteps, installationWizard,
  partsRequests, businessForms, formTemplates,
  tenants, tenantVocabularies, tenantFieldLabels, maintenanceContracts, serviceHistory, businessMetrics,
  userRoles, permissions, rolePermissions, userRoleAssignments, permissionRequests,
  // New Business Workflow Tables
  installOrders, installInventory, installationChecklist, customerLifecycle, 
  employeeTimeEntries, dailyTimeSummaries,
  type User, type UpsertUser, type InsertUser,
  type Customer, type InsertCustomer,
  type ServiceCall, type InsertServiceCall,
  type Maintenance, type InsertMaintenance,
  type Parts, type InsertParts,
  type Quote, type InsertQuote,
  type Message, type InsertMessage,
  type Task, type InsertTask,
  type Announcement, type InsertAnnouncement,
  type Generator, type InsertGenerator,
  type UserAddon, type InsertUserAddon,
  type GeneratorMonitoringData, type InsertGeneratorMonitoringData,
  type MonitoringAlert, type InsertMonitoringAlert,
  type AlertThreshold, type InsertAlertThreshold,
  type MonitoringProvider, type InsertMonitoringProvider,
  type CustomerPortalUser, type InsertCustomerPortalUser,
  type CustomerPortalSession, type InsertCustomerPortalSession,
  type CustomerPortalActivity, type InsertCustomerPortalActivity,
  type TechnicianSchedule, type InsertTechnicianSchedule,
  type ScheduledAppointment, type InsertScheduledAppointment,
  type InstallationConfig, type InsertInstallationConfig,
  type InstallationStep, type InsertInstallationStep,
  type InstallationWizard, type InsertInstallationWizard,
  type PartsRequest, type InsertPartsRequest,
  type BusinessForm, type InsertBusinessForm,
  type FormTemplate, type InsertFormTemplate,
  type Tenant, type InsertTenant,
  type TenantVocabulary, type InsertTenantVocabulary,
  type TenantFieldLabel, type InsertTenantFieldLabel,
  type MaintenanceContract, type InsertMaintenanceContract,
  type ServiceHistory, type InsertServiceHistory,
  type BusinessMetric, type InsertBusinessMetric,
  type UserRole, type InsertUserRole,
  type Permission, type InsertPermission,
  type RolePermission, type InsertRolePermission,
  type UserRoleAssignment, type InsertUserRoleAssignment,
  type PermissionRequest, type InsertPermissionRequest,
  // New Business Workflow Types
  type SelectInstallOrder, type InsertInstallOrder,
  type SelectInstallInventory, type InsertInstallInventory,
  type SelectInstallationChecklist, type InsertInstallationChecklist,
  type SelectCustomerLifecycle, type InsertCustomerLifecycle,
  type SelectEmployeeTimeEntry, type InsertEmployeeTimeEntry,
  type SelectDailyTimeSummary, type InsertDailyTimeSummary,
  type SelectQuote
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, sql, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Session store for authentication
  sessionStore: any;
  
  // Users - Replit Auth integration
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customers - using cust_ID as primary key (integer)
  getCustomer(cust_ID: number): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  searchCustomers(query: string): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(custindex: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  
  // Service Calls
  getServiceCall(service_index: number): Promise<ServiceCall | undefined>;
  getServiceCalls(): Promise<ServiceCall[]>;
  getServiceCallsByCustomer(cust_ID: number): Promise<ServiceCall[]>;
  getServiceCallsByTech(techName: string): Promise<ServiceCall[]>;
  getPendingServiceCalls(): Promise<ServiceCall[]>;
  getFieldCompleteServiceCalls(): Promise<ServiceCall[]>;
  createServiceCall(serviceCall: InsertServiceCall): Promise<ServiceCall>;
  updateServiceCall(service_index: number, serviceCall: Partial<InsertServiceCall>): Promise<ServiceCall>;
  
  // Maintenance Orders
  getMaintenance(maint_index: number): Promise<Maintenance | undefined>;
  getMaintenanceOrders(): Promise<Maintenance[]>;
  getMaintenanceByCustomer(cust_ID: number): Promise<Maintenance[]>;
  getMaintenanceByTech(techName: string): Promise<Maintenance[]>;
  getPendingMaintenance(): Promise<Maintenance[]>;
  getFieldCompleteMaintenance(): Promise<Maintenance[]>;
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  updateMaintenance(maint_index: number, maintenance: Partial<InsertMaintenance>): Promise<Maintenance>;
  
  // Parts
  getPart(partindex: number): Promise<Parts | undefined>;
  getParts(): Promise<Parts[]>;
  getPartsByCustomer(cust_ID: string): Promise<Parts[]>;
  getPartsToOrder(): Promise<Parts[]>;
  createPart(part: InsertParts): Promise<Parts>;
  updatePart(partindex: number, part: Partial<InsertParts>): Promise<Parts>;
  
  // Quotes
  getQuote(quoteindex: number): Promise<Quote | undefined>;
  getQuotes(): Promise<Quote[]>;
  getQuotesByCustomer(cust_ID: number): Promise<Quote[]>;
  getQuotesByStatus(status: string): Promise<Quote[]>;
  getFieldCompleteQuotes(): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(quoteindex: number, quote: Partial<InsertQuote>): Promise<Quote>;
  
  // Messages
  getMessage(taskindex: number): Promise<Message | undefined>;
  getMessages(): Promise<Message[]>;
  getMessagesByAssignee(assignee: string): Promise<Message[]>;
  getUnacknowledgedMessages(assignee: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(taskindex: number, message: Partial<InsertMessage>): Promise<Message>;
  
  // Tasks
  getTask(taskindex: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  getTasksByAssignee(assignee: string): Promise<Task[]>;
  getUnacknowledgedTasks(assignee: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(taskindex: number, task: Partial<InsertTask>): Promise<Task>;
  
  // Announcements
  getAnnouncement(taskindex: number): Promise<Announcement | undefined>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Generators
  getGenerator(genindex: number): Promise<Generator | undefined>;
  getGenerators(): Promise<Generator[]>;
  getGeneratorsByCustomer(cust_ID: number): Promise<Generator[]>;
  getActiveGenerators(): Promise<Generator[]>;
  createGenerator(generator: InsertGenerator): Promise<Generator>;
  updateGenerator(genindex: number, generator: Partial<InsertGenerator>): Promise<Generator>;

  // Addon Management
  hasAddonAccess(userId: string, addonType: string): Promise<boolean>;
  getUserAddons(userId: string): Promise<UserAddon[]>;
  getAddonCatalog(): Promise<any[]>;
  subscribeToAddon(userId: string, addonData: InsertUserAddon): Promise<UserAddon>;

  // Generator Monitoring
  getMonitoringDashboard(userId: string): Promise<any>;
  getAllGeneratorStatuses(userId: string): Promise<any[]>;
  getGeneratorMonitoringHistory(generatorId: string, timeRange: string): Promise<GeneratorMonitoringData[]>;
  storeMonitoringData(data: InsertGeneratorMonitoringData): Promise<GeneratorMonitoringData>;

  // Manufacturer API Integration
  syncGeneracData(userId: string): Promise<any>;
  syncKohlerData(userId: string): Promise<any>;
  syncCumminsData(userId: string): Promise<any>;
  syncCaterpillarData(userId: string): Promise<any>;
  syncWatchlinkData(userId: string): Promise<any>;

  // Alert Management
  getActiveAlerts(userId: string): Promise<MonitoringAlert[]>;
  acknowledgeAlert(alertId: string, userId: string): Promise<any>;
  createAlertThreshold(thresholdData: InsertAlertThreshold): Promise<AlertThreshold>;
  processAlert(alertData: InsertMonitoringAlert): Promise<MonitoringAlert>;

  // Intelligent Scheduling
  getTechnicianAvailability(technicianId: string, date: string): Promise<any>;
  optimizeRoute(optimizationRequest: any): Promise<any>;
  scheduleAppointment(appointmentData: InsertScheduledAppointment): Promise<ScheduledAppointment>;
  getScheduledAppointments(userId: string): Promise<ScheduledAppointment[]>;

  // Customer Portal
  authenticateCustomer(email: string, password: string): Promise<any>;
  getCustomerDashboard(customerId: number): Promise<any>;
  customerHasMonitoringAccess(customerId: number): Promise<boolean>;
  customerHasSchedulingAccess(customerId: number): Promise<boolean>;
  getCustomerGeneratorStatus(customerId: number): Promise<any>;
  getCustomerServiceHistory(customerId: number): Promise<any>;
  createCustomerServiceRequest(serviceRequest: any): Promise<any>;
  getCustomerAvailableSlots(customerId: number, date: string, serviceType: string, urgency: string): Promise<any[]>;

  // Installation Wizard System
  getInstallationWizard(userId: string): Promise<InstallationWizard | undefined>;
  createInstallationWizard(userId: string, wizardData: Partial<InsertInstallationWizard>): Promise<InstallationWizard>;
  updateInstallationWizard(userId: string, wizardData: Partial<InstallationWizard>): Promise<InstallationWizard>;
  getInstallationSteps(userId: string): Promise<InstallationStep[]>;
  createInstallationStep(stepData: InsertInstallationStep): Promise<InstallationStep>;
  updateInstallationStep(stepId: number, stepData: Partial<InstallationStep>): Promise<InstallationStep>;
  getInstallationConfig(userId: string, category?: string): Promise<InstallationConfig[]>;
  setInstallationConfig(configData: InsertInstallationConfig): Promise<InstallationConfig>;
  verifyGoogleConfiguration(userId: string): Promise<any>;

  // Parts Request Workflow - Enhanced Inventory Management
  createPartsRequest(requestData: InsertPartsRequest): Promise<PartsRequest>;
  getPartsRequests(filters?: { status?: string; requestedBy?: string; customerId?: number }): Promise<PartsRequest[]>;
  getPartsRequest(id: number): Promise<PartsRequest | undefined>;
  updatePartsRequest(id: number, updates: Partial<PartsRequest>): Promise<PartsRequest>;
  updatePartsRequestStatus(id: number, status: string, updates?: Partial<PartsRequest>): Promise<PartsRequest>;
  getPartsRequestsByWarehouseManager(managerId: string): Promise<PartsRequest[]>;
  getPartsRequestsByTechnician(technicianId: string): Promise<PartsRequest[]>;

  // Business Forms System - Replacing WPForms
  createBusinessForm(formData: InsertBusinessForm): Promise<BusinessForm>;
  getBusinessForms(filters?: { formType?: string; customerId?: number; status?: string }): Promise<BusinessForm[]>;
  getBusinessForm(id: number): Promise<BusinessForm | undefined>;
  updateBusinessForm(id: number, updates: Partial<BusinessForm>): Promise<BusinessForm>;
  getFormTemplate(formType: string): Promise<FormTemplate | undefined>;
  createFormTemplate(templateData: InsertFormTemplate): Promise<FormTemplate>;

  // ============== CORE BUSINESS WORKFLOW METHODS ==============
  
  // Quote-to-Install Workflow
  approveQuote(id: number, approvedBy: string): Promise<SelectQuote>;
  convertQuoteToInstall(quoteId: number, installData: InsertInstallOrder): Promise<SelectInstallOrder>;
  
  // Install Order Management  
  getInstallOrders(status?: string): Promise<SelectInstallOrder[]>;
  getInstallOrder(id: number): Promise<SelectInstallOrder | undefined>;
  updateInstallOrder(id: number, data: Partial<InsertInstallOrder>): Promise<SelectInstallOrder>;
  addInstallInventory(installOrderId: number, items: InsertInstallInventory[]): Promise<SelectInstallInventory[]>;
  getInstallInventory(installOrderId: number): Promise<SelectInstallInventory[]>;
  
  // Installation Checklist
  getInstallationChecklist(installOrderId: number): Promise<SelectInstallationChecklist[]>;
  updateChecklistItem(id: number, completed: boolean, completedBy: string, notes?: string): Promise<SelectInstallationChecklist>;
  
  // Customer Lifecycle Management
  getCustomerLifecycle(customerId: number): Promise<SelectCustomerLifecycle>;
  updateCustomerLifecycleStage(customerId: number, stage: string, date?: Date): Promise<SelectCustomerLifecycle>;
  
  // Employee Time Tracking
  clockIn(employeeId: string, location?: string): Promise<SelectEmployeeTimeEntry>;
  clockOut(employeeId: string): Promise<SelectEmployeeTimeEntry>;
  addTimeEntry(entry: InsertEmployeeTimeEntry): Promise<SelectEmployeeTimeEntry>;
  getEmployeeTimeEntries(employeeId: string, startDate: Date, endDate: Date): Promise<SelectEmployeeTimeEntry[]>;
  getDailyTimeSummary(employeeId: string, date: Date): Promise<SelectDailyTimeSummary | undefined>;

  // Permissions & Role Management  
  hasPermission(tenantId: string, userId: string, permissionKey: string): Promise<boolean>;
  getUserPermissions(tenantId: string, userId: string): Promise<any[]>;
  getUserRoleAssignments(tenantId: string, userId: string): Promise<any[]>;
  assignRoleToUser(assignment: any): Promise<any>;
  revokeUserRole(tenantId: string, userId: string, roleId: number): Promise<void>;
  createPermissionRequest(request: any): Promise<any>;
  getPermissionRequests(tenantId: string, status?: string): Promise<any[]>;
  reviewPermissionRequest(id: number, status: string, reviewerId: string, notes?: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Set up PostgreSQL session store
    this.sessionStore = new PostgresSessionStore({ 
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true 
    });
  }

  // Users - Replit Auth integration
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customers - using cust_ID as integer primary key
  async getCustomer(cust_ID: number): Promise<Customer | undefined> {
    const [customerRecord] = await db.select().from(customer).where(eq(customer.cust_ID, cust_ID));
    return customerRecord || undefined;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customer).orderBy(asc(customer.last_name), asc(customer.first_name));
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(customer).where(
      or(
        like(customer.first_name, searchTerm),
        like(customer.last_name, searchTerm),
        like(customer.Business, searchTerm),
        like(customer.Cell_Phone, searchTerm),
        like(customer.Home_Phone, searchTerm),
        like(customer.Email, searchTerm),
        sql`CAST(${customer.cust_ID} AS TEXT) LIKE ${searchTerm}`
      )
    ).orderBy(asc(customer.last_name), asc(customer.first_name));
  }

  async createCustomer(customerData: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db
      .insert(customer)
      .values(customerData)
      .returning();
    return newCustomer;
  }

  async updateCustomer(custindex: number, customerData: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customer)
      .set(customerData)
      .where(eq(customer.custindex, custindex))
      .returning();
    return updatedCustomer;
  }

  // Service Calls
  async getServiceCall(service_index: number): Promise<ServiceCall | undefined> {
    const [serviceCall] = await db.select().from(service_call).where(eq(service_call.service_index, service_index));
    return serviceCall || undefined;
  }

  async getServiceCalls(): Promise<ServiceCall[]> {
    return await db.select().from(service_call).orderBy(desc(service_call.service_ID));
  }

  async getServiceCallsByCustomer(cust_ID: number): Promise<ServiceCall[]> {
    return await db.select().from(service_call)
      .where(eq(service_call.cust_ID, cust_ID))
      .orderBy(desc(service_call.service_ID));
  }

  async getServiceCallsByTech(techName: string): Promise<ServiceCall[]> {
    return await db.select().from(service_call)
      .where(eq(service_call.assigned_tech, techName))
      .orderBy(desc(service_call.service_ID));
  }

  async getPendingServiceCalls(): Promise<ServiceCall[]> {
    return await db.select().from(service_call)
      .where(and(
        sql`${service_call.field_complete} != 'yes'`,
        sql`${service_call.office_complete} != 'Closed'`
      ))
      .orderBy(asc(service_call.start_date));
  }

  async getFieldCompleteServiceCalls(): Promise<ServiceCall[]> {
    return await db.select().from(service_call)
      .where(and(
        eq(service_call.field_complete, "yes"),
        sql`${service_call.office_complete} != 'Closed'`
      ))
      .orderBy(desc(service_call.complete_date));
  }

  async createServiceCall(serviceCall: InsertServiceCall): Promise<ServiceCall> {
    const [newServiceCall] = await db
      .insert(service_call)
      .values(serviceCall)
      .returning();
    return newServiceCall;
  }

  async updateServiceCall(service_index: number, serviceCallData: Partial<InsertServiceCall>): Promise<ServiceCall> {
    const [updatedServiceCall] = await db
      .update(service_call)
      .set(serviceCallData)
      .where(eq(service_call.service_index, service_index))
      .returning();
    return updatedServiceCall;
  }

  // Maintenance Orders
  async getMaintenance(maint_index: number): Promise<Maintenance | undefined> {
    const [maintenanceOrder] = await db.select().from(maint).where(eq(maint.maint_index, maint_index));
    return maintenanceOrder || undefined;
  }

  async getMaintenanceOrders(): Promise<Maintenance[]> {
    return await db.select().from(maint).orderBy(desc(maint.maint_ID));
  }

  async getMaintenanceByCustomer(cust_ID: number): Promise<Maintenance[]> {
    return await db.select().from(maint)
      .where(eq(maint.cust_ID, cust_ID))
      .orderBy(desc(maint.maint_ID));
  }

  async getMaintenanceByTech(techName: string): Promise<Maintenance[]> {
    return await db.select().from(maint)
      .where(eq(maint.assigned_tech, techName))
      .orderBy(desc(maint.maint_ID));
  }

  async getPendingMaintenance(): Promise<Maintenance[]> {
    return await db.select().from(maint)
      .where(and(
        sql`${maint.field_complete} != 'yes'`,
        sql`${maint.office_complete} != 'Closed'`
      ))
      .orderBy(asc(maint.start_date));
  }

  async getFieldCompleteMaintenance(): Promise<Maintenance[]> {
    return await db.select().from(maint)
      .where(and(
        eq(maint.field_complete, "yes"),
        sql`${maint.office_complete} != 'Closed'`
      ))
      .orderBy(desc(maint.complete_date));
  }

  async createMaintenance(maintenanceOrder: InsertMaintenance): Promise<Maintenance> {
    const [newMaintenance] = await db
      .insert(maint)
      .values(maintenanceOrder)
      .returning();
    return newMaintenance;
  }

  async updateMaintenance(maint_index: number, maintenanceOrder: Partial<InsertMaintenance>): Promise<Maintenance> {
    const [updatedMaintenance] = await db
      .update(maint)
      .set(maintenanceOrder)
      .where(eq(maint.maint_index, maint_index))
      .returning();
    return updatedMaintenance;
  }

  // Parts
  async getPart(partindex: number): Promise<Parts | undefined> {
    const [part] = await db.select().from(parts).where(eq(parts.partindex, partindex));
    return part || undefined;
  }

  async getParts(): Promise<Parts[]> {
    return await db.select().from(parts).orderBy(desc(parts.part_ID));
  }

  async getPartsByCustomer(cust_ID: string): Promise<Parts[]> {
    return await db.select().from(parts)
      .where(eq(parts.cust_ID, cust_ID))
      .orderBy(desc(parts.part_ID));
  }

  async getPartsToOrder(): Promise<Parts[]> {
    return await db.select().from(parts)
      .where(or(
        eq(parts.order_processed, "1. Not Ordered"),
        eq(parts.order_processed, "Not Ordered")
      ))
      .orderBy(desc(parts.part_ID));
  }

  async createPart(part: InsertParts): Promise<Parts> {
    const [newPart] = await db
      .insert(parts)
      .values(part)
      .returning();
    return newPart;
  }

  async updatePart(partindex: number, part: Partial<InsertParts>): Promise<Parts> {
    const [updatedPart] = await db
      .update(parts)
      .set(part)
      .where(eq(parts.partindex, partindex))
      .returning();
    return updatedPart;
  }

  // Quotes
  async getQuote(quoteindex: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.quoteindex, quoteindex));
    return quote || undefined;
  }

  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes).orderBy(desc(quotes.quote_ID));
  }

  async getQuotesByCustomer(cust_ID: number): Promise<Quote[]> {
    return await db.select().from(quotes)
      .where(eq(quotes.cust_ID, cust_ID))
      .orderBy(desc(quotes.quote_ID));
  }

  async getQuotesByStatus(status: string): Promise<Quote[]> {
    return await db.select().from(quotes)
      .where(eq(quotes.quote_status, status))
      .orderBy(desc(quotes.quote_ID));
  }

  async getFieldCompleteQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes)
      .where(eq(quotes.field_complete, "yes"))
      .orderBy(desc(quotes.field_comp_date));
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db
      .insert(quotes)
      .values(quote)
      .returning();
    return newQuote;
  }

  async updateQuote(quoteindex: number, quote: Partial<InsertQuote>): Promise<Quote> {
    const [updatedQuote] = await db
      .update(quotes)
      .set(quote)
      .where(eq(quotes.quoteindex, quoteindex))
      .returning();
    return updatedQuote;
  }

  // Messages
  async getMessage(taskindex: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.taskindex, taskindex));
    return message || undefined;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.taskindex));
  }

  async getMessagesByAssignee(assignee: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(sql`${messages.assign_to} LIKE ${'%' + assignee + '%'}`)
      .orderBy(desc(messages.taskindex));
  }

  async getUnacknowledgedMessages(assignee: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(and(
        sql`${messages.assign_to} LIKE ${'%' + assignee + '%'}`,
        sql`${messages.acknowledge} != 'yes'`
      ))
      .orderBy(desc(messages.taskindex));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateMessage(taskindex: number, message: Partial<InsertMessage>): Promise<Message> {
    const [updatedMessage] = await db
      .update(messages)
      .set(message)
      .where(eq(messages.taskindex, taskindex))
      .returning();
    return updatedMessage;
  }

  // Tasks
  async getTask(taskindex: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.taskindex, taskindex));
    return task || undefined;
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(desc(tasks.taskindex));
  }

  async getTasksByAssignee(assignee: string): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(sql`${tasks.assign_to} LIKE ${'%' + assignee + '%'}`)
      .orderBy(desc(tasks.taskindex));
  }

  async getUnacknowledgedTasks(assignee: string): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(and(
        sql`${tasks.assign_to} LIKE ${'%' + assignee + '%'}`,
        sql`${tasks.acknowledge} != 'yes'`
      ))
      .orderBy(desc(tasks.taskindex));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(taskindex: number, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.taskindex, taskindex))
      .returning();
    return updatedTask;
  }

  // Announcements
  async getAnnouncement(taskindex: number): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.taskindex, taskindex));
    return announcement || undefined;
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements)
      .where(sql`${announcements.date_due} > NOW()`)
      .orderBy(desc(announcements.date_posted));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  // Generators
  async getGenerator(genindex: number): Promise<Generator | undefined> {
    const [generatorRecord] = await db.select().from(generator).where(eq(generator.genindex, genindex));
    return generatorRecord || undefined;
  }

  async getGenerators(): Promise<Generator[]> {
    return await db.select().from(generator).orderBy(desc(generator.gen_ID));
  }

  async getGeneratorsByCustomer(cust_ID: number): Promise<Generator[]> {
    return await db.select().from(generator)
      .where(eq(generator.cust_ID, cust_ID))
      .orderBy(desc(generator.gen_ID));
  }

  async getActiveGenerators(): Promise<Generator[]> {
    return await db.select().from(generator)
      .where(eq(generator.gen_status, "active"))
      .orderBy(desc(generator.gen_ID));
  }

  async createGenerator(generatorData: InsertGenerator): Promise<Generator> {
    const [newGenerator] = await db
      .insert(generator)
      .values(generatorData)
      .returning();
    return newGenerator;
  }

  async updateGenerator(genindex: number, generatorData: Partial<InsertGenerator>): Promise<Generator> {
    const [updatedGenerator] = await db
      .update(generator)
      .set(generatorData)
      .where(eq(generator.genindex, genindex))
      .returning();
    return updatedGenerator;
  }

  // Addon Management Implementation
  async hasAddonAccess(userId: string, addonType: string): Promise<boolean> {
    const [addon] = await db.select()
      .from(userAddons)
      .where(and(
        eq(userAddons.userId, userId),
        eq(userAddons.addonType, addonType),
        eq(userAddons.enabled, true)
      ));
    return !!addon;
  }

  async getUserAddons(userId: string): Promise<UserAddon[]> {
    return await db.select()
      .from(userAddons)
      .where(eq(userAddons.userId, userId))
      .orderBy(desc(userAddons.subscribedAt));
  }

  async getAddonCatalog(): Promise<any> {
    // Return static addon catalog from shared/addon-system.ts
    const { ADDON_DEFINITIONS, PRICING_TIERS } = await import("@shared/addon-system");
    return {
      addons: ADDON_DEFINITIONS,
      pricingTiers: PRICING_TIERS
    };
  }

  async subscribeToAddon(userId: string, addonData: InsertUserAddon): Promise<UserAddon> {
    const [newAddon] = await db
      .insert(userAddons)
      .values({ ...addonData, userId })
      .returning();
    return newAddon;
  }

  // Generator Monitoring Implementation
  async getMonitoringDashboard(userId: string): Promise<any> {
    // Get user's customers and their generators with latest monitoring data
    const userCustomers = await db.select()
      .from(customer)
      .where(eq(customer.status, "active"));
    
    const dashboardData = {
      totalGenerators: 0,
      onlineGenerators: 0,
      offlineGenerators: 0,
      alertCount: 0,
      recentAlerts: [] as any[],
      generatorStatuses: [] as any[]
    };

    for (const cust of userCustomers) {
      const generators = await this.getGeneratorsByCustomer(cust.cust_ID!);
      dashboardData.totalGenerators += generators.length;

      for (const gen of generators) {
        const [latestData] = await db.select()
          .from(generatorMonitoringData)
          .where(eq(generatorMonitoringData.generatorId, gen.gen_ID!.toString()))
          .orderBy(desc(generatorMonitoringData.timestamp))
          .limit(1);

        if (latestData) {
          if (latestData.status === 'online' || latestData.status === 'running') {
            dashboardData.onlineGenerators++;
          } else {
            dashboardData.offlineGenerators++;
          }

          dashboardData.generatorStatuses.push({
            generator: gen,
            customer: cust,
            latestData: latestData
          });
        }
      }
    }

    const alerts = await this.getActiveAlerts(userId);
    dashboardData.alertCount = alerts.length;
    dashboardData.recentAlerts = alerts.slice(0, 5);

    return dashboardData;
  }

  async getAllGeneratorStatuses(userId: string): Promise<any[]> {
    const userCustomers = await db.select()
      .from(customer)
      .where(eq(customer.status, "active"));
    
    const statuses = [];
    for (const cust of userCustomers) {
      const generators = await this.getGeneratorsByCustomer(cust.cust_ID!);
      
      for (const gen of generators) {
        const [latestData] = await db.select()
          .from(generatorMonitoringData)
          .where(eq(generatorMonitoringData.generatorId, gen.gen_ID!.toString()))
          .orderBy(desc(generatorMonitoringData.timestamp))
          .limit(1);

        statuses.push({
          generator: gen,
          customer: cust,
          status: latestData?.status || 'unknown',
          lastUpdate: latestData?.timestamp || null,
          data: latestData
        });
      }
    }
    
    return statuses;
  }

  async getGeneratorMonitoringHistory(generatorId: string, timeRange: string): Promise<GeneratorMonitoringData[]> {
    let timeFilter = sql`true`;
    
    switch (timeRange) {
      case '1h':
        timeFilter = sql`${generatorMonitoringData.timestamp} > NOW() - INTERVAL '1 hour'`;
        break;
      case '24h':
        timeFilter = sql`${generatorMonitoringData.timestamp} > NOW() - INTERVAL '24 hours'`;
        break;
      case '7d':
        timeFilter = sql`${generatorMonitoringData.timestamp} > NOW() - INTERVAL '7 days'`;
        break;
      case '30d':
        timeFilter = sql`${generatorMonitoringData.timestamp} > NOW() - INTERVAL '30 days'`;
        break;
    }

    return await db.select()
      .from(generatorMonitoringData)
      .where(and(
        eq(generatorMonitoringData.generatorId, generatorId),
        timeFilter
      ))
      .orderBy(desc(generatorMonitoringData.timestamp));
  }

  async storeMonitoringData(data: InsertGeneratorMonitoringData): Promise<GeneratorMonitoringData> {
    const [newData] = await db
      .insert(generatorMonitoringData)
      .values(data)
      .returning();
    return newData;
  }

  // Manufacturer API Integration Implementation
  async syncGeneracData(userId: string): Promise<any> {
    // Placeholder for Generac API integration
    // In production, this would call the actual Generac Mobile Link API
    return {
      success: true,
      provider: 'generac',
      syncedGenerators: 0,
      message: 'Generac API integration pending - requires API key configuration'
    };
  }

  async syncKohlerData(userId: string): Promise<any> {
    // Placeholder for Kohler API integration
    return {
      success: true,
      provider: 'kohler',
      syncedGenerators: 0,
      message: 'Kohler API integration pending - requires API key configuration'
    };
  }

  async syncCumminsData(userId: string): Promise<any> {
    // Placeholder for Cummins API integration
    return {
      success: true,
      provider: 'cummins',
      syncedGenerators: 0,
      message: 'Cummins API integration pending - requires API key configuration'
    };
  }

  async syncCaterpillarData(userId: string): Promise<any> {
    // Placeholder for Caterpillar API integration
    return {
      success: true,
      provider: 'caterpillar',
      syncedGenerators: 0,
      message: 'Caterpillar API integration pending - requires API key configuration'
    };
  }

  async syncWatchlinkData(userId: string): Promise<any> {
    // Placeholder for Watchlink in-house system integration
    return {
      success: true,
      provider: 'watchlink',
      syncedGenerators: 0,
      message: 'Watchlink in-house API integration pending - requires configuration'
    };
  }

  // Alert Management Implementation
  async getActiveAlerts(userId: string): Promise<MonitoringAlert[]> {
    // Get alerts for generators belonging to user's customers
    const userCustomers = await db.select()
      .from(customer)
      .where(eq(customer.status, "active"));
    
    const customerIds = userCustomers.map(c => c.cust_ID!);
    
    if (customerIds.length === 0) return [];

    return await db.select()
      .from(monitoringAlerts)
      .where(and(
        sql`${monitoringAlerts.customerId} IN (${customerIds.join(',')})`,
        sql`${monitoringAlerts.resolvedAt} IS NULL`
      ))
      .orderBy(desc(monitoringAlerts.timestamp));
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<any> {
    const [updatedAlert] = await db
      .update(monitoringAlerts)
      .set({
        acknowledgedAt: new Date(),
        acknowledgedBy: userId
      })
      .where(eq(monitoringAlerts.id, parseInt(alertId)))
      .returning();
    
    return {
      success: true,
      alert: updatedAlert,
      message: 'Alert acknowledged successfully'
    };
  }

  async createAlertThreshold(thresholdData: InsertAlertThreshold): Promise<AlertThreshold> {
    const [newThreshold] = await db
      .insert(alertThresholds)
      .values(thresholdData)
      .returning();
    return newThreshold;
  }

  async processAlert(alertData: InsertMonitoringAlert): Promise<MonitoringAlert> {
    const [newAlert] = await db
      .insert(monitoringAlerts)
      .values(alertData)
      .returning();

    // Check if we should create a service order automatically
    const [threshold] = await db.select()
      .from(alertThresholds)
      .where(and(
        eq(alertThresholds.generatorId, alertData.generatorId),
        eq(alertThresholds.alertType, alertData.alertType),
        eq(alertThresholds.createServiceOrder, true)
      ));

    if (threshold && alertData.severity === 'critical') {
      // Auto-create service order
      const nextServiceId = Date.now(); // Simple ID generation
      
      const serviceCallData = {
        service_ID: nextServiceId,
        cust_ID: alertData.customerId,
        gen_ID: parseInt(alertData.generatorId),
        order_status: 'Alert Generated',
        service_order_type: 'Alert Response',
        work_needed: `Alert: ${alertData.title} - ${alertData.description}`,
        assigned_tech: 'Auto-Assigned',
        start_date: new Date().toISOString().split('T')[0]
      };

      const serviceCall = await this.createServiceCall(serviceCallData as any);
      
      // Update alert with service order reference
      await db
        .update(monitoringAlerts)
        .set({ serviceOrderCreated: serviceCall.service_index })
        .where(eq(monitoringAlerts.id, newAlert.id));
    }

    return newAlert;
  }

  // Intelligent Scheduling Implementation
  async getTechnicianAvailability(technicianId: string, date: string): Promise<any> {
    // Get technician's schedule for the date
    const [schedule] = await db.select()
      .from(technicianSchedules)
      .where(and(
        eq(technicianSchedules.technicianId, technicianId),
        eq(technicianSchedules.date, date)
      ));

    // Get existing appointments
    const appointments = await db.select()
      .from(scheduledAppointments)
      .where(and(
        eq(scheduledAppointments.technicianId, technicianId),
        eq(scheduledAppointments.scheduledDate, date)
      ))
      .orderBy(asc(scheduledAppointments.startTime));

    return {
      technician: {
        id: technicianId,
        name: technicianId, // Would come from user table in production
      },
      date: date,
      workingHours: schedule ? {
        start: schedule.startTime,
        end: schedule.endTime
      } : {
        start: '08:00',
        end: '17:00'
      },
      currentLocation: schedule?.currentLocation || null,
      serviceRadius: schedule?.serviceRadius || 50,
      skills: schedule?.skills ? JSON.parse(schedule.skills) : [],
      status: schedule?.status || 'available',
      scheduledAppointments: appointments,
      availableSlots: this.calculateAvailableSlots(
        schedule?.startTime || '08:00',
        schedule?.endTime || '17:00',
        appointments
      )
    };
  }

  private calculateAvailableSlots(workStart: string, workEnd: string, appointments: any[]): any[] {
    const slots = [];
    let currentTime = workStart;
    
    // Sort appointments by start time
    const sortedAppointments = appointments.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    for (const appointment of sortedAppointments) {
      // Add slot before this appointment if there's time
      if (currentTime < appointment.startTime) {
        slots.push({
          start: currentTime,
          end: appointment.startTime,
          duration: this.calculateMinutesBetween(currentTime, appointment.startTime)
        });
      }
      currentTime = appointment.endTime;
    }
    
    // Add final slot if there's time left in the day
    if (currentTime < workEnd) {
      slots.push({
        start: currentTime,
        end: workEnd,
        duration: this.calculateMinutesBetween(currentTime, workEnd)
      });
    }
    
    return slots.filter(slot => slot.duration >= 60); // Only slots 1+ hours
  }

  private calculateMinutesBetween(start: string, end: string): number {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return endMinutes - startMinutes;
  }

  async optimizeRoute(optimizationRequest: any): Promise<any> {
    // Placeholder for Google Maps route optimization
    // In production, this would use Google Maps Directions API
    return {
      success: true,
      optimizedRoute: optimizationRequest.appointments,
      totalTravelTime: 0,
      totalTravelDistance: 0,
      efficiency: 0.85,
      recommendations: [
        'Google Maps API integration required for full route optimization'
      ]
    };
  }

  async scheduleAppointment(appointmentData: InsertScheduledAppointment): Promise<ScheduledAppointment> {
    const [newAppointment] = await db
      .insert(scheduledAppointments)
      .values(appointmentData)
      .returning();
    return newAppointment;
  }

  async getScheduledAppointments(userId: string): Promise<ScheduledAppointment[]> {
    // Get all scheduled appointments for user's customers
    const userCustomers = await db.select()
      .from(customer)
      .where(eq(customer.status, "active"));
    
    const customerIds = userCustomers.map(c => c.cust_ID!);
    
    if (customerIds.length === 0) return [];

    return await db.select()
      .from(scheduledAppointments)
      .where(sql`${scheduledAppointments.customerId} IN (${customerIds.join(',')})`)
      .orderBy(asc(scheduledAppointments.scheduledDate), asc(scheduledAppointments.startTime));
  }

  // Customer Portal Implementation
  async authenticateCustomer(email: string, password: string): Promise<any> {
    // Simple authentication - in production would use proper password hashing
    const [customer] = await db.select()
      .from(customerPortalUsers)
      .where(and(
        eq(customerPortalUsers.email, email),
        eq(customerPortalUsers.isActive, true)
      ));

    if (!customer) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(customerPortalSessions).values({
      id: sessionId,
      userId: customer.id,
      customerId: customer.customerId,
      expiresAt: expiresAt
    });

    // Log activity
    await db.insert(customerPortalActivity).values({
      userId: customer.id,
      customerId: customer.customerId,
      action: 'login',
      details: { loginMethod: 'email' }
    });

    return {
      success: true,
      sessionId: sessionId,
      customer: {
        id: customer.id,
        customerId: customer.customerId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        permissions: {
          canViewMonitoring: customer.canViewMonitoring,
          canViewServiceHistory: customer.canViewServiceHistory,
          canRequestService: customer.canRequestService,
          canViewInvoices: customer.canViewInvoices,
          canScheduleAppointments: customer.canScheduleAppointments
        }
      }
    };
  }

  async getCustomerDashboard(customerId: number): Promise<any> {
    // Get customer info
    const customerInfo = await this.getCustomer(customerId);
    if (!customerInfo) throw new Error('Customer not found');

    // Get generators
    const generators = await this.getGeneratorsByCustomer(customerId);

    // Get recent service history
    const recentServices = await db.select()
      .from(service_call)
      .where(eq(service_call.cust_ID, customerId))
      .orderBy(desc(service_call.service_ID))
      .limit(5);

    // Get upcoming appointments
    const upcomingAppointments = await db.select()
      .from(scheduledAppointments)
      .where(and(
        eq(scheduledAppointments.customerId, customerId),
        sql`${scheduledAppointments.scheduledDate} >= CURRENT_DATE`
      ))
      .orderBy(asc(scheduledAppointments.scheduledDate))
      .limit(3);

    return {
      customer: customerInfo,
      generators: generators,
      recentServices: recentServices,
      upcomingAppointments: upcomingAppointments,
      summary: {
        totalGenerators: generators.length,
        pendingServices: recentServices.filter(s => s.field_complete !== 'yes').length,
        upcomingAppointments: upcomingAppointments.length
      }
    };
  }

  async customerHasMonitoringAccess(customerId: number): Promise<boolean> {
    // Check if customer portal includes monitoring access
    // This would be based on the business's subscription level
    return true; // Placeholder - would check subscription in production
  }

  async customerHasSchedulingAccess(customerId: number): Promise<boolean> {
    // Check if customer portal includes scheduling access
    return true; // Placeholder - would check subscription in production
  }

  async getCustomerGeneratorStatus(customerId: number): Promise<any> {
    const generators = await this.getGeneratorsByCustomer(customerId);
    const statuses = [];

    for (const gen of generators) {
      const [latestData] = await db.select()
        .from(generatorMonitoringData)
        .where(eq(generatorMonitoringData.generatorId, gen.gen_ID!.toString()))
        .orderBy(desc(generatorMonitoringData.timestamp))
        .limit(1);

      const recentAlerts = await db.select()
        .from(monitoringAlerts)
        .where(and(
          eq(monitoringAlerts.generatorId, gen.gen_ID!.toString()),
          sql`${monitoringAlerts.timestamp} > NOW() - INTERVAL '7 days'`
        ))
        .orderBy(desc(monitoringAlerts.timestamp))
        .limit(3);

      statuses.push({
        generator: gen,
        status: latestData?.status || 'unknown',
        lastUpdate: latestData?.timestamp || null,
        metrics: latestData ? {
          fuelLevel: latestData.fuelLevel,
          batteryVoltage: latestData.batteryVoltage,
          engineHours: latestData.engineHours,
          powerOutput: latestData.powerOutput
        } : null,
        recentAlerts: recentAlerts
      });
    }

    return statuses;
  }

  async getCustomerServiceHistory(customerId: number): Promise<any> {
    const serviceHistory = await db.select()
      .from(service_call)
      .where(eq(service_call.cust_ID, customerId))
      .orderBy(desc(service_call.service_ID));

    const maintenanceHistory = await db.select()
      .from(maint)
      .where(eq(maint.cust_ID, customerId))
      .orderBy(desc(maint.maint_ID));

    return {
      serviceCalls: serviceHistory,
      maintenance: maintenanceHistory,
      summary: {
        totalServices: serviceHistory.length,
        totalMaintenance: maintenanceHistory.length,
        lastServiceDate: serviceHistory[0]?.complete_date || null,
        lastMaintenanceDate: maintenanceHistory[0]?.complete_date || null
      }
    };
  }

  async createCustomerServiceRequest(serviceRequest: any): Promise<any> {
    // Generate unique service ID
    const serviceId = Date.now();
    
    // Create service call record
    const serviceCallData = {
      service_ID: serviceId,
      cust_ID: serviceRequest.customerId,
      gen_ID: serviceRequest.generatorId || 0,
      order_status: 'Customer Request',
      service_order_type: serviceRequest.requestType || 'Service',
      work_needed: serviceRequest.description,
      assigned_tech: 'Pending Assignment',
      start_date: serviceRequest.preferredDate || new Date().toISOString().split('T')[0]
    };

    const newServiceCall = await this.createServiceCall(serviceCallData as any);

    // Log activity
    await db.insert(customerPortalActivity).values({
      userId: 0, // Would use actual customer portal user ID
      customerId: serviceRequest.customerId,
      action: 'service_request_created',
      resource: 'service_call',
      resourceId: newServiceCall.service_index.toString(),
      details: {
        requestType: serviceRequest.requestType,
        urgency: serviceRequest.urgency
      }
    });

    return {
      success: true,
      serviceCall: newServiceCall,
      message: 'Service request created successfully',
      estimatedResponse: serviceRequest.urgency === 'emergency' ? '2-4 hours' : '1-2 business days'
    };
  }

  async getCustomerAvailableSlots(customerId: number, date: string, serviceType: string, urgency: string): Promise<any[]> {
    // Get customer location
    const customerInfo = await this.getCustomer(customerId);
    if (!customerInfo) return [];

    // Get all technicians (simplified - would filter by skills/location in production)
    const technicians = await db.select()
      .from(technicianSchedules)
      .where(eq(technicianSchedules.date, date));

    const availableSlots = [];

    for (const tech of technicians) {
      const availability = await this.getTechnicianAvailability(tech.technicianId, date);
      
      for (const slot of availability.availableSlots) {
        if (slot.duration >= 60) { // Minimum 1 hour slot
          availableSlots.push({
            technicianId: tech.technicianId,
            technicianName: tech.technicianId, // Would get from users table
            date: date,
            startTime: slot.start,
            endTime: slot.end,
            duration: slot.duration,
            estimatedTravelTime: 30, // Would calculate with Google Maps
            confidence: 0.85,
            skillMatch: 1.0 // Would calculate based on requirements
          });
        }
      }
    }

    return availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  // Installation Wizard System Implementation
  async getInstallationWizard(userId: string): Promise<InstallationWizard | undefined> {
    const [wizard] = await db.select()
      .from(installationWizard)
      .where(eq(installationWizard.userId, userId));
    return wizard || undefined;
  }

  async createInstallationWizard(userId: string, wizardData: Partial<InsertInstallationWizard>): Promise<InstallationWizard> {
    const [newWizard] = await db
      .insert(installationWizard)
      .values({ ...wizardData, userId })
      .returning();
    return newWizard;
  }

  async updateInstallationWizard(userId: string, wizardData: Partial<InstallationWizard>): Promise<InstallationWizard> {
    const [updatedWizard] = await db
      .update(installationWizard)
      .set({ ...wizardData, updatedAt: new Date() })
      .where(eq(installationWizard.userId, userId))
      .returning();
    return updatedWizard;
  }

  async getInstallationSteps(userId: string): Promise<InstallationStep[]> {
    return await db.select()
      .from(installationSteps)
      .where(eq(installationSteps.userId, userId))
      .orderBy(asc(installationSteps.createdAt));
  }

  async createInstallationStep(stepData: InsertInstallationStep): Promise<InstallationStep> {
    const [newStep] = await db
      .insert(installationSteps)
      .values(stepData)
      .returning();
    return newStep;
  }

  async updateInstallationStep(stepId: number, stepData: Partial<InstallationStep>): Promise<InstallationStep> {
    const [updatedStep] = await db
      .update(installationSteps)
      .set(stepData)
      .where(eq(installationSteps.id, stepId))
      .returning();
    return updatedStep;
  }

  async getInstallationConfig(userId: string, category?: string): Promise<InstallationConfig[]> {
    if (category) {
      return await db.select()
        .from(installationConfig)
        .where(and(
          eq(installationConfig.userId, userId),
          eq(installationConfig.category, category)
        ));
    }

    return await db.select()
      .from(installationConfig)
      .where(eq(installationConfig.userId, userId));
  }

  async setInstallationConfig(configData: InsertInstallationConfig): Promise<InstallationConfig> {
    const [newConfig] = await db
      .insert(installationConfig)
      .values({ ...configData, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [installationConfig.userId, installationConfig.configKey],
        set: {
          configValue: configData.configValue,
          status: configData.status,
          updatedAt: new Date()
        }
      })
      .returning();
    return newConfig;
  }

  async verifyGoogleConfiguration(userId: string): Promise<any> {
    // Check if Google API keys are configured in environment
    const hasGoogleMapsKey = !!process.env.GOOGLE_MAPS_API_KEY;
    const hasGoogleCalendarId = !!process.env.GOOGLE_CALENDAR_CLIENT_ID;
    const hasGoogleCalendarSecret = !!process.env.GOOGLE_CALENDAR_CLIENT_SECRET;

    // Update installation configuration based on available keys
    if (hasGoogleMapsKey) {
      await this.setInstallationConfig({
        userId,
        configKey: 'google_maps_api_key',
        configValue: 'configured',
        category: 'google',
        status: 'configured'
      });
    }

    if (hasGoogleCalendarId && hasGoogleCalendarSecret) {
      await this.setInstallationConfig({
        userId,
        configKey: 'google_calendar_credentials',
        configValue: 'configured',
        category: 'google',
        status: 'configured'
      });
    }

    return {
      googleMaps: {
        configured: hasGoogleMapsKey,
        status: hasGoogleMapsKey ? 'configured' : 'missing',
        capabilities: hasGoogleMapsKey ? ['route_optimization', 'distance_calculation', 'geocoding'] : []
      },
      googleCalendar: {
        configured: hasGoogleCalendarId && hasGoogleCalendarSecret,
        status: (hasGoogleCalendarId && hasGoogleCalendarSecret) ? 'configured' : 'missing',
        capabilities: (hasGoogleCalendarId && hasGoogleCalendarSecret) ? ['calendar_sync', 'event_creation', 'conflict_detection'] : []
      },
      googleWorkspace: {
        configured: hasGoogleCalendarId && hasGoogleCalendarSecret,
        status: (hasGoogleCalendarId && hasGoogleCalendarSecret) ? 'configured' : 'missing',
        capabilities: (hasGoogleCalendarId && hasGoogleCalendarSecret) ? ['workspace_integration', 'team_calendars'] : []
      }
    };
  }

  // Parts Request Workflow Implementation
  async createPartsRequest(requestData: InsertPartsRequest): Promise<PartsRequest> {
    // Generate unique request number
    const requestNumber = `PR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const [newRequest] = await db
      .insert(partsRequests)
      .values({ ...requestData, requestNumber })
      .returning();
    return newRequest;
  }

  async getPartsRequests(filters?: { status?: string; requestedBy?: string; customerId?: number }): Promise<PartsRequest[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(partsRequests.status, filters.status));
    }
    if (filters?.requestedBy) {
      conditions.push(eq(partsRequests.requestedBy, filters.requestedBy));
    }
    if (filters?.customerId) {
      conditions.push(eq(partsRequests.customerId, filters.customerId));
    }
    
    if (conditions.length > 0) {
      return await db.select()
        .from(partsRequests)
        .where(and(...conditions))
        .orderBy(desc(partsRequests.requestDate));
    }
    
    return await db.select()
      .from(partsRequests)
      .orderBy(desc(partsRequests.requestDate));
  }

  async getPartsRequest(id: number): Promise<PartsRequest | undefined> {
    const [request] = await db.select().from(partsRequests).where(eq(partsRequests.id, id));
    return request || undefined;
  }

  async updatePartsRequest(id: number, updates: Partial<PartsRequest>): Promise<PartsRequest> {
    const [updatedRequest] = await db
      .update(partsRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(partsRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async updatePartsRequestStatus(id: number, status: string, updates?: Partial<PartsRequest>): Promise<PartsRequest> {
    const [updatedRequest] = await db
      .update(partsRequests)
      .set({ 
        status, 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(partsRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getPartsRequestsByWarehouseManager(managerId: string): Promise<PartsRequest[]> {
    return await db.select()
      .from(partsRequests)
      .where(or(
        eq(partsRequests.status, "tech_requested"),
        eq(partsRequests.status, "warehouse_review"),
        and(
          eq(partsRequests.warehouseManagerId, managerId),
          sql`${partsRequests.status} IN ('vendor_ordered', 'received')`
        )
      ))
      .orderBy(asc(partsRequests.requestDate));
  }

  async getPartsRequestsByTechnician(technicianId: string): Promise<PartsRequest[]> {
    return await db.select()
      .from(partsRequests)
      .where(eq(partsRequests.requestedBy, technicianId))
      .orderBy(desc(partsRequests.requestDate));
  }

  // Business Forms System Implementation
  async createBusinessForm(formData: InsertBusinessForm): Promise<BusinessForm> {
    // Generate unique form number based on form type
    const formNumber = `${formData.formType.toUpperCase()}-${Date.now()}`;
    
    const [newForm] = await db
      .insert(businessForms)
      .values({ ...formData, formNumber })
      .returning();
    return newForm;
  }

  async getBusinessForms(filters?: { formType?: string; customerId?: number; status?: string }): Promise<BusinessForm[]> {
    const conditions = [];
    
    if (filters?.formType) {
      conditions.push(eq(businessForms.formType, filters.formType));
    }
    if (filters?.customerId) {
      conditions.push(eq(businessForms.customerId, filters.customerId));
    }
    if (filters?.status) {
      conditions.push(eq(businessForms.status, filters.status));
    }
    
    if (conditions.length > 0) {
      return await db.select()
        .from(businessForms)
        .where(and(...conditions))
        .orderBy(desc(businessForms.createdAt));
    }
    
    return await db.select()
      .from(businessForms)
      .orderBy(desc(businessForms.createdAt));
  }

  async getBusinessForm(id: number): Promise<BusinessForm | undefined> {
    const [form] = await db.select().from(businessForms).where(eq(businessForms.id, id));
    return form || undefined;
  }

  async updateBusinessForm(id: number, updates: Partial<BusinessForm>): Promise<BusinessForm> {
    const [updatedForm] = await db
      .update(businessForms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessForms.id, id))
      .returning();
    return updatedForm;
  }

  async getFormTemplate(formType: string): Promise<FormTemplate | undefined> {
    const [template] = await db.select()
      .from(formTemplates)
      .where(and(
        eq(formTemplates.formType, formType),
        eq(formTemplates.isActive, true)
      ));
    return template || undefined;
  }

  async createFormTemplate(templateData: InsertFormTemplate): Promise<FormTemplate> {
    const [newTemplate] = await db
      .insert(formTemplates)
      .values(templateData)
      .returning();
    return newTemplate;
  }

  // Tenant Configuration System - Full Customization
  async createTenant(tenantData: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db
      .insert(tenants)
      .values(tenantData)
      .returning();
    return newTenant;
  }

  async getTenant(tenantId: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
    return tenant || undefined;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    return tenant || undefined;
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenants.id, tenantId))
      .returning();
    return updatedTenant;
  }

  // Tenant Vocabularies - Dynamic Dropdowns
  async createTenantVocabulary(vocabularyData: InsertTenantVocabulary): Promise<TenantVocabulary> {
    const [newVocabulary] = await db
      .insert(tenantVocabularies)
      .values(vocabularyData)
      .returning();
    return newVocabulary;
  }

  async getTenantVocabularies(tenantId: string, category?: string): Promise<TenantVocabulary[]> {
    const conditions = [eq(tenantVocabularies.tenantId, tenantId)];
    
    if (category) {
      conditions.push(eq(tenantVocabularies.category, category));
    }
    
    return await db.select()
      .from(tenantVocabularies)
      .where(and(...conditions))
      .orderBy(asc(tenantVocabularies.category));
  }

  async updateTenantVocabulary(id: number, updates: Partial<TenantVocabulary>): Promise<TenantVocabulary> {
    const [updatedVocabulary] = await db
      .update(tenantVocabularies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenantVocabularies.id, id))
      .returning();
    return updatedVocabulary;
  }

  // Tenant Field Labels - Custom Terminology
  async createTenantFieldLabel(fieldData: InsertTenantFieldLabel): Promise<TenantFieldLabel> {
    const [newField] = await db
      .insert(tenantFieldLabels)
      .values(fieldData)
      .returning();
    return newField;
  }

  async getTenantFieldLabels(tenantId: string): Promise<TenantFieldLabel[]> {
    return await db.select()
      .from(tenantFieldLabels)
      .where(eq(tenantFieldLabels.tenantId, tenantId))
      .orderBy(asc(tenantFieldLabels.fieldKey));
  }

  async updateTenantFieldLabel(id: number, updates: Partial<TenantFieldLabel>): Promise<TenantFieldLabel> {
    const [updatedField] = await db
      .update(tenantFieldLabels)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenantFieldLabels.id, id))
      .returning();
    return updatedField;
  }

  // Maintenance Contracts - Comprehensive Tracking
  async createMaintenanceContract(contractData: InsertMaintenanceContract): Promise<MaintenanceContract> {
    const [newContract] = await db
      .insert(maintenanceContracts)
      .values(contractData)
      .returning();
    return newContract;
  }

  async getMaintenanceContracts(tenantId: string, filters?: { 
    status?: string; 
    customerId?: number; 
    overdue?: boolean;
    dueWithinDays?: number;
  }): Promise<MaintenanceContract[]> {
    const conditions = [eq(maintenanceContracts.tenantId, tenantId)];
    
    if (filters?.status) {
      conditions.push(eq(maintenanceContracts.status, filters.status));
    }
    if (filters?.customerId) {
      conditions.push(eq(maintenanceContracts.customerId, filters.customerId));
    }
    if (filters?.overdue) {
      conditions.push(sql`${maintenanceContracts.nextServiceDue} < CURRENT_DATE`);
    }
    if (filters?.dueWithinDays) {
      conditions.push(sql`${maintenanceContracts.nextServiceDue} <= CURRENT_DATE + INTERVAL '${filters.dueWithinDays} days'`);
    }
    
    return await db.select()
      .from(maintenanceContracts)
      .where(and(...conditions))
      .orderBy(asc(maintenanceContracts.nextServiceDue));
  }

  async getMaintenanceContract(id: number): Promise<MaintenanceContract | undefined> {
    const [contract] = await db.select().from(maintenanceContracts).where(eq(maintenanceContracts.id, id));
    return contract || undefined;
  }

  async updateMaintenanceContract(id: number, updates: Partial<MaintenanceContract>): Promise<MaintenanceContract> {
    const [updatedContract] = await db
      .update(maintenanceContracts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(maintenanceContracts.id, id))
      .returning();
    return updatedContract;
  }

  // Service History - Comprehensive Tracking
  async createServiceHistory(serviceData: InsertServiceHistory): Promise<ServiceHistory> {
    const [newService] = await db
      .insert(serviceHistory)
      .values(serviceData)
      .returning();
    return newService;
  }

  async getServiceHistory(tenantId: string, filters?: {
    generatorId?: number;
    customerId?: number;
    serviceType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ServiceHistory[]> {
    const conditions = [eq(serviceHistory.tenantId, tenantId)];
    
    if (filters?.generatorId) {
      conditions.push(eq(serviceHistory.generatorId, filters.generatorId));
    }
    if (filters?.customerId) {
      conditions.push(eq(serviceHistory.customerId, filters.customerId));
    }
    if (filters?.serviceType) {
      conditions.push(eq(serviceHistory.serviceType, filters.serviceType));
    }
    if (filters?.dateFrom) {
      conditions.push(sql`${serviceHistory.serviceDate} >= ${filters.dateFrom}`);
    }
    if (filters?.dateTo) {
      conditions.push(sql`${serviceHistory.serviceDate} <= ${filters.dateTo}`);
    }
    
    return await db.select()
      .from(serviceHistory)
      .where(and(...conditions))
      .orderBy(desc(serviceHistory.serviceDate));
  }

  // Business Metrics & Reporting
  async createBusinessMetric(metricData: InsertBusinessMetric): Promise<BusinessMetric> {
    const [newMetric] = await db
      .insert(businessMetrics)
      .values(metricData)
      .returning();
    return newMetric;
  }

  async getBusinessMetrics(tenantId: string, filters?: {
    metricType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<BusinessMetric[]> {
    const conditions = [eq(businessMetrics.tenantId, tenantId)];
    
    if (filters?.metricType) {
      conditions.push(eq(businessMetrics.metricType, filters.metricType));
    }
    if (filters?.dateFrom) {
      conditions.push(sql`${businessMetrics.metricDate} >= ${filters.dateFrom}`);
    }
    if (filters?.dateTo) {
      conditions.push(sql`${businessMetrics.metricDate} <= ${filters.dateTo}`);
    }
    
    return await db.select()
      .from(businessMetrics)
      .where(and(...conditions))
      .orderBy(desc(businessMetrics.metricDate));
  }

  // Comprehensive Reporting Queries
  async getServiceDueReport(tenantId: string): Promise<any[]> {
    return await db.execute(sql`
      SELECT 
        mc.id,
        mc.contract_number,
        c.company_name,
        mc.service_frequency,
        mc.last_service_date,
        mc.next_service_due,
        mc.days_until_due,
        CASE 
          WHEN mc.next_service_due < CURRENT_DATE THEN 'overdue'
          WHEN mc.next_service_due <= CURRENT_DATE + INTERVAL '7 days' THEN 'due_soon'
          WHEN mc.next_service_due <= CURRENT_DATE + INTERVAL '30 days' THEN 'upcoming'
          ELSE 'future'
        END as urgency_status
      FROM maintenance_contracts mc
      JOIN customer c ON mc.customer_id = c.cust_id
      WHERE mc.tenant_id = ${tenantId}
        AND mc.status = 'active'
      ORDER BY mc.next_service_due ASC
    `);
  }

  async getPerformanceMetrics(tenantId: string, dateFrom: Date, dateTo: Date): Promise<any[]> {
    return await db.execute(sql`
      SELECT 
        AVG(response_time) as avg_response_time,
        AVG(service_time) as avg_service_time,
        AVG(customer_rating) as avg_customer_rating,
        COUNT(*) as total_services,
        SUM(total_cost) as total_revenue,
        AVG(total_cost) as avg_service_cost
      FROM service_history 
      WHERE tenant_id = ${tenantId}
        AND service_date BETWEEN ${dateFrom} AND ${dateTo}
    `);
  }

  async getContractRenewalReport(tenantId: string, daysAhead: number = 90): Promise<any[]> {
    return await db.execute(sql`
      SELECT 
        mc.id,
        mc.contract_number,
        c.company_name,
        mc.end_date,
        mc.contract_value,
        mc.auto_renew,
        mc.account_manager,
        EXTRACT(days FROM mc.end_date - CURRENT_DATE) as days_until_expiry
      FROM maintenance_contracts mc
      JOIN customer c ON mc.customer_id = c.cust_id
      WHERE mc.tenant_id = ${tenantId}
        AND mc.status = 'active'
        AND mc.end_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
      ORDER BY mc.end_date ASC
    `);
  }

  // ============== USER ROLES & PERMISSIONS SYSTEM ==============

  // Initialize default roles and permissions for a tenant
  async initializeTenantRoles(tenantId: string): Promise<void> {
    // Default roles for generator service businesses
    const defaultRoles = [
      { roleName: 'super_admin', displayName: 'Super Administrator', description: 'Full system access', isSystemRole: true, priority: 1, colorCode: '#dc2626' },
      { roleName: 'admin', displayName: 'Administrator', description: 'Administrative access', isSystemRole: true, priority: 10, colorCode: '#ea580c' },
      { roleName: 'office', displayName: 'Office Staff', description: 'Office operations and customer management', isSystemRole: true, priority: 20, colorCode: '#2563eb' },
      { roleName: 'manager', displayName: 'Manager', description: 'Supervisory access and approvals', isSystemRole: true, priority: 15, colorCode: '#7c3aed' },
      { roleName: 'service_technician', displayName: 'Service Technician', description: 'Field service and repair work', isSystemRole: true, priority: 30, colorCode: '#059669' },
      { roleName: 'maintenance_technician', displayName: 'Maintenance Technician', description: 'Scheduled maintenance operations', isSystemRole: true, priority: 30, colorCode: '#0891b2' },
      { roleName: 'warehouse', displayName: 'Warehouse Staff', description: 'Inventory and parts management', isSystemRole: true, priority: 40, colorCode: '#ca8a04' },
      { roleName: 'customer', displayName: 'Customer', description: 'Customer portal access', isSystemRole: true, priority: 100, colorCode: '#6b7280' }
    ];

    for (const role of defaultRoles) {
      await db.insert(userRoles).values({
        tenantId,
        ...role
      }).onConflictDoNothing();
    }
  }

  // User Roles Management
  async createUserRole(roleData: InsertUserRole): Promise<UserRole> {
    const [newRole] = await db
      .insert(userRoles)
      .values(roleData)
      .returning();
    return newRole;
  }

  async getUserRoles(tenantId: string): Promise<UserRole[]> {
    return await db.select()
      .from(userRoles)
      .where(and(
        eq(userRoles.tenantId, tenantId),
        eq(userRoles.isActive, true)
      ))
      .orderBy(asc(userRoles.priority), asc(userRoles.displayName));
  }

  async getUserRole(roleId: number): Promise<UserRole | undefined> {
    const [role] = await db.select().from(userRoles).where(eq(userRoles.id, roleId));
    return role || undefined;
  }

  async updateUserRole(roleId: number, updates: Partial<UserRole>): Promise<UserRole> {
    const [updatedRole] = await db
      .update(userRoles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userRoles.id, roleId))
      .returning();
    return updatedRole;
  }

  // Permissions Management
  async createPermission(permissionData: InsertPermission): Promise<Permission> {
    const [newPermission] = await db
      .insert(permissions)
      .values(permissionData)
      .returning();
    return newPermission;
  }

  async getPermissions(category?: string): Promise<Permission[]> {
    const conditions = [];
    if (category) {
      conditions.push(eq(permissions.category, category));
    }

    return await db.select()
      .from(permissions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(permissions.category), asc(permissions.permissionName));
  }

  async getPermissionsByRole(tenantId: string, roleId: number): Promise<Permission[]> {
    return await db.select({
      id: permissions.id,
      permissionKey: permissions.permissionKey,
      permissionName: permissions.permissionName,
      description: permissions.description,
      category: permissions.category,
      subcategory: permissions.subcategory,
      isSystemPermission: permissions.isSystemPermission,
      requiresApproval: permissions.requiresApproval,
      createdAt: permissions.createdAt
    })
      .from(permissions)
      .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
      .where(and(
        eq(rolePermissions.tenantId, tenantId),
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.isGranted, true)
      ))
      .orderBy(asc(permissions.category), asc(permissions.permissionName));
  }

  // Role Permissions Management
  async assignPermissionToRole(assignmentData: InsertRolePermission): Promise<RolePermission> {
    const [assignment] = await db
      .insert(rolePermissions)
      .values(assignmentData)
      .returning();
    return assignment;
  }

  async revokePermissionFromRole(tenantId: string, roleId: number, permissionId: number): Promise<void> {
    await db
      .update(rolePermissions)
      .set({ isGranted: false })
      .where(and(
        eq(rolePermissions.tenantId, tenantId),
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      ));
  }

  // User Role Assignments
  async assignRoleToUser(assignmentData: InsertUserRoleAssignment): Promise<UserRoleAssignment> {
    const [assignment] = await db
      .insert(userRoleAssignments)
      .values(assignmentData)
      .returning();
    return assignment;
  }

  async getUserRoleAssignments(tenantId: string, userId: string): Promise<UserRole[]> {
    return await db.select({
      id: userRoles.id,
      tenantId: userRoles.tenantId,
      roleName: userRoles.roleName,
      displayName: userRoles.displayName,
      description: userRoles.description,
      isSystemRole: userRoles.isSystemRole,
      isActive: userRoles.isActive,
      priority: userRoles.priority,
      colorCode: userRoles.colorCode,
      createdAt: userRoles.createdAt,
      updatedAt: userRoles.updatedAt
    })
      .from(userRoles)
      .innerJoin(userRoleAssignments, eq(userRoles.id, userRoleAssignments.roleId))
      .where(and(
        eq(userRoleAssignments.tenantId, tenantId),
        eq(userRoleAssignments.userId, userId),
        eq(userRoleAssignments.isActive, true)
      ))
      .orderBy(asc(userRoles.priority));
  }

  async getUserPermissions(tenantId: string, userId: string): Promise<Permission[]> {
    return await db.execute(sql`
      SELECT DISTINCT p.*
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_role_assignments ura ON rp.role_id = ura.role_id
      WHERE ura.tenant_id = ${tenantId}
        AND ura.user_id = ${userId}
        AND ura.is_active = true
        AND rp.is_granted = true
        AND (rp.expires_at IS NULL OR rp.expires_at > NOW())
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
      ORDER BY p.category, p.permission_name
    `);
  }

  async hasPermission(tenantId: string, userId: string, permissionKey: string): Promise<boolean> {
    const result = await db.execute(sql`
      SELECT 1
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_role_assignments ura ON rp.role_id = ura.role_id
      WHERE ura.tenant_id = ${tenantId}
        AND ura.user_id = ${userId}
        AND p.permission_key = ${permissionKey}
        AND ura.is_active = true
        AND rp.is_granted = true
        AND (rp.expires_at IS NULL OR rp.expires_at > NOW())
        AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
      LIMIT 1
    `);
    
    return result.rowCount > 0;
  }

  async revokeUserRole(tenantId: string, userId: string, roleId: number): Promise<void> {
    await db
      .update(userRoleAssignments)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(
        eq(userRoleAssignments.tenantId, tenantId),
        eq(userRoleAssignments.userId, userId),
        eq(userRoleAssignments.roleId, roleId)
      ));
  }

  // Permission Requests
  async createPermissionRequest(requestData: InsertPermissionRequest): Promise<PermissionRequest> {
    const [request] = await db
      .insert(permissionRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getPermissionRequests(tenantId: string, status?: string): Promise<PermissionRequest[]> {
    const conditions = [eq(permissionRequests.tenantId, tenantId)];
    
    if (status) {
      conditions.push(eq(permissionRequests.status, status));
    }
    
    return await db.select()
      .from(permissionRequests)
      .where(and(...conditions))
      .orderBy(desc(permissionRequests.createdAt));
  }

  async reviewPermissionRequest(requestId: number, status: string, reviewerId: string, notes?: string): Promise<PermissionRequest> {
    const [request] = await db
      .update(permissionRequests)
      .set({
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(permissionRequests.id, requestId))
      .returning();
    return request;
  }

  // ============== CORE BUSINESS WORKFLOW IMPLEMENTATIONS ==============

  // Quote-to-Install Workflow Implementation
  async approveQuote(id: number, approvedBy: string): Promise<SelectQuote> {
    return await db.transaction(async (tx) => {
      // Check if quote is already approved (concurrency protection)
      const [existingQuote] = await tx.select().from(quotes).where(eq(quotes.id, id));
      
      if (!existingQuote) {
        throw new Error(`Quote ${id} not found`);
      }
      
      if (existingQuote.quote_status === 'approved') {
        throw new Error(`Quote ${id} is already approved`);
      }
      
      if (existingQuote.converted_to_install) {
        throw new Error(`Quote ${id} has already been converted to install order`);
      }

      // Atomically approve the quote
      const [updatedQuote] = await tx
        .update(quotes)
        .set({
          quote_status: 'approved',
          approval_date: new Date(),
          approved_by: approvedBy,
          converted_to_install: false
        })
        .where(eq(quotes.id, id))
        .returning();
      
      return updatedQuote;
    });
  }

  async convertQuoteToInstall(quoteId: number, installData: InsertInstallOrder): Promise<SelectInstallOrder> {
    return await db.transaction(async (tx) => {
      // Validate quote exists and is approved (concurrency protection)
      const [existingQuote] = await tx.select().from(quotes).where(eq(quotes.id, quoteId));
      
      if (!existingQuote) {
        throw new Error(`Quote ${quoteId} not found`);
      }
      
      if (existingQuote.quote_status !== 'approved') {
        throw new Error(`Quote ${quoteId} must be approved before conversion to install order`);
      }
      
      if (existingQuote.converted_to_install) {
        throw new Error(`Quote ${quoteId} has already been converted to install order`);
      }

      // Generate unique order number
      const orderNumber = `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create install order atomically
      const [installOrder] = await tx
        .insert(installOrders)
        .values({
          quote_id: quoteId,
          order_number: orderNumber,
          customer_id: installData.customer_id,
          status: 'pending',
          install_type: installData.install_type || 'new_install',
          generator_info: installData.generator_info,
          material_cost: installData.material_cost,
          labor_cost: installData.labor_cost,
          total_cost: installData.total_cost,
          created_by: installData.created_by
        })
        .returning();

      // Mark quote as converted atomically
      await tx
        .update(quotes)
        .set({
          converted_to_install: true,
          install_order_id: installOrder.id
        })
        .where(eq(quotes.id, quoteId));

      return installOrder;
    });
  }

  // Install Order Management
  async getInstallOrders(status?: string): Promise<SelectInstallOrder[]> {
    let query = db.select().from(installOrders);
    
    if (status) {
      query = query.where(eq(installOrders.status, status));
    }
    
    return await query.orderBy(desc(installOrders.created_at));
  }

  async getInstallOrder(id: number): Promise<SelectInstallOrder | undefined> {
    const [order] = await db.select().from(installOrders).where(eq(installOrders.id, id));
    return order;
  }

  async updateInstallOrder(id: number, data: Partial<InsertInstallOrder>): Promise<SelectInstallOrder> {
    const [updatedOrder] = await db
      .update(installOrders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(installOrders.id, id))
      .returning();
    
    return updatedOrder;
  }

  async addInstallInventory(installOrderId: number, items: InsertInstallInventory[]): Promise<SelectInstallInventory[]> {
    const inventoryItems = items.map(item => ({
      install_order_id: installOrderId,
      part_number: item.part_number,
      part_name: item.part_name,
      quantity_used: item.quantity_used,
      unit_cost: item.unit_cost,
      total_cost: item.total_cost,
      supplier: item.supplier,
      installed_by: item.installed_by
    }));

    return await db.insert(installInventory).values(inventoryItems).returning();
  }

  async getInstallInventory(installOrderId: number): Promise<SelectInstallInventory[]> {
    return await db.select().from(installInventory)
      .where(eq(installInventory.install_order_id, installOrderId));
  }

  // Installation Checklist
  async getInstallationChecklist(installOrderId: number): Promise<SelectInstallationChecklist[]> {
    return await db.select().from(installationChecklist)
      .where(eq(installationChecklist.install_order_id, installOrderId));
  }

  async updateChecklistItem(id: number, completed: boolean, completedBy: string, notes?: string): Promise<SelectInstallationChecklist> {
    const updateData: any = {
      is_completed: completed,
      completed_by: completedBy
    };

    if (completed) {
      updateData.completed_at = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    const [updatedItem] = await db
      .update(installationChecklist)
      .set(updateData)
      .where(eq(installationChecklist.id, id))
      .returning();

    return updatedItem;
  }

  // Customer Lifecycle Management
  async getCustomerLifecycle(customerId: number): Promise<SelectCustomerLifecycle> {
    const [lifecycle] = await db.select().from(customerLifecycle)
      .where(eq(customerLifecycle.customer_id, customerId));
    
    if (!lifecycle) {
      const [newLifecycle] = await db.insert(customerLifecycle)
        .values({ customer_id: customerId, current_stage: 'lead' })
        .returning();
      return newLifecycle;
    }
    
    return lifecycle;
  }

  async updateCustomerLifecycleStage(customerId: number, stage: string, date?: Date): Promise<SelectCustomerLifecycle> {
    const stageDate = date || new Date();
    const updateData: any = { current_stage: stage, updated_at: new Date() };

    switch (stage) {
      case 'lead':
        updateData.lead_date = stageDate;
        break;
      case 'quote':
        updateData.quote_date = stageDate;
        break;
      case 'install':
        updateData.install_date = stageDate;
        break;
      case 'active':
        updateData.activation_date = stageDate;
        break;
    }

    const [updatedLifecycle] = await db
      .update(customerLifecycle)
      .set(updateData)
      .where(eq(customerLifecycle.customer_id, customerId))
      .returning();

    return updatedLifecycle;
  }

  // Employee Time Tracking
  async clockIn(employeeId: string, location?: string): Promise<SelectEmployeeTimeEntry> {
    const workDate = new Date().toISOString().split('T')[0];
    
    const [timeEntry] = await db.insert(employeeTimeEntries).values({
      employee_id: employeeId,
      work_date: workDate,
      entry_type: 'clock_in',
      start_time: new Date(),
      location: location,
      activity_description: 'Clock in for work day'
    }).returning();

    return timeEntry;
  }

  async clockOut(employeeId: string): Promise<SelectEmployeeTimeEntry> {
    const workDate = new Date().toISOString().split('T')[0];
    
    const [timeEntry] = await db.insert(employeeTimeEntries).values({
      employee_id: employeeId,
      work_date: workDate,
      entry_type: 'clock_out',
      start_time: new Date(),
      activity_description: 'Clock out for work day'
    }).returning();

    return timeEntry;
  }

  async addTimeEntry(entry: InsertEmployeeTimeEntry): Promise<SelectEmployeeTimeEntry> {
    const [newEntry] = await db.insert(employeeTimeEntries).values(entry).returning();
    return newEntry;
  }

  async getEmployeeTimeEntries(employeeId: string, startDate: Date, endDate: Date): Promise<SelectEmployeeTimeEntry[]> {
    return await db.select().from(employeeTimeEntries)
      .where(
        and(
          eq(employeeTimeEntries.employee_id, employeeId),
          sql`${employeeTimeEntries.work_date} >= ${startDate.toISOString().split('T')[0]}`,
          sql`${employeeTimeEntries.work_date} <= ${endDate.toISOString().split('T')[0]}`
        )
      )
      .orderBy(desc(employeeTimeEntries.start_time));
  }

  async getDailyTimeSummary(employeeId: string, date: Date): Promise<SelectDailyTimeSummary | undefined> {
    const workDate = date.toISOString().split('T')[0];
    
    const [summary] = await db.select().from(dailyTimeSummaries)
      .where(
        and(
          eq(dailyTimeSummaries.employee_id, employeeId),
          sql`${dailyTimeSummaries.work_date} = ${workDate}`
        )
      );

    return summary;
  }
}

export const storage = new DatabaseStorage();