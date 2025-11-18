import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LANGUAGES, LanguageCode } from '../../constants/languages';

interface Props {
  language: LanguageCode;
  onBack: () => void;
}

type Operation = '+' | '-' | '×' | '÷';

export default function MathSprint({ language, onBack }: Props) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0, operation: '+' as Operation, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [bestScore, setBestScore] = useState(0);
  const [shakeAnim] = useState(new Animated.Value(0));

  const t = LANGUAGES[language];

  const generateProblem = () => {
    const operations: Operation[] = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 8) + 2;
        answer = Math.floor(Math.random() * 8) + 2;
        num1 = num2 * answer;
        break;
    }
    
    setProblem({ num1, num2, operation, answer: answer! });
    setUserAnswer('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    generateProblem();
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    const userAnswerNum = parseInt(userAnswer);
    
    if (userAnswerNum === problem.answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(prev => prev + 1);
      generateProblem();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeAnimation();
    }
  };

  const handleSubmit = () => {
    checkAnswer();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameActive(false);
            if (score > bestScore) {
              setBestScore(score);
              Alert.alert(t.newRecord, `${t.score}: ${score}`);
            } else {
              Alert.alert(t.completed, `${t.score}: ${score}\n${t.best}: ${bestScore}`);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameActive, timeLeft, score]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>➕ {t.mathSprint}</Text>
        <View style={styles.stats}>
          <Text style={styles.timer}>{t.time}: {timeLeft}s</Text>
          <Text style={styles.score}>{t.score}: {score}</Text>
          {bestScore > 0 && <Text style={styles.bestScore}>{t.best}: {bestScore}</Text>}
        </View>
      </View>

      {/* Problem Display */}
      <Animated.View style={[styles.problemContainer, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.problemText}>
          {problem.num1} {problem.operation} {problem.num2} = ?
        </Text>
      </Animated.View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder={t.answer}
          placeholderTextColor="#666"
          keyboardType="numeric"
          editable={gameActive}
          onSubmitEditing={handleSubmit}
          autoFocus={gameActive}
        />
        <TouchableOpacity 
          style={[styles.submitButton, !gameActive && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!gameActive}
        >
          <Text style={styles.submitButtonText}>{t.next}</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>
          {t.solve} simple math problems in 60 seconds!
        </Text>
      </View>

      {/* Controls */}
      <TouchableOpacity 
        style={[styles.button, !gameActive && styles.buttonActive]}
        onPress={startGame}
        disabled={gameActive}
      >
        <Text style={styles.buttonText}>
          {gameActive ? 'Solving...' : t.start}
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
  timer: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  score: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
    marginTop: 2,
  },
  bestScore: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginTop: 2,
  },
  problemContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 30,
    backgroundColor: '#333',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#444',
  },
  problemText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
    borderRadius: 15,
    padding: 20,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#333',
    padding: 18,
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