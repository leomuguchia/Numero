import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LanguageCode } from './constants/languages';
import LanguageSelector from './components/languageselector';
import Dashboard from './components/dashboard';
import NumberTap from './components/challenges/NumberTap';
import MathSprint from './components/challenges/MathSprint';
import MemoryNumbers from './components/challenges/MemoryNumbers';
import PatternMatch from './components/challenges/PatternMatch';

type AppState = 'language-select' | 'dashboard' | 'challenge';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('language-select');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);

  const handleLanguageSelect = (selectedLanguage: LanguageCode) => {
    setLanguage(selectedLanguage);
    setCurrentState('dashboard');
  };

  const handleChallengeSelect = (challengeId: string) => {
    setCurrentChallenge(challengeId);
    setCurrentState('challenge');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
    setCurrentChallenge(null);
  };

  const handleLanguageChange = () => {
    setCurrentState('language-select');
  };

  const renderChallenge = () => {
    const props = { language, onBack: handleBackToDashboard };
    
    switch (currentChallenge) {
      case 'numberTap':
        return <NumberTap {...props} />;
      case 'mathSprint':
        return <MathSprint {...props} />;
      case 'memoryNumbers':
        return <MemoryNumbers {...props} />;
      case 'patternMatch':
        return <PatternMatch {...props} />;
      default:
        return null;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
      case 'language-select':
        return (
          <LanguageSelector
            onLanguageSelect={handleLanguageSelect}
            currentLanguage={language}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            language={language}
            onLanguageChange={handleLanguageChange}
            onChallengeSelect={handleChallengeSelect}
          />
        );
      case 'challenge':
        return renderChallenge();
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
      <StatusBar style="light" />
    </View>
  );
}