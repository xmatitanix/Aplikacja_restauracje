import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import { ENERGY_ARCS, getEventById, VIBE_TAGS } from '../../data/events';
import { useRatings } from '../../hooks/useRatings';
import { AGE_GROUPS, AgeGroup, EnergyArc, Rating } from '../../types';

const STEPS = ['overall', 'energy', 'selection', 'mix', 'tags', 'age', 'presence'] as const;
type Step = typeof STEPS[number];

const STEP_LABELS: Record<Step, string> = {
  overall: 'OVERALL VIBE',
  energy: 'ENERGY ARC',
  selection: 'SELECTION STYLE',
  mix: 'MIX QUALITY',
  tags: 'VIBE TAGS',
  age: 'CROWD AGE',
  presence: 'WERE YOU THERE?',
};

const STEP_KANA: Record<Step, string> = {
  overall: '全体',
  energy: 'エネルギー',
  selection: '選択',
  mix: 'ミックス',
  tags: 'タグ',
  age: '年齢層',
  presence: '存在',
};

export default function RateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { saveRating } = useRatings();
  const event = getEventById(id);

  const [step, setStep] = useState<Step>('overall');
  const [overall, setOverall] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [energyArc, setEnergyArc] = useState<EnergyArc | null>(null);
  const [selectionStyle, setSelectionStyle] = useState<-2 | -1 | 0 | 1 | 2 | null>(null);
  const [mixQuality, setMixQuality] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [wasPresent, setWasPresent] = useState<boolean | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (!event) {
    return (
      <View style={styles.safe}>
        <Text>Event not found</Text>
      </View>
    );
  }

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      const next = STEPS[idx + 1];
      setStep(next);
    }
  }

  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      const prev = STEPS[idx - 1];
      setStep(prev);
    } else {
      router.back();
    }
  }

  async function submit() {
    if (
      overall === null ||
      energyArc === null ||
      selectionStyle === null ||
      mixQuality === null ||
      wasPresent === null
    )
      return;

    const crowdSync = Math.round((overall + mixQuality) / 2) as 1 | 2 | 3 | 4 | 5;

    const rating: Rating = {
      eventId: event!.id,
      overall,
      energyArc,
      selectionStyle,
      mixQuality,
      crowdSync,
      tags: selectedTags,
      wasPresent,
      ...(ageGroup ? { ageGroup } : {}),
      timestamp: Date.now(),
    };

    await saveRating(rating);
    router.replace(`/rate-result/${event!.id}`);
  }

  function canProceed(): boolean {
    switch (step) {
      case 'overall': return overall !== null;
      case 'energy': return energyArc !== null;
      case 'selection': return selectionStyle !== null;
      case 'mix': return mixQuality !== null;
      case 'tags': return true;
      case 'age': return true; // optional
      case 'presence': return wasPresent !== null;
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Progress */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Step header */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepDJ}>{event.djName}</Text>
        <View style={styles.stepMeta}>
          <Text style={styles.stepNum}>
            {String(stepIndex + 1).padStart(2, '0')}/{STEPS.length}
          </Text>
          <Text style={styles.stepKana}>{STEP_KANA[step]}</Text>
        </View>
      </View>

      <View style={styles.stepLabelRow}>
        <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {step === 'overall' && (
          <OverallStep value={overall} onChange={(v) => {
            setOverall(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} />
        )}
        {step === 'energy' && (
          <EnergyStep value={energyArc} onChange={(v) => {
            setEnergyArc(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} />
        )}
        {step === 'selection' && (
          <SelectionStep value={selectionStyle} onChange={(v) => {
            setSelectionStyle(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} />
        )}
        {step === 'mix' && (
          <MixStep value={mixQuality} onChange={(v) => {
            setMixQuality(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} />
        )}
        {step === 'tags' && (
          <TagsStep
            selected={selectedTags}
            onChange={setSelectedTags}
          />
        )}
        {step === 'age' && (
          <AgeStep value={ageGroup} onChange={setAgeGroup} />
        )}
        {step === 'presence' && (
          <PresenceStep value={wasPresent} onChange={(v) => {
            setWasPresent(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }} />
        )}
      </ScrollView>

      {/* Nav */}
      <View style={styles.nav}>
        <Pressable style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>

        {step === 'presence' ? (
          <Pressable
            style={[styles.nextBtn, styles.submitBtn, !canProceed() && styles.btnDisabled]}
            onPress={submit}
            disabled={!canProceed()}
          >
            <Text style={[styles.nextBtnText, !canProceed() && styles.btnTextDisabled]}>
              SUBMIT RATING
            </Text>
            <Text style={styles.submitKana}>送信する</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.nextBtn, !canProceed() && styles.btnDisabled]}
            onPress={goNext}
            disabled={!canProceed()}
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

// STEP COMPONENTS

function OverallStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const labels = ['MEH', 'OK', 'SOLID', 'GREAT', 'ELITE'];
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Twoje ogólne wrażenie z setu — nie tylko techniczne.
      </Text>
      <View style={styles.orbRow}>
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <Pressable
            key={n}
            style={[
              styles.orb,
              value !== null && n <= value && styles.orbFilled,
              value === n && styles.orbActive,
            ]}
            onPress={() => onChange(n)}
          >
            <Text
              style={[
                styles.orbNum,
                value !== null && n <= value && styles.orbNumFilled,
              ]}
            >
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      {value && (
        <Text style={styles.selectionConfirm}>{labels[value - 1]}</Text>
      )}
    </View>
  );
}

function EnergyStep({
  value,
  onChange,
}: {
  value: EnergyArc | null;
  onChange: (v: EnergyArc) => void;
}) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Jak wyglądał kształt energii podczas całego setu?
      </Text>
      {ENERGY_ARCS.map((arc) => (
        <Pressable
          key={arc.id}
          style={[styles.arcOption, value === arc.id && styles.arcOptionSelected]}
          onPress={() => onChange(arc.id)}
        >
          <Text
            style={[
              styles.arcOptionShape,
              value === arc.id && styles.arcOptionShapeSelected,
            ]}
          >
            {arc.shape}
          </Text>
          <View style={styles.arcOptionBody}>
            <Text
              style={[
                styles.arcOptionLabel,
                value === arc.id && styles.arcOptionLabelSelected,
              ]}
            >
              {arc.label}
            </Text>
            <Text style={styles.arcOptionDesc}>{arc.desc}</Text>
          </View>
          {value === arc.id && (
            <Text style={styles.arcCheck}>✓</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

function SelectionStep({
  value,
  onChange,
}: {
  value: -2 | -1 | 0 | 1 | 2 | null;
  onChange: (v: -2 | -1 | 0 | 1 | 2) => void;
}) {
  const options: Array<{ v: -2 | -1 | 0 | 1 | 2; label: string; desc: string }> = [
    { v: -2, label: 'SAFE', desc: 'Tylko znane hity, zero ryzyka' },
    { v: -1, label: 'FAMILIAR', desc: 'Przeważnie sprawdzone tracki' },
    { v: 0, label: 'BALANCED', desc: 'Mix popularnych i mniej znanych' },
    { v: 1, label: 'ADVENTUROUS', desc: 'Dużo nieznanych, świeżych tracków' },
    { v: 2, label: 'AVANT-GARDE', desc: 'Eksperyment — nie dla każdego' },
  ];

  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Jak oceniasz dobór utworów? Bezpieczny czy ryzykowny?
      </Text>
      {options.map((opt) => (
        <Pressable
          key={opt.v}
          style={[
            styles.selOption,
            value === opt.v && styles.selOptionSelected,
          ]}
          onPress={() => onChange(opt.v)}
        >
          <Text
            style={[
              styles.selOptionLabel,
              value === opt.v && styles.selOptionLabelSelected,
            ]}
          >
            {opt.label}
          </Text>
          <Text style={styles.selOptionDesc}>{opt.desc}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function MixStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const labels = [
    'ROUGH — dużo błędów',
    'AVERAGE — kilka potknięć',
    'SOLID — poprawny',
    'CLEAN — prawie bez błędów',
    'SEAMLESS — perfekcja',
  ];

  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Techniczna jakość mixowania — transitions, beatmatching, sound design.
      </Text>
      <View style={styles.dotRow}>
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <Pressable
            key={n}
            style={[styles.dot, value === n && styles.dotSelected]}
            onPress={() => onChange(n)}
          >
            <Text style={[styles.dotNum, value === n && styles.dotNumSelected]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      {value && (
        <Text style={styles.selectionConfirm}>{labels[value - 1]}</Text>
      )}
    </View>
  );
}

function TagsStep({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < 5) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange([...selected, tag]);
    }
  }

  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Wybierz do 5 tagów opisujących ten set. Pomiń jeśli żaden nie pasuje.
      </Text>
      <View style={styles.tagsGrid}>
        {VIBE_TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <Pressable
              key={tag}
              style={[styles.tagPill, active && styles.tagPillActive]}
              onPress={() => toggle(tag)}
            >
              <Text style={[styles.tagPillText, active && styles.tagPillTextActive]}>
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.tagCounter}>{selected.length}/5 TAGS SELECTED</Text>
    </View>
  );
}

function AgeStep({
  value,
  onChange,
}: {
  value: AgeGroup | null;
  onChange: (v: AgeGroup | null) => void;
}) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Jaka była dominująca grupa wiekowa publiczności? Możesz pominąć.
      </Text>
      <View style={styles.ageGrid}>
        {AGE_GROUPS.map((group) => (
          <Pressable
            key={group}
            style={[styles.agePill, value === group && styles.agePillActive]}
            onPress={() => onChange(value === group ? null : group)}
            accessibilityRole="radio"
            accessibilityLabel={`Wiek ${group}`}
          >
            <Text style={[styles.agePillText, value === group && styles.agePillTextActive]}>
              {group}
            </Text>
          </Pressable>
        ))}
      </View>
      {value && (
        <Text style={styles.selectionConfirm}>{value} LAT</Text>
      )}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          // Opcjonalne — pomaga innym wybrać odpowiednie imprezy.
          Twoja ocena pozostaje anonimowa.
        </Text>
      </View>
    </View>
  );
}

function PresenceStep({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepHint}>
        Twoja ocena będzie oznaczona jako "present" lub "online listener" —
        oba są równie wartościowe.
      </Text>

      <Pressable
        style={[styles.presenceOption, value === true && styles.presenceSelected]}
        onPress={() => onChange(true)}
      >
        <Text
          style={[
            styles.presenceLabel,
            value === true && styles.presenceLabelSelected,
          ]}
        >
          BYŁEM/BYŁAM TAM
        </Text>
        <Text style={styles.presenceDesc}>
          Słyszałem/słyszałam na żywo, w klubie
        </Text>
      </Pressable>

      <Pressable
        style={[styles.presenceOption, value === false && styles.presenceSelected]}
        onPress={() => onChange(false)}
      >
        <Text
          style={[
            styles.presenceLabel,
            value === false && styles.presenceLabelSelected,
          ]}
        >
          SŁYSZAŁEM/SŁYSZAŁAM ONLINE
        </Text>
        <Text style={styles.presenceDesc}>
          Stream, nagranie, SoundCloud, YouTube
        </Text>
      </Pressable>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          // Oceny "present" ważą nieco więcej w algorytmie consensus score,
          bo uwzględniają akustykę i atmosferę miejsca.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Progress
  progressTrack: {
    height: 2,
    backgroundColor: theme.colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.text,
  },

  // Step header
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stepDJ: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    letterSpacing: theme.font.letterSpacing.tight,
  },
  stepMeta: {
    alignItems: 'flex-end',
  },
  stepNum: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontVariant: ['tabular-nums'],
  },
  stepKana: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },

  stepLabelRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.text,
  },
  stepLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },

  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: theme.spacing.xxl,
  },

  stepBody: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  stepHint: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  // Overall orbs
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
  orbNumFilled: {
    color: theme.colors.text,
  },
  selectionConfirm: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },

  // Energy arc options
  arcOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  arcOptionSelected: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.text,
  },
  arcOptionShape: {
    fontSize: theme.font.sizes.xl,
    color: theme.colors.textTertiary,
    fontFamily: 'monospace',
    width: 48,
  },
  arcOptionShapeSelected: {
    color: theme.colors.white,
  },
  arcOptionBody: {
    flex: 1,
  },
  arcOptionLabel: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  arcOptionLabelSelected: {
    color: theme.colors.white,
  },
  arcOptionDesc: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  arcCheck: {
    fontSize: theme.font.sizes.lg,
    color: theme.colors.white,
    fontWeight: theme.font.weights.bold,
  },

  // Selection options
  selOption: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  selOptionSelected: {
    borderColor: theme.colors.text,
    borderWidth: 2,
    backgroundColor: theme.colors.accentLight,
  },
  selOptionLabel: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  selOptionLabelSelected: {
    color: theme.colors.text,
  },
  selOptionDesc: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 4,
  },

  // Mix dots
  dotRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  dot: {
    width: 52,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  dotSelected: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  dotNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  dotNumSelected: {
    color: theme.colors.white,
  },

  // Tags
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
  tagPillText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  tagPillTextActive: {
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

  // Age
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  agePill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minWidth: 80,
    alignItems: 'center',
  },
  agePillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  agePillText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: theme.font.letterSpacing.wide,
    fontVariant: ['tabular-nums'],
  },
  agePillTextActive: {
    color: theme.colors.white,
  },

  // Presence
  presenceOption: {
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
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
  presenceLabelSelected: {
    color: theme.colors.white,
  },
  presenceDesc: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },
  noteBox: {
    padding: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  noteText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Navigation
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
  },
  backBtnText: {
    fontSize: theme.font.sizes.xl,
    color: theme.colors.text,
  },
  nextBtn: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.text,
    gap: 4,
  },
  submitBtn: {
    backgroundColor: theme.colors.text,
  },
  btnDisabled: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  nextBtnText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  btnTextDisabled: {
    color: theme.colors.textTertiary,
  },
  submitKana: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
});
