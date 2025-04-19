'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ReportStats } from '@/lib/firebase/reports';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    padding: 5,
    backgroundColor: '#f3f4f6',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  cardChange: {
    fontSize: 10,
    marginTop: 2,
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#1a1a1a',
  },
  tableCellAmount: {
    flex: 1,
    fontSize: 10,
    color: '#1a1a1a',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
  },
});

interface ReportsPDFProps {
  data: ReportStats;
  period: string;
}

export function ReportsPDF({ data, period }: ReportsPDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reports & Analytics</Text>
            <Text style={styles.subtitle}>
              {period === 'current' ? 'Current Month' : 'Previous Month'} Report
              {' • '}
              {format(new Date(), 'PPP')}
            </Text>
          </View>
          <Image 
            src="/imprinta-logo.jpg"
            style={styles.logo}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Total Purchase Orders</Text>
              <Text style={styles.cardValue}>{data.totalPOs}</Text>
              <Text style={[
                styles.cardChange,
                { color: data.changeFromPrevious.poCount >= 0 ? '#16a34a' : '#dc2626' }
              ]}>
                {formatPercentage(data.changeFromPrevious.poCount)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Total Spent</Text>
              <Text style={styles.cardValue}>{formatCurrency(data.totalSpent)}</Text>
              <Text style={[
                styles.cardChange,
                { color: data.changeFromPrevious.spent >= 0 ? '#16a34a' : '#dc2626' }
              ]}>
                {formatPercentage(data.changeFromPrevious.spent)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Average PO Value</Text>
              <Text style={styles.cardValue}>{formatCurrency(data.averagePOValue)}</Text>
              <Text style={[
                styles.cardChange,
                { color: data.changeFromPrevious.average >= 0 ? '#16a34a' : '#dc2626' }
              ]}>
                {formatPercentage(data.changeFromPrevious.average)}
              </Text>
            </View>
          </View>
        </View>

        {/* Supplier Spend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supplier Spend</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Supplier</Text>
              <Text style={styles.tableCellAmount}>Amount</Text>
            </View>
            {data.supplierSpend
              .sort((a, b) => b.total - a.total)
              .map((supplier, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{supplier.supplier}</Text>
                  <Text style={styles.tableCellAmount}>{formatCurrency(supplier.total)}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Item Type Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Type Distribution</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Item Type</Text>
              <Text style={styles.tableCell}>Count</Text>
              <Text style={styles.tableCellAmount}>Amount</Text>
            </View>
            {data.itemTypeDistribution
              .sort((a, b) => b.total - a.total)
              .map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.type}</Text>
                  <Text style={styles.tableCell}>{item.count} items</Text>
                  <Text style={styles.tableCellAmount}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by ImprintaPO • {format(new Date(), 'PPP')}
        </Text>
      </Page>
    </Document>
  );
} 