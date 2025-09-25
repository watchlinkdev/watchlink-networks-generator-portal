import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Replit Auth (Google Workspace authentication)
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Generator Monitoring Routes - Real-time data collection and alerts
  
  // Main monitoring dashboard data
  app.get('/api/monitoring/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Check if user has monitoring addon enabled
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const dashboardData = await storage.getMonitoringDashboard(userId);
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching monitoring dashboard:", error);
      res.status(500).json({ message: "Failed to fetch monitoring data" });
    }
  });

  // Real-time generator status for all monitored generators
  app.get('/api/monitoring/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const generatorStatuses = await storage.getAllGeneratorStatuses(userId);
      res.json(generatorStatuses);
    } catch (error) {
      console.error("Error fetching generator statuses:", error);
      res.status(500).json({ message: "Failed to fetch generator statuses" });
    }
  });

  // Individual generator monitoring data with history
  app.get('/api/monitoring/generator/:generatorId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { generatorId } = req.params;
      const { timeRange = '24h' } = req.query;
      
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const monitoringData = await storage.getGeneratorMonitoringHistory(generatorId, timeRange as string);
      res.json(monitoringData);
    } catch (error) {
      console.error("Error fetching generator monitoring data:", error);
      res.status(500).json({ message: "Failed to fetch generator monitoring data" });
    }
  });

  // Manufacturer API Integration Routes - Generac, Kohler, Cummins, Caterpillar
  
  // Generac Mobile Link integration
  app.post('/api/monitoring/generac/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const syncResult = await storage.syncGeneracData(userId);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing Generac data:", error);
      res.status(500).json({ message: "Failed to sync Generac data" });
    }
  });

  // Kohler OnCue Connect integration  
  app.post('/api/monitoring/kohler/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const syncResult = await storage.syncKohlerData(userId);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing Kohler data:", error);
      res.status(500).json({ message: "Failed to sync Kohler data" });
    }
  });

  // Cummins Connect integration
  app.post('/api/monitoring/cummins/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const syncResult = await storage.syncCumminsData(userId);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing Cummins data:", error);
      res.status(500).json({ message: "Failed to sync Cummins data" });
    }
  });

  // Caterpillar Cat Connect integration
  app.post('/api/monitoring/caterpillar/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const syncResult = await storage.syncCaterpillarData(userId);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing Caterpillar data:", error);
      res.status(500).json({ message: "Failed to sync Caterpillar data" });
    }
  });

  // Watchlink in-house monitoring system integration
  app.post('/api/monitoring/watchlink/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const syncResult = await storage.syncWatchlinkData(userId);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing Watchlink data:", error);
      res.status(500).json({ message: "Failed to sync Watchlink data" });
    }
  });

  // Alert Management Routes
  
  // Get all active alerts
  app.get('/api/alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const alerts = await storage.getActiveAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Acknowledge alert
  app.post('/api/alerts/:alertId/acknowledge', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { alertId } = req.params;
      
      const result = await storage.acknowledgeAlert(alertId, userId);
      res.json(result);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Create alert threshold configuration
  app.post('/api/alerts/thresholds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const thresholdConfig = req.body;
      
      const hasAccess = await storage.hasAddonAccess(userId, 'remote_monitoring');
      if (!hasAccess) {
        return res.status(403).json({ message: "Remote monitoring addon required" });
      }
      
      const result = await storage.createAlertThreshold(thresholdConfig);
      res.json(result);
    } catch (error) {
      console.error("Error creating alert threshold:", error);
      res.status(500).json({ message: "Failed to create alert threshold" });
    }
  });

  // Intelligent Scheduling Routes
  
  // Get technician availability
  app.get('/api/scheduling/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date, technicianId } = req.query;
      
      const hasAccess = await storage.hasAddonAccess(userId, 'intelligent_scheduling');
      if (!hasAccess) {
        return res.status(403).json({ message: "Intelligent scheduling addon required" });
      }
      
      const availability = await storage.getTechnicianAvailability(technicianId as string, date as string);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Optimize route for technician
  app.post('/api/scheduling/optimize', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const optimizationRequest = req.body;
      
      const hasAccess = await storage.hasAddonAccess(userId, 'intelligent_scheduling');
      if (!hasAccess) {
        return res.status(403).json({ message: "Intelligent scheduling addon required" });
      }
      
      const optimizedRoute = await storage.optimizeRoute(optimizationRequest);
      res.json(optimizedRoute);
    } catch (error) {
      console.error("Error optimizing route:", error);
      res.status(500).json({ message: "Failed to optimize route" });
    }
  });

  // Schedule new appointment with smart suggestions
  app.post('/api/scheduling/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentRequest = req.body;
      
      const hasAccess = await storage.hasAddonAccess(userId, 'intelligent_scheduling');
      if (!hasAccess) {
        return res.status(403).json({ message: "Intelligent scheduling addon required" });
      }
      
      const schedulingResult = await storage.scheduleAppointment(appointmentRequest);
      res.json(schedulingResult);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      res.status(500).json({ message: "Failed to schedule appointment" });
    }
  });

  // Customer Portal Routes - Self-service portal for customers
  
  // Customer portal authentication
  app.post('/api/customer-portal/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const authResult = await storage.authenticateCustomer(email, password);
      res.json(authResult);
    } catch (error) {
      console.error("Error authenticating customer:", error);
      res.status(500).json({ message: "Failed to authenticate customer" });
    }
  });

  // Customer portal dashboard
  app.get('/api/customer-portal/dashboard', async (req: any, res) => {
    try {
      const customerId = req.customer?.id; // From customer auth middleware
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      
      const dashboardData = await storage.getCustomerDashboard(customerId);
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching customer dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Customer generator monitoring (if monitoring addon enabled)
  app.get('/api/customer-portal/monitoring', async (req: any, res) => {
    try {
      const customerId = req.customer?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      
      // Check if customer portal includes monitoring access
      const hasMonitoringAccess = await storage.customerHasMonitoringAccess(customerId);
      if (!hasMonitoringAccess) {
        return res.status(403).json({ message: "Generator monitoring not available in your plan" });
      }
      
      const monitoringData = await storage.getCustomerGeneratorStatus(customerId);
      res.json(monitoringData);
    } catch (error) {
      console.error("Error fetching customer monitoring data:", error);
      res.status(500).json({ message: "Failed to fetch monitoring data" });
    }
  });

  // Customer service history
  app.get('/api/customer-portal/service-history', async (req: any, res) => {
    try {
      const customerId = req.customer?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      
      const serviceHistory = await storage.getCustomerServiceHistory(customerId);
      res.json(serviceHistory);
    } catch (error) {
      console.error("Error fetching service history:", error);
      res.status(500).json({ message: "Failed to fetch service history" });
    }
  });

  // Customer service request submission
  app.post('/api/customer-portal/service-request', async (req: any, res) => {
    try {
      const customerId = req.customer?.id;
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      
      const serviceRequest = req.body;
      serviceRequest.customerId = customerId;
      
      const result = await storage.createCustomerServiceRequest(serviceRequest);
      res.json(result);
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Failed to create service request" });
    }
  });

  // Customer self-scheduling
  app.get('/api/customer-portal/scheduling/availability', async (req: any, res) => {
    try {
      const customerId = req.customer?.id;
      const { date, serviceType, urgency } = req.query;
      
      if (!customerId) {
        return res.status(401).json({ message: "Customer authentication required" });
      }
      
      const hasSchedulingAccess = await storage.customerHasSchedulingAccess(customerId);
      if (!hasSchedulingAccess) {
        return res.status(403).json({ message: "Online scheduling not available in your plan" });
      }
      
      const availableSlots = await storage.getCustomerAvailableSlots(
        customerId, 
        date as string, 
        serviceType as string, 
        urgency as string
      );
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  // Addon Management Routes
  
  // Get user's active addons
  app.get('/api/addons', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAddons = await storage.getUserAddons(userId);
      res.json(userAddons);
    } catch (error) {
      console.error("Error fetching user addons:", error);
      res.status(500).json({ message: "Failed to fetch user addons" });
    }
  });

  // Get available addons and pricing
  app.get('/api/addons/catalog', isAuthenticated, async (req: any, res) => {
    try {
      const addonCatalog = await storage.getAddonCatalog();
      res.json(addonCatalog);
    } catch (error) {
      console.error("Error fetching addon catalog:", error);
      res.status(500).json({ message: "Failed to fetch addon catalog" });
    }
  });

  // Core business logic routes - Customers, Service Calls, etc.
  
  // Customer management
  app.get('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const customer = req.body;
      const newCustomer = await storage.createCustomer(customer);
      res.json(newCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  // Service calls management
  app.get('/api/service-calls', isAuthenticated, async (req: any, res) => {
    try {
      const serviceCalls = await storage.getServiceCalls();
      res.json(serviceCalls);
    } catch (error) {
      console.error("Error fetching service calls:", error);
      res.status(500).json({ message: "Failed to fetch service calls" });
    }
  });

  app.post('/api/service-calls', isAuthenticated, async (req: any, res) => {
    try {
      const serviceCall = req.body;
      const newServiceCall = await storage.createServiceCall(serviceCall);
      res.json(newServiceCall);
    } catch (error) {
      console.error("Error creating service call:", error);
      res.status(500).json({ message: "Failed to create service call" });
    }
  });

  // ============== USER ROLES & PERMISSIONS ROUTES ==============

  // Authorization helper for role management
  const requireRoleManagement = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const tenantId = req.query.tenantId || req.params.tenantId || 'default';
      
      // Check if user has role management permission
      const hasPermission = await storage.hasPermission(tenantId, userId, 'manage_roles');
      if (!hasPermission) {
        return res.status(403).json({ error: "Insufficient permissions for role management" });
      }
      next();
    } catch (error) {
      console.error("Error checking role management permission:", error);
      res.status(500).json({ error: "Failed to verify permissions" });
    }
  };

  // User Roles Management (Protected)
  app.post("/api/user-roles", isAuthenticated, requireRoleManagement, async (req: any, res) => {
    try {
      const role = await storage.createUserRole(req.body);
      res.json({ data: role });
    } catch (error) {
      console.error("Error creating user role:", error);
      res.status(500).json({ error: "Failed to create user role" });
    }
  });

  app.get("/api/user-roles", isAuthenticated, async (req: any, res) => {
    try {
      const { tenantId = 'default' } = req.query;
      const roles = await storage.getUserRoles(tenantId as string);
      res.json({ data: roles });
    } catch (error) {
      console.error("Error fetching user roles:", error);
      res.status(500).json({ error: "Failed to fetch user roles" });
    }
  });

  app.put("/api/user-roles/:id", isAuthenticated, requireRoleManagement, async (req: any, res) => {
    try {
      const role = await storage.updateUserRole(parseInt(req.params.id), req.body);
      res.json({ data: role });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Initialize default roles for a tenant (Super Admin only)
  app.post("/api/tenants/:tenantId/initialize-roles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasPermission = await storage.hasPermission('default', userId, 'manage_tenants');
      if (!hasPermission) {
        return res.status(403).json({ error: "Super admin access required" });
      }
      
      await storage.initializeTenantRoles(req.params.tenantId);
      res.json({ message: "Default roles initialized successfully" });
    } catch (error) {
      console.error("Error initializing tenant roles:", error);
      res.status(500).json({ error: "Failed to initialize tenant roles" });
    }
  });

  // Permissions Management
  app.get("/api/permissions", isAuthenticated, async (req: any, res) => {
    try {
      const { category } = req.query;
      const permissions = await storage.getPermissions(category as string);
      res.json({ data: permissions });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ error: "Failed to fetch permissions" });
    }
  });

  // User Role Assignments (Protected)
  app.post("/api/user-role-assignments", isAuthenticated, requireRoleManagement, async (req: any, res) => {
    try {
      const assignment = await storage.assignRoleToUser(req.body);
      res.json({ data: assignment });
    } catch (error) {
      console.error("Error assigning role to user:", error);
      res.status(500).json({ error: "Failed to assign role to user" });
    }
  });

  app.get("/api/user-role-assignments", isAuthenticated, async (req: any, res) => {
    try {
      const { tenantId = 'default', userId } = req.query;
      const requestingUserId = req.user.claims.sub;
      
      if (userId) {
        // Check if user can view role assignments (either their own or has permission)
        const canViewRoles = userId === requestingUserId || 
                           await storage.hasPermission(tenantId as string, requestingUserId, 'view_user_roles');
        
        if (!canViewRoles) {
          return res.status(403).json({ error: "Insufficient permissions to view role assignments" });
        }
        
        const roles = await storage.getUserRoleAssignments(tenantId as string, userId as string);
        res.json({ data: roles });
      } else {
        // Return all assignments for tenant (requires permission)
        const canViewAll = await storage.hasPermission(tenantId as string, requestingUserId, 'view_user_roles');
        if (!canViewAll) {
          return res.status(403).json({ error: "Insufficient permissions to view all role assignments" });
        }
        
        // TODO: Implement getAllUserRoleAssignments method
        res.json({ data: [] });
      }
    } catch (error) {
      console.error("Error fetching user role assignments:", error);
      res.status(500).json({ error: "Failed to fetch user role assignments" });
    }
  });

  // Permission Checking
  app.get("/api/check-permission/:tenantId/:userId/:permissionKey", isAuthenticated, async (req: any, res) => {
    try {
      const hasPermission = await storage.hasPermission(
        req.params.tenantId,
        req.params.userId,
        req.params.permissionKey
      );
      res.json({ hasPermission });
    } catch (error) {
      console.error("Error checking permission:", error);
      res.status(500).json({ error: "Failed to check permission" });
    }
  });

  // ============== QUOTE-TO-INSTALL WORKFLOW API ROUTES ==============
  
  // Validation schemas
  const approveQuoteSchema = z.object({
    approvedBy: z.string().min(1, "Approved by is required")
  });

  const convertQuoteSchema = z.object({
    customer_id: z.number(),
    install_type: z.string().optional().default('new_install'),
    generator_info: z.object({
      brand: z.string(),
      model: z.string(), 
      features: z.array(z.string()).optional()
    }).optional(),
    material_cost: z.number().optional(),
    labor_cost: z.number().optional(),
    total_cost: z.number().optional()
    // removed created_by - will use authenticated user
  });

  // Get all quotes
  app.get('/api/quotes', isAuthenticated, async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json({ data: quotes });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // Approve a quote
  app.post('/api/quotes/:id/approve', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Use authenticated user for approval tracking
      const approvedBy = req.user.claims.sub;
      
      const updatedQuote = await storage.approveQuote(parseInt(id), approvedBy);
      res.json({ data: updatedQuote, message: "Quote approved successfully" });
    } catch (error) {
      console.error("Error approving quote:", error);
      res.status(500).json({ error: error.message || "Failed to approve quote" });
    }
  });

  // Convert quote to install order
  app.post('/api/quotes/:id/convert-to-install', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const result = convertQuoteSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error });
      }
      
      // Add authenticated user to install data
      const installDataWithUser = {
        ...result.data,
        created_by: req.user.claims.sub
      };
      
      const installOrder = await storage.convertQuoteToInstall(parseInt(id), installDataWithUser);
      res.json({ data: installOrder, message: "Quote converted to install order successfully" });
    } catch (error) {
      console.error("Error converting quote to install:", error);
      res.status(500).json({ error: error.message || "Failed to convert quote to install order" });
    }
  });

  // Get all install orders
  app.get('/api/install-orders', isAuthenticated, async (req, res) => {
    try {
      const { status } = req.query;
      const installOrders = await storage.getInstallOrders(status as string);
      res.json({ data: installOrders });
    } catch (error) {
      console.error("Error fetching install orders:", error);
      res.status(500).json({ error: "Failed to fetch install orders" });
    }
  });

  // Get specific install order with checklist and inventory
  app.get('/api/install-orders/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const [installOrder, checklist, inventory] = await Promise.all([
        storage.getInstallOrder(parseInt(id)),
        storage.getInstallationChecklist(parseInt(id)),
        storage.getInstallInventory(parseInt(id))
      ]);
      
      if (!installOrder) {
        return res.status(404).json({ error: "Install order not found" });
      }
      
      res.json({ 
        data: {
          installOrder,
          checklist,
          inventory
        }
      });
    } catch (error) {
      console.error("Error fetching install order:", error);
      res.status(500).json({ error: "Failed to fetch install order" });
    }
  });

  // Update checklist item
  app.patch('/api/checklist-items/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { completed, notes } = req.body;
      const completedBy = req.user.claims.sub;
      
      const updatedItem = await storage.updateChecklistItem(
        parseInt(id), 
        completed === true, 
        completedBy, 
        notes
      );
      
      res.json({ data: updatedItem, message: "Checklist item updated successfully" });
    } catch (error) {
      console.error("Error updating checklist item:", error);
      res.status(500).json({ error: "Failed to update checklist item" });
    }
  });

  // Employee Time Tracking Routes
  app.post('/api/time-tracking/clock-in', isAuthenticated, async (req, res) => {
    try {
      const employeeId = req.user.claims.sub;
      const { location } = req.body;
      
      const timeEntry = await storage.clockIn(employeeId, location);
      res.json({ data: timeEntry, message: "Clocked in successfully" });
    } catch (error) {
      console.error("Error clocking in:", error);
      res.status(500).json({ error: "Failed to clock in" });
    }
  });

  app.post('/api/time-tracking/clock-out', isAuthenticated, async (req, res) => {
    try {
      const employeeId = req.user.claims.sub;
      
      const timeEntry = await storage.clockOut(employeeId);
      res.json({ data: timeEntry, message: "Clocked out successfully" });
    } catch (error) {
      console.error("Error clocking out:", error);
      res.status(500).json({ error: "Failed to clock out" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
