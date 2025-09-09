import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Define the type for a single waste log item
interface WasteLog {
  id: string;
  type: string;
  weight: string;
  date: string;
  status?: string;
}

// Define the props for the WasteLogList component
interface WasteLogListProps {
  data: WasteLog[];
}

const WasteLogList: React.FC<WasteLogListProps> = ({ data }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Processed': return '#4CAF50';
      case 'Collected': return '#2196F3';
      case 'Pending': return '#FF9800';
      default: return Colors.light.text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'organic': return 'leaf';
      case 'recyclable': 
      case 'plastic': return 'recycle';
      case 'hazardous': return 'exclamation-triangle';
      default: return 'trash';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'organic': return '#4CAF50';
      case 'recyclable': 
      case 'plastic': return '#2196F3';
      case 'hazardous': return '#F44336';
      default: return Colors.light.text;
    }
  };

  const renderItem: ListRenderItem<WasteLog> = ({ item, index }) => (
    <TouchableOpacity style={[styles.itemContainer, { marginBottom: index === data.length - 1 ? 0 : 12 }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <FontAwesome5 
            name={getTypeIcon(item.type) as any} 
            size={16} 
            color={getTypeColor(item.type)} 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemWeight}>{item.weight}</Text>
        {item.status && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Recent Activity</Text>
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All</Text>
        <FontAwesome5 name="chevron-right" size={12} color={Colors.light.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="clipboard-list" size={40} color={Colors.light.text + '60'} />
      <Text style={styles.emptyText}>No waste logs yet</Text>
      <Text style={styles.emptySubText}>Start logging your waste to see activity here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {data.length > 0 ? (
        <FlatList
          data={data.slice(0, 5)} // Show only first 5 items
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmpty()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    padding: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.light.text + '80',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.text + '80',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default WasteLogList;