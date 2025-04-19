import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    objectFit: 'contain',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a56db', // Add brand color
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginBottom: 2,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    paddingVertical: 5,
  },
  col1: { width: '20%' },
  col2: { width: '30%' },
  col3: { width: '10%' },
  col4: { width: '15%' },
  col5: { width: '10%' },
  col6: { width: '15%' },
  totalsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalsLabel: {
    width: 150,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalsValue: {
    width: 120,
    textAlign: 'right',
  },
  finalTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    marginTop: 5,
  }
})

interface PurchaseOrderPDFProps {
  data: {
    poNumber: string
    projectRef: string
    orderDate: Date
    deliveryDate: Date
    supplier: string
    lineItems: Array<{
      type: string
      description: string
      quantity: number
      unitPrice: number
      taxPercent: number
      totalPrice: number
    }>
    subtotal: number
    taxAmount: number
    totalAmount: number
  }
}

export function PurchaseOrderPDF({ data }: PurchaseOrderPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image 
            src={`${window.location.origin}/imprinta-logo.jpg`}
            style={styles.logo}
          />
          <View style={styles.headerRight}>
            <Text style={styles.title}>Purchase Order</Text>
            <Text style={styles.companyInfo}>Imprinta Solutions</Text>
            <Text style={styles.companyInfo}>123 Business Street</Text>
            <Text style={styles.companyInfo}>Chennai, Tamil Nadu 600001</Text>
            <Text style={styles.companyInfo}>Phone: +91 123-456-7890</Text>
          </View>
        </View>

        {/* PO Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>PO Number:</Text>
            <Text style={styles.value}>{data.poNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Project Reference:</Text>
            <Text style={styles.value}>{data.projectRef}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{format(data.orderDate, 'PPP')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Date:</Text>
            <Text style={styles.value}>{format(data.deliveryDate, 'PPP')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Supplier:</Text>
            <Text style={styles.value}>{data.supplier}</Text>
          </View>
        </View>

        {/* Line Items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Type</Text>
            <Text style={styles.col2}>Description</Text>
            <Text style={styles.col3}>Qty</Text>
            <Text style={styles.col4}>Unit Price (₹)</Text>
            <Text style={styles.col5}>Tax %</Text>
            <Text style={styles.col6}>Total (₹)</Text>
          </View>

          {data.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.type}</Text>
              <Text style={styles.col2}>{item.description}</Text>
              <Text style={styles.col3}>{item.quantity}</Text>
              <Text style={styles.col4}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.col5}>{item.taxPercent}%</Text>
              <Text style={styles.col6}>{item.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal:</Text>
            <Text style={styles.totalsValue}>₹{data.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax Amount:</Text>
            <Text style={styles.totalsValue}>₹{data.taxAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalsRow, styles.finalTotal]}>
            <Text style={styles.totalsLabel}>Total Amount:</Text>
            <Text style={styles.totalsValue}>₹{data.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
} 