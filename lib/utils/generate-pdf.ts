import { ReactElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Document, DocumentProps } from '@react-pdf/renderer'

export async function generatePDF(document: ReactElement<DocumentProps>) {
  try {
    const blob = await pdf(document).toBlob()
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'purchase-order.pdf'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
} 