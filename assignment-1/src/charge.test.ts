import { Invoice, charge, Payment, Receipt } from './charge';

describe('charge', () => {
  const cashOnly: Payment[] = [{ type: 'CASH', amount: 10000 }];
  const multipleCash: Payment[] = [
    { type: 'CASH', amount: 5000 },
    { type: 'CASH', amount: 5000 },
  ];
  const couponOnly: Payment[] = [{ type: 'COUPON', amount: 10000 }];
  const cashAndCoupon: Payment[] = [
    { type: 'CASH', amount: 5000 },
    { type: 'COUPON', amount: 5000 },
  ];
  const cashAndPercentageCoupon: Payment[] = [
    { type: 'CASH', amount: 5000 },
    { type: 'COUPON', percentage: 50 },
  ];

  it('過不足なく支払った場合、お釣りは0でレシートが返される', () => {
    const invoice: Invoice = { total: 10000 };
    const receipt: Receipt = { total: 10000, deposit: 10000, change: 0 };

    [cashOnly, multipleCash, couponOnly, cashAndCoupon, cashAndPercentageCoupon].forEach(
      (payments) => {
        expect(charge(invoice, payments)).toEqual(receipt);
      },
    );
  });
  it('金額が不足している場合はエラーを起こす', () => {
    const invoice: Invoice = { total: 12000 };

    [cashOnly, multipleCash, couponOnly, cashAndCoupon, cashAndPercentageCoupon].forEach(
      (payments) => {
        expect(() => {
          charge(invoice, payments);
        }).toThrowError('Shortage');
      },
    );
  });
  it('現金での過払いはお釣りを返す', () => {
    const invoice: Invoice = { total: 8000 };
    const receipt: Receipt = { total: 8000, deposit: 10000, change: 2000 };

    [cashOnly, multipleCash, cashAndCoupon].forEach((payments) => {
      expect(charge(invoice, payments)).toEqual(receipt);
    });
  });
  it('クーポンでの過払いはお釣りを返さない', () => {
    const invoice: Invoice = { total: 8000 };
    const receipt: Receipt = { total: 8000, deposit: 10000, change: 0 };

    [couponOnly].forEach((payments) => {
      expect(charge(invoice, payments)).toEqual(receipt);
    });
  });
  it('クーポンで全額払える場合に現金も含まれていればエラーを起こす', () => {
    const invoice: Invoice = { total: 5000 };

    [cashAndCoupon].forEach((payments) => {
      expect(() => {
        charge(invoice, payments);
      }).toThrowError('OverCharge');
    });
  });
});
