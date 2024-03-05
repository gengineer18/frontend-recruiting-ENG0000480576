export type Invoice = {
  total: number;
};

export type Receipt = {
  total: number;
  deposit: number;
  change: number;
};

export type Payment = {
  type: 'CASH' | 'COUPON'; // 支払い方法はCASH(現金)かCOUPON(クーポン)のいずれか
  percentage?: number;
  amount?: number;
};

export function charge(invoice: Invoice, payments: Payment[]) {
  const { total } = invoice;
  // 預かり金。支払いが行われるたびに加算される
  let deposit = 0;

  // paymentsをtype=CASHのものを先に処理するようにソート(paymentsの破壊的変更を防ぐ)
  const sortedPayments = payments.slice().sort((payment) => (payment.type !== 'CASH' ? -1 : 1));

  // 配列生成するmap関数である必要がないのでforEachに変更
  sortedPayments.forEach((payment) => {
    const { type, amount, percentage } = payment;

    switch (type) {
      case 'CASH': {
        // 過払いの場合は'OverCharge'としてエラーを起こす
        if (deposit >= total) {
          throw new Error('OverCharge');
        }
        deposit += amount ?? 0;
        break;
      }
      case 'COUPON': {
        // nullとの比較になっていたが、型でnullは許容されていないのでundefinedとの比較に変更
        if (percentage !== undefined) {
          deposit += Math.floor(total * (percentage / 100));
        } else {
          deposit += amount ?? 0;
        }
        break;
      }
    }
  });

  // depositがtotalより多い場合は'Shortage'としてエラーを起こす
  if (total > deposit) {
    throw new Error('Shortage');
  }

  // クーポンの使用有無を判定する
  const isCoupon = payments.every((payment) => payment.type === 'COUPON');
  // お釣りの計算
  const change = isCoupon ? 0 : deposit - total;

  return { total, deposit, change };
}
