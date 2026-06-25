import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../../assets/onboarding/slide1.png'),
    heading: "Keep Track of your Child's Progress",
    sub: "Stay informed about your child's academic journey and celebrate every milestone together.",
  },
  {
    id: '2',
    image: require('../../../assets/onboarding/slide2.png'),
    heading: "Communicate Instantly with your Child's Tutor",
    sub: 'Send and receive messages from teachers in real-time, any time of the day.',
  },
  {
    id: '3',
    image: require('../../../assets/onboarding/slide3.png'),
    heading: "Stay Connected with your Child's School",
    sub: 'Get notified about important updates and never miss a thing.',
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export default function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SLIDES[activeIndex];

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.replace('SelectAccountType');
    }
  };

  const handleSkip = () => navigation.replace('SelectAccountType');

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.slide}>
        <Image source={slide.image} style={styles.illustration} resizeMode="contain" />
        <Text style={styles.heading}>{slide.heading}</Text>
        <Text style={styles.sub}>{slide.sub}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  skipText: {
    fontSize: 14,
    color: Colors.primaryBlue,
  },
  slide: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  illustration: {
    width: width - 48,
    height: 280,
    alignSelf: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginBottom: 8,
    lineHeight: 30,
  },
  sub: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 24,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: { backgroundColor: Colors.primaryBlue },
  dotInactive: { backgroundColor: Colors.borderGray },
  nextBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextArrow: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
