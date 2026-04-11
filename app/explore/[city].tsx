import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventCard } from '../../components/EventCard';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import {
  CITIES,
  CITY_FACTS,
  getEventsByCity,
} from '../../data/events';
import { CityId } from '../../types';

export default function CityScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const router = useRouter();
  const cityId = city as CityId;

  const cityInfo = CITIES.find((c) => c.id === cityId);
  const cityFact = CITY_FACTS.find((f) => f.cityId === cityId);
  const events = getEventsByCity(cityId);

  if (!cityInfo) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>CITY NOT FOUND</Text>
      </SafeAreaView>
    );
  }

  const avgRating =
    events.length > 0
      ? (
          events.reduce((s, e) => s + e.ratingData.avgOverall, 0) /
          events.length
        ).toFixed(1)
      : '—';

  const totalRatings = events.reduce((s, e) => s + e.ratingData.count, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll}>
        {/* City Hero */}
        <View style={styles.hero}>
          <Text style={styles.cityName}>{cityInfo.name}</Text>
          <Text style={styles.cityDesc}>{cityInfo.description}</Text>

          <View style={styles.heroStats}>
            <HeroStat label="AVG RATING" value={avgRating} />
            <HeroStat label="TOTAL SETS" value={events.length.toString()} />
            <HeroStat label="TOTAL RATINGS" value={totalRatings.toLocaleString()} />
          </View>
        </View>

        {/* Venue info */}
        <View style={styles.venueBlock}>
          <Text style={styles.venueLabel}>KLUCZOWE MIEJSCA</Text>
          <Text style={styles.venueText}>{cityInfo.sceneNote}</Text>
        </View>

        {/* City fact */}
        {cityFact && (
          <View style={styles.factBlock}>
            <Text style={styles.factLabel}>// CIEKAWOSTKA</Text>
            <Text style={styles.factText}>{cityFact.fact}</Text>
            <View style={styles.factStatRow}>
              <Text style={styles.factStat}>{cityFact.stat}</Text>
            </View>
          </View>
        )}

        {/* Events */}
        <SectionHeader
          label="SETS"
          sublabel={`${events.length} events from ${cityInfo.name}`}
          decoration="全部"
        />

        {events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO SETS YET</Text>
            <Text style={styles.emptyHint}>
              Wkrótce pojawią się sety z tego miasta
            </Text>
          </View>
        ) : (
          events.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              onPress={() => router.push(`/event/${event.id}`)}
            />
          ))
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatNum}>{value}</Text>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: { flex: 1 },
  notFound: {
    padding: theme.spacing.xl,
    fontSize: theme.font.sizes.xl,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
  },

  // Hero
  hero: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
  },
  cityName: {
    fontSize: theme.font.sizes.display,
    fontWeight: theme.font.weights.black,
    letterSpacing: -2,
    color: theme.colors.text,
    lineHeight: 52,
  },
  cityDesc: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  heroStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.xl,
  },
  heroStat: {},
  heroStatNum: {
    fontSize: theme.font.sizes.xxl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  heroStatLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginTop: 2,
    lineHeight: 15,
  },

  // Venue block
  venueBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  venueLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
  },
  venueText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },

  // Fact block
  factBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  factLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.sm,
  },
  factText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  factStatRow: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  factStat: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    fontWeight: theme.font.weights.semibold,
  },

  // Empty
  empty: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },
  emptyHint: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  footer: {
    height: theme.spacing.xxxl,
  },
});
