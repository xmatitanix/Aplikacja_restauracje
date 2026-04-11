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
import { useRatings } from '../../hooks/useRatings';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { ratings, getRatedCount } = useRatings();
  const topSets = getTopRatedEvents();
  const divisive = getMostDivisiveEvents();

  const totalRatings = MOCK_EVENTS.reduce(
    (s, e) => s + e.ratingData.count,
    0
  );
  const avgConsensus = Math.round(
    MOCK_EVENTS.reduce((s, e) => s + e.ratingData.consensusScore, 0) /
      MOCK_EVENTS.length
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll}>
        {/* Global Stats */}
        <View style={styles.globalStats}>
          <Text style={styles.globalTitle}>PLATFORM STATS</Text>
          <View style={styles.statsGrid}>
            <StatBlock num={MOCK_EVENTS.length.toString()} label="TOTAL SETS" />
            <StatBlock num={totalRatings.toLocaleString()} label="RATINGS" />
            <StatBlock num={`${avgConsensus}%`} label="AVG CONSENSUS" />
            <StatBlock num={getRatedCount().toString()} label="YOU RATED" />
          </View>
        </View>

        {/* Interesting fact */}
        <View style={styles.factBanner}>
          <Text style={styles.factBannerLabel}>// DID YOU KNOW</Text>
          <Text style={styles.factBannerText}>
            Badania pokazują, że 73% słuchaczy nie jest w stanie rozpoznać złego
            mixu, jeśli track selection jest dobry. Twoje tagi "tight transitions"
            mają więc większe znaczenie niż myślisz.
          </Text>
        </View>

        {/* Top Rated */}
        <SectionHeader
          label="TOP RATED SETS"
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
          label="MOST DIVISIVE"
          sublabel="Najniższy consensus score"
          decoration="論争"
        />
        <View style={styles.divisiveNote}>
          <Text style={styles.divisiveText}>
            Te sety polaryzują najbardziej — część kocha, część nie rozumie.
            Consensus score to miara zgodności oceniających.
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

        {/* Your stats if rated */}
        {getRatedCount() > 0 && (
          <>
            <SectionHeader
              label="YOUR ACTIVITY"
              sublabel="Twoje oceny"
              decoration="自分"
            />
            <View style={styles.yourStats}>
              <View style={styles.yourRow}>
                <Text style={styles.yourLabel}>SETS RATED</Text>
                <Text style={styles.yourValue}>{getRatedCount()}</Text>
              </View>
              <View style={styles.yourRow}>
                <Text style={styles.yourLabel}>PRESENT AT SHOW</Text>
                <Text style={styles.yourValue}>
                  {
                    Object.values(ratings).filter((r) => r.wasPresent).length
                  }
                </Text>
              </View>
              <View style={styles.yourRow}>
                <Text style={styles.yourLabel}>AVG YOUR RATING</Text>
                <Text style={styles.yourValue}>
                  {Object.values(ratings).length > 0
                    ? (
                        Object.values(ratings).reduce(
                          (s, r) => s + r.overall,
                          0
                        ) / Object.values(ratings).length
                      ).toFixed(1)
                    : '—'}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerDeco}>TOP SETS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ num, label }: { num: string; label: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  globalStats: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  globalTitle: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  statNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 15,
  },
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
    lineHeight: 20,
  },
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  yourLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  yourValue: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  footerDeco: {
    fontSize: theme.font.sizes.display,
    fontWeight: theme.font.weights.black,
    color: theme.colors.textTertiary,
    opacity: 0.08,
    letterSpacing: theme.font.letterSpacing.widest,
  },
});
