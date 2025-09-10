import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { View, Text } from '../../components/Themed';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  increment 
} from 'firebase/firestore';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  category: 'tip' | 'question' | 'achievement' | 'event';
  image?: string;
}

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'tip' as CommunityPost['category'],
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const postsRef = collection(db, 'community_posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: CommunityPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          author: data.author,
          authorAvatar: data.authorAvatar,
          timestamp: data.timestamp?.toDate() || new Date(),
          likes: data.likes || 0,
          comments: data.comments || 0,
          category: data.category,
          image: data.image,
        });
      });
      setPosts(postsData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'community_posts'), {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        author: 'Current User', // In real app, get from auth
        authorAvatar: null,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
      });

      setNewPost({ title: '', content: '', category: 'tip' });
      setShowCreatePost(false);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tip': return 'lightbulb';
      case 'question': return 'question-circle';
      case 'achievement': return 'trophy';
      case 'event': return 'calendar';
      default: return 'comment';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tip': return '#FFC107';
      case 'question': return '#2196F3';
      case 'achievement': return '#4CAF50';
      case 'event': return '#FF5722';
      default: return Colors.light.primary;
    }
  };

  const renderPost = (post: CommunityPost) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <FontAwesome5 name="user" size={16} color={Colors.light.primary} />
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.postTime}>
              {post.timestamp.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
          <FontAwesome5 
            name={getCategoryIcon(post.category) as any} 
            size={12} 
            color="white" 
          />
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <FontAwesome5 name="heart" size={16} color={Colors.light.danger} />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="comment" size={16} color={Colors.light.text} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="share" size={16} color={Colors.light.text} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreatePost(true)}
        >
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
        </View>

        <View style={styles.postsContainer}>
          {posts.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="users" size={60} color={Colors.light.text + '40'} />
              <Text style={styles.emptyTitle}>No Posts Yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to share something with the community!
              </Text>
            </View>
          ) : (
            posts.map(renderPost)
          )}
        </View>
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <FontAwesome5 name="times" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.postButton}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.categorySelector}>
              {[
                { key: 'tip', label: 'Tip', icon: 'lightbulb' },
                { key: 'question', label: 'Question', icon: 'question-circle' },
                { key: 'achievement', label: 'Achievement', icon: 'trophy' },
                { key: 'event', label: 'Event', icon: 'calendar' },
              ].map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryOption,
                    newPost.category === category.key && styles.categoryOptionActive
                  ]}
                  onPress={() => setNewPost({ ...newPost, category: category.key as any })}
                >
                  <FontAwesome5 
                    name={category.icon as any} 
                    size={16} 
                    color={newPost.category === category.key ? 'white' : Colors.light.text} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    newPost.category === category.key && styles.categoryLabelActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.titleInput}
              placeholder="Post title..."
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
              multiline
            />

            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
              numberOfLines={6}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.text + '80',
    marginTop: 4,
  },
  postsContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.text + '80',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  postTime: {
    fontSize: 12,
    color: Colors.light.text + '80',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: Colors.light.text + '90',
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: Colors.light.text + '80',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  postButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.background,
    backgroundColor: Colors.light.card,
  },
  categoryOptionActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: 'white',
  },
  titleInput: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  contentInput: {
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: Colors.light.text,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
});