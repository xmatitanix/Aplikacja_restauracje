import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CityFilter } from '../../components/CityFilter';
import { EventCard } from '../../components/EventCard';
import { GenreFilter } from '../../components/GenreFilter';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import {
  GENRE_GROUPS,
  getAvailableMacroGenres,
  getEventsByCity,
  getTrendingEvents,
} from '../../data/events';
import { useRatings } from '../../hooks/useRatings';
import { useSubmittedEvents } from '../../hooks/useSubmittedEvents';
import { CityId } from '../../types';

type SortBy = 'recent' | 'rating' | 'popular';

// Static — never changes
const trending = getTrendingEvents();
const featured = trending[0];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<CityId | 'all'>('all');
  const [selectedMacro, setSelectedMacro] = useState<string>('all');
  const [selectedSubGenre, setSelectedSubGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [onlyUnrated, setOnlyUnrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { getRatedCount, hasRated } = useRatings();
  const { events: submittedEvents } = useSubmittedEvents();

  const handleCitySelect = useCallback((city: CityId | 'all') => {
    setSelectedCity(city);
    setSelectedMacro('all');
    setSelectedSubGenre(null);
  }, []);

  const handleMacroSelect = useCallback((macro: string) => {
    setSelectedMacro(macro);
    setSelectedSubGenre(null);
  }, []);

  const cityEvents = useMemo(() => {
    const base = getEventsByCity(selectedCity);
    const userFiltered =
      selectedCity === 'all'
        ? submittedEvents
        : submittedEvents.filter((e) => e.city === selectedCity);
    return [...base, ...userFiltered];
  }, [selectedCity, submittedEvents]);

  const availableGenres = useMemo(
    () => getAvailableMacroGenres(cityEvents),
    [cityEvents]
  );

  const availableSubGenres = useMemo(() => {
    if (selectedMacro === 'all') return [];
    const macroSubs = GENRE_GROUPS[selectedMacro] ?? [];
    const present = new Set<string>();
    cityEvents.forEach((e) => e.genres.forEach((g) => present.add(g)));
    return macroSubs.filter((g) => present.has(g));
  }, [selectedMacro, cityEvents]);

  const hasActiveFilters =
    selectedCity !== 'all' || selectedMacro !== 'all' || onlyUnrated;

  const events = useMemo(() => {
    let list = cityEvents;

    if (selectedMacro !== 'all') {
      const macroSubs = GENRE_GROUPS[selectedMacro];
      if (macroSubs) {
        list = list.filter((e) => e.genres.some((g) => macroSubs.includes(g)));
      }
      if (selectedSubGenre) {
        list = list.filter((e) => e.genres.includes(selectedSubGenre));
      }
    }

    if (onlyUnrated) {
      list = list.filter((e) => !hasRated(e.id));
    }

    const sorted = [...list];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.ratingData.avgOverall - a.ratingData.avgOverall);
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => b.ratingData.count - a.ratingData.count);
    } else {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return sorted;
  }, [cityEvents, selectedMacro, selectedSubGenre, onlyUnrated, hasRated, sortBy]);

  const showFeatured =
    selectedCity === 'all' &&
    selectedMacro === 'all' &&
    !onlyUnrated &&
    sortBy === 'recent' &&
    !!featured;

  const listLabel =
    sortBy === 'rating'
      ? 'TOP RATED'
      : sortBy === 'popular'
      ? 'MOST POPULAR'
      : showFeatured
      ? 'RECENT SETS'
      : selectedSubGenre
      ? selectedSubGenre.toUpperCase()
      : selectedMacro !== 'all'
      ? selectedMacro
      : selectedCity !== 'all'
      ? 'SETS IN CITY'
      : 'ALL SETS';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCity('all');
    setSelectedMacro('all');
    setSelectedSubGenre(null);
    setOnlyUnrated(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text}
          />
        }
      >
        {/* Child 0: Header */}
        <View>
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
        </View>

        {/* Child 1: Sticky filter area */}
        <View style={styles.filterArea}>
          <CityFilter selected={selectedCity} onSelect={handleCitySelect} />
          <GenreFilter
            macros={availableGenres}
            selectedMacro={selectedMacro}
            onSelectMacro={handleMacroSelect}
            subGenres={availableSubGenres}
            selectedSubGenre={selectedSubGenre}
            onSelectSubGenre={setSelectedSubGenre}
          />
          <SortBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            onlyUnrated={onlyUnrated}
            onToggleUnrated={() => setOnlyUnrated((v) => !v)}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />
        </View>

        {/* Child 2: Content */}
        <View>
          {showFeatured && (
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

          <SectionHeader
            label={listLabel}
            sublabel={`${events.length} ${events.length === 1 ? 'set' : 'setów'}`}
            decoration="全部"
          />

          {events.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>NO SETS</Text>
              <Text style={styles.emptySubtext}>
                Brak setów dla wybranych filtrów
              </Text>
            </View>
          ) : (
            events
              .filter((e) => !showFeatured || e.id !== featured?.id)
              .map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  isUserAdded={event.id.startsWith('user_')}
                  onPress={() => router.push(`/event/${event.id}`)}
                />
              ))
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              SETLOG / DJ RATING PLATFORM / PL
            </Text>
            <Text style={styles.footerKana}>セットログ</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SortBar({
  sortBy,
  onSortChange,
  onlyUnrated,
  onToggleUnrated,
  hasActiveFilters,
  onClear,
}: {
  sortBy: SortBy;
  onSortChange: (s: SortBy) => void;
  onlyUnrated: boolean;
  onToggleUnrated: () => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <View style={styles.sortBar}>
      <View style={styles.sortGroup}>
        {(['recent', 'rating', 'popular'] as SortBy[]).map((s) => {
          const label =
            s === 'recent' ? 'NEW' : s === 'rating' ? 'TOP' : 'HOT';
          const active = sortBy === s;
          return (
            <Pressable
              key={s}
              style={[styles.sortPill, active && styles.sortPillActive]}
              onPress={() => onSortChange(s)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={`Sortuj: ${label}`}
            >
              <Text
                style={[
                  styles.sortPillText,
                  active && styles.sortPillTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sortRight}>
        <Pressable
          style={[styles.sortPill, onlyUnrated && styles.sortPillActive]}
          onPress={onToggleUnrated}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          accessibilityRole="button"
          accessibilityLabel="Tylko nieocenione"
        >
          <Text
            style={[
              styles.sortPillText,
              onlyUnrated && styles.sortPillTextActive,
            ]}
          >
            ☆ UNRATED
          </Text>
        </Pressable>
        {hasActiveFilters && (
          <Pressable
            style={styles.clearBtn}
            onPress={onClear}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityLabel="Wyczyść filtry"
          >
            <Text style={styles.clearBtnText}>× CLEAR</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },

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
  divider: { height: 1, backgroundColor: theme.colors.border },

  filterArea: { backgroundColor: theme.colors.background },

  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  sortGroup: { flexDirection: 'row', gap: theme.spacing.xs },
  sortRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  sortPill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minHeight: 28,
    justifyContent: 'center',
  },
  sortPillActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  sortPillText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textTertiary,
  },
  sortPillTextActive: { color: theme.colors.white },
  clearBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    minHeight: 28,
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textTertiary,
  },

  empty: { padding: theme.spacing.xxxl, alignItems: 'center' },
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
