import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export function VibeTagFilter({ tags, selectedTags, onToggle }: Props) {
  if (tags.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.rowLabel}>// VIBE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => onToggle(tag)}
              style={({ pressed }) => [
                styles.pill,
                active && styles.pillActive,
                pressed && styles.pillPressed,
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={[styles.label, active && styles.labelActive]}>
                {tag}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
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
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  pillPressed: { opacity: 0.7 },
  label: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textSecondary,
  },
  labelActive: { color: theme.colors.white },
});
