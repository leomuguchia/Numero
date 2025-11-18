import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LANGUAGES, LanguageCode } from '../../constants/languages';

interface Props {
  language: LanguageCode;
  onBack: () => void;
}

type PatternType = 'arithmetic' | 'geometric' | 'alternating';

export default function PatternMatch({ language, onBack }: Props) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [currentPatternType, setCurrentPatternType] = useState<PatternType>('arithmetic');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const t = LANGUAGES[language];

  const generatePattern = (patternType: PatternType, length: number = 4) => {
    let sequence: number[] = [];
    const start = Math.floor(Math.random() * 10) + 1;
    
    switch (patternType) {
      case 'arithmetic':
        const difference = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < length; i++) {
          sequence.push(start + i * difference);
        }
        break;
      case 'geometric':
        const ratio = Math.floor(Math.random() * 3) + 2;
        let current = start;
        for (let i = 0; i < length; i++) {
          sequence.push(current);
          current *= ratio;
        }
        break;
      case 'alternating':
        const altDiff = Math.floor(Math.random() * 4) + 1;
        let altCurrent = start;
        for (let i = 0; i < length; i++) {
          sequence.push(altCurrent);
          altCurrent += (i % 2 === 0 ? altDiff : -altDiff);
        }
        break;
    }
    
    return sequence;
  };

  const generateOptions = (correctAnswer: number) => {
    const optionsSet = new Set<number>([correctAnswer]);
    
    while (optionsSet.size < 4) {
      const randomOffset = Math.floor(Math.random() * 20) - 10;
      const wrongAnswer = correctAnswer + randomOffset;
      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && !optionsSet.has(wrongAnswer)) {
        optionsSet.add(wrongAnswer);
      }
    }
    
    return Array.from(optionsSet).sort(() => Math.random() - 0.5);
  };

  const startLevel = () => {
    const patternTypes: PatternType[] = ['arithmetic', 'geometric', 'alternating'];
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    const fullPattern = generatePattern(patternType, 4); // Generate 4 numbers
    const displayPattern = fullPattern.slice(0, 3); // Show first 3
    const nextNumber = fullPattern[3]; // The 4th is the answer
    
    setPattern(displayPattern);
    setCurrentPatternType(patternType);
    setCorrectAnswer(nextNumber);
    setOptions(generateOptions(nextNumber));
    setGameActive(true);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!gameActive) return;

    if (selectedAnswer === correctAnswer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(prev => prev + 10);
      setLevel(prev => prev + 1);
      startLevel();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setGameActive(false);
      if (score > bestScore) {
        setBestScore(score);
        Alert.alert(t.newRecord || 'New Record!', `${t.score || 'Score'}: ${score}\n${t.level || 'Level'}: ${level}`);
      } else {
        Alert.alert(t.completed || 'Game Over', `${t.score || 'Score'}: ${score}\n${t.level || 'Level'}: ${level}\n${t.best || 'Best'}: ${bestScore}`);
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    startLevel();
  };

  useEffect(() => {
    startLevel();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎯 {t.patternMatch}</Text>
        <View style={styles.stats}>
          <Text style={styles.score}>{t.score}: {score}</Text>
          <Text style={styles.level}>{t.level}: {level}</Text>
          {bestScore > 0 && <Text style={styles.bestScore}>{t.best}: {bestScore}</Text>}
        </View>
      </View>

      {/* Pattern Display */}
      <View style={styles.patternContainer}>
        <Text style={styles.instruction}>{t.solve} the pattern:</Text>
        <View style={styles.pattern}>
          {pattern.map((num, index) => (
            <View key={index} style={styles.patternNumber}>
              <Text style={styles.patternText}>{num}</Text>
            </View>
          ))}
          <View style={styles.patternNumber}>
            <Text style={styles.patternQuestion}>?</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              !gameActive && styles.optionButtonDisabled
            ]}
            onPress={() => handleAnswer(option)}
            disabled={!gameActive}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>
          Find the number that completes the pattern!
        </Text>
      </View>

      {/* Controls */}
      <TouchableOpacity 
        style={[styles.button, gameActive && styles.buttonDisabled]}
        onPress={startGame}
        disabled={gameActive}
      >
        <Text style={styles.buttonText}>
          {gameActive ? 'Playing...' : 'Play Again'}
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
    paddingVertical:50
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
  score: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  level: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 2,
  },
  bestScore: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginTop: 2,
  },
  patternContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  pattern: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  patternNumber: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  patternText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  patternQuestion: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD93D',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  optionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  optionButtonDisabled: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 30,
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