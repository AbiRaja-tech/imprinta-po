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
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: '#f8f9fa',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
    paddingVertical: 8,
    minHeight: 35,
    alignItems: 'center',
  },
  columnContainer: {
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  col1: { 
    width: '20%',
  },
  col2: { 
    width: '30%',
  },
  col3: { 
    width: '10%',
  },
  col4: { 
    width: '15%',
  },
  col5: { 
    width: '10%',
  },
  col6: { 
    width: '15%',
  },
  tableCell: {
    fontSize: 10,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCellWrapped: {
    fontSize: 10,
    flexWrap: 'wrap',
  },
  tableCellRight: {
    fontSize: 10,
    textAlign: 'right',
  },
  tableCellRightWrapped: {
    fontSize: 10,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
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

        {/* Enhanced Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.columnContainer, styles.col1]}>
              <Text style={styles.tableCellHeader}>Type</Text>
            </View>
            <View style={[styles.columnContainer, styles.col2]}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={[styles.columnContainer, styles.col3]}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Qty</Text>
            </View>
            <View style={[styles.columnContainer, styles.col4]}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Unit Price (₹)</Text>
            </View>
            <View style={[styles.columnContainer, styles.col5]}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Tax %</Text>
            </View>
            <View style={[styles.columnContainer, styles.col6]}>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Total (₹)</Text>
            </View>
          </View>

          {data.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.columnContainer, styles.col1]}>
                <Text style={styles.tableCellWrapped}>{item.type}</Text>
              </View>
              <View style={[styles.columnContainer, styles.col2]}>
                <Text style={styles.tableCellWrapped}>{item.description}</Text>
              </View>
              <View style={[styles.columnContainer, styles.col3]}>
                <Text style={styles.tableCellRight}>{item.quantity}</Text>
              </View>
              <View style={[styles.columnContainer, styles.col4]}>
                <Text style={styles.tableCellRight}>
                  {new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(item.unitPrice)}
                </Text>
              </View>
              <View style={[styles.columnContainer, styles.col5]}>
                <Text style={styles.tableCellRight}>{item.taxPercent}%</Text>
              </View>
              <View style={[styles.columnContainer, styles.col6]}>
                <Text style={styles.tableCellRight}>
                  {new Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(item.totalPrice)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals Section with enhanced number formatting */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal:</Text>
            <Text style={styles.totalsValue}>
              ₹{new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(data.subtotal)}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Tax Amount:</Text>
            <Text style={styles.totalsValue}>
              ₹{new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(data.taxAmount)}
            </Text>
          </View>
          <View style={[styles.totalsRow, styles.finalTotal]}>
            <Text style={styles.totalsLabel}>Total Amount:</Text>
            <Text style={styles.totalsValue}>
              ₹{new Intl.NumberFormat('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(data.totalAmount)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
} 