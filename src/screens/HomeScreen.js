import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessages, setNewMessages] = useState('');
  const [searchText, setSearchText] = useState('');

  const GROUP_KEY = '@message_groups';

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const stored = await AsyncStorage.getItem(GROUP_KEY);
      if (stored !== null) {
        setGroups(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading groups', e);
    }
  };

  const saveGroups = async (data) => {
    try {
      await AsyncStorage.setItem(GROUP_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving groups', e);
    }
  };

  const addGroup = () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    const id = Date.now().toString();
    const messagesArray = newMessages
      .split(',')
      .map((msg, idx) => ({
        id: `${id}-${idx}`,
        text: msg.trim(),
        timestamp: new Date().toLocaleTimeString(),
      }))
      .filter(m => m.text.length);

    const updatedGroups = [...groups, { id, title: newTitle.trim(), messages: messagesArray }];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    setNewTitle('');
    setNewMessages('');
    setModalVisible(false);
  };

  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search groups..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredGroups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() =>
              navigation.navigate('Board', {
                title: item.title,
                messages: item.messages,
              })
            }
          >
            <Text style={styles.groupText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group name"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Initial messages (comma-separated)"
              value={newMessages}
              onChangeText={setNewMessages}
              multiline
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.addButton]} onPress={addGroup}>
                <Text style={[styles.modalButtonText, styles.addButtonText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  createButton: {
    backgroundColor: '#0d47a1',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  groupText: {
    fontSize: 18,
    color: '#333333',
  },
  separator: { height: 1, backgroundColor: '#cccccc', marginVertical: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0d47a1',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fdfdfd',
    marginBottom: 12,
  },
  messageInput: { height: 60, textAlignVertical: 'top' },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  cancelButton: { backgroundColor: '#cccccc' },
  addButton: { backgroundColor: '#0d47a1' },
  modalButtonText: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },
  addButtonText: { color: '#ffffff' },
});
