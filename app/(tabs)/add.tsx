import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { CITIES, GENRE_GROUPS } from '../../data/events';
import { useSubmittedEvents } from '../../hooks/useSubmittedEvents';
import { AggregatedRatings, CityId, DJEvent, EnergyArc } from '../../types';

const EMPTY_RATING: AggregatedRatings = {
  count: 0,
  avgOverall: 0,
  energyArcDist: {
    flat: 0,
    building: 0,
    peak: 0,
    rollercoaster: 0,
    afterburner: 0,
  } as Record<EnergyArc, number>,
  avgSelectionStyle: 0,
  avgMixQuality: 0,
  avgCrowdSync: 0,
  wouldReturnPct: 0,
  tagCounts: {},
  presentPct: 0,
  consensusScore: 0,
  ageGroupDist: {},
};

export default function AddScreen() {
  const { submitEvent } = useSubmittedEvents();

  const [djName, setDjName] = useState('');
  const [supportingActs, setSupportingActs] = useState('');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState<CityId | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) {
        next.delete(genre);
      } else {
        next.add(genre);
      }
      return next;
    });
  };

  const canSubmit =
    djName.trim().length > 0 &&
    venueName.trim().length > 0 &&
    city !== null &&
    date.trim().length > 0 &&
    startTime.trim().length > 0 &&
    selectedGenres.size > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !city) return;

    const event: DJEvent = {
      id: `user_${Date.now()}`,
      djName: djName.trim(),
      venueName: venueName.trim(),
      city,
      date: date.trim(),
      startTime: startTime.trim(),
      genres: Array.from(selectedGenres),
      supportingActs: supportingActs.trim()
        ? supportingActs
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      description: description.trim() || undefined,
      ratingData: EMPTY_RATING,
      createdAt: Date.now(),
    };

    await submitEvent(event);
    setSubmitted(true);
  };

  const handleReset = () => {
    setDjName('');
    setSupportingActs('');
    setVenueName('');
    setCity(null);
    setDate('');
    setStartTime('');
    setSelectedGenres(new Set());
    setDescription('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successCheck}>✓</Text>
          <Text style={styles.successTitle}>SET DODANY</Text>
          <Text style={styles.successSub}>
            Pojawi się na liście setów — możesz go teraz ocenić
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.addAnotherBtn,
              pressed && styles.pressed,
            ]}
            onPress={handleReset}
            accessibilityRole="button"
          >
            <Text style={styles.addAnotherText}>DODAJ KOLEJNY</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DODAJ SET</Text>
            <Text style={styles.headerSub}>
              Byłeś/aś na secie, którego tu nie ma? Dodaj go — inni będą
              mogli go ocenić.
            </Text>
          </View>

          {/* DJ / Artysta */}
          <Field label="DJ / ARTYSTA" required>
            <TextInput
              style={styles.input}
              value={djName}
              onChangeText={setDjName}
              placeholder="np. Surgeon, Paula Temple, Trym"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
              returnKeyType="next"
              maxLength={100}
            />
          </Field>

          {/* Support */}
          <Field label="SUPPORT ACTS" hint="Oddziel przecinkami, opcjonalne">
            <TextInput
              style={styles.input}
              value={supportingActs}
              onChangeText={setSupportingActs}
              placeholder="np. Orphx, Rrose"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
              maxLength={200}
            />
          </Field>

          {/* Venue */}
          <Field label="VENUE" required>
            <TextInput
              style={styles.input}
              value={venueName}
              onChangeText={setVenueName}
              placeholder="np. Smolna, B90, Hevre"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
              returnKeyType="next"
              maxLength={100}
            />
          </Field>

          {/* City */}
          <Field label="MIASTO" required>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {CITIES.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.pill, city === c.id && styles.pillActive]}
                  onPress={() => setCity(c.id as CityId)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.pillText,
                      city === c.id && styles.pillTextActive,
                    ]}
                  >
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Field>

          {/* Date + Time */}
          <View style={styles.dateRow}>
            <View style={styles.dateCell}>
              <Field label="DATA" required hint="RRRR-MM-DD">
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="2025-06-20"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  returnKeyType="next"
                />
              </Field>
            </View>
            <View style={styles.timeCell}>
              <Field label="GODZINA" required>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="23:00"
                  placeholderTextColor={theme.colors.textTertiary}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  returnKeyType="next"
                />
              </Field>
            </View>
          </View>

          {/* Genres */}
          <Field label="GATUNKI" required hint="Wybierz co najmniej jeden">
            {Object.entries(GENRE_GROUPS).map(([macro, subs]) => (
              <View key={macro} style={styles.genreGroup}>
                <Text style={styles.genreMacroLabel}>{macro}</Text>
                <View style={styles.genrePillRow}>
                  {subs.map((sub) => (
                    <Pressable
                      key={sub}
                      style={[
                        styles.genrePill,
                        selectedGenres.has(sub) && styles.genrePillActive,
                      ]}
                      onPress={() => toggleGenre(sub)}
                      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.genrePillText,
                          selectedGenres.has(sub) && styles.genrePillTextActive,
                        ]}
                      >
                        {sub}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </Field>

          {/* Description */}
          <Field label="OPIS" hint="Opcjonalne">
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Kilka słów o secie, atmosferze, miejscu..."
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
            />
          </Field>

          {/* Submit */}
          <View style={styles.submitArea}>
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                !canSubmit && styles.submitBtnDisabled,
                pressed && canSubmit && styles.pressed,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Dodaj set"
            >
              <Text
                style={[
                  styles.submitText,
                  !canSubmit && styles.submitTextDisabled,
                ]}
              >
                DODAJ SET
              </Text>
              {canSubmit && (
                <Text style={styles.submitKana}>追加する</Text>
              )}
            </Pressable>
            {!canSubmit && (
              <Text style={styles.requiredHint}>* Wypełnij wymagane pola</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldBlock}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.fieldRequired}>*</Text>}
        {hint ? <Text style={styles.fieldHint}> — {hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  pressed: { opacity: 0.7 },

  header: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderStrong,
  },
  headerTitle: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  headerSub: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },

  // Field wrapper
  fieldBlock: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  fieldRequired: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.text,
    fontWeight: theme.font.weights.black,
    marginLeft: 3,
  },
  fieldHint: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginLeft: 2,
  },

  // Inputs
  input: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: theme.spacing.sm,
  },

  // City pills
  pillRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  pill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minHeight: 34,
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  pillText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textTertiary,
  },
  pillTextActive: {
    color: theme.colors.white,
  },

  // Date / time side-by-side
  dateRow: {
    flexDirection: 'row',
  },
  dateCell: { flex: 2 },
  timeCell: { flex: 1 },

  // Genre multi-select
  genreGroup: {
    marginBottom: theme.spacing.md,
  },
  genreMacroLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  genrePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  genrePill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  genrePillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  genrePillText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  genrePillTextActive: {
    color: theme.colors.white,
    fontWeight: theme.font.weights.semibold,
  },

  // Submit
  submitArea: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.sm,
    alignItems: 'stretch',
  },
  submitBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    minHeight: 56,
  },
  submitBtnDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  submitText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  submitTextDisabled: {
    color: theme.colors.textTertiary,
  },
  submitKana: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  requiredHint: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Success
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  successCheck: {
    fontSize: 56,
    color: theme.colors.text,
    fontWeight: theme.font.weights.black,
    lineHeight: 64,
  },
  successTitle: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  successSub: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  addAnotherBtn: {
    marginTop: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  addAnotherText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
});
