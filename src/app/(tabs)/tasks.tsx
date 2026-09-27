import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/Theme';
import { useHouseholdStore } from '@/store/householdStore';
import { TaskPriority } from '@/types/household';

export default function TasksScreen() {
  const router = useRouter();
  const tasks = useHouseholdStore((s) => s.tasks);
  const members = useHouseholdStore((s) => s.members);
  const toggleTaskStatus = useHouseholdStore((s) => s.toggleTaskStatus);
  const addTask = useHouseholdStore((s) => s.addTask);
  const payBill = useHouseholdStore((s) => s.payBill);
  const setActiveMoreTab = useHouseholdStore((s) => s.setActiveMoreTab);

  const [activeTab, setActiveTab] = useState<'SEMUA' | 'TUGASKU' | 'RUTINITAS'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  // Modal Tambah Tugas
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState(members[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [category, setCategory] = useState('Household');
  const [estimatedCost, setEstimatedCost] = useState('');

  // Filter tasks based on search & tab
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === 'TUGASKU') {
      return t.assignedToName?.toLowerCase().includes('ibu') || t.assignedTo === 'm_2';
    }
    if (activeTab === 'RUTINITAS') {
      return t.category?.toLowerCase().includes('rutin') || t.title.toLowerCase().includes('servis') || t.title.toLowerCase().includes('tagihan');
    }
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const handleCreateTask = () => {
    if (!title.trim()) {
      Alert.alert('Perhatian', 'Nama tugas tidak boleh kosong.');
      return;
    }
    const assignedMember = members.find((m) => m.id === assignedMemberId);

    addTask({
      householdId: 'hh_anderson',
      title: title.trim(),
      description: description.trim() || undefined,
      createdBy: 'user_2',
      assignedTo: assignedMemberId,
      assignedToName: assignedMember ? assignedMember.name : 'Ibu Sarah',
      status: 'TODO',
      priority,
      category,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      estimatedCost: estimatedCost ? parseInt(estimatedCost.replace(/[^0-9]/g, ''), 10) : undefined,
    });

    setTitle('');
    setDescription('');
    setEstimatedCost('');
    setModalVisible(false);
    Alert.alert('Sukses! ✨', 'Tugas baru berhasil ditambahkan ke daftar keluarga.');
  };

  const handleQuickPayInternet = () => {
    Alert.alert(
      'Bayar IndiHome Fiber',
      'Bayar tagihan internet rumah Rp 650.000 via e-wallet keluarga?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar Sekarang',
          onPress: () => {
            payBill('bill_internet', 650000, 'Ayah Mark');
            Alert.alert('Lunas! 📶', 'Tagihan IndiHome telah dibayar dan dicatat ke pengeluaran bulanan.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navLeft}
          onPress={() => router.push('/(tabs)/family')}
        >
          <View style={styles.avatarMini}>
            <Text style={{ fontSize: 18 }}>👩‍🦰</Text>
            <View style={styles.onlineBadge} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.navHouseholdName}>Keluarga Anderson</Text>
              <Text style={styles.navChevron}> ⌵</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={styles.dotGreen} />
              <Text style={styles.navSubtext}>Harmoni Rumah Tangga</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navIconBtn}
          onPress={() => Alert.alert('Notifikasi Tugas 🔔', `Ada ${pendingTasks.length} tugas yang perlu diselesaikan hari ini.`)}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Semangat Hari Ini */}
        <View style={styles.bannerRow}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIconCircle}>
              <Text style={{ fontSize: 18 }}>🌱</Text>
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.bannerTitle}>Semangat Hari Ini! ✨</Text>
              <Text style={styles.bannerSubtitle}>Tinggal {pendingTasks.length} kegiatan lagi bersama keluarga</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.streakBadge}
            onPress={() => Alert.alert('Kompak Selalu! 🔥', 'Keluarga Anderson sudah 5 hari berturut-turut menyelesaikan tugas rumah tepat waktu!')}
          >
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={styles.streakText}> 5 Hari Kompak</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterChip, activeTab === 'SEMUA' && styles.filterChipActive]}
            onPress={() => setActiveTab('SEMUA')}
          >
            <Text style={[styles.filterChipText, activeTab === 'SEMUA' && styles.filterChipTextActive]}>
              🏠 Semua <Text style={styles.filterPillNum}>{tasks.length}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, activeTab === 'TUGASKU' && styles.filterChipActive]}
            onPress={() => setActiveTab('TUGASKU')}
          >
            <Text style={[styles.filterChipText, activeTab === 'TUGASKU' && styles.filterChipTextActive]}>
              👤 Tugasku <Text style={styles.filterPillNum}>2</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, activeTab === 'RUTINITAS' && styles.filterChipActive]}
            onPress={() => setActiveTab('RUTINITAS')}
          >
            <Text style={[styles.filterChipText, activeTab === 'RUTINITAS' && styles.filterChipTextActive]}>
              🔄 Rutinitas Rumah
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar + Filter Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={{ fontSize: 15, marginRight: 8, color: Colors.light.textMuted }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari kegiatan, belanjaan, ..."
              placeholderTextColor={Colors.light.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ fontSize: 14, color: Colors.light.textMuted }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity 
            style={styles.filterTimeBtn}
            onPress={() => Alert.alert('Urutan Waktu', 'Menampilkan urutan dari paling mendesak.')}
          >
            <Text style={styles.filterTimeText}>☰ Waktu</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Hari Ini */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dotTerracotta} />
            <Text style={styles.sectionTitle}>Hari Ini</Text>
          </View>
          <Text style={styles.sectionCountText}>{pendingTasks.length} kegiatan</Text>
        </View>

        {/* Dynamic Task List from Store */}
        {pendingTasks.map((task) => {
          const isInternetTask = task.title.toLowerCase().includes('internet');
          const isCarTask = task.title.toLowerCase().includes('fortuner') || task.title.toLowerCase().includes('mobil');
          const isGroceryTask = task.title.toLowerCase().includes('belanja') || task.title.toLowerCase().includes('kulkas');
          const isAcTask = task.title.toLowerCase().includes('ac');

          return (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity 
                style={styles.taskCardHeader}
                activeOpacity={0.7}
                onPress={() => toggleTaskStatus(task.id)}
              >
                <View style={styles.radioCircle} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                    <Text style={styles.taskDeadlineText}>⏰ {task.category || 'Hari ini'} • </Text>
                    <Text style={styles.taskRutinText}>Prioritas: {task.priority}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Sub-box jika tugas internet */}
              {isInternetTask && (
                <View style={styles.taskInnerBox}>
                  <View style={[styles.taskInnerIcon, { backgroundColor: '#FDF0EC' }]}>
                    <Text style={{ fontSize: 16 }}>📶</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.innerTitle}>IndiHome Fiber Rumah</Text>
                    <Text style={styles.innerSub}>Otomatis via e-wallet</Text>
                  </View>
                  <Text style={styles.innerPrice}>Rp 650.000</Text>
                </View>
              )}

              {/* Sub-box jika tugas servis mobil */}
              {isCarTask && (
                <View style={styles.taskInnerBox}>
                  <View style={[styles.taskInnerIcon, { backgroundColor: '#EFF5F1' }]}>
                    <Text style={{ fontSize: 16 }}>🚗</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.innerTitle}>Toyota Fortuner (B 1234 PA)</Text>
                    <Text style={styles.innerSub}>Ganti oli & pengecekan rem</Text>
                  </View>
                  <Text style={styles.innerPrice}>Est. Rp 1.850.000</Text>
                </View>
              )}

              {/* Sub-box jika tugas belanja */}
              {isGroceryTask && (
                <View style={styles.tagsPillRow}>
                  <View style={styles.itemTagPill}>
                    <Text style={styles.itemTagText}>🥛 Susu Oat x2</Text>
                  </View>
                  <View style={styles.itemTagPill}>
                    <Text style={styles.itemTagText}>🥚 Telur Ayam Kampung (10)</Text>
                  </View>
                </View>
              )}

              {/* Sub-box jika AC */}
              {isAcTask && (
                <View style={styles.taskInnerBox}>
                  <View style={[styles.taskInnerIcon, { backgroundColor: '#EFF5F1' }]}>
                    <Text style={{ fontSize: 16 }}>❄️</Text>
                  </View>
                  <Text style={[styles.innerTitle, { marginLeft: 8 }]}>AC Kamar Depan (Daikin 1.5 PK)</Text>
                </View>
              )}

              {/* Footer Row */}
              <View style={styles.taskFooterRow}>
                <View style={styles.memberBadge}>
                  <Text style={{ fontSize: 12 }}>👤</Text>
                  <Text style={styles.memberNameText}> {task.assignedToName || 'Anggota'}</Text>
                </View>

                {isInternetTask && (
                  <TouchableOpacity style={styles.btnActionPrimary} onPress={handleQuickPayInternet}>
                    <Text style={styles.btnActionPrimaryText}>💳 Bayar Sekarang</Text>
                  </TouchableOpacity>
                )}

                {isCarTask && (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity 
                      style={styles.circleIconBtn}
                      onPress={() => Alert.alert('Hubungi Bengkel 📞', 'Menghubungi Bengkel Auto2000 Cilandak: 021-7654321')}
                    >
                      <Text style={{ fontSize: 12 }}>📞</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.circleIconBtn}
                      onPress={() => {
                        setActiveMoreTab('ASSETS');
                        router.push('/(tabs)/more');
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>➤</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isGroceryTask && (
                  <TouchableOpacity 
                    style={styles.btnOutline}
                    onPress={() => Alert.alert('Daftar Belanja 🛒', '1. Susu Oat\n2. Telur Ayam\n3. Sayur Bayam\n4. Roti Gandum\n5. Minyak Zaitun\n6. Keju Cheddar\n7. Sabun Cuci\n8. Buah Naga')}
                  >
                    <Text style={styles.btnOutlineText}>☰ Lihat 8 Item</Text>
                  </TouchableOpacity>
                )}

                {isAcTask && (
                  <View style={styles.poinBadge}>
                    <Text style={styles.poinBadgeText}>⭐ +50 Poin Kebaikan</Text>
                  </View>
                )}

                {!isInternetTask && !isCarTask && !isGroceryTask && !isAcTask && (
                  <TouchableOpacity 
                    style={styles.btnOutline}
                    onPress={() => toggleTaskStatus(task.id)}
                  >
                    <Text style={styles.btnOutlineText}>✓ Tandai Selesai</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Accordion: Sudah Selesai */}
        <View style={styles.completedAccordion}>
          <TouchableOpacity 
            style={styles.completedHeader}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.checkDoneIcon}>
                <Text style={{ fontSize: 12, color: '#2E7D32' }}>✓</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.completedTitle}>Sudah Selesai</Text>
                <Text style={styles.completedSub}>{completedTasks.length} tugas selesai</Text>
              </View>
            </View>
            <Text style={styles.accordionChevron}>{showCompleted ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showCompleted && completedTasks.map((t) => (
            <TouchableOpacity 
              key={t.id}
              style={styles.completedInnerCard}
              onPress={() => toggleTaskStatus(t.id)}
            >
              <View style={styles.completedCheck}>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>✓</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.completedTaskName}>{t.title}</Text>
                <Text style={styles.completedTaskSub}>Terselesaikan • {t.assignedToName || 'Keluarga'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floating Add Task Button */}
        <TouchableOpacity 
          style={styles.floatingAddBtn}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.floatingAddBtnText}>+ Tambah Tugas</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: Tambah Tugas Baru */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Tugas Keluarga</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nama Tugas *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Bersihkan jendela ruang tamu"
                placeholderTextColor={Colors.light.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Keterangan Tambahan (Opsional)</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Catatan atau instruksi..."
                placeholderTextColor={Colors.light.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <Text style={styles.inputLabel}>Tugaskan Kepada</Text>
              <View style={styles.chipRow}>
                {members.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.chip, assignedMemberId === m.id && styles.chipActive]}
                    onPress={() => setAssignedMemberId(m.id)}
                  >
                    <Text style={[styles.chipText, assignedMemberId === m.id && styles.chipTextActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Kategori</Text>
              <View style={styles.chipRow}>
                {['Household', 'Education', 'Vehicle', 'Food', 'Health'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, category === c && styles.chipActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Estimasi Anggaran / Biaya (Opsional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 150000"
                placeholderTextColor={Colors.light.textMuted}
                keyboardType="numeric"
                value={estimatedCost}
                onChangeText={setEstimatedCost}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTask}>
                <Text style={styles.submitBtnText}>Simpan Tugas</Text>
              </TouchableOpacity>
            </ScrollView>
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
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
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
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
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
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.light.accentCoral,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl + 40,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7F2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    borderWidth: 1,
    borderColor: '#E8DED1',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: '#2D3E33',
    borderColor: '#2D3E33',
  },
  filterChipText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterPillNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
  },
  filterTimeBtn: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dotTerracotta: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.accentCoral,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sectionCountText: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  taskCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C5BCB2',
    marginTop: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 20,
  },
  taskDeadlineText: {
    fontSize: 11,
    color: Colors.light.accentCoral,
    fontWeight: '600',
  },
  taskRutinText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  taskInnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  taskInnerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  innerSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  innerPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.accentCoral,
  },
  taskFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  memberNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  btnActionPrimary: {
    backgroundColor: '#2D3E33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  btnActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  circleIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  itemTagPill: {
    backgroundColor: '#FAF5ED',
    borderWidth: 1,
    borderColor: '#E8DED1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemTagText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  btnOutlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  poinBadge: {
    backgroundColor: '#E7F2EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  poinBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  completedAccordion: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: Spacing.sm,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkDoneIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E7F2EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  completedSub: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
  accordionChevron: {
    fontSize: 12,
    color: Colors.light.textMuted,
    fontWeight: '700',
  },
  completedInnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  completedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTaskName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  completedTaskSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  floatingAddBtn: {
    alignSelf: 'center',
    backgroundColor: '#2D3E33',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  floatingAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
    maxHeight: '85%',
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
    marginBottom: 6,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
