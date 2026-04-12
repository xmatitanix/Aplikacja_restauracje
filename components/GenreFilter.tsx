import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

export function GenreFilter({ genres, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <Pressable
        style={[styles.pill, selected === 'all' && styles.pillActive]}
        onPress={() => onSelect('all')}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        accessibilityRole="button"
        accessibilityLabel="Wszystkie gatunki"
      >
        <Text style={[styles.pillText, selected === 'all' && styles.pillTextActive]}>
          ALL GENRES
        </Text>
      </Pressable>
      {genres.map((genre) => (
        <Pressable
          key={genre}
          style={[styles.pill, selected === genre && styles.pillActive]}
          onPress={() => onSelect(genre)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          accessibilityRole="button"
          accessibilityLabel={`Gatunek: ${genre}`}
        >
          <Text
            style={[styles.pillText, selected === genre && styles.pillTextActive]}
            numberOfLines={1}
          >
            {genre}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 32,
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
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textTertiary,
  },
  pillTextActive: {
    color: theme.colors.white,
  },
});
