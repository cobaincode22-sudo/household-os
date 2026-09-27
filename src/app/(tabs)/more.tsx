import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/Theme';
import { useHouseholdStore } from '@/store/householdStore';

export default function MoreHubScreen() {
  const assets = useHouseholdStore((s) => s.assets);
  const bills = useHouseholdStore((s) => s.bills);
  const budget = useHouseholdStore((s) => s.currentBudget);
  const diary = useHouseholdStore((s) => s.diaryEntries);
  const timeline = useHouseholdStore((s) => s.timelineEvents);
  const transactions = useHouseholdStore((s) => s.transactions);
  const payBill = useHouseholdStore((s) => s.payBill);
  const addAsset = useHouseholdStore((s) => s.addAsset);
  const addDiaryEntry = useHouseholdStore((s) => s.addDiaryEntry);
  const activeTab = useHouseholdStore((s) => s.activeMoreTab);
  const setActiveTab = useHouseholdStore((s) => s.setActiveMoreTab);

  // Modal Tambah Aset
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetBrand, setAssetBrand] = useState('');
  const [assetCategory, setAssetCategory] = useState<'VEHICLE' | 'APPLIANCE' | 'ELECTRONICS'>('VEHICLE');
  const [assetPlate, setAssetPlate] = useState('');

  // Modal Tambah Memori / Diary
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryDesc, setDiaryDesc] = useState('');
  const [diaryLocation, setDiaryLocation] = useState('');

  const handlePayBill = (billId: string, name: string, amount: number) => {
    Alert.alert(
      'Bayar Tagihan',
      `Konfirmasi pembayaran ${name} sebesar Rp ${amount.toLocaleString()}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar Sekarang',
          onPress: () => {
            payBill(billId, amount, 'Ayah Mark');
            Alert.alert('Sukses! ✅', `${name} berhasil dibayar & tercatat di riwayat.`);
          }
        }
      ]
    );
  };

  const handleCreateAsset = () => {
    if (!assetName.trim()) {
      Alert.alert('Perhatian', 'Nama aset tidak boleh kosong.');
      return;
    }
    addAsset({
      householdId: 'hh_anderson',
      name: assetName.trim(),
      category: assetCategory,
      brand: assetBrand.trim() || undefined,
      plateNumber: assetPlate.trim() || undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: 'Aset baru keluarga.',
    });

    setAssetName('');
    setAssetBrand('');
    setAssetPlate('');
    setAssetModalVisible(false);
    Alert.alert('Aset Ditambahkan! 🚗', 'Aset baru berhasil dicatat dalam inventaris keluarga.');
  };

  const handleCreateDiary = () => {
    if (!diaryTitle.trim() || !diaryDesc.trim()) {
      Alert.alert('Perhatian', 'Judul dan cerita kenangan tidak boleh kosong.');
      return;
    }

    addDiaryEntry({
      householdId: 'hh_anderson',
      title: diaryTitle.trim(),
      description: diaryDesc.trim(),
      date: new Date().toISOString().split('T')[0],
      location: diaryLocation.trim() || 'Rumah',
      photos: [],
      participants: ['Sarah', 'David', 'Alex', 'Leo'],
    });

    setDiaryTitle('');
    setDiaryDesc('');
    setDiaryLocation('');
    setDiaryModalVisible(false);
    Alert.alert('Momen Tersimpan! 📖', 'Catatan kenangan keluarga berhasil diabadikan.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Operasional Rumah Tangga</Text>
          <Text style={styles.headerTitle}>Pusat Manajemen</Text>
        </View>

        {/* Module Segment Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {(['FINANCE', 'BILLS', 'ASSETS', 'DIARY', 'TIMELINE'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'FINANCE' ? '💰 Keuangan' : tab === 'BILLS' ? '📅 Tagihan' : tab === 'ASSETS' ? '🚗 Aset & Mobil' : tab === 'DIARY' ? '📖 Memori' : '⏱️ Linimasa'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Body */}
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* TAB 1: FINANCE */}
          {activeTab === 'FINANCE' && (
            <View>
              <View style={styles.card}>
                <Text style={styles.cardSubtitle}>Rencana Anggaran September</Text>
                <Text style={styles.cardTitle}>Rp {budget?.totalBudget.toLocaleString()}</Text>
                <View style={styles.finRow}>
                  <View>
                    <Text style={styles.finLabel}>Terpakai</Text>
                    <Text style={styles.finValue}>Rp {budget?.spent.toLocaleString()}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.finLabel}>Sisa Nyaman</Text>
                    <Text style={[styles.finValue, { color: '#2E7D32' }]}>
                      Rp {((budget?.totalBudget || 0) - (budget?.spent || 0)).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionHeader}>TRANSAKSI TERBARU</Text>
              {transactions.map((tx) => (
                <View key={tx.id} style={styles.txItem}>
                  <View style={styles.txIconCircle}>
                    <Text style={{ fontSize: 16 }}>💳</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.txDesc}>{tx.description}</Text>
                    <Text style={styles.txMeta}>{tx.category} • Dicatat oleh {tx.createdByName || 'Keluarga'}</Text>
                  </View>
                  <Text style={styles.txAmount}>-Rp {tx.amount.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: BILLS */}
          {activeTab === 'BILLS' && (
            <View>
              <Text style={styles.sectionHeader}>TAGIHAN & KEWAJIBAN BULANAN</Text>
              {bills.map((bill) => (
                <View key={bill.id} style={styles.billItem}>
                  <View style={styles.billIcon}>
                    <Text style={{ fontSize: 20 }}>💡</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.billItemName}>{bill.name}</Text>
                    <Text style={styles.billItemDue}>Jatuh tempo: Tanggal {bill.dueDay} • {bill.assignedToName || 'Keluarga'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.billItemAmount}>Rp {bill.amount.toLocaleString()}</Text>
                    <TouchableOpacity 
                      style={styles.payNowBtn}
                      onPress={() => handlePayBill(bill.id, bill.name, bill.amount)}
                    >
                      <Text style={styles.payNowText}>Bayar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: ASSETS & INVENTORY */}
          {activeTab === 'ASSETS' && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.sectionHeader}>INVENTARIS KENDARAAN & PERANGKAT</Text>
                <TouchableOpacity onPress={() => setAssetModalVisible(true)}>
                  <Text style={styles.linkAction}>+ Tambah Aset</Text>
                </TouchableOpacity>
              </View>

              {assets.map((asset) => (
                <View key={asset.id} style={styles.assetCard}>
                  <View style={styles.assetTop}>
                    <View>
                      <Text style={styles.assetName}>{asset.name}</Text>
                      <Text style={styles.assetMeta}>{asset.brand || ''} {asset.model || ''} • {asset.category}</Text>
                    </View>
                    <View style={styles.assetPill}>
                      <Text style={styles.assetPillText}>{asset.category}</Text>
                    </View>
                  </View>

                  {asset.plateNumber && (
                    <Text style={styles.assetDetailLine}>Plat Nomor: <Text style={styles.bold}>{asset.plateNumber}</Text></Text>
                  )}
                  {asset.taxDueDate && (
                    <Text style={styles.assetDetailLine}>Pajak STNK Jatuh Tempo: <Text style={styles.bold}>{asset.taxDueDate}</Text></Text>
                  )}
                  {asset.currentMileage && (
                    <Text style={styles.assetDetailLine}>Jarak Tempuh: <Text style={styles.bold}>{asset.currentMileage.toLocaleString()} km</Text></Text>
                  )}
                  {asset.notes && (
                    <Text style={styles.assetNotes}>{asset.notes}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* TAB 4: FAMILY DIARY */}
          {activeTab === 'DIARY' && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={styles.sectionHeader}>SUDUT MEMORI KELUARGA</Text>
                <TouchableOpacity onPress={() => setDiaryModalVisible(true)}>
                  <Text style={styles.linkAction}>+ Tulis Kenangan</Text>
                </TouchableOpacity>
              </View>

              {diary.map((entry) => (
                <View key={entry.id} style={styles.diaryCard}>
                  <Text style={styles.diaryTitle}>{entry.title}</Text>
                  <Text style={styles.diaryMeta}>📅 {entry.date} • 📍 {entry.location || 'Rumah'}</Text>
                  <Text style={styles.diaryDesc}>{entry.description}</Text>
                  <View style={styles.participantRow}>
                    {entry.participants.map((p) => (
                      <View key={p} style={styles.participantChip}>
                        <Text style={styles.participantText}>👤 {p}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 5: UNIVERSAL TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <View>
              <Text style={styles.sectionHeader}>LINIMASA AKTIVITAS KELUARGA</Text>
              {timeline.map((item) => (
                <View key={item.id} style={styles.timelineRow}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineCard}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineSummary}>{item.summary}</Text>
                    <Text style={styles.timelineActor}>Dicatat oleh {item.actorName}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modal Tambah Aset */}
      <Modal
        visible={assetModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAssetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Aset Keluarga</Text>
              <TouchableOpacity onPress={() => setAssetModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nama Barang / Kendaraan *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Motor Vespa Sprint"
              placeholderTextColor={Colors.light.textMuted}
              value={assetName}
              onChangeText={setAssetName}
            />

            <Text style={styles.inputLabel}>Merek / Tipe</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Piaggio 150cc"
              placeholderTextColor={Colors.light.textMuted}
              value={assetBrand}
              onChangeText={setAssetBrand}
            />

            <Text style={styles.inputLabel}>Plat Nomor (Jika Kendaraan)</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: B 4567 ABC"
              placeholderTextColor={Colors.light.textMuted}
              value={assetPlate}
              onChangeText={setAssetPlate}
            />

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateAsset}>
              <Text style={styles.modalSubmitText}>Simpan Aset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Tambah Diary */}
      <Modal
        visible={diaryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDiaryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tulis Momen Keluarga</Text>
              <TouchableOpacity onPress={() => setDiaryModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Judul Momen *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Jalan Pagi & Sarapan Bubur"
              placeholderTextColor={Colors.light.textMuted}
              value={diaryTitle}
              onChangeText={setDiaryTitle}
            />

            <Text style={styles.inputLabel}>Lokasi</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Taman Suropati"
              placeholderTextColor={Colors.light.textMuted}
              value={diaryLocation}
              onChangeText={setDiaryLocation}
            />

            <Text style={styles.inputLabel}>Cerita Hangat *</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Ceritakan momen seru dan kebersamaan..."
              placeholderTextColor={Colors.light.textMuted}
              value={diaryDesc}
              onChangeText={setDiaryDesc}
              multiline
            />

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateDiary}>
              <Text style={styles.modalSubmitText}>Simpan ke Album</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.md,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  tabScroll: {
    maxHeight: 46,
    marginBottom: Spacing.md,
  },
  tabContainer: {
    gap: Spacing.xs,
    paddingRight: Spacing.lg,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tabButtonActive: {
    backgroundColor: '#2D3E33',
    borderColor: '#2D3E33',
  },
  tabText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollBody: {
    paddingBottom: Spacing.xxl + 40,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  finRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  finLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  finValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  txItem: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  txMeta: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.accentCoral,
  },
  linkAction: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },
  billItem: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  billItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  billItemDue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  billItemAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  payNowBtn: {
    backgroundColor: '#E7F2EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  payNowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  assetCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  assetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  assetMeta: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  assetPill: {
    backgroundColor: Colors.light.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  assetPillText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  assetDetailLine: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  bold: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  assetNotes: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  diaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  diaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  diaryMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  diaryDesc: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  participantRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  participantChip: {
    backgroundColor: Colors.light.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  participantText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#354A3E',
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  timelineSummary: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  timelineActor: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  modalCloseText: {
    fontSize: 20,
    color: Colors.light.textMuted,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalSubmitBtn: {
    backgroundColor: '#2D3E33',
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
