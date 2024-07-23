import React from 'react'

export default function InvoiceDetails(pdf: any) {
  return (
    <div>
        <a href={`data:application/pdf;base64,${pdf.pdf}`} download>Download Invoice</a>
    </div>
  )
}
