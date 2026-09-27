import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/Theme';
import { useHouseholdStore } from '@/store/householdStore';

export default function CalendarScreen() {
  const router = useRouter();
  const events = useHouseholdStore((s) => s.events);
  const bills = useHouseholdStore((s) => s.bills);
  const addEvent = useHouseholdStore((s) => s.addEvent);
  const setActiveMoreTab = useHouseholdStore((s) => s.setActiveMoreTab);

  const [activeTab, setActiveTab] = useState<'PEKAN' | 'BULAN' | 'AGENDA'>('PEKAN');
  const [activeMember, setActiveMember] = useState<'SEMUA' | 'AYAH' | 'IBU'>('SEMUA');
  const [selectedDay, setSelectedDay] = useState(23);

  // Modal Rencana Baru
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'FAMILY' | 'SCHOOL' | 'APPOINTMENT' | 'MAINTENANCE'>('FAMILY');
  const [eventTime, setEventTime] = useState('10:00 WIB');

  const handleCreatePlan = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Perhatian', 'Nama agenda tidak boleh kosong.');
      return;
    }

    addEvent({
      householdId: 'hh_anderson',
      title: eventTitle.trim(),
      description: `Rencana agenda bersama keluarga pada jam ${eventTime}`,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      allDay: false,
      category: eventCategory,
      location: eventLocation.trim() || 'Rumah',
    });

    setEventTitle('');
    setEventLocation('');
    setModalVisible(false);
    Alert.alert('Sukses! 📅', 'Agenda baru berhasil dijadwalkan ke Kalender Keluarga.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navLeft}
          onPress={() => router.push('/(tabs)/family')}
        >
          <View style={styles.navHomeIcon}>
            <Text style={{ fontSize: 16 }}>🏠</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.navHouseholdName}>Keluarga Anderson</Text>
              <Text style={styles.navChevron}> ⌵</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={styles.dotTerracotta} />
              <Text style={styles.navSubtext}>Agenda & Catatan Bersama</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={styles.navIconBtn}
            onPress={() => Alert.alert('Jadwal Hari Ini 🔔', 'Agenda terdekat: Servis Mobil Fortuner pukul 09:00 WIB.')}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.avatarMini}
            onPress={() => router.push('/(tabs)/family')}
          >
            <Text style={{ fontSize: 18 }}>👩‍🦰</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* View Switcher & Rencana Baru Button */}
        <View style={styles.topControlRow}>
          <View style={styles.viewSegment}>
            <TouchableOpacity 
              style={[styles.segmentBtn, activeTab === 'PEKAN' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('PEKAN')}
            >
              <Text style={[styles.segmentText, activeTab === 'PEKAN' && styles.segmentTextActive]}>
                Pekan Ini
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segmentBtn, activeTab === 'BULAN' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('BULAN')}
            >
              <Text style={[styles.segmentText, activeTab === 'BULAN' && styles.segmentTextActive]}>
                Bulan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segmentBtn, activeTab === 'AGENDA' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('AGENDA')}
            >
              <Text style={[styles.segmentText, activeTab === 'AGENDA' && styles.segmentTextActive]}>
                Agenda
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.btnRencanaBaru}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.btnRencanaBaruText}>⊕ Rencana Baru</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Strip Card (September 2026) */}
        <View style={styles.calendarCard}>
          <View style={styles.monthHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.monthTitle}>September 2026</Text>
              <View style={styles.seasonBadge}>
                <Text style={styles.seasonText}>Musim Gugur</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity onPress={() => Alert.alert('Kalender', 'Pindah ke bulan sebelumnya')}>
                <Text style={{ fontSize: 16, color: Colors.light.textSecondary }}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('Kalender', 'Pindah ke bulan berikutnya')}>
                <Text style={{ fontSize: 16, color: Colors.light.textSecondary }}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Days of Week Row */}
          <View style={styles.dayStripRow}>
            {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map((d) => (
              <Text key={d} style={styles.dayStripName}>{d}</Text>
            ))}
          </View>

          {/* Dates Row (Bisa dipilih) */}
          <View style={styles.dateStripRow}>
            {[
              { day: 20, dots: [] },
              { day: 21, dots: ['#8C827A'] },
              { day: 22, dots: ['#2E7D32'] },
              { day: 23, dots: [Colors.light.accentCoral, '#A3D9A5'] },
              { day: 24, dots: [] },
              { day: 25, dots: [Colors.light.accentCoral] },
              { day: 26, dots: ['#8C827A'] },
            ].map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <TouchableOpacity
                  key={item.day}
                  style={[styles.dateCol, isSelected && styles.dateColActive]}
                  onPress={() => setSelectedDay(item.day)}
                >
                  <Text style={[styles.dateNum, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                    {item.day}
                  </Text>
                  {item.dots.length > 0 && (
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 3 }}>
                      {item.dots.map((c, i) => (
                        <View key={i} style={[styles.miniDot, { backgroundColor: c }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.light.accentCoral }]} />
              <Text style={styles.legendText}>Acara Keluarga</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
              <Text style={styles.legendText}>Urusan Rumah & Servis</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Ulang Tahun</Text>
            </View>
          </View>
        </View>

        {/* Filter Anggota Keluarga */}
        <View style={styles.memberFilterSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={styles.memberFilterHeader}>PILIH ANGGOTA KELUARGA</Text>
            <Text style={styles.memberFilterHelp}>Sentuh untuk menyaring</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <TouchableOpacity 
              style={[styles.memberFilterChip, activeMember === 'SEMUA' && styles.memberFilterChipActive]}
              onPress={() => setActiveMember('SEMUA')}
            >
              <Text style={[styles.memberFilterText, activeMember === 'SEMUA' && { color: '#FFFFFF' }]}>
                👥 Semua <Text style={styles.badgeNum}>4</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.memberFilterChip, activeMember === 'AYAH' && styles.memberFilterChipActive]}
              onPress={() => setActiveMember('AYAH')}
            >
              <Text style={[styles.memberFilterText, activeMember === 'AYAH' && { color: '#FFFFFF' }]}>
                👨 Ayah <Text style={styles.subTagRole}>Mark</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.memberFilterChip, activeMember === 'IBU' && styles.memberFilterChipActive]}
              onPress={() => setActiveMember('IBU')}
            >
              <Text style={[styles.memberFilterText, activeMember === 'IBU' && { color: '#FFFFFF' }]}>
                👩 Ibu <Text style={styles.subTagRole}>Sarah</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Section: Tanggal Terpilih */}
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing.md }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dayGroupTitle}>Rabu, {selectedDay} September</Text>
            <View style={styles.dayGroupDot} />
          </View>
          <Text style={styles.dayGroupCount}>{events.length + 1} rencana</Text>
        </View>

        {/* Event 1: Servis Mobil Fortuner */}
        <TouchableOpacity 
          style={styles.eventCard}
          activeOpacity={0.8}
          onPress={() => {
            setActiveMoreTab('ASSETS');
            router.push('/(tabs)/more');
          }}
        >
          <View style={styles.eventCardTop}>
            <Text style={styles.eventTimeHeader}>Pagi • 09:00 – 10:30 WIB</Text>
            <View style={styles.categoryBadgeGreen}>
              <Text style={styles.categoryBadgeGreenText}>🚗 Kendaraan</Text>
            </View>
          </View>
          <Text style={styles.eventTitle}>Servis Mobil Keluarga (Fortuner)</Text>
          <Text style={styles.eventLocation}>📍 Bengkel Auto2000 • Bay 4 (Pengecekan Rutin)</Text>

          <View style={styles.eventFooterPills}>
            <View style={styles.linkedAssetPill}>
              <Text style={styles.linkedAssetText}>🔗 Toyota Fortuner (B 1289 VRA)</Text>
            </View>
            <View style={styles.personPill}>
              <Text style={styles.personPillText}>👨 Bersama Ayah</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Event 2: Pertemuan Orang Tua Alex */}
        <TouchableOpacity 
          style={styles.eventCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Jadwal Sekolah 🏫', 'Pertemuan Orang Tua Alex di Mentari International School.\nAgenda: Evaluasi Tengah Semester & Pembahasan Kurikulum Sains.')}
        >
          <View style={styles.eventCardTop}>
            <Text style={styles.eventTimeHeader}>Siang • 14:30 – 15:30 WIB</Text>
            <View style={styles.categoryBadgeGreen}>
              <Text style={styles.categoryBadgeGreenText}>🎓 Sekolah</Text>
            </View>
          </View>
          <Text style={styles.eventTitle}>Pertemuan Orang Tua Alex</Text>
          <Text style={styles.eventLocation}>🎓 Mentari International School • Ruang Kelas 204</Text>

          <View style={styles.eventFooterPills}>
            <View style={styles.childPill}>
              <Text style={styles.childPillText}>👦 Anak: Alex (Kelas 3B)</Text>
            </View>
            <View style={styles.personPill}>
              <Text style={styles.personPillText}>👩 Didampingi Ibu</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Dynamic User Created Events */}
        {events.map((ev) => (
          <View key={ev.id} style={styles.eventCard}>
            <View style={styles.eventCardTop}>
              <Text style={styles.eventTimeHeader}>Jadwal Ditambahkan</Text>
              <View style={styles.categoryBadgeBrown}>
                <Text style={styles.categoryBadgeBrownText}>{ev.category}</Text>
              </View>
            </View>
            <Text style={styles.eventTitle}>{ev.title}</Text>
            <Text style={styles.eventLocation}>📍 {ev.location || 'Rumah'}</Text>
            <Text style={styles.eventDescText}>{ev.description}</Text>
          </View>
        ))}

        {/* Event 3: Makan Malam Spesial */}
        <TouchableOpacity 
          style={styles.eventCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Makan Malam Spesial 🍴', 'Menu: Sup Ayam Jahe Hangat & Sayur Buncis.\nSeluruh keluarga wajib berkumpul pukul 19:00 WIB.')}
        >
          <View style={styles.eventCardTop}>
            <Text style={styles.eventTimeHeader}>Malam • 19:00 WIB</Text>
            <View style={styles.categoryBadgeBrown}>
              <Text style={styles.categoryBadgeBrownText}>🍴 Santai</Text>
            </View>
          </View>
          <Text style={styles.eventTitle}>Makan Malam Spesial & Obrolan Santai</Text>
          <Text style={styles.eventLocation}>🥣 Meja Makan Rumah • Sup Hangat & Cerita Mingguan</Text>

          <View style={styles.eventFooterPills}>
            <View style={styles.familyPill}>
              <Text style={styles.familyPillText}>❤️ Seluruh Keluarga Wajib Kumpul</Text>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
              <Text style={{ fontSize: 16 }}>👨👩👦👧</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Event Highlight: Ulang Tahun Leo */}
        <TouchableOpacity 
          style={styles.birthdayCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Pesta Ulang Tahun Leo 🎂', '12 Oktober di Halaman Belakang.\nPersiapan kado: Sepeda gunung baru & Kue Tart cokelat.')}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.birthdayTag}>🎉 ACARA SPESIAL SEGERA TIBA</Text>
            <View style={styles.perayaanBadge}>
              <Text style={styles.perayaanText}>PERAYAAN</Text>
            </View>
          </View>

          <Text style={styles.birthdayTitle}>Ulang Tahun Leo ke-14 🎂</Text>
          <Text style={styles.birthdayDesc}>
            12 Oktober mendatang. Rencana pesta kejutan kecil & buka kado di halaman belakang bersama keluarga dan sahabat!
          </Text>

          <View style={styles.birthdayFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 13 }}>🎁</Text>
              <Text style={styles.birthdayPrepText}> Kado & Kue Tart sedang disiapkan</Text>
            </View>
            <View style={styles.hDaysPill}>
              <Text style={styles.hDaysText}>H-19 Hari</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Agenda & Catatan Mendatang */}
        <View style={[styles.sectionHeaderRow, { marginTop: Spacing.md }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, marginRight: 6 }}>📑</Text>
            <Text style={styles.dayGroupTitle}>Agenda & Catatan Mendatang</Text>
          </View>
          <TouchableOpacity onPress={() => {
            setActiveMoreTab('BILLS');
            router.push('/(tabs)/more');
          }}>
            <Text style={styles.dayGroupCount}>Lihat Tagihan ›</Text>
          </TouchableOpacity>
        </View>

        {/* Bill Agenda 1 */}
        <TouchableOpacity 
          style={styles.agendaUpcomingCard}
          onPress={() => {
            setActiveMoreTab('BILLS');
            router.push('/(tabs)/more');
          }}
        >
          <View style={styles.dateSquare}>
            <Text style={styles.dateSquareMonth}>SEP</Text>
            <Text style={styles.dateSquareNum}>25</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.agendaUpcomingTitle}>Bayar WiFi & Listrik Rumah</Text>
            <Text style={styles.agendaUpcomingSub}>📶 Fiber Home • Rutinitas Bulanan</Text>
          </View>
          <View style={styles.rutinitasBadge}>
            <Text style={styles.rutinitasText}>Rutinitas</Text>
          </View>
        </TouchableOpacity>

        {/* Bill Agenda 2 */}
        <TouchableOpacity 
          style={styles.agendaUpcomingCard}
          onPress={() => {
            setActiveMoreTab('ASSETS');
            router.push('/(tabs)/more');
          }}
        >
          <View style={styles.dateSquare}>
            <Text style={styles.dateSquareMonth}>OKT</Text>
            <Text style={styles.dateSquareNum}>04</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.agendaUpcomingTitle}>Pajak Tahunan Fortuner</Text>
            <Text style={styles.agendaUpcomingSub}>📋 Biro Jasa / Samsat Online</Text>
          </View>
          <View style={styles.categoryBadgeGreen}>
            <Text style={styles.categoryBadgeGreenText}>Kendaraan</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Add Plan Icon */}
      <TouchableOpacity 
        style={styles.floatingCalendarBtn}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 20 }}>📅</Text>
      </TouchableOpacity>

      {/* Modal: Rencana Baru */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Jadwalkan Rencana Baru</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nama Kegiatan / Acara *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Kunjungan Dokter Gigi Leo"
              placeholderTextColor={Colors.light.textMuted}
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            <Text style={styles.inputLabel}>Lokasi / Tempat</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Rumah Sakit Pondok Indah"
              placeholderTextColor={Colors.light.textMuted}
              value={eventLocation}
              onChangeText={setEventLocation}
            />

            <Text style={styles.inputLabel}>Waktu & Jam</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 14:00 WIB"
              placeholderTextColor={Colors.light.textMuted}
              value={eventTime}
              onChangeText={setEventTime}
            />

            <Text style={styles.inputLabel}>Kategori Kegiatan</Text>
            <View style={styles.chipRow}>
              {(['FAMILY', 'SCHOOL', 'APPOINTMENT', 'MAINTENANCE'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, eventCategory === cat && styles.chipActive]}
                  onPress={() => setEventCategory(cat)}
                >
                  <Text style={[styles.chipText, eventCategory === cat && styles.chipTextActive]}>
                    {cat === 'FAMILY' ? '❤️ Keluarga' : cat === 'SCHOOL' ? '🎓 Sekolah' : cat === 'APPOINTMENT' ? '🩺 Janji Medis' : '🚗 Servis'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreatePlan}>
              <Text style={styles.submitBtnText}>Simpan ke Kalender</Text>
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
  navChevron: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '700',
  },
  dotTerracotta: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accentCoral,
    marginRight: 6,
  },
  navSubtext: {
    fontSize: 12,
    color: Colors.light.textSecondary,
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
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  viewSegment: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  segmentBtnActive: {
    backgroundColor: Colors.light.sand,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  segmentTextActive: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  btnRencanaBaru: {
    backgroundColor: '#2D3E33',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
  },
  btnRencanaBaruText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  seasonBadge: {
    backgroundColor: '#FDF0EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: 8,
  },
  seasonText: {
    fontSize: 11,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  dayStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayStripName: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textMuted,
  },
  dateStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateCol: {
    width: 36,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  dateColActive: {
    backgroundColor: '#2D3E33',
  },
  dateNum: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  memberFilterSection: {
    marginBottom: Spacing.md,
  },
  memberFilterHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textMuted,
    letterSpacing: 0.6,
  },
  memberFilterHelp: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  memberFilterChip: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  memberFilterChipActive: {
    backgroundColor: '#2D3E33',
    borderColor: '#2D3E33',
  },
  memberFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  badgeNum: {
    fontWeight: '700',
  },
  subTagRole: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  dayGroupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accentCoral,
    marginLeft: 6,
  },
  dayGroupCount: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  eventCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventTimeHeader: {
    fontSize: 11,
    color: Colors.light.textMuted,
    fontWeight: '500',
  },
  categoryBadgeGreen: {
    backgroundColor: '#E7F2EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeGreenText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '700',
  },
  categoryBadgeBrown: {
    backgroundColor: '#FAF0EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeBrownText: {
    fontSize: 10,
    color: '#8C3D28',
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 20,
  },
  eventLocation: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  eventDescText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  eventFooterPills: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  linkedAssetPill: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  linkedAssetText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  personPill: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  personPillText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  childPill: {
    backgroundColor: '#FDF0EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  childPillText: {
    fontSize: 11,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  familyPill: {
    backgroundColor: '#FDF0EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  familyPillText: {
    fontSize: 11,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  birthdayCard: {
    backgroundColor: '#FBF5EE',
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginTop: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAE1D5',
  },
  birthdayTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C3D28',
    letterSpacing: 0.5,
  },
  perayaanBadge: {
    backgroundColor: '#8C3D28',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  perayaanText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  birthdayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 6,
  },
  birthdayDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  birthdayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  birthdayPrepText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  hDaysPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#EAE1D5',
  },
  hDaysText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.accentCoral,
  },
  agendaUpcomingCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSquare: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateSquareMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.textMuted,
  },
  dateSquareNum: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  agendaUpcomingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  agendaUpcomingSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  rutinitasBadge: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  rutinitasText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  floatingCalendarBtn: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2D3E33',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chipActive: {
    backgroundColor: '#2D3E33',
    borderColor: '#2D3E33',
  },
  chipText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#2D3E33',
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
