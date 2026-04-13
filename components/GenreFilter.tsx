import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  macros: string[];
  selectedMacro: string;
  onSelectMacro: (macro: string) => void;
  subGenres: string[];
  selectedSubGenre: string | null;
  onSelectSubGenre: (sub: string | null) => void;
  macroCounts?: Record<string, number>;
}

export function GenreFilter({
  macros,
  selectedMacro,
  onSelectMacro,
  subGenres,
  selectedSubGenre,
  onSelectSubGenre,
  macroCounts,
}: Props) {
  const showSubRow = selectedMacro !== 'all' && subGenres.length > 1;

  return (
    <View>
      {/* Row 1: Macro groups */}
      <View style={styles.macroWrapper}>
        <Text style={styles.rowLabel}>// GATUNEK</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.container}
        >
          <Pressable
            style={[styles.pill, selectedMacro === 'all' && styles.pillActive]}
            onPress={() => onSelectMacro('all')}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={[styles.pillText, selectedMacro === 'all' && styles.pillTextActive]}>
              WSZYSTKIE
            </Text>
          </Pressable>
          {macros.map((macro) => (
            <Pressable
              key={macro}
              style={[styles.pill, selectedMacro === macro && styles.pillActive]}
              onPress={() => onSelectMacro(macro)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[styles.pillText, selectedMacro === macro && styles.pillTextActive]}
                numberOfLines={1}
              >
                {macro}
              </Text>
              {macroCounts?.[macro] !== undefined && (
                <Text style={[styles.pillCount, selectedMacro === macro && styles.pillCountActive]}>
                  {macroCounts[macro]}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Row 2: Sub-genres */}
      {showSubRow && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subScroll}
          contentContainerStyle={styles.container}
        >
          <Pressable
            style={[styles.subPill, !selectedSubGenre && styles.subPillActive]}
            onPress={() => onSelectSubGenre(null)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={[styles.subPillText, !selectedSubGenre && styles.subPillTextActive]}>
              Wszystkie
            </Text>
          </Pressable>
          {subGenres.map((sub) => (
            <Pressable
              key={sub}
              style={[styles.subPill, selectedSubGenre === sub && styles.subPillActive]}
              onPress={() => onSelectSubGenre(selectedSubGenre === sub ? null : sub)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[styles.subPillText, selectedSubGenre === sub && styles.subPillTextActive]}
                numberOfLines={1}
              >
                {sub}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  macroWrapper: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: theme.spacing.xs,
  },
  rowLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 2,
    fontWeight: theme.font.weights.semibold,
  },
  scroll: { backgroundColor: theme.colors.surface },
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: theme.colors.background,
  },
  pillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  pillText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  pillTextActive: { color: theme.colors.white },
  pillCount: {
    fontSize: 10,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  pillCountActive: { color: 'rgba(255,255,255,0.55)' },

  subScroll: {
    backgroundColor: theme.colors.accentLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  subPill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 28,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  subPillActive: { borderColor: theme.colors.text },
  subPillText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  subPillTextActive: { color: theme.colors.text, fontWeight: theme.font.weights.bold },
});
