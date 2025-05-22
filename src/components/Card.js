import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Card({ text, timestamp, onEdit }) {
  return (
    <TouchableOpacity onLongPress={onEdit} style={styles.card}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{timestamp}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    elevation: 2,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    marginBottom: 4,
    color: '#333333',
  },
  time: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 10,
    color: '#777777',
    textAlign: 'right',
  },
});
