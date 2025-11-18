import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LANGUAGES, LanguageCode } from '../../constants/languages';

interface Props {
  language: LanguageCode;
  onBack: () => void;
}

export default function MemoryNumbers({ language, onBack }: Props) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'showing' | 'guessing' | 'gameOver'>('showing');
  const [bestLevel, setBestLevel] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const t = LANGUAGES[language];

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  const startGame = () => {
    const newSequence = generateSequence(3);
    setSequence(newSequence);
    setUserSequence([]);
    setLevel(1);
    setGameState('showing');
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setGameState('showing');
    
    for (let i = 0; i < seq.length; i++) {
      setHighlightedIndex(i);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(resolve => setTimeout(resolve, 800));
      setHighlightedIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setGameState('guessing');
    setUserSequence([]);
  };

  const handleNumberPress = (number: number) => {
    if (gameState !== 'guessing') return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    // Check if correct
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong sequence
      setGameState('gameOver');
      if (level > bestLevel) {
        setBestLevel(level);
        Alert.alert(t.newRecord, `${t.level}: ${level}`);
      } else {
        Alert.alert('Game Over', `${t.level}: ${level}\n${t.best}: ${bestLevel}`);
      }
      return;
    }

    // Check if sequence complete
    if (newUserSequence.length === sequence.length) {
      // Level complete
      setTimeout(() => {
        const newLevel = level + 1;
        const newSequence = generateSequence(2 + newLevel);
        setSequence(newSequence);
        setLevel(newLevel);
        showSequence(newSequence);
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧠 {t.memoryNumbers}</Text>
        <View style={styles.stats}>
          <Text style={styles.level}>{t.level}: {level}</Text>
          {bestLevel > 1 && <Text style={styles.bestLevel}>{t.best}: {bestLevel}</Text>}
        </View>
      </View>

      {/* Sequence Display */}
      <View style={styles.sequenceContainer}>
        <Text style={styles.instruction}>
          {gameState === 'showing' ? t.remember : t.yourTurn}
        </Text>
        <View style={styles.sequence}>
          {sequence.map((num, index) => (
            <View
              key={index}
              style={[
                styles.sequenceNumber,
                highlightedIndex === index && styles.highlightedNumber,
                gameState === 'guessing' && styles.hiddenNumber
              ]}
            >
              <Text style={[
                styles.sequenceText,
                highlightedIndex === index && styles.highlightedText
              ]}>
                {num}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* User Progress */}
      {gameState === 'guessing' && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {userSequence.length}/{sequence.length}
          </Text>
        </View>
      )}

      {/* Number Pad */}
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              gameState !== 'guessing' && styles.numberButtonDisabled
            ]}
            onPress={() => handleNumberPress(num)}
            disabled={gameState !== 'guessing'}
          >
            <Text style={styles.numberButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>
          {t.remember} number sequences and repeat them!
        </Text>
      </View>

      {/* Controls */}
      <TouchableOpacity 
        style={[styles.button, gameState !== 'gameOver' && styles.buttonDisabled]}
        onPress={startGame}
        disabled={gameState !== 'gameOver'}
      >
        <Text style={styles.buttonText}>
          {gameState === 'gameOver' ? 'Play Again' : t.start}
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
    marginBottom: 40,
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
  level: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  bestLevel: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginTop: 2,
  },
  sequenceContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  sequence: {
    flexDirection: 'row',
    gap: 15,
  },
  sequenceNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  highlightedNumber: {
    backgroundColor: '#4ECDC4',
    borderColor: '#fff',
    transform: [{ scale: 1.2 }],
  },
  hiddenNumber: {
    backgroundColor: '#2a2a2a',
  },
  sequenceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlightedText: {
    color: '#000',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  numberButtonDisabled: {
    opacity: 0.5,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});