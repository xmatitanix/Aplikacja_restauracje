import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RatingDisplay } from '../../components/RatingDisplay';
import { theme } from '../../constants/theme';
import { formatDate, getCityName, getEventById } from '../../data/events';
import { useRatings } from '../../hooks/useRatings';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hasRated, getRating } = useRatings();
  const event = getEventById(id);

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>SET NOT FOUND</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rated = hasRated(event.id);
  const myRating = rated ? getRating(event.id) : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroIndex}>SET</Text>
            <View style={styles.genreRow}>
              {event.genres.map((g) => (
                <Text key={g} style={styles.genre}>
                  {g}
                </Text>
              ))}
            </View>
          </View>

          <Text style={styles.djName}>{event.djName}</Text>
          {event.supportingActs && event.supportingActs.length > 0 && (
            <Text style={styles.supporting}>
              + {event.supportingActs.join(', ')}
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoBlock}>
          <InfoRow label="VENUE" value={event.venueName} />
          <InfoRow label="CITY" value={getCityName(event.city)} />
          <InfoRow
            label="DATE"
            value={`${formatDate(event.date)} · ${event.startTime}${
              event.endTime ? ` → ${event.endTime}` : ''
            }`}
          />
          {event.venueAddress && (
            <InfoRow label="ADDRESS" value={event.venueAddress} />
          )}
        </View>

        {event.description && (
          <View style={styles.descBlock}>
            <Text style={styles.descLabel}>// OPIS</Text>
            <Text style={styles.descText}>{event.description}</Text>
          </View>
        )}

        {/* My rating badge */}
        {rated && myRating && (
          <View style={styles.myRatingBanner}>
            <Text style={styles.myRatingLabel}>TWOJA OCENA</Text>
            <View style={styles.myRatingRow}>
              <Text style={styles.myRatingScore}>{myRating.overall}</Text>
              <Text style={styles.myRatingOf}>/5</Text>
              <Text style={styles.myRatingPresent}>
                {myRating.wasPresent ? '· BYŁEM/AM' : '· ONLINE'}
              </Text>
            </View>
            {myRating.tags.length > 0 && (
              <View style={styles.myTags}>
                {myRating.tags.map((t) => (
                  <Text key={t} style={styles.myTag}>{t}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Rating data */}
        <View style={styles.ratingsHeader}>
          <Text style={styles.ratingsTitle}>COMMUNITY RATINGS</Text>
          <Text style={styles.ratingsCount}>
            {event.ratingData.count} ocen
          </Text>
        </View>

        <RatingDisplay data={event.ratingData} />

        {/* CTA */}
        <View style={styles.ctaContainer}>
          {rated ? (
            <View style={styles.ratedBox}>
              <Text style={styles.ratedText}>✓ OCENIŁEŚ/AŚ TEN SET</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaPressed]}
              onPress={() => router.push(`/rate/${event.id}`)}
            >
              <Text style={styles.ctaBtnText}>OCEŃ TEN SET</Text>
              <Text style={styles.ctaKana}>評価する</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },

  // Hero
  hero: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderStrong,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroIndex: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
  },
  genreRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genre: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  djName: {
    fontSize: 40,
    fontWeight: theme.font.weights.black,
    letterSpacing: -1,
    color: theme.colors.text,
    lineHeight: 44,
  },
  supporting: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  // Info block
  infoBlock: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  infoValue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weights.medium,
    flex: 1,
    textAlign: 'right',
  },

  // Description
  descBlock: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  descLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.sm,
  },
  descText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // My rating
  myRatingBanner: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  myRatingLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.bold,
    marginBottom: theme.spacing.sm,
  },
  myRatingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  myRatingScore: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  myRatingOf: {
    fontSize: theme.font.sizes.lg,
    color: theme.colors.textTertiary,
    marginBottom: 4,
  },
  myRatingPresent: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  myTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  myTag: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.accentLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Ratings section
  ratingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
  },
  ratingsTitle: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  ratingsCount: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },

  // CTA
  ctaContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
    marginTop: theme.spacing.sm,
  },
  ctaBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ctaPressed: {
    opacity: 0.7,
  },
  ctaBtnText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  ctaKana: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  ratedBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
  },
  ratedText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
  },
});
