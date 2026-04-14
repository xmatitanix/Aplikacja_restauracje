import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Achievement } from '../constants/achievements';
import { theme } from '../constants/theme';

interface Props {
  achievements: Achievement[];
  visible: boolean;
  onDismiss: () => void;
}

export function AchievementUnlockModal({ achievements, visible, onDismiss }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 120,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible || achievements.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.kana}>新しいバッジ</Text>
          <Text style={styles.header}>// NOWE ODZNAKI</Text>

          {achievements.map((a) => (
            <View key={a.id} style={styles.row}>
              <Text style={styles.emoji}>{a.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{a.name}</Text>
                <Text style={styles.desc}>{a.description}</Text>
              </View>
            </View>
          ))}

          <Pressable
            style={({ pressed }) => [styles.dismissBtn, pressed && styles.pressed]}
            onPress={onDismiss}
            accessibilityRole="button"
          >
            <Text style={styles.dismissText}>ODEBRANO</Text>
            <Text style={styles.dismissKana}>受け取った</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  kana: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  header: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
    width: 40,
    textAlign: 'center',
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  desc: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    lineHeight: 16,
  },
  dismissBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 52,
    marginTop: theme.spacing.xs,
  },
  pressed: { opacity: 0.8 },
  dismissText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  dismissKana: {
    fontSize: theme.font.sizes.xs,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: theme.font.letterSpacing.wide,
  },
});
