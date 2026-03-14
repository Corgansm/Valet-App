import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  MOCK_VEHICLES,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  formatArrival,
  matchesSearch,
  getStatusLabel,
} from '../data/vehicles';

const carIcon = require('../../assets/car-icon.png');

const SORT_ICON = () => (
  <View style={styles.sortIconWrap}>
    <View style={styles.sortArrowUp} />
    <View style={styles.sortArrowDown} />
  </View>
);

const CAR_ICON = () => (
  <Image source={carIcon} style={styles.carIconImage} resizeMode="contain" />
);

function VehicleCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.ticket}>{item.ticket}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>{item.plate} · {item.make}</Text>
      <Text style={styles.detail}>{formatArrival(item.arrival)}</Text>
    </View>
  );
}

export default function ValetScreen({ vehicles, onPressCheckIn }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortValue, setSortValue] = useState('arrival-desc');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const filteredAndSorted = useMemo(() => {
    const source = vehicles && vehicles.length ? vehicles : MOCK_VEHICLES;
    let list = source.filter((v) => {
      const statusMatch = statusFilter === 'all' || v.status === statusFilter;
      return statusMatch && matchesSearch(v, search);
    });
    const [sortField, sortDir] = sortValue.split('-');
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'arrival') {
        cmp = new Date(a.arrival) - new Date(b.arrival);
      } else {
        cmp = (a.ticket || '').localeCompare(b.ticket || '', undefined, { numeric: true });
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [search, statusFilter, sortValue]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ticket #, name, plate, make…"
              placeholderTextColor="#8b9cb3"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity
              style={styles.sortTrigger}
              onPress={() => setSortModalVisible(true)}
              activeOpacity={0.7}
            >
              <SORT_ICON />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.statusTrigger}
            onPress={() => setStatusModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.statusTriggerText}>{getStatusLabel(statusFilter)}</Text>
            <Text style={styles.statusTriggerChevron}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.filterLabel}>
            Showing: <Text style={styles.filterLabelBold}>{getStatusLabel(statusFilter)}</Text>
          </Text>
        </View>

        <View style={styles.main}>
          {filteredAndSorted.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No vehicles match your search or filter.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredAndSorted}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <VehicleCard item={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={onPressCheckIn}
          activeOpacity={0.85}
        >
          <CAR_ICON />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.sortOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.sortDropdownWrap}>
            <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sortOption, opt.value === sortValue && styles.sortOptionActive]}
                onPress={() => {
                  setSortValue(opt.value);
                  setSortModalVisible(false);
                }}
              >
                <Text style={[styles.sortOptionText, opt.value === sortValue && styles.sortOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.statusOverlay}
          activeOpacity={1}
          onPress={() => setStatusModalVisible(false)}
        >
          <View style={styles.statusDropdownWrap}>
            <View style={styles.statusDropdown}>
              {STATUS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.sortOption, opt.value === statusFilter && styles.sortOptionActive]}
                  onPress={() => {
                    setStatusFilter(opt.value);
                    setStatusModalVisible(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, opt.value === statusFilter && styles.sortOptionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    backgroundColor: '#161f2e',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3a4d',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#2d3a4d',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#e6edf3',
  },
  sortTrigger: {
    width: 44,
    height: 44,
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#2d3a4d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortArrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e6edf3',
    marginBottom: 2,
  },
  sortArrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#e6edf3',
  },
  statusTrigger: {
    marginTop: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#2d3a4d',
    borderRadius: 8,
  },
  statusTriggerText: {
    fontSize: 15,
    color: '#e6edf3',
  },
  statusTriggerChevron: {
    fontSize: 10,
    color: '#8b9cb3',
  },
  statusOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 152,
  },
  statusDropdownWrap: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    alignItems: 'stretch',
  },
  statusDropdown: {
    width: '100%',
    backgroundColor: '#1a2332',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    paddingVertical: 6,
  },
  filterLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#8b9cb3',
  },
  filterLabelBold: {
    color: '#e6edf3',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  listContent: {
    paddingBottom: 88,
    gap: 10,
  },
  card: {
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#2d3a4d',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticket: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e',
  },
  statusBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22c55e',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e6edf3',
    marginTop: 4,
  },
  detail: {
    fontSize: 13,
    color: '#8b9cb3',
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 15,
    color: '#8b9cb3',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  carIconImage: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  sortOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 96,
  },
  sortDropdownWrap: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  sortDropdown: {
    minWidth: 200,
    backgroundColor: '#1a2332',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    paddingVertical: 6,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  sortOptionActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#e6edf3',
  },
  sortOptionTextActive: {
    color: '#22c55e',
    fontWeight: '600',
  },
});
