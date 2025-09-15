import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ProjectPayment } from '@/hooks/useProject';

interface PaymentSectionProps {
  payments: ProjectPayment[];
  totalAmount: number;
  className?: string;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  payments,
  totalAmount,
  className = ''
}) => {
  const paidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const paymentProgress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع';
      case 'pending':
        return 'في انتظار الدفع';
      case 'overdue':
        return 'متأخر';
      default:
        return 'غير محدد';
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'initial':
        return 'دفعة أولى';
      case 'milestone':
        return 'دفعة مرحلية';
      case 'final':
        return 'دفعة نهائية';
      case 'addon':
        return 'إضافة';
      default:
        return 'دفعة';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Payment Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <CreditCard className="h-5 w-5 ml-2" />
            نظرة عامة على المدفوعات
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {paidAmount.toLocaleString()} ج.م
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">تم الدفع</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingAmount.toLocaleString()} ج.م
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">في انتظار الدفع</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalAmount.toLocaleString()} ج.م
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي المشروع</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>تقدم الدفع</span>
            <span>{Math.round(paymentProgress)}%</span>
          </div>
          <Progress value={paymentProgress} className="h-2" />
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">تاريخ المدفوعات</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد مدفوعات مسجلة بعد
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <p className="font-medium">{getPaymentTypeText(payment.payment_type)}</p>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {getStatusText(payment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.description}
                    </p>
                    {payment.due_date && (
                      <p className="text-xs text-muted-foreground">
                        تاريخ الاستحقاق: {new Date(payment.due_date).toLocaleDateString('ar-EG')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {Number(payment.amount).toLocaleString()} ج.م
                  </p>
                  {payment.paid_date && (
                    <p className="text-xs text-muted-foreground">
                      تم الدفع في: {new Date(payment.paid_date).toLocaleDateString('ar-EG')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingAmount > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button className="w-full bg-primary hover:bg-primary/90">
              دفع المبلغ المتبقي ({pendingAmount.toLocaleString()} ج.م)
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};