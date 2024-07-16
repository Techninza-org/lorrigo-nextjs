'use client'
import React, { useEffect } from 'react'
import { useSellerProvider } from '../providers/SellerProvider'

const Invoice = () => {
  const { invoices } = useSellerProvider()
  return (
    <div>
      {invoices ? (
        invoices
          .map((invoice: any, index: any) => (
            <iframe
              key={index}
              src={`data:application/pdf;base64,${invoice.pdf}`}
              width="100%"
              height="600px"
              title={`Invoice PDF - ${invoice.date}`} 
            />
          ))
      ) : (
        <p>No Invoice Found...</p>
      )}
    </div>
  )
}

export default Invoice