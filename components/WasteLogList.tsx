import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

type WasteLogItem = {
  id: string;
  type: string;
  weight: string;
  date: string;
};

type WasteLogListProps = {
  data: WasteLogItem[];
};

export default function WasteLogList({ data }: WasteLogListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.type}>{item.type}</Text>
          <Text>{item.weight}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  type: { fontWeight: "bold" },
  date: { color: "gray", fontSize: 12 },
});