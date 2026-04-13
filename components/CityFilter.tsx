import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { CITIES } from '../data/events';
import { CityId } from '../types';

interface Props {
  selected: CityId | 'all';
  onSelect: (city: CityId | 'all') => void;
  eventCounts?: Record<string, number>;
}

export function CityFilter({ selected, onSelect, eventCounts }: Props) {
  const total = eventCounts
    ? Object.values(eventCounts).reduce((s, n) => s + n, 0)
    : undefined;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.rowLabel}>// MIASTO</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <CityPill
          label="ALL"
          count={total}
          active={selected === 'all'}
          onPress={() => onSelect('all')}
        />
        {CITIES.map((city) => (
          <CityPill
            key={city.id}
            label={city.name}
            count={eventCounts?.[city.id]}
            active={selected === city.id}
            onPress={() => onSelect(city.id as CityId)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CityPill({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        active && styles.pillActive,
        pressed && styles.pillPressed,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      {count !== undefined && (
        <Text style={[styles.count, active && styles.countActive]}>
          {count}
        </Text>
      )}
    </Pressable>
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
    flexDirection: 'row',
    gap: 5,
  },
  pillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  pillPressed: { opacity: 0.7 },
  label: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
  },
  labelActive: { color: theme.colors.white },
  count: {
    fontSize: 10,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  countActive: { color: 'rgba(255,255,255,0.6)' },
});
