import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventCard } from '../../components/EventCard';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import {
  getMostDivisiveEvents,
  getTopRatedEvents,
  MOCK_EVENTS,
} from '../../data/events';
import { useAchievements } from '../../hooks/useAchievements';
import { useRatings } from '../../hooks/useRatings';

// Static data — computed once, never changes
const topSets = getTopRatedEvents();
const divisive = getMostDivisiveEvents();
const TOTAL_RATINGS = MOCK_EVENTS.reduce((s, e) => s + e.ratingData.count, 0);
const AVG_CONSENSUS = Math.round(
  MOCK_EVENTS.reduce((s, e) => s + e.ratingData.consensusScore, 0) /
    MOCK_EVENTS.length
);

export default function LeaderboardScreen() {
  const router = useRouter();
  const { ratings, getRatedCount } = useRatings();
  const myRatingsArr = Object.values(ratings) as { overall: number; wasPresent: boolean }[];
  const { achievements, earnedIds, ready: achievementsReady } = useAchievements();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll}>

        {/* Hero banner */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroNum}>
              {String(topSets.length).padStart(2, '0')}
            </Text>
            <Text style={styles.heroLabel}>TOP{'\n'}SETS</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>
                {TOTAL_RATINGS.toLocaleString()}
              </Text>
              <Text style={styles.heroStatLabel}>WSZYSTKICH OCEN</Text>
            </View>
            <View style={styles.heroSep} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{AVG_CONSENSUS}%</Text>
              <Text style={styles.heroStatLabel}>ŚR. ZGODNOŚĆ</Text>
            </View>
            <View style={styles.heroSep} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{getRatedCount()}</Text>
              <Text style={styles.heroStatLabel}>TWOJE OCENY</Text>
            </View>
          </View>
        </View>

        {/* Interesting fact banner */}
        <View style={styles.factBanner}>
          <Text style={styles.factBannerLabel}>// CZY WIESZ, ŻE</Text>
          <Text style={styles.factBannerText}>
            Badania pokazują, że 73% słuchaczy nie rozpoznaje złego miksu,
            jeśli track selection jest dobry. Twoje tagi mają większe
            znaczenie niż myślisz.
          </Text>
        </View>

        {/* Top Rated */}
        <SectionHeader
          label="NAJWYŻEJ OCENIANE"
          sublabel={`Min. 200 ocen · ${topSets.length} pozycji`}
          decoration="最高"
        />
        {topSets.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            variant="compact"
            index={i}
            onPress={() => router.push(`/event/${event.id}`)}
          />
        ))}

        {/* Most Divisive */}
        <SectionHeader
          label="KONTROWERSYJNE"
          sublabel="Najniższy wynik zgodności"
          decoration="論争"
        />
        <View style={styles.divisiveNote}>
          <Text style={styles.divisiveText}>
            Te sety polaryzują — część kocha, część nie rozumie.
            Wynik zgodności mierzy jak bardzo oceniający są ze sobą zgodni.
          </Text>
        </View>
        {divisive.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            index={i}
            onPress={() => router.push(`/event/${event.id}`)}
          />
        ))}

        {/* Your stats */}
        {getRatedCount() > 0 && (
          <>
            <SectionHeader
              label="TWOJA AKTYWNOŚĆ"
              sublabel="Twoje oceny"
              decoration="自分"
            />
            <View style={styles.yourStats}>
              <YourRow label="OCENIONYCH SETÓW" value={getRatedCount().toString()} />
              <YourRow
                label="BYŁEŚ NA ŻYWO"
                value={myRatingsArr.filter((r) => r.wasPresent).length.toString()}
              />
              <YourRow
                label="TWOJA ŚREDNIA"
                value={
                  myRatingsArr.length > 0
                    ? (
                        myRatingsArr.reduce((s, r) => s + r.overall, 0) /
                        myRatingsArr.length
                      ).toFixed(1)
                    : '—'
                }
                last
              />
            </View>
          </>
        )}

        {/* Achievements */}
        {achievementsReady && (
          <>
            <SectionHeader
              label="ODZNAKI"
              sublabel={`${earnedIds.size} / ${achievements.length} odblokowane`}
              decoration="勲章"
            />
            <View style={styles.badgeGrid}>
              {achievements.map((a) => {
                const earned = earnedIds.has(a.id);
                return (
                  <View
                    key={a.id}
                    style={[styles.badge, earned && styles.badgeEarned]}
                  >
                    <Text style={styles.badgeEmoji}>{earned ? a.emoji : '🔒'}</Text>
                    <Text
                      style={[styles.badgeName, !earned && styles.badgeNameLocked]}
                      numberOfLines={2}
                    >
                      {a.name}
                    </Text>
                    <Text style={styles.badgeDesc} numberOfLines={2}>
                      {a.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function YourRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.yourRow, last && styles.yourRowLast]}>
      <Text style={styles.yourLabel}>{label}</Text>
      <Text style={styles.yourValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },

  // Hero
  hero: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
  },
  heroLeft: {
    padding: theme.spacing.lg,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    minWidth: 100,
  },
  heroNum: {
    fontSize: 52,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 56,
  },
  heroLabel: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
    lineHeight: 20,
  },
  heroRight: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  heroStat: {},
  heroStatNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  heroStatLabel: {
    fontSize: 11,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    lineHeight: 15,
  },
  heroSep: {
    height: 1,
    backgroundColor: theme.colors.border,
  },

  // Fact banner
  factBanner: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.text,
  },
  factBannerLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.font.weights.semibold,
  },
  factBannerText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.white,
    lineHeight: 22,
  },

  // Divisive
  divisiveNote: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
  },
  divisiveText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Your stats
  yourStats: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  yourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  yourRowLast: {
    borderBottomWidth: 0,
  },
  yourLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    flexShrink: 1,
  },
  yourValue: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    flexShrink: 0,
  },

  footer: { height: theme.spacing.xxxl },

  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  badge: {
    width: '33.33%',
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    opacity: 0.3,
    minHeight: 96,
    justifyContent: 'center',
  },
  badgeEarned: {
    opacity: 1,
  },
  badgeEmoji: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  badgeNameLocked: {
    color: theme.colors.textTertiary,
  },
  badgeDesc: {
    fontSize: 9,
    color: theme.colors.textTertiary,
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 13,
    marginTop: 2,
  },
});
