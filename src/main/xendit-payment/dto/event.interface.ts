
export interface XenditInvoiceEvent {

  id: string; 

  event: string; 

  created: string; 

  data: {
    external_id: string; 
    id: string; 
    status: 'PENDING' | 'PAID' | 'EXPIRED' | string; 
    amount: number; 
    payment_method: string | null; 
    paid_amount: number | null; 
    paid_at: string | null; 
    metadata?: Record<string, any>; 
  };
}