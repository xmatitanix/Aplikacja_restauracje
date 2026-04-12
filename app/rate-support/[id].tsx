import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { VIBE_TAGS, getEventById } from '../../data/events';
import { useSupportRatings } from '../../hooks/useSupportRatings';
import { SupportRating, isValidEventId, isValidActName, sanitizeActName } from '../../types';

const STEPS = ['overall', 'tags', 'presence'] as const;
type Step = typeof STEPS[number];

const STEP_LABELS: Record<Step, string> = {
  overall: 'OVERALL VIBE',
  tags: 'VIBE TAGS',
  presence: 'WERE YOU THERE?',
};

export default function RateSupportScreen() {
  const { id, act } = useLocalSearchParams<{ id: string; act: string }>();
  const router = useRouter();
  const { saveRating, makeSupportId } = useSupportRatings();

  // Input validation
  if (!isValidEventId(id) || !isValidActName(act)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>INVALID REQUEST</Text>
          <Pressable style={styles.errorBack} onPress={() => router.back()}>
            <Text style={styles.errorBackText}>← WRÓĆ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const actName = sanitizeActName(act);
  const event = getEventById(id);

  const [step, setStep] = useState<Step>('overall');
  const [overall, setOverall] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [wasPresent, setWasPresent] = useState<boolean | null>(null);

  const stepIndex = STEPS.indexOf(step);

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>EVENT NOT FOUND</Text>
          <Pressable style={styles.errorBack} onPress={() => router.back()}>
            <Text style={styles.errorBackText}>← WRÓĆ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  function canProceed(): boolean {
    if (step === 'overall') return overall !== null;
    if (step === 'tags') return true;
    if (step === 'presence') return wasPresent !== null;
    return false;
  }

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  }

  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
    } else {
      router.back();
    }
  }

  async function submit() {
    if (overall === null || wasPresent === null) return;

    const rating: SupportRating = {
      id: makeSupportId(event!.id, actName),
      eventId: event!.id,
      actName,
      overall,
      tags: selectedTags,
      wasPresent,
      timestamp: Date.now(),
    };

    await saveRating(rating);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedTags([...selectedTags, tag]);
    }
  }

  const OVERALL_LABELS = ['MEH', 'OK', 'SOLID', 'GREAT', 'ELITE'];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Progress */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((stepIndex + 1) / STEPS.length) * 100}%` },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerContext}>{event.djName} / support</Text>
          <Text style={styles.headerAct} numberOfLines={1}>{actName}</Text>
        </View>
        <Text style={styles.headerStep}>
          {String(stepIndex + 1).padStart(2, '0')}/{STEPS.length}
        </Text>
      </View>

      <View style={styles.stepLabelRow}>
        <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {step === 'overall' && (
          <View style={styles.stepBody}>
            <Text style={styles.hint}>
              Ogólne wrażenie z setu supportu. Czy był wart przyjścia wcześniej?
            </Text>
            <View style={styles.orbRow}>
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <Pressable
                  key={n}
                  style={[
                    styles.orb,
                    overall !== null && n <= overall && styles.orbFilled,
                    overall === n && styles.orbActive,
                  ]}
                  onPress={() => {
                    setOverall(n);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  accessibilityRole="radio"
                  accessibilityLabel={`${n} out of 5`}
                >
                  <Text style={[styles.orbNum, overall !== null && n <= overall && styles.orbNumFilled]}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>
            {overall && (
              <Text style={styles.selectionConfirm}>{OVERALL_LABELS[overall - 1]}</Text>
            )}
          </View>
        )}

        {step === 'tags' && (
          <View style={styles.stepBody}>
            <Text style={styles.hint}>
              Wybierz do 3 tagów. Możesz pominąć.
            </Text>
            <View style={styles.tagsGrid}>
              {VIBE_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    style={[styles.tagPill, active && styles.tagPillActive]}
                    onPress={() => toggleTag(tag)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.tagCounter}>{selectedTags.length}/3 TAGS</Text>
          </View>
        )}

        {step === 'presence' && (
          <View style={styles.stepBody}>
            <Text style={styles.hint}>
              Czy słyszałeś/aś support na żywo?
            </Text>
            <Pressable
              style={[styles.presenceOpt, wasPresent === true && styles.presenceSelected]}
              onPress={() => {
                setWasPresent(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Text style={[styles.presenceLabel, wasPresent === true && styles.presenceLabelSel]}>
                BYŁEM/AM TAM
              </Text>
              <Text style={styles.presenceDesc}>Na żywo w klubie</Text>
            </Pressable>
            <Pressable
              style={[styles.presenceOpt, wasPresent === false && styles.presenceSelected]}
              onPress={() => {
                setWasPresent(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Text style={[styles.presenceLabel, wasPresent === false && styles.presenceLabelSel]}>
                SŁYSZAŁEM/AM ONLINE
              </Text>
              <Text style={styles.presenceDesc}>Nagranie, stream</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Nav */}
      <View style={styles.nav}>
        <Pressable style={styles.backBtn} onPress={goBack} accessibilityLabel="Wróć">
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
        {step === 'presence' ? (
          <Pressable
            style={[styles.nextBtn, !canProceed() && styles.btnDisabled]}
            onPress={submit}
            disabled={!canProceed()}
            accessibilityRole="button"
            accessibilityLabel="Wyślij ocenę"
          >
            <Text style={[styles.nextBtnText, !canProceed() && styles.btnTextDisabled]}>
              SUBMIT
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.nextBtn, !canProceed() && styles.btnDisabled]}
            onPress={goNext}
            disabled={!canProceed()}
            accessibilityRole="button"
          >
            <Text style={[styles.nextBtnText, !canProceed() && styles.btnTextDisabled]}>
              NEXT →
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },
  errorBack: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  errorBackText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },

  progressTrack: { height: 2, backgroundColor: theme.colors.border },
  progressFill: { height: '100%', backgroundColor: theme.colors.text },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContext: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    marginBottom: 2,
  },
  headerAct: {
    fontSize: theme.font.sizes.lg,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
  },
  headerStep: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontVariant: ['tabular-nums'],
  },

  stepLabelRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.text,
  },
  stepLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },

  content: { flex: 1 },
  contentInner: { paddingBottom: theme.spacing.xxl },

  stepBody: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  orbRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  orb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  orbFilled: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.accentLight,
  },
  orbActive: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.text,
  },
  orbNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  orbNumFilled: { color: theme.colors.text },
  selectionConfirm: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
    textAlign: 'center',
  },

  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tagPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tagPillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  tagText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  tagTextActive: {
    color: theme.colors.white,
    fontWeight: theme.font.weights.semibold,
  },
  tagCounter: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },

  presenceOpt: {
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  presenceSelected: {
    borderColor: theme.colors.text,
    borderWidth: 2,
    backgroundColor: theme.colors.text,
  },
  presenceLabel: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  presenceLabelSel: { color: theme.colors.white },
  presenceDesc: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },

  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backBtn: {
    padding: theme.spacing.lg,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    minHeight: 56,
  },
  backBtnText: { fontSize: theme.font.sizes.xl, color: theme.colors.text },
  nextBtn: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.text,
    minHeight: 56,
  },
  btnDisabled: { backgroundColor: theme.colors.surfaceAlt },
  nextBtnText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  btnTextDisabled: { color: theme.colors.textTertiary },
});
