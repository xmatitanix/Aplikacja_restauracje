import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { formatDate, getCityName, getEventsByDjName } from '../../data/events';

export default function DjProfileScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const djName = typeof name === 'string' ? decodeURIComponent(name) : '';
  const events = getEventsByDjName(djName);

  if (!djName || events.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>DJ NOT FOUND</Text>
          <Text style={styles.notFoundSub}>Brak setów dla tego artysty</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Aggregate stats across all sets
  const ratedSets = events.filter((e) => e.ratingData.count > 0);
  const totalRatings = events.reduce((s, e) => s + e.ratingData.count, 0);
  const avgOverall =
    ratedSets.length > 0
      ? ratedSets.reduce((s, e) => s + e.ratingData.avgOverall * e.ratingData.count, 0) /
        totalRatings
      : 0;

  const cityCounts: Record<string, number> = {};
  events.forEach((e) => {
    cityCounts[e.city] = (cityCounts[e.city] ?? 0) + 1;
  });
  const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const allTags: Record<string, number> = {};
  events.forEach((e) => {
    Object.entries(e.ratingData.tagCounts).forEach(([tag, count]) => {
      allTags[tag] = (allTags[tag] ?? 0) + count;
    });
  });
  const topTags = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  // Sort events by date descending
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const allGenres = Array.from(
    new Set(events.flatMap((e) => e.genres))
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>// PROFIL DJ</Text>
          <Text style={styles.heroName}>{djName}</Text>
          <View style={styles.genreRow}>
            {allGenres.slice(0, 4).map((g) => (
              <Text key={g} style={styles.genreTag}>{g}</Text>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCell
            num={events.length.toString()}
            label={events.length === 1 ? 'SET' : events.length < 5 ? 'SETY' : 'SETÓW'}
          />
          <View style={styles.statsDivider} />
          <StatCell
            num={totalRatings > 0 ? avgOverall.toFixed(1) : '—'}
            label="AVG RATING"
          />
          <View style={styles.statsDivider} />
          <StatCell
            num={totalRatings.toString()}
            label={totalRatings === 1 ? 'OCENA' : totalRatings < 5 ? 'OCENY' : 'OCEN'}
          />
        </View>

        {topCity && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>MIASTO</Text>
            <Text style={styles.infoValue}>{getCityName(topCity as Parameters<typeof getCityName>[0])}</Text>
          </View>
        )}

        {topTags.length > 0 && (
          <View style={styles.tagsBlock}>
            <Text style={styles.tagsLabel}>// VIBE TAGS</Text>
            <View style={styles.tagsRow}>
              {topTags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sets list */}
        <View style={styles.setsHeader}>
          <Text style={styles.setsTitle}>// SETY</Text>
          <Text style={styles.setsCount}>{events.length}</Text>
        </View>

        {sortedEvents.map((event) => {
          const rated = event.ratingData.count > 0;
          return (
            <Pressable
              key={event.id}
              style={({ pressed }) => [styles.setRow, pressed && styles.pressed]}
              onPress={() => router.push(`/event/${event.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Set: ${event.djName} at ${event.venueName}`}
            >
              <View style={styles.setInfo}>
                <Text style={styles.setVenue} numberOfLines={1}>
                  {event.venueName}
                </Text>
                <Text style={styles.setCity}>{getCityName(event.city)}</Text>
                <Text style={styles.setDate}>{formatDate(event.date)}</Text>
              </View>
              <View style={styles.setRight}>
                {rated ? (
                  <>
                    <Text style={styles.setScore}>
                      {event.ratingData.avgOverall.toFixed(1)}
                    </Text>
                    <Text style={styles.setScoreOf}>/5</Text>
                    <Text style={styles.setRatingCount}>
                      {event.ratingData.count} ocen
                    </Text>
                  </>
                ) : (
                  <Text style={styles.setNoRating}>BRAK OCEN</Text>
                )}
              </View>
            </Pressable>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>SETLOG / DJ PROFILE</Text>
          <Text style={styles.footerKana}>プロフィール</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCell({ num, label }: { num: string; label: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },
  pressed: { opacity: 0.7 },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  notFoundText: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },
  notFoundSub: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
  },

  hero: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.borderStrong,
  },
  heroLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.xs,
  },
  heroName: {
    fontSize: 38,
    fontWeight: theme.font.weights.black,
    letterSpacing: -1,
    color: theme.colors.text,
    lineHeight: 44,
    marginBottom: theme.spacing.sm,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  genreTag: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  statsGrid: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: 4,
  },
  statsDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  statNum: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  infoLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  infoValue: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.medium,
    color: theme.colors.text,
  },

  tagsBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  tagsLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  tagChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tagChipText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },

  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  setsTitle: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  setsCount: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },

  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
    minHeight: 64,
  },
  setInfo: { flex: 1, minWidth: 0, gap: 2 },
  setVenue: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    lineHeight: 20,
  },
  setCity: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  setDate: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
  },
  setRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  setScore: {
    fontSize: theme.font.sizes.xxl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 30,
  },
  setScoreOf: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
  },
  setRatingCount: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  setNoRating: {
    fontSize: 10,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
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
