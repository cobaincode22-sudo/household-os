import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/Theme';
import { useHouseholdStore } from '@/store/householdStore';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const currentHousehold = useHouseholdStore((s) => s.currentHousehold);
  const tasks = useHouseholdStore((s) => s.tasks);
  const bills = useHouseholdStore((s) => s.bills);
  const budget = useHouseholdStore((s) => s.currentBudget);
  const events = useHouseholdStore((s) => s.events);
  const assets = useHouseholdStore((s) => s.assets);
  const diary = useHouseholdStore((s) => s.diaryEntries);
  const members = useHouseholdStore((s) => s.members);
  const setActiveMoreTab = useHouseholdStore((s) => s.setActiveMoreTab);

  // Metrics & Calculations for Graphs
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Budget
  const totalBudget = budget?.totalBudget || 20000000;
  const spentBudget = budget?.spent || 12300000;
  const remainingBudget = Math.max(0, totalBudget - spentBudget);
  const spentPercent = Math.min(100, Math.round((spentBudget / totalBudget) * 100));
  const remainingPercent = 100 - spentPercent;

  // Bills
  const activeBills = bills.filter(b => b.status === 'ACTIVE');
  const paidBillsCount = 1; // 1 paid in current cycle
  const totalBillsCount = activeBills.length + paidBillsCount;
  const billPaidRate = Math.round((paidBillsCount / totalBillsCount) * 100);

  const navigateToMore = (tab: 'FINANCE' | 'BILLS' | 'ASSETS' | 'DIARY' | 'TIMELINE') => {
    setActiveMoreTab(tab);
    router.push('/(tabs)/more');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navLeft} 
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/family')}
        >
          <View style={styles.avatarMini}>
            <Text style={{ fontSize: 18 }}>👨‍💼</Text>
            <View style={styles.onlineBadge} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.navHouseholdName}>{currentHousehold?.name || 'Keluarga Anderson'}</Text>
              <Text style={styles.navChevron}> ⌵</Text>
            </View>
            <Text style={styles.navSubtext}>Ringkasan Eksekutif Kepala Keluarga</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navIconBtn}
          onPress={() => router.push('/(tabs)/family')}
        >
          <Text style={{ fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Status Cepat */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingTitle}>Kondisi Rumah Terkendali ✨</Text>
          <Text style={styles.greetingSubtitle}>
            Sentuh kartu visual di bawah untuk langsung membuka rincian operasional keluarga.
          </Text>
        </View>

        {/* 1. CHART DOMPET KELUARGA (Klik -> Tab More/Finance) */}
        <TouchableOpacity 
          style={styles.chartCard}
          activeOpacity={0.85}
          onPress={() => navigateToMore('FINANCE')}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconCircle, { backgroundColor: '#E7F2EB' }]}>
                <Text style={{ fontSize: 16 }}>💰</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Dompet & Anggaran Keluarga</Text>
                <Text style={styles.cardSub}>Bulan September • Sentuh untuk rincian</Text>
              </View>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>

          {/* Bar Chart Sederhana */}
          <View style={styles.chartVisualBox}>
            <View style={styles.chartNumberRow}>
              <View>
                <Text style={styles.chartBigValue}>Rp {spentBudget.toLocaleString()}</Text>
                <Text style={styles.chartValueLabel}>Terpakai ({spentPercent}%)</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.chartBigValue, { color: '#2E7D32' }]}>
                  Rp {remainingBudget.toLocaleString()}
                </Text>
                <Text style={styles.chartValueLabel}>Sisa Aman ({remainingPercent}%)</Text>
              </View>
            </View>

            {/* Split Stacked Bar Chart */}
            <View style={styles.segmentedBarTrack}>
              <View style={[styles.segmentedBarSpent, { width: `${spentPercent}%` }]} />
              <View style={[styles.segmentedBarRemain, { width: `${remainingPercent}%` }]} />
            </View>

            <View style={styles.barLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.light.accentCoral }]} />
                <Text style={styles.legendText}>Pengeluaran Dapur & Rutin</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
                <Text style={styles.legendText}>Sisa Anggaran</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 2 GRID ROW: TUGAS & TAGIHAN (Grafik Jumlah Bersih) */}
        <View style={styles.twoColRow}>
          {/* CHART TUGAS RUMAH (Klik -> Tab Tasks) */}
          <TouchableOpacity 
            style={styles.colCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <View style={styles.miniCardHeader}>
              <View style={[styles.miniIconCircle, { backgroundColor: '#EBF4EE' }]}>
                <Text style={{ fontSize: 14 }}>📋</Text>
              </View>
              <Text style={styles.arrowMini}>›</Text>
            </View>

            <Text style={styles.gridCardTitle}>Tugas Rumah</Text>
            <Text style={styles.gridBigCount}>{pendingTasks} <Text style={styles.gridSmallTotal}>/ {totalTasks}</Text></Text>
            <Text style={styles.gridStatusLabel}>{completedTasks} terselesaikan</Text>

            {/* Mini Progress Graph */}
            <View style={styles.miniProgressTrack}>
              <View style={[styles.miniProgressFillGreen, { width: `${taskCompletionRate}%` }]} />
            </View>
            <Text style={styles.rateLabel}>{taskCompletionRate}% selesai pekan ini</Text>
          </TouchableOpacity>

          {/* CHART TAGIHAN (Klik -> Tab More/Bills) */}
          <TouchableOpacity 
            style={styles.colCard}
            activeOpacity={0.85}
            onPress={() => navigateToMore('BILLS')}
          >
            <View style={styles.miniCardHeader}>
              <View style={[styles.miniIconCircle, { backgroundColor: '#FDF0EC' }]}>
                <Text style={{ fontSize: 14 }}>💡</Text>
              </View>
              <Text style={styles.arrowMini}>›</Text>
            </View>

            <Text style={styles.gridCardTitle}>Tagihan Rutin</Text>
            <Text style={styles.gridBigCount}>{activeBills.length} <Text style={styles.gridSmallTotal}>Jatuh Tempo</Text></Text>
            <Text style={[styles.gridStatusLabel, { color: Colors.light.accentCoral }]}>1 tagihan dalam 3 hari</Text>

            {/* Mini Progress Graph */}
            <View style={styles.miniProgressTrack}>
              <View style={[styles.miniProgressFillCoral, { width: `${billPaidRate}%` }]} />
            </View>
            <Text style={styles.rateLabel}>{billPaidRate}% terlunasi bulan ini</Text>
          </TouchableOpacity>
        </View>

        {/* 3. CHART JADWAL & AGENDA KELUARGA (Klik -> Tab Calendar) */}
        <TouchableOpacity 
          style={styles.chartCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/calendar')}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconCircle, { backgroundColor: '#FAF0EB' }]}>
                <Text style={{ fontSize: 16 }}>📅</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Jadwal & Agenda Keluarga</Text>
                <Text style={styles.cardSub}>Pekan ini • Sentuh untuk kalender</Text>
              </View>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>

          {/* Weekly Bar Distribution Graph */}
          <View style={styles.chartVisualBox}>
            <Text style={styles.subGraphTitle}>Distribusi Agenda 7 Hari ke Depan:</Text>
            
            <View style={styles.weeklyBarChartRow}>
              {[
                { day: 'Sen', count: 1, active: false },
                { day: 'Sel', count: 2, active: false },
                { day: 'Rab', count: 4, active: true },
                { day: 'Kam', count: 1, active: false },
                { day: 'Jum', count: 2, active: false },
                { day: 'Sab', count: 3, active: false },
                { day: 'Min', count: 1, active: false },
              ].map((item) => (
                <View key={item.day} style={styles.barCol}>
                  <View style={styles.barPillarWrapper}>
                    <View 
                      style={[
                        styles.barPillar, 
                        { height: item.count * 14 },
                        item.active && { backgroundColor: '#2D3E33' }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.barDayText, item.active && { fontWeight: '700', color: Colors.light.text }]}>
                    {item.day}
                  </Text>
                  <Text style={styles.barCountText}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>

        {/* 4. GRID ASET & KELUARGA (Klik ke Aset / Anggota) */}
        <View style={styles.twoColRow}>
          {/* ASET RUMAH TANGGA */}
          <TouchableOpacity 
            style={styles.colCard}
            activeOpacity={0.85}
            onPress={() => navigateToMore('ASSETS')}
          >
            <View style={styles.miniCardHeader}>
              <View style={[styles.miniIconCircle, { backgroundColor: '#EFF5F1' }]}>
                <Text style={{ fontSize: 14 }}>🚗</Text>
              </View>
              <Text style={styles.arrowMini}>›</Text>
            </View>
            <Text style={styles.gridCardTitle}>Aset & Mobil</Text>
            <Text style={styles.gridBigCount}>{assets.length} <Text style={styles.gridSmallTotal}>Unit</Text></Text>
            <Text style={styles.gridStatusLabel}>Fortuner & AC Daikin</Text>
            <View style={styles.tagKondisi}>
              <Text style={styles.tagKondisiText}>✓ Terawat Baik</Text>
            </View>
          </TouchableOpacity>

          {/* ANGGOTA KELUARGA */}
          <TouchableOpacity 
            style={styles.colCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/family')}
          >
            <View style={styles.miniCardHeader}>
              <View style={[styles.miniIconCircle, { backgroundColor: '#F3EFE9' }]}>
                <Text style={{ fontSize: 14 }}>👨‍👩‍👧</Text>
              </View>
              <Text style={styles.arrowMini}>›</Text>
            </View>
            <Text style={styles.gridCardTitle}>Anggota Keluarga</Text>
            <Text style={styles.gridBigCount}>{members.length} <Text style={styles.gridSmallTotal}>Jiwa</Text></Text>
            <Text style={styles.gridStatusLabel}>Ayah, Ibu, & 2 Anak</Text>
            <View style={[styles.tagKondisi, { backgroundColor: '#FDF0EC' }]}>
              <Text style={[styles.tagKondisiText, { color: Colors.light.accentCoral }]}>❤️ Harmonis</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. MEMORI KELUARGA / DIARY (Klik -> Tab More/Diary) */}
        <TouchableOpacity 
          style={styles.chartCard}
          activeOpacity={0.85}
          onPress={() => navigateToMore('DIARY')}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconCircle, { backgroundColor: '#FDF0EC' }]}>
                <Text style={{ fontSize: 16 }}>📖</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Album Kenangan Keluarga</Text>
                <Text style={styles.cardSub}>{diary.length} momen hangat tercatat • Sentuh untuk album</Text>
              </View>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  navHouseholdName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  navChevron: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '700',
  },
  navSubtext: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 1,
  },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl + 50,
  },
  greetingHeader: {
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 3,
  },
  chartCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cardSub: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 1,
  },
  arrowIcon: {
    fontSize: 20,
    color: Colors.light.textMuted,
    fontWeight: '300',
  },
  chartVisualBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  chartNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartBigValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chartValueLabel: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  segmentedBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EDE8E1',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 4,
  },
  segmentedBarSpent: {
    backgroundColor: Colors.light.accentCoral,
    height: '100%',
  },
  segmentedBarRemain: {
    backgroundColor: '#2E7D32',
    height: '100%',
  },
  barLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  colCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  miniCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowMini: {
    fontSize: 16,
    color: Colors.light.textMuted,
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  gridBigCount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 2,
  },
  gridSmallTotal: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textMuted,
  },
  gridStatusLabel: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  miniProgressTrack: {
    height: 6,
    backgroundColor: '#EDE8E1',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 4,
  },
  miniProgressFillGreen: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  miniProgressFillCoral: {
    height: '100%',
    backgroundColor: Colors.light.accentCoral,
    borderRadius: 3,
  },
  rateLabel: {
    fontSize: 10,
    color: Colors.light.textMuted,
  },
  subGraphTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textMuted,
    marginBottom: 10,
  },
  weeklyBarChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 75,
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barPillarWrapper: {
    height: 48,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barPillar: {
    width: 14,
    backgroundColor: '#D1D9D3',
    borderRadius: 4,
  },
  barDayText: {
    fontSize: 10,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  barCountText: {
    fontSize: 9,
    color: Colors.light.textMuted,
  },
  tagKondisi: {
    backgroundColor: '#EBF4EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagKondisiText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
