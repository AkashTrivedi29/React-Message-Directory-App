import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
} from 'react-native';
import Column from '../components/Column';

export default function BoardScreen({ route }) {
  const { title, messages } = route.params;
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <TextInput
        placeholder="Search messages..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.scroll}>
        <Column title={title} initialMessages={messages} searchText={searchText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 8,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  scroll: { flex: 1, paddingHorizontal: 8 },
});
