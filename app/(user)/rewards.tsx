import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { View, Text } from "@/components/Themed";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

const rewards = [
  {
    id: "1",
    title: "Eco-Friendly Water Bottle",
    points: 1500,
    icon: "bottle-water",
    color: ["#4c669f", "#3b5998", "#192f6a"],
    image: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg",
  },
  {
    id: "2",
    title: "Reusable Shopping Bag",
    points: 1200,
    icon: "shopping-bag",
    color: ["#f7b733", "#fc4a1a"],
    image: "https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg",
  },
  {
    id: "3",
    title: "Solar-Powered Charger",
    points: 3500,
    icon: "solar-panel",
    color: ["#42e695", "#3bb2b8"],
    image: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg",
  },
  {
    id: "4",
    title: "Plant a Tree Donation",
    points: 1000,
    icon: "tree",
    color: ["#6a11cb", "#2575fc"],
    image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
  },
  {
    id: "5",
    title: "Bamboo Toothbrush Set",
    points: 800,
    icon: "tooth",
    color: ["#00c6ff", "#0072ff"],
    image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
  },
  {
    id: "6",
    title: "Smart Composter Discount",
    points: 5000,
    icon: "recycle",
    color: ["#d4fc79", "#96e6a1"],
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(8450);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  useEffect(() => {
    loadUserRewards();
  }, []);

  const loadUserRewards = async () => {
    try {
      // In a real app, you would get the current user's ID from authentication
      const rewardsRef = collection(db, 'user_rewards');
      const q = query(rewardsRef, where('userId', '==', 'current_user_id'));
      const snapshot = await getDocs(q);
      
      const redeemed: string[] = [];
      snapshot.forEach((doc) => {
        redeemed.push(doc.data().rewardId);
      });
      setRedeemedRewards(redeemed);
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
  };

  const handleRedeemReward = async (reward: typeof rewards[0]) => {
    if (userPoints < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points - userPoints} more points to redeem this reward.`);
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}" for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            try {
              // Add to Firebase
              await addDoc(collection(db, 'user_rewards'), {
                userId: 'current_user_id', // In real app, get from auth
                rewardId: reward.id,
                rewardTitle: reward.title,
                pointsSpent: reward.points,
                redeemedAt: new Date(),
              });

              // Update local state
              setUserPoints(prev => prev - reward.points);
              setRedeemedRewards(prev => [...prev, reward.id]);

              Alert.alert('Success!', `You have successfully redeemed "${reward.title}". Check your email for details.`);
            } catch (error) {
              console.error('Error redeeming reward:', error);
              Alert.alert('Error', 'Failed to redeem reward. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem Rewards</Text>
        <View style={styles.pointsContainer}>
          <FontAwesome5 name="star" solid size={20} color="#FFD700" />
          <Text style={styles.pointsText}>{userPoints.toLocaleString()}</Text>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {rewards.map((reward) => (
          <TouchableOpacity 
            key={reward.id} 
            style={[
              styles.rewardCard,
              redeemedRewards.includes(reward.id) && styles.redeemedCard
            ]}
            onPress={() => handleRedeemReward(reward)}
            disabled={redeemedRewards.includes(reward.id)}
          >
            <ImageBackground
              source={{ uri: reward.image }}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 15 }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.rewardOverlay}
              >
                <FontAwesome5
                  name={reward.icon as any}
                  size={32}
                  color="white"
                  style={styles.rewardIcon}
                />
                <Text style={styles.rewardTitle} numberOfLines={2}>
                  {reward.title}
                </Text>
                <View style={styles.pointsBadge}>
                  <Text style={styles.rewardPoints}>{`${reward.points} pts`}</Text>
                </View>
                {redeemedRewards.includes(reward.id) && (
                  <View style={styles.redeemedBadge}>
                    <FontAwesome5 name="check" size={16} color="white" />
                    <Text style={styles.redeemedText}>Redeemed</Text>
                  </View>
                )}
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  rewardCard: {
    width: "45%",
    height: 180,
    margin: "2.5%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  rewardOverlay: {
    flex: 1,
    borderRadius: 15,
    padding: 12,
    justifyContent: "flex-end",
  },
  rewardIcon: {
    position: "absolute",
    top: 15,
    left: 15,
    opacity: 0.8,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  pointsBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.85)",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  rewardPoints: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  redeemedCard: {
    opacity: 0.6,
  },
  redeemedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  redeemedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});