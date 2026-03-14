import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { RATES } from '../data/rates';

export default function CheckInScreen({ onBack, onConfirm }) {
  const [ticket, setTicket] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRate, setSelectedRate] = useState(RATES[0]);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backText}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check In</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.main}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ticket #</Text>
            <TextInput
              value={ticket}
              onChangeText={setTicket}
              placeholder="Enter ticket number"
              placeholderTextColor="#8b9cb3"
              style={[
                styles.input,
                showErrors && !ticket.trim() && styles.inputError,
              ]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Guest name</Text>
            <TextInput
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Enter guest name"
              placeholderTextColor="#8b9cb3"
              style={[
                styles.input,
                showErrors && !guestName.trim() && styles.inputError,
              ]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Guest phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#8b9cb3"
              style={[
                styles.input,
                showErrors && !phone.trim() && styles.inputError,
              ]}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rate</Text>
            <TouchableOpacity
              style={styles.rateTrigger}
              onPress={() => setRateModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.rateTriggerText}>{selectedRate.label}</Text>
              <Text style={styles.rateTriggerChevron}>▼</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPress={() => {
              setShowErrors(true);
              const missing = [];
              if (!ticket.trim()) missing.push('Ticket #');
              if (!guestName.trim()) missing.push('Guest name');
              if (!phone.trim()) missing.push('Guest phone');

              if (missing.length > 0) {
                return;
              }

              if (onConfirm) {
                onConfirm({
                  ticket: ticket.trim(),
                  guestName: guestName.trim(),
                  phone: phone.trim(),
                  rate: selectedRate,
                });
              }
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm check-in</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={rateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setRateModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setRateModalVisible(false)}
          >
            <View style={styles.dropdownWrap}>
              <View style={styles.dropdown}>
                <FlatList
                  data={RATES}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownOption,
                        item.id === selectedRate.id && styles.dropdownOptionActive,
                      ]}
                      onPress={() => {
                        setSelectedRate(item);
                        setRateModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          item.id === selectedRate.id && styles.dropdownOptionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#161f2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3a4d',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
    paddingLeft: 0,
  },
  backText: {
    fontSize: 24,
    color: '#e6edf3',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#e6edf3',
  },
  headerRightSpacer: {
    width: 24,
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#8b9cb3',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    backgroundColor: '#1a2332',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#e6edf3',
  },
  inputError: {
    borderColor: '#f97373',
  },
  rateTrigger: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    backgroundColor: '#1a2332',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateTriggerText: {
    fontSize: 15,
    color: '#e6edf3',
  },
  rateTriggerChevron: {
    fontSize: 10,
    color: '#8b9cb3',
  },
  confirmButton: {
    marginTop: 24,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f1419',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 140,
  },
  dropdownWrap: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: '#1a2332',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d3a4d',
    paddingVertical: 6,
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownOptionActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#e6edf3',
  },
  dropdownOptionTextActive: {
    color: '#22c55e',
    fontWeight: '600',
  },
});

