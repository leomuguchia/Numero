import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LANGUAGES, LanguageCode } from '../../constants/languages';

interface Props {
  language: LanguageCode;
  onBack: () => void;
}

const GRID_SIZE = 25;

export default function NumberTap({ language, onBack }: Props) {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [time, setTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [scaleAnims] = useState(() => 
    Array(GRID_SIZE).fill(0).map(() => new Animated.Value(1))
  );

  const t = LANGUAGES[language];

  // Initialize game
  const startGame = () => {
    generateNumbers();
    setNextNumber(1);
    setTime(0);
    setGameActive(true);
  };

  // Generate shuffled numbers 1-25
  const generateNumbers = () => {
    const numbersArray = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
    const shuffled = numbersArray.sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
  };

  // Number tap animation
  const tapAnimation = (index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Handle number tap
  const handleNumberTap = (number: number, index: number) => {
    if (!gameActive || number !== nextNumber) return;

    tapAnimation(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (number === GRID_SIZE) {
      // Game completed!
      setGameActive(false);
      const finalTime = time;
      
      if (!bestTime || finalTime < bestTime) {
        setBestTime(finalTime);
        Alert.alert(t.newRecord, `${t.timeText}: ${finalTime.toFixed(2)}s`);
      } else {
        Alert.alert(t.completed, `${t.timeText}: ${finalTime.toFixed(2)}s\n${t.bestText}: ${bestTime.toFixed(2)}s`);
      }
    }
    
    setNextNumber(prev => prev + 1);
  };

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 0.01);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [gameActive]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔢 {t.numberTap}</Text>
        <View style={styles.stats}>
          <Text style={styles.timer}>{t.time}: {time.toFixed(2)}s</Text>
          {bestTime && <Text style={styles.bestTime}>{t.best}: {bestTime.toFixed(2)}s</Text>}
        </View>
      </View>

      {/* Current Target */}
      <View style={styles.targetSection}>
        <Text style={styles.targetText}>{t.tap}: {nextNumber}</Text>
      </View>

      {/* Game Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>{t.description}</Text>
      </View>

      {/* Number Grid */}
      <View style={styles.grid}>
        {numbers.map((number, index) => (
          <Animated.View
            key={number}
            style={{ transform: [{ scale: scaleAnims[index] }] }}
          >
            <TouchableOpacity
              style={[
                styles.numberTile,
                number === nextNumber && styles.nextNumber,
                number < nextNumber && styles.completedNumber
              ]}
              onPress={() => handleNumberTap(number, index)}
              disabled={!gameActive || number !== nextNumber}
            >
              <Text style={[
                styles.numberText,
                number === nextNumber && styles.nextNumberText,
                number < nextNumber && styles.completedNumberText
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Controls */}
      <TouchableOpacity 
        style={[styles.button, !gameActive && styles.buttonActive]}
        onPress={startGame}
        disabled={gameActive}
      >
        <Text style={styles.buttonText}>
          {gameActive ? t.tapping : t.start}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  stats: {
    alignItems: 'flex-end',
  },
  timer: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  bestTime: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginTop: 2,
  },
  targetSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  targetText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  numberTile: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  nextNumber: {
    backgroundColor: '#4ECDC4',
    borderColor: '#fff',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  completedNumber: {
    backgroundColor: '#2a2a2a',
    borderColor: '#333',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextNumberText: {
    color: '#000',
    fontWeight: '800',
  },
  completedNumberText: {
    color: '#666',
  },
  button: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonActive: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});