import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { View, Text } from '../../components/Themed';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const { width } = Dimensions.get('window');

interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: 'recycling' | 'composting' | 'reduction' | 'awareness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  image: string;
  content: string;
  tips: string[];
}

const sampleContent: EducationContent[] = [
  {
    id: '1',
    title: 'Plastic Recycling Basics',
    description: 'Learn the fundamentals of plastic recycling and how to identify recyclable plastics.',
    category: 'recycling',
    difficulty: 'beginner',
    duration: '5 min read',
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
    content: 'Plastic recycling is crucial for environmental protection. Different types of plastics require different recycling processes...',
    tips: [
      'Look for recycling symbols on plastic containers',
      'Clean containers before recycling',
      'Remove caps and labels when possible',
      'Never mix different plastic types'
    ]
  },
  {
    id: '2',
    title: 'Home Composting Guide',
    description: 'Start your own compost bin and turn organic waste into nutrient-rich soil.',
    category: 'composting',
    difficulty: 'intermediate',
    duration: '8 min read',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    content: 'Composting is a natural process that transforms organic waste into valuable fertilizer...',
    tips: [
      'Balance green and brown materials',
      'Turn compost regularly for aeration',
      'Keep compost moist but not soggy',
      'Avoid meat and dairy products'
    ]
  },
  {
    id: '3',
    title: 'Zero Waste Lifestyle',
    description: 'Practical tips to reduce waste in your daily life and live more sustainably.',
    category: 'reduction',
    difficulty: 'intermediate',
    duration: '10 min read',
    image: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg',
    content: 'Zero waste living focuses on reducing consumption and eliminating waste...',
    tips: [
      'Use reusable bags and containers',
      'Buy in bulk to reduce packaging',
      'Repair items instead of replacing',
      'Choose products with minimal packaging'
    ]
  },
  {
    id: '4',
    title: 'Environmental Impact Awareness',
    description: 'Understand how waste affects our environment and climate.',
    category: 'awareness',
    difficulty: 'beginner',
    duration: '6 min read',
    image: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg',
    content: 'Waste management has significant environmental implications...',
    tips: [
      'Reduce single-use items',
      'Support eco-friendly brands',
      'Educate others about waste impact',
      'Participate in community cleanup events'
    ]
  }
];

export default function EducationScreen() {
  const router = useRouter();
  const [content, setContent] = useState<EducationContent[]>(sampleContent);
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { key: 'all', label: 'All', icon: 'book', color: Colors.light.primary },
    { key: 'recycling', label: 'Recycling', icon: 'recycle', color: '#2196F3' },
    { key: 'composting', label: 'Composting', icon: 'leaf', color: '#4CAF50' },
    { key: 'reduction', label: 'Reduction', icon: 'minus-circle', color: '#FF9800' },
    { key: 'awareness', label: 'Awareness', icon: 'lightbulb', color: '#9C27B0' },
  ];

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return Colors.light.text;
    }
  };

  const openContent = (item: EducationContent) => {
    setSelectedContent(item);
    setModalVisible(true);
  };

  const renderContentCard = (item: EducationContent) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.contentCard}
      onPress={() => openContent(item)}
    >
      <Image source={{ uri: item.image }} style={styles.contentImage} />
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.contentDescription}>{item.description}</Text>
        <View style={styles.contentFooter}>
          <FontAwesome5 
            name={categories.find(c => c.key === item.category)?.icon as any || 'book'} 
            size={14} 
            color={categories.find(c => c.key === item.category)?.color || Colors.light.primary} 
          />
          <Text style={styles.categoryText}>
            {categories.find(c => c.key === item.category)?.label || 'General'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Education Hub</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive,
                { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <FontAwesome5 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.key ? 'white' : category.color} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.categoryButtonTextActive,
                { color: selectedCategory === category.key ? 'white' : category.color }
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome5 name="book-open" size={24} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{content.length}</Text>
            <Text style={styles.statLabel}>Articles</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="clock" size={24} color={Colors.light.accent} />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Min Read</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="users" size={24} color={Colors.light.secondary} />
            <Text style={styles.statNumber}>2.1k</Text>
            <Text style={styles.statLabel}>Learners</Text>
          </View>
        </View>

        {/* Content Grid */}
        <View style={styles.contentGrid}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Content' : categories.find(c => c.key === selectedCategory)?.label}
            <Text style={styles.contentCount}> ({filteredContent.length})</Text>
          </Text>
          {filteredContent.map(renderContentCard)}
        </View>
      </ScrollView>

      {/* Content Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedContent && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome5 name="times" size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Article</Text>
              <TouchableOpacity>
                <FontAwesome5 name="bookmark" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedContent.image }} style={styles.modalImage} />
              
              <View style={styles.modalInfo}>
                <View style={styles.modalMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedContent.difficulty) }]}>
                    <Text style={styles.difficultyText}>{selectedContent.difficulty}</Text>
                  </View>
                  <Text style={styles.duration}>{selectedContent.duration}</Text>
                </View>
                
                <Text style={styles.modalContentTitle}>{selectedContent.title}</Text>
                <Text style={styles.modalContentText}>{selectedContent.content}</Text>
                
                <View style={styles.tipsSection}>
                  <Text style={styles.tipsTitle}>Key Tips:</Text>
                  {selectedContent.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <FontAwesome5 name="check-circle" size={16} color={Colors.light.primary} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    backgroundColor: Colors.light.card,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryButtonTextActive: {
    color: 'white',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text + '80',
    marginTop: 4,
  },
  contentGrid: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  contentCount: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.light.text + '80',
  },
  contentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  contentInfo: {
    padding: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  duration: {
    fontSize: 12,
    color: Colors.light.text + '80',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: Colors.light.text + '90',
    lineHeight: 20,
    marginBottom: 12,
  },
  contentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.text + '80',
    marginLeft: 6,
    fontWeight: '600',
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
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: 20,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  modalContentText: {
    fontSize: 16,
    color: Colors.light.text + '90',
    lineHeight: 24,
    marginBottom: 24,
  },
  tipsSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.light.text + '90',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});