import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { CITIES } from '../data/events';
import { CityId } from '../types';

interface Props {
  selected: CityId | 'all';
  onSelect: (city: CityId | 'all') => void;
}

export function CityFilter({ selected, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <CityPill
          label="ALL"
          active={selected === 'all'}
          onPress={() => onSelect('all')}
        />
        {CITIES.map((city) => (
          <CityPill
            key={city.id}
            label={city.name}
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
  active,
  onPress,
}: {
  label: string;
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  pillPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
  },
  labelActive: {
    color: theme.colors.white,
  },
});
