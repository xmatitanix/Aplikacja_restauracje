import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import { CITIES, CITY_FACTS, getEventsByCity } from '../../data/events';
import { City, CityId } from '../../types';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll}>
        <SectionHeader
          label="BROWSE BY CITY"
          sublabel="Największe sceny muzyczne w Polsce"
          decoration="都市"
        />

        <View style={styles.cityGrid}>
          {CITIES.map((city, i) => (
            <CityTile
              key={city.id}
              city={city}
              index={i}
              onPress={() => router.push(`/explore/${city.id}`)}
            />
          ))}
        </View>

        <SectionHeader label="SCENE NOTES" sublabel="Ciekawostki o miastach" decoration="知識" />
        {CITY_FACTS.map((fact) => {
          const city = CITIES.find((c) => c.id === fact.cityId);
          return (
            <View key={fact.cityId} style={styles.factCard}>
              <View style={styles.factHeader}>
                <Text style={styles.factCity}>{city?.name}</Text>
                <Text style={styles.factStat}>{fact.stat}</Text>
              </View>
              <Text style={styles.factText}>{fact.fact}</Text>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            * Dane eventowe są mockiem — integracja z FB/RA Events w trakcie
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CityTile({
  city,
  index,
  onPress,
}: {
  city: City;
  index: number;
  onPress: () => void;
}) {
  const events = getEventsByCity(city.id as CityId);
  const avgRating =
    events.length > 0
      ? (
          events.reduce((s, e) => s + e.ratingData.avgOverall, 0) /
          events.length
        ).toFixed(1)
      : '—';

  return (
    <Pressable
      style={({ pressed }) => [styles.cityTile, pressed && styles.tilePressed]}
      onPress={onPress}
    >
      <View style={styles.tileHeader}>
        <Text style={styles.tileIndex}>{String(index + 1).padStart(2, '0')}</Text>
        <View style={styles.tileScore}>
          <Text style={styles.tileScoreNum}>{avgRating}</Text>
          <Text style={styles.tileScoreLabel}>AVG</Text>
        </View>
      </View>

      <Text style={styles.tileName}>{city.name}</Text>
      <Text style={styles.tileDesc}>{city.description}</Text>

      <View style={styles.tileSep} />

      <Text style={styles.tileVenues}>{city.sceneNote}</Text>

      <View style={styles.tileFooter}>
        <Text style={styles.tileCount}>{events.length} sets</Text>
        <Text style={styles.tileArrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  cityGrid: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cityTile: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  tileIndex: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  tileScore: {
    alignItems: 'flex-end',
  },
  tileScoreNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 22,
  },
  tileScoreLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  tileName: {
    fontSize: theme.font.sizes.xxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.tight,
    color: theme.colors.text,
  },
  tileDesc: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  tileSep: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  tileVenues: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  tileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  tileCount: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textSecondary,
    fontWeight: theme.font.weights.semibold,
  },
  tileArrow: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    fontWeight: theme.font.weights.bold,
  },
  factCard: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text,
  },
  factHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  factCity: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  factStat: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  factText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  footerNote: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
