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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from './Card';

export default function Column({ title, initialMessages, searchText }) {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = screenWidth * 0.9;
  const buttonHeight = 48;

  const storageKey = `@messages_${title}`;

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved !== null) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(initialMessages);
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  const saveMessages = async (data) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  };

  const addMessage = () => {
    if (!newText.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }
    const newMsg = {
      id: Date.now().toString(),
      text: newText.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);
    setNewText('');
    setModalVisible(false);
  };

  const startEdit = (message) => {
    setEditingMessage(message);
    setEditedText(message.text);
  };

  const handleSaveEdit = () => {
    const timestamp = new Date().toLocaleTimeString();
    const updated = messages.map(msg =>
      msg.id === editingMessage.id
        ? { ...msg, text: editedText.trim(), timestamp }
        : msg
    );
    setMessages(updated);
    saveMessages(updated);
    setEditingMessage(null);
  };

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.column, { width: columnWidth }]}>  
      <Text style={styles.title}>{title}</Text>

      <View style={[styles.listWrapper, { paddingBottom: buttonHeight + insets.bottom + 16 }]}>  
        <FlatList
          data={filteredMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card
              text={item.text}
              timestamp={item.timestamp}
              onEdit={() => startEdit(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.addBtn,
          {
            position: 'absolute',
            bottom: insets.bottom + 8,
            left: 8,
            right: 8,
            height: buttonHeight,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ Add Message</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter message"
              value={newText}
              onChangeText={setNewText}
              multiline
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addMessage} style={[styles.modalButton, styles.addButton]}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={!!editingMessage} transparent onRequestClose={() => setEditingMessage(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Edit message"
              value={editedText}
              onChangeText={setEditedText}
              multiline
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity onPress={() => setEditingMessage(null)} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={[styles.modalButton, styles.addButton]}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0d47a1',
  },
  listWrapper: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#cfd8dc',
    marginVertical: 6,
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d47a1',
    borderRadius: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#cccccc',
  },
  addButton: {
    backgroundColor: '#0d47a1',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});