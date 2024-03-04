export type Invoice = {
  total: number;
};

export type Receipt = {
  total: number;
  deposit: number;
  change: number;
};

export type Payment = {
  type: string;
  percentage?: number;
  amount?: number;
};

export function charge(invoice: Invoice, payments: Payment[]) {
  const total = invoice.total;
  let deposit = 0;

  payments
    .sort((payment) => (payment.type !== 'CASH' ? -1 : 1))
    .map((payment) => {
      if (payment.type === 'COUPON') {
        if (payment.percentage != null) {
          deposit += Math.floor(total * (payment.percentage / 100));
        } else {
          deposit += payment.amount || 0;
        }
      } else {
        if (deposit >= total) {
          throw new Error('OverCharge');
        }
        deposit += payment.amount || 0;
      }
    });
  if (total > deposit) {
    throw new Error('Shortage');
  }

  let isCoupon = true;
  for (let i = 0; i < payments.length; i++) {
    if (payments[i].type !== 'COUPON') {
      isCoupon = false;
      continue;
    }
  }
  if (isCoupon) return { total, deposit, change: 0 };
  return { total: total, deposit: deposit, change: deposit - total };
}
