import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import { LANGUAGES, LanguageCode } from '../constants/languages';

interface Props {
  onLanguageSelect: (language: LanguageCode) => void;
  currentLanguage: LanguageCode;
}

const LANGUAGE_DATA = {
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  zh: { name: 'Chinese', native: '中文', flag: '🇨🇳' },
  ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' }
};

export default function LanguageSelector({ onLanguageSelect, currentLanguage }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌍 Select Language</Text>
          <Text style={styles.subtitle}>
            Choose your preferred language for the app
          </Text>
        </View>

        {/* Current Selection */}
        <View style={styles.currentSelection}>
          <Text style={styles.currentLabel}>Currently Selected:</Text>
          <View style={styles.currentLanguage}>
            <Text style={styles.currentFlag}>
              {LANGUAGE_DATA[currentLanguage]?.flag || '🌐'}
            </Text>
            <View style={styles.currentTextContainer}>
              <Text style={styles.currentName}>
                {LANGUAGE_DATA[currentLanguage]?.name || currentLanguage.toUpperCase()}
              </Text>
              <Text style={styles.currentNative}>
                {LANGUAGE_DATA[currentLanguage]?.native || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Language List */}
        <ScrollView 
          style={styles.languageList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.languageListContent}
        >
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((lang) => {
            const isSelected = currentLanguage === lang;
            const languageInfo = LANGUAGE_DATA[lang];
            
            return (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageCard,
                  isSelected && styles.selectedLanguageCard
                ]}
                onPress={() => onLanguageSelect(lang)}
                activeOpacity={0.7}
              >
                {/* Flag and Language Info */}
                <View style={styles.languageInfo}>
                  <Text style={styles.flag}>{languageInfo?.flag || '🌐'}</Text>
                  <View style={styles.languageDetails}>
                    <Text style={[
                      styles.languageName,
                      isSelected && styles.selectedLanguageName
                    ]}>
                      {languageInfo?.name || lang.toUpperCase()}
                    </Text>
                    <Text style={[
                      styles.languageNative,
                      isSelected && styles.selectedLanguageNative
                    ]}>
                      {languageInfo?.native || ''}
                    </Text>
                  </View>
                </View>

                {/* Selection Indicator */}
                <View style={styles.selectionIndicator}>
                  {isSelected ? (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.unselectedIndicator} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            More languages coming soon!
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
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  currentSelection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  currentLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 12,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  currentTextContainer: {
    flex: 1,
  },
  currentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  currentNative: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  languageList: {
    flex: 1,
  },
  languageListContent: {
    paddingBottom: 20,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedLanguageCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderColor: '#4ECDC4',
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  selectedLanguageName: {
    color: '#4ECDC4',
    fontWeight: '700',
  },
  languageNative: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  selectedLanguageNative: {
    color: '#fff',
  },
  selectionIndicator: {
    marginLeft: 10,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  unselectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
  },
  checkmark: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
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