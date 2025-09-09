import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';

// Define the type for a single waste log item
interface WasteLog {
  id: string;
  type: string;
  weight: string;
  date: string;
}

// Define the props for the WasteLogList component
interface WasteLogListProps {
  data: WasteLog[];
}

const WasteLogList: React.FC<WasteLogListProps> = ({ data }) => {
  const renderItem: ListRenderItem<WasteLog> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.type}</Text>
      <Text style={styles.itemText}>{item.weight}</Text>
      <Text style={styles.itemText}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Log</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default WasteLogList;
