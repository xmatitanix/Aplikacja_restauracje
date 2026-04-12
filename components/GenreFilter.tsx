import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  macros: string[];
  selectedMacro: string; // 'all' or macro key
  onSelectMacro: (macro: string) => void;
  subGenres: string[];
  selectedSubGenre: string | null;
  onSelectSubGenre: (sub: string | null) => void;
}

export function GenreFilter({
  macros,
  selectedMacro,
  onSelectMacro,
  subGenres,
  selectedSubGenre,
  onSelectSubGenre,
}: Props) {
  const showSubRow = selectedMacro !== 'all' && subGenres.length > 1;

  return (
    <View>
      {/* Row 1: Macro groups */}
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
          accessibilityRole="button"
          accessibilityLabel="Wszystkie gatunki"
        >
          <Text
            style={[
              styles.pillText,
              selectedMacro === 'all' && styles.pillTextActive,
            ]}
          >
            ALL
          </Text>
        </Pressable>
        {macros.map((macro) => (
          <Pressable
            key={macro}
            style={[styles.pill, selectedMacro === macro && styles.pillActive]}
            onPress={() => onSelectMacro(macro)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel={`Gatunek: ${macro}`}
          >
            <Text
              style={[
                styles.pillText,
                selectedMacro === macro && styles.pillTextActive,
              ]}
              numberOfLines={1}
            >
              {macro}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Row 2: Sub-genres — expands when macro selected */}
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
            accessibilityRole="button"
            accessibilityLabel="Wszystkie w kategorii"
          >
            <Text
              style={[
                styles.subPillText,
                !selectedSubGenre && styles.subPillTextActive,
              ]}
            >
              Wszystkie
            </Text>
          </Pressable>
          {subGenres.map((sub) => (
            <Pressable
              key={sub}
              style={[
                styles.subPill,
                selectedSubGenre === sub && styles.subPillActive,
              ]}
              onPress={() =>
                onSelectSubGenre(selectedSubGenre === sub ? null : sub)
              }
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={sub}
            >
              <Text
                style={[
                  styles.subPillText,
                  selectedSubGenre === sub && styles.subPillTextActive,
                ]}
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
  // Macro row
  scroll: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 36,
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
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
  pillTextActive: {
    color: theme.colors.white,
  },

  // Sub-genre row
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
  subPillActive: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  subPillText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  subPillTextActive: {
    color: theme.colors.text,
    fontWeight: theme.font.weights.bold,
  },
});
