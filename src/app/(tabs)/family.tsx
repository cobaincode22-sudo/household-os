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
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/Theme';
import { useHouseholdStore } from '@/store/householdStore';

export default function FamilyAndSettingsScreen() {
  const router = useRouter();
  const setActiveMoreTab = useHouseholdStore((s) => s.setActiveMoreTab);
  const budget = useHouseholdStore((s) => s.currentBudget);
  const members = useHouseholdStore((s) => s.members);

  // Modal Ganti Bahasa / Mata Uang
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('IDR');
  const [selectedLanguage, setSelectedLanguage] = useState('id');

  // Modal Notifikasi Santai
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [billReminder, setBillReminder] = useState(true);
  const [routineReminder, setRoutineReminder] = useState(true);
  const [familyDigest, setFamilyDigest] = useState(true);

  const handleRingDinnerBell = () => {
    Alert.alert(
      '🔔 Lonceng Makan Malam Dibunyikan!',
      'Pemberitahuan telah dikirimkan ke seluruh smartphone keluarga:\n"Makan Malam Bersama Siap di Meja Makan! Yuk Kumpul!"',
      [{ text: 'Bagus Sekali! ❤️', style: 'default' }]
    );
  };

  const navigateToMore = (tab: 'FINANCE' | 'BILLS' | 'ASSETS' | 'DIARY' | 'TIMELINE') => {
    setActiveMoreTab(tab);
    router.push('/(tabs)/more');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.navHomeIcon}>
            <Text style={{ fontSize: 16 }}>🏠</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.navHouseholdName}>Rumah Anderson</Text>
            <Text style={styles.navSubtext}>Pusat Keluarga</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={styles.navIconBtn}
            onPress={() => setNotifModalVisible(true)}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
          <View style={styles.avatarMini}>
            <Text style={{ fontSize: 18 }}>👩‍🦰</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Sarah Anderson */}
        <TouchableOpacity 
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Profil Koordinator', 'Sarah Anderson\nPeran: Ibu & Koordinator Rumah\nBergabung: 1 Januari 2024')}
        >
          <View style={styles.profileAvatarBox}>
            <Text style={{ fontSize: 32 }}>👩‍🦰</Text>
            <View style={styles.heartSmallBadge}>
              <Text style={{ fontSize: 9 }}>💚</Text>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.profileName}>Sarah Anderson</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>Ibu & Koordinator Rumah</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 12 }}>👥</Text>
              <Text style={styles.memberCountText}> Keluarga Anderson ({members.length} Anggota)</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Status Suasana Rumah */}
        <View style={styles.statusHomeRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            Suasana Rumah: Damai & Nyaman <Text style={styles.statusLoc}>• Jakarta Selatan (WIB)</Text>
          </Text>
        </View>

        {/* Lonceng Makan Malam Button (Aktif) */}
        <TouchableOpacity 
          style={styles.btnDinnerBell}
          activeOpacity={0.8}
          onPress={handleRingDinnerBell}
        >
          <Text style={styles.btnDinnerBellText}>🔔 Panggil Keluarga / Lonceng Makan Malam 🔔</Text>
        </TouchableOpacity>

        {/* Section: Aktivitas & Urusan Rumah */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dotTerracotta} />
            <Text style={styles.sectionTitle}>Aktivitas & Urusan Rumah</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Hari ini, 21 Sep</Text>
        </View>

        {/* Menu 1: Keuangan & Belanja */}
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.7}
          onPress={() => navigateToMore('FINANCE')}
        >
          <View style={styles.menuTopRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#E7F2EB' }]}>
              <Text style={{ fontSize: 18 }}>🪙</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.menuTitle}>Keuangan & Belanja</Text>
              <Text style={styles.menuSub}>Anggaran bulanan & catatan belanja dapur</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>

          <View style={styles.menuInnerProgressCard}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Terpakai: <Text style={styles.bold}>Rp {budget?.spent.toLocaleString()}</Text></Text>
              <Text style={styles.progressLabel}>Batas: Rp {budget?.totalBudget.toLocaleString()}</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '61.5%' }]} />
            </View>
            <View style={styles.progressBottomRow}>
              <Text style={styles.progressSubLeft}>Sisa Rp {((budget?.totalBudget || 0) - (budget?.spent || 0)).toLocaleString()} untuk 9 hari ke depan</Text>
              <Text style={styles.progressSubRight}>Aman terkendali</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Menu 2: Barang & Kendaraan Rumah */}
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.7}
          onPress={() => navigateToMore('ASSETS')}
        >
          <View style={styles.menuTopRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#E7F2EB' }]}>
              <Text style={{ fontSize: 18 }}>🚗</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.menuTitle}>Barang & Kendaraan Rumah</Text>
              <Text style={styles.menuSub}>Perawatan mobil, AC, & servis berkala</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>

          <View style={styles.menuPillsRow}>
            <View style={styles.assetStatusPill}>
              <Text style={styles.assetStatusText}>🚗 Fortuner (Servis Nov)</Text>
            </View>
            <View style={styles.assetStatusPill}>
              <Text style={styles.assetStatusText}>❄️ Cuci AC Kamar (Beres)</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Menu 3: Tagihan Rutin */}
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.7}
          onPress={() => navigateToMore('BILLS')}
        >
          <View style={styles.menuTopRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#FDF0EC' }]}>
              <Text style={{ fontSize: 18 }}>📋</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.menuTitle}>Tagihan Rutin</Text>
                <View style={styles.tagihanBadge}>
                  <Text style={styles.tagihanBadgeText}>1 Segera</Text>
                </View>
              </View>
              <Text style={styles.menuSub}>Listrik PLN, WiFi Biznet, & langganan</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>

          <View style={styles.menuTwoColBox}>
            <View style={styles.colCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.dueAlertText}>JATUH TEMPO 3 HARI</Text>
                <Text style={{ fontSize: 11, color: Colors.light.accentCoral }}>⚡</Text>
              </View>
              <Text style={styles.colTitle}>Listrik PLN</Text>
              <Text style={styles.colAmount}>~Rp1.850.000</Text>
            </View>

            <View style={styles.colCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.colDateText}>1 OKT</Text>
                <Text style={{ fontSize: 11, color: Colors.light.textMuted }}>📶</Text>
              </View>
              <Text style={styles.colTitle}>Biznet WiFi</Text>
              <Text style={styles.colAmount}>Rp550.000</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Menu 4: Album & Kenangan Keluarga */}
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.7}
          onPress={() => navigateToMore('DIARY')}
        >
          <View style={styles.menuTopRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#FDF0EC' }]}>
              <Text style={{ fontSize: 18 }}>🖼️</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.menuTitle}>Album & Kenangan Keluarga</Text>
              <Text style={styles.menuSub}>Foto liburan Bali, momen makan malam bersama</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>

          <View style={styles.albumPreviewRow}>
            <View style={[styles.photoCard, { backgroundColor: '#A89E94' }]}>
              <Text style={{ fontSize: 22 }}>🏖️</Text>
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>Bali Trip</Text>
              </View>
            </View>

            <View style={[styles.photoCard, { backgroundColor: '#D6C8BB' }]}>
              <Text style={{ fontSize: 22 }}>🍕</Text>
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>Makan Malam</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addPhotoCard}
              onPress={() => navigateToMore('DIARY')}
            >
              <Text style={{ fontSize: 18, color: Colors.light.textSecondary }}>📷</Text>
              <Text style={styles.addPhotoText}>+ Tambah Foto</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Menu 5: Dokumen Penting */}
        <TouchableOpacity 
          style={styles.menuCard}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Brankas Dokumen Keluarga 🔒', 'Tersimpan aman:\n1. Polis Asuransi Kesehatan Allisya\n2. STNK Toyota Fortuner (B 1234 PA)\n3. Akta Kelahiran Alex & Leo\n4. Sertifikat Garansi Daikin AC')}
        >
          <View style={styles.menuTopRow}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#FAF7F2' }]}>
              <Text style={{ fontSize: 18 }}>📁</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.menuTitle}>Dokumen Penting</Text>
              <Text style={styles.menuSub}>Asuransi, STNK, buku nikah, & akta keluarga</Text>
            </View>
            <View style={styles.amanBadge}>
              <Text style={styles.amanBadgeText}>Aman</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Section: Pengaturan Rumah */}
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing.lg }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dotTerracotta} />
            <Text style={styles.sectionTitle}>Pengaturan Rumah</Text>
          </View>
          <Text style={styles.sectionSubtitle}>KELUARGA</Text>
        </View>

        <View style={styles.settingsGroupCard}>
          {/* Item 1: Anggota Keluarga */}
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => {
              Alert.alert(
                'Anggota Keluarga Anderson',
                members.map(m => `• ${m.name} (${m.role})`).join('\n')
              );
            }}
          >
            <View style={styles.settingsIcon}>
              <Text style={{ fontSize: 16 }}>👥</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingsTitle}>Anggota Keluarga</Text>
              <Text style={styles.settingsSub}>Sarah, David, & 2 anak</Text>
            </View>
            <View style={styles.avatarMiniStack}>
              <View style={[styles.miniCircle, { backgroundColor: '#E7F2EB' }]}>
                <Text style={{ fontSize: 9, fontWeight: '700' }}>SA</Text>
              </View>
              <View style={[styles.miniCircle, { backgroundColor: '#FDF0EC', marginLeft: -6 }]}>
                <Text style={{ fontSize: 9, fontWeight: '700' }}>DA</Text>
              </View>
              <View style={[styles.miniCircle, { backgroundColor: '#FAF7F2', marginLeft: -6 }]}>
                <Text style={{ fontSize: 9, fontWeight: '700' }}>+2</Text>
              </View>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Item 2: Notifikasi Santai */}
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setNotifModalVisible(true)}
          >
            <View style={styles.settingsIcon}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingsTitle}>Notifikasi Santai</Text>
              <Text style={styles.settingsSub}>Pengingat halus tagihan & agenda akhir...</Text>
            </View>
            <View style={styles.notifDot} />
            <Text style={styles.chevronRight}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Item 3: Ganti Bahasa & Mata Uang */}
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setLangModalVisible(true)}
          >
            <View style={styles.settingsIcon}>
              <Text style={{ fontSize: 16 }}>🌐</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.settingsTitle}>Ganti Bahasa & Mata Uang</Text>
              <Text style={styles.settingsSub}>
                {selectedLanguage === 'id' ? 'Bahasa Indonesia' : 'English'} • {selectedCurrency}
              </Text>
            </View>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>{selectedCurrency}</Text>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Slogan */}
        <View style={styles.footerBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dotGreenMini} />
            <Text style={styles.footerText}>Rumah Nyaman, Keluarga Bahagia</Text>
          </View>
          <Text style={styles.footerSub}>The Anderson Family • Kemang, Jakarta</Text>
        </View>
      </ScrollView>

      {/* Modal Notifikasi Santai */}
      <Modal
        visible={notifModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pengaturan Notifikasi Santai</Text>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Pengingat ramah keluarga agar tidak mengganggu ketenangan rumah.
            </Text>

            <TouchableOpacity 
              style={styles.switchRow}
              onPress={() => setBillReminder(!billReminder)}
            >
              <Text style={styles.switchLabel}>Pengingat Jatuh Tempo Tagihan (H-3)</Text>
              <Text style={{ fontSize: 20 }}>{billReminder ? '🟢' : '⚪'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchRow}
              onPress={() => setRoutineReminder(!routineReminder)}
            >
              <Text style={styles.switchLabel}>Pengingat Servis Mobil & Cuci AC</Text>
              <Text style={{ fontSize: 20 }}>{routineReminder ? '🟢' : '⚪'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchRow}
              onPress={() => setFamilyDigest(!familyDigest)}
            >
              <Text style={styles.switchLabel}>Kabar Harian Keluarga di Pagi Hari</Text>
              <Text style={{ fontSize: 20 }}>{familyDigest ? '🟢' : '⚪'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalActionBtn}
              onPress={() => {
                setNotifModalVisible(false);
                Alert.alert('Tersimpan! ✨', 'Preferensi notifikasi santai telah diperbarui.');
              }}
            >
              <Text style={styles.modalActionText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Bahasa & Mata Uang */}
      <Modal
        visible={langModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Bahasa & Mata Uang</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Bahasa Aplikasi</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              <TouchableOpacity 
                style={[styles.langChip, selectedLanguage === 'id' && styles.langChipActive]}
                onPress={() => setSelectedLanguage('id')}
              >
                <Text style={[styles.langText, selectedLanguage === 'id' && styles.langTextActive]}>🇮🇩 Bahasa Indonesia</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.langChip, selectedLanguage === 'en' && styles.langChipActive]}
                onPress={() => setSelectedLanguage('en')}
              >
                <Text style={[styles.langText, selectedLanguage === 'en' && styles.langTextActive]}>🇺🇸 English</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Mata Uang Utama</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              {['IDR', 'USD', 'SGD', 'EUR'].map((cur) => (
                <TouchableOpacity 
                  key={cur}
                  style={[styles.langChip, selectedCurrency === cur && styles.langChipActive]}
                  onPress={() => setSelectedCurrency(cur)}
                >
                  <Text style={[styles.langText, selectedCurrency === cur && styles.langTextActive]}>{cur}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalActionBtn}
              onPress={() => {
                setLangModalVisible(false);
                Alert.alert('Berhasil Diubah! 🌐', `Bahasa: ${selectedLanguage === 'id' ? 'Indonesia' : 'English'}, Mata Uang: ${selectedCurrency}`);
              }}
            >
              <Text style={styles.modalActionText}>Terapkan Perubahan</Text>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.light.background,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navHomeIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EBF4EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHouseholdName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  navSubtext: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3EFE9',
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
    paddingBottom: Spacing.xxl + 40,
  },
  profileCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 4,
  },
  profileAvatarBox: {
    width: 58,
    height: 58,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FDF0EC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heartSmallBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E8EFEA',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
  },
  roleTag: {
    backgroundColor: '#FDF0EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  roleTagText: {
    fontSize: 11,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  memberCountText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  statusHomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  statusLoc: {
    color: Colors.light.textMuted,
  },
  btnDinnerBell: {
    backgroundColor: '#8C3D28',
    borderRadius: BorderRadius.full,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: Spacing.md,
  },
  btnDinnerBellText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dotTerracotta: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accentCoral,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  menuCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  menuTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  chevronRight: {
    fontSize: 20,
    color: Colors.light.textMuted,
    marginLeft: 6,
  },
  menuInnerProgressCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: Colors.light.text,
  },
  barTrack: {
    height: 6,
    backgroundColor: '#EDE8E1',
    borderRadius: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#354A3E',
    borderRadius: 3,
  },
  progressBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSubLeft: {
    fontSize: 10,
    color: Colors.light.textMuted,
  },
  progressSubRight: {
    fontSize: 10,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  menuPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  assetStatusPill: {
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  assetStatusText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  tagihanBadge: {
    backgroundColor: '#8C3D28',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  tagihanBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  menuTwoColBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  colCard: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: 10,
  },
  dueAlertText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.accentCoral,
  },
  colDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textMuted,
  },
  colTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 2,
  },
  colAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  albumPreviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  photoCard: {
    flex: 1,
    height: 70,
    borderRadius: BorderRadius.md,
    justifyContent: 'flex-end',
    padding: 6,
  },
  photoTag: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  photoTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  addPhotoCard: {
    flex: 1,
    height: 70,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  amanBadge: {
    backgroundColor: '#E7F2EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: 4,
  },
  amanBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  settingsGroupCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  settingsSub: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  avatarMiniStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.accentCoral,
  },
  currencyBadge: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  currencyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.borderLight,
  },
  footerBox: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  dotGreenMini: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginRight: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  footerSub: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginTop: 2,
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
    marginBottom: Spacing.sm,
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
  modalDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  switchLabel: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '500',
    flex: 1,
  },
  modalActionBtn: {
    backgroundColor: '#2D3E33',
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  modalActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  langChipActive: {
    backgroundColor: '#2D3E33',
    borderColor: '#2D3E33',
  },
  langText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
