import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { getEventById } from '../../data/events';
import { useRatings } from '../../hooks/useRatings';
import { isValidEventId } from '../../types';

export default function RateResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRating, getStreak } = useRatings();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 100,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!isValidEventId(id)) {
    router.replace('/(tabs)');
    return null;
  }

  const event = getEventById(id);
  if (!event) {
    router.replace('/(tabs)');
    return null;
  }

  const myRating = getRating(id);
  const streak = getStreak();
  const data = event.ratingData;

  const topTags = Object.entries(data.tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  const presentPct = Math.round(data.presentPct * 100);
  const communityScore = data.avgOverall.toFixed(1);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Success mark */}
        <Animated.View
          style={[
            styles.heroBlock,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.heroTitle}>OCENIONO</Text>
          <Text style={styles.heroDj}>{event.djName}</Text>
          <Text style={styles.heroVenue}>{event.venueName}</Text>
        </Animated.View>

        {/* Streak */}
        {streak >= 2 && (
          <Animated.View style={[styles.streakBanner, { opacity: fadeAnim }]}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakNum}>{streak}</Text>
              <Text style={styles.streakLabel}>
                {streak === 1 ? 'DZIEŃ Z RZĘDU' : streak < 5 ? 'DNI Z RZĘDU' : 'DNI Z RZĘDU'}
              </Text>
            </View>
            <Text style={styles.streakSub}>SERIA OCEN</Text>
          </Animated.View>
        )}

        {/* Your score vs community */}
        <Animated.View style={[styles.compareBlock, { opacity: fadeAnim }]}>
          <Text style={styles.compareLabel}>// PORÓWNANIE</Text>
          <View style={styles.compareRow}>
            <View style={styles.compareCol}>
              <Text style={styles.compareScore}>
                {myRating?.overall ?? '?'}
              </Text>
              <Text style={styles.compareColLabel}>TWOJA</Text>
            </View>
            <Text style={styles.compareSep}>vs</Text>
            <View style={styles.compareCol}>
              <Text style={styles.compareScore}>{communityScore}</Text>
              <Text style={styles.compareColLabel}>
                SPOŁECZNOŚĆ ({data.count} {data.count === 1 ? 'ocena' : data.count < 5 ? 'oceny' : 'ocen'})
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Community insights */}
        <Animated.View style={[styles.insightsBlock, { opacity: fadeAnim }]}>
          <Text style={styles.insightsLabel}>// SPOŁECZNOŚĆ MÓWI</Text>

          <View style={styles.insightRow}>
            <View style={styles.insightCell}>
              <Text style={styles.insightNum}>{presentPct}%</Text>
              <Text style={styles.insightDesc}>
                {myRating?.wasPresent ? '← ty też byłeś/aś' : 'było live'}
              </Text>
            </View>
            <View style={styles.insightDivider} />
            <View style={styles.insightCell}>
              <Text style={styles.insightNum}>{data.avgMixQuality.toFixed(1)}</Text>
              <Text style={styles.insightDesc}>avg mix quality</Text>
            </View>
            <View style={styles.insightDivider} />
            <View style={styles.insightCell}>
              <Text style={styles.insightNum}>{data.consensusScore}</Text>
              <Text style={styles.insightDesc}>consensus</Text>
            </View>
          </View>

          {topTags.length > 0 && (
            <View style={styles.tagsReveal}>
              <Text style={styles.tagsRevealLabel}>POPULARNE TAGI</Text>
              <View style={styles.tagsRow}>
                {topTags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tagChip,
                      myRating?.tags.includes(tag) && styles.tagChipOwn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        myRating?.tags.includes(tag) && styles.tagChipTextOwn,
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>

        {/* CTAs */}
        <Animated.View style={[styles.ctaBlock, { opacity: fadeAnim }]}>
          <Pressable
            style={({ pressed }) => [styles.ctaMain, pressed && styles.pressed]}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
          >
            <Text style={styles.ctaMainText}>WRÓĆ DO LISTY SETÓW</Text>
            <Text style={styles.ctaMainKana}>一覧へ戻る</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.ctaSecondary, pressed && styles.pressed]}
            onPress={() => router.replace(`/event/${event.id}`)}
            accessibilityRole="button"
          >
            <Text style={styles.ctaSecondaryText}>SZCZEGÓŁY SETU</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },
  pressed: { opacity: 0.7 },

  heroBlock: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  checkmark: {
    fontSize: 56,
    color: theme.colors.text,
    fontWeight: theme.font.weights.black,
    lineHeight: 64,
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  heroDj: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  heroVenue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },

  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  streakIcon: { fontSize: 28 },
  streakNum: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.white,
    fontVariant: ['tabular-nums'],
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: theme.font.letterSpacing.wider,
  },
  streakSub: {
    marginLeft: 'auto',
    fontSize: theme.font.sizes.xs,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: theme.font.letterSpacing.widest,
    fontWeight: theme.font.weights.bold,
  },

  compareBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  compareLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.md,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  compareCol: { alignItems: 'center', gap: 4 },
  compareScore: {
    fontSize: 48,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 54,
  },
  compareColLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    textAlign: 'center',
    maxWidth: 120,
  },
  compareSep: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },

  insightsBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  insightsLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
  },
  insightDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  insightNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  insightDesc: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
    textAlign: 'center',
  },

  tagsReveal: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  tagsRevealLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  tagChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tagChipOwn: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.accentLight,
  },
  tagChipText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  tagChipTextOwn: {
    color: theme.colors.text,
    fontWeight: theme.font.weights.semibold,
  },

  ctaBlock: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  ctaMain: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 56,
    justifyContent: 'center',
  },
  ctaMainText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  ctaMainKana: {
    fontSize: theme.font.sizes.xs,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: theme.font.letterSpacing.wide,
  },
  ctaSecondary: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaSecondaryText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
  },
});
