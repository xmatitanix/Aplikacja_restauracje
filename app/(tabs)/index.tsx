import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CityFilter } from '../../components/CityFilter';
import { EventCard } from '../../components/EventCard';
import { GenreFilter } from '../../components/GenreFilter';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import {
  getAllGenres,
  getEventsByCity,
  getTrendingEvents,
} from '../../data/events';
import { useRatings } from '../../hooks/useRatings';
import { CityId } from '../../types';

// Static — never changes
const trending = getTrendingEvents();
const featured = trending[0];
const ALL_GENRES = getAllGenres();

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<CityId | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { getRatedCount } = useRatings();

  const handleCitySelect = useCallback((city: CityId | 'all') => {
    setSelectedCity(city);
    setSelectedGenre('all');
  }, []);

  const noFilters = selectedCity === 'all' && selectedGenre === 'all';

  const events = useMemo(() => {
    const cityEvents = getEventsByCity(selectedCity);
    if (selectedGenre === 'all') return cityEvents;
    return cityEvents.filter((e) => e.genres.includes(selectedGenre));
  }, [selectedCity, selectedGenre]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>SETLOG</Text>
            <Text style={styles.tagline}>音楽評価プラットフォーム</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.statsNum}>{getRatedCount()}</Text>
            <Text style={styles.statsLabel}>RATED</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* City Filter */}
        <CityFilter selected={selectedCity} onSelect={handleCitySelect} />

        {/* Genre Filter */}
        <GenreFilter
          genres={ALL_GENRES}
          selected={selectedGenre}
          onSelect={setSelectedGenre}
        />

        {/* Featured */}
        {noFilters && featured && (
          <>
            <SectionHeader label="FEATURED SET" decoration="精選" />
            <EventCard
              event={featured}
              variant="featured"
              index={0}
              onPress={() => router.push(`/event/${featured.id}`)}
            />
          </>
        )}

        {/* Events List */}
        <SectionHeader
          label={noFilters ? 'RECENT SETS' : selectedGenre !== 'all' ? selectedGenre.toUpperCase() : 'SETS IN CITY'}
          sublabel={`${events.length} ${events.length === 1 ? 'set' : 'setów'}`}
          decoration="全部"
        />

        {events.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO SETS YET</Text>
            <Text style={styles.emptySubtext}>
              Brak setów dla wybranych filtrów
            </Text>
          </View>
        ) : (
          events
            .filter((e) => !noFilters || e.id !== featured?.id)
            .map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))
        )}

        {/* Footer decoration */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            SETLOG / DJ RATING PLATFORM / PL
          </Text>
          <Text style={styles.footerKana}>セットログ</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  wordmark: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  tagline: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  statsBox: {
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statsNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  statsLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
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
  emptySubtext: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  footer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: 11,
    letterSpacing: 3,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  footerKana: {
    fontSize: theme.font.sizes.xl,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.black,
  },
});
