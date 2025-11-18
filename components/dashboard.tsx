import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { LANGUAGES, LanguageCode } from '../constants/languages';
import { Challenge } from '../types/game';

// Import the actual components
import NumberTap from './challenges/NumberTap';
import MathSprint from './challenges/MathSprint';
import MemoryNumbers from './challenges/MemoryNumbers';
import PatternMatch from './challenges/PatternMatch';

interface Props {
  language: LanguageCode;
  onLanguageChange: () => void;
  onChallengeSelect: (challengeId: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Use the actual imported components
const CHALLENGES: Challenge[] = [
  {
    id: 'numberTap',
    name: 'Number Tap',
    description: 'Tap numbers 1-25 in order as fast as you can!',
    icon: '🔢',
    component: NumberTap,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 'mathSprint',
    name: 'Math Sprint', 
    description: 'Solve simple math problems against time!',
    icon: '➕',
    component: MathSprint,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#EE5A52'],
  },
  {
    id: 'memoryNumbers',
    name: 'Memory Numbers',
    description: 'Remember and repeat number sequences!',
    icon: '🧠',
    component: MemoryNumbers,
    color: '#FFD93D',
    gradient: ['#FFD93D', '#F4C430'],
  },
  {
    id: 'patternMatch',
    name: 'Pattern Match',
    description: 'Complete the number patterns!',
    icon: '🎯',
    component: PatternMatch,
    color: '#6C5CE7',
    gradient: ['#6C5CE7', '#5B4CD8'],
  },
];

export default function Dashboard({ language, onLanguageChange, onChallengeSelect }: Props) {
  const t = LANGUAGES[language];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.title}>Brain Games</Text>
            </View>
            <TouchableOpacity 
              onPress={onLanguageChange} 
              style={styles.languageButton}
              activeOpacity={0.7}
            >
              <Text style={styles.globeIcon}>🌍</Text>
              <Text style={styles.languageText}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Train your brain with fun math challenges!
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Fun</Text>
          </View>
        </View>

        {/* Challenges Grid */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.challengesGrid}
        >
          <Text style={styles.sectionTitle}>Choose Your Challenge</Text>
          
          {CHALLENGES.map((challenge, index) => (
            <TouchableOpacity
              key={challenge.id}
              style={[
                styles.challengeCard,
                { 
                  borderLeftColor: challenge.color,
                  backgroundColor: `${challenge.color}15` // 15 = ~8% opacity
                }
              ]}
              onPress={() => onChallengeSelect(challenge.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: challenge.color }]}>
                  <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                </View>
                <View style={styles.cardTextContent}>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeDescription}>{challenge.description}</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={[styles.difficultyTag, { backgroundColor: challenge.color }]}>
                  <Text style={styles.difficultyText}>BEGINNER</Text>
                </View>
                <View style={styles.playButton}>
                  <Text style={styles.playText}>PLAY →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Challenge yourself daily to improve your skills!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical:30
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#444',
  },
  globeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#444',
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  challengesGrid: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  challengeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: '#333',
    borderTopColor: '#333',
    borderBottomColor: '#333',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 3,
  },
  challengeIcon: {
    fontSize: 24,
  },
  cardTextContent: {
    flex: 1,
  },
  challengeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});