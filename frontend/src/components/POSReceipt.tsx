import React from 'react';

interface Props {
  data: any;
}

const POSReceipt: React.FC<Props> = ({ data }) => {
  return (
    <div className="p-3 border rounded-md bg-gray-50 text-sm">
      <div className="text-center font-bold">BakeryHUB</div>
      <div className="text-center text-xs text-gray-500">Sales Receipt</div>
      <div className="mt-2 text-xs">Receipt #: {data?.sale_id ?? '—'}</div>
      <div className="mt-2">
        {data?.items?.map((it: any, idx: number) => (
          <div key={idx} className="flex justify-between">
            <div>{it.qty} x {it.product_id}</div>
            <div>Rs. {it.qty * it.price}</div>
          </div>
        ))}
      </div>
      <hr className="my-2" />
      <div className="flex justify-between font-bold">
        <div>Total</div>
        <div>Rs. {data?.total}</div>
      </div>
    </div>
  );
};

export default POSReceipt;