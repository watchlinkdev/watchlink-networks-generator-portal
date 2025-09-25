import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  DollarSign,
  Wrench,
  User,
  MapPin,
  Timer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function QuoteToInstallDemo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch quotes
  const { data: quotesData, isLoading: quotesLoading } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: true
  });

  // Fetch install orders  
  const { data: installOrdersData, isLoading: installOrdersLoading } = useQuery({
    queryKey: ['/api/install-orders'],
    enabled: true
  });

  // Approve quote mutation
  const approveQuoteMutation = useMutation({
    mutationFn: async ({ quoteId, approvedBy }: { quoteId: number, approvedBy: string }) => {
      return apiRequest('POST', `/api/quotes/${quoteId}/approve`, { approvedBy });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      toast({ title: "Quote approved successfully!", variant: "default" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error approving quote", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    }
  });

  // Convert to install mutation
  const convertToInstallMutation = useMutation({
    mutationFn: async ({ quoteId, installData }: { quoteId: number, installData: any }) => {
      return apiRequest('POST', `/api/quotes/${quoteId}/convert-to-install`, installData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/install-orders'] });
      toast({ title: "Quote converted to install order!", variant: "default" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error converting quote", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    }
  });

  // Clock in/out mutations
  const clockInMutation = useMutation({
    mutationFn: async (location: string) => {
      return apiRequest('POST', '/api/time-tracking/clock-in', { location });
    },
    onSuccess: () => {
      toast({ title: "Clocked in successfully!", variant: "default" });
    }
  });

  const clockOutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/time-tracking/clock-out');
    },
    onSuccess: () => {
      toast({ title: "Clocked out successfully!", variant: "default" });
    }
  });

  const quotes = (quotesData as any)?.data || [];
  const installOrders = (installOrdersData as any)?.data || [];

  const handleApproveQuote = (quoteId: number) => {
    approveQuoteMutation.mutate({
      quoteId,
      approvedBy: "Demo User" // This will be ignored by API, which uses authenticated user
    });
  };

  const handleConvertToInstall = (quoteId: number, customerId: number) => {
    convertToInstallMutation.mutate({
      quoteId,
      installData: {
        customer_id: customerId,
        install_type: 'new_install',
        generator_info: {
          brand: 'Generac',
          model: '22kW Guardian Series',
          features: ['Automatic Transfer Switch', 'Wi-Fi Monitoring', 'Smart Load Management']
        },
        material_cost: 8500,
        labor_cost: 3500,
        total_cost: 12000
        // created_by will be set automatically by the API using authenticated user
      }
    });
  };

  const getQuoteStatusBadge = (status: string, converted: boolean) => {
    if (converted) return <Badge className="bg-green-500">Converted</Badge>;
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-blue-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInstallStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-orange-500"><Wrench className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="quote-to-install-demo">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="title-demo">Watchlink Networks Generator Portal</h1>
          <p className="text-muted-foreground">Complete Quote-to-Install Workflow Demo</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => clockInMutation.mutate("Office - Main Street")}
            disabled={clockInMutation.isPending}
            data-testid="button-clock-in"
          >
            <Timer className="w-4 h-4 mr-2" />
            Clock In
          </Button>
          <Button 
            variant="outline"
            onClick={() => clockOutMutation.mutate()}
            disabled={clockOutMutation.isPending}
            data-testid="button-clock-out"
          >
            <Timer className="w-4 h-4 mr-2" />
            Clock Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quotes" data-testid="tab-quotes">Quote Management</TabsTrigger>
          <TabsTrigger value="installs" data-testid="tab-installs">Install Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Quotes Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <div className="text-center py-8" data-testid="loading-quotes">Loading quotes...</div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-quotes">
                  No quotes found. Create some quotes to test the workflow.
                </div>
              ) : (
                <div className="grid gap-4">
                  {quotes.map((quote: any) => (
                    <Card key={quote.id} className="border-l-4 border-l-blue-500" data-testid={`quote-card-${quote.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold" data-testid={`quote-id-${quote.id}`}>Quote #{quote.id}</span>
                              {getQuoteStatusBadge(quote.quote_status, quote.converted_to_install)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Customer ID: {quote.cust_ID}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(quote.date_created).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${quote.sale_price?.toLocaleString() || 'TBD'}
                              </span>
                            </div>
                            <p className="text-sm">{quote.service_type || 'Generator Installation'}</p>
                          </div>
                          <div className="flex gap-2">
                            {quote.quote_status !== 'approved' && !quote.converted_to_install && (
                              <Button
                                size="sm"
                                onClick={() => handleApproveQuote(quote.id)}
                                disabled={approveQuoteMutation.isPending}
                                data-testid={`button-approve-${quote.id}`}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            {quote.quote_status === 'approved' && !quote.converted_to_install && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleConvertToInstall(quote.id, quote.cust_ID)}
                                disabled={convertToInstallMutation.isPending}
                                data-testid={`button-convert-${quote.id}`}
                              >
                                <Wrench className="w-3 h-3 mr-1" />
                                Convert to Install
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Installation Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {installOrdersLoading ? (
                <div className="text-center py-8" data-testid="loading-installs">Loading install orders...</div>
              ) : installOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-installs">
                  No install orders yet. Convert some approved quotes to see them here.
                </div>
              ) : (
                <div className="grid gap-4">
                  {installOrders.map((order: any) => (
                    <Card key={order.id} className="border-l-4 border-l-green-500" data-testid={`install-card-${order.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold" data-testid={`install-order-${order.id}`}>{order.order_number}</span>
                              {getInstallStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Customer ID: {order.customer_id}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${order.total_cost?.toLocaleString() || 'TBD'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{order.generator_info || 'Generator Installation'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Demo Features Available</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• <strong>Quote Approval:</strong> Click "Approve" to approve pending quotes</li>
                <li>• <strong>Quote-to-Install Conversion:</strong> Convert approved quotes to installation orders</li>
                <li>• <strong>Employee Time Tracking:</strong> Clock in/out to track work hours</li>
                <li>• <strong>Real-time Updates:</strong> All data updates immediately across the interface</li>
                <li>• <strong>Transaction Safety:</strong> All operations use database transactions for data integrity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}