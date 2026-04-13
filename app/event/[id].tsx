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
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import { formatDate, getCityName, getEventById } from '../../data/events';
import { useDjNotes } from '../../hooks/useDjNotes';
import { useRatings } from '../../hooks/useRatings';
import { useSupportRatings } from '../../hooks/useSupportRatings';
import { isValidEventId } from '../../types';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { hasRated, getRating } = useRatings();
  const { hasRated: hasSupportRated, getRating: getSupportRating } = useSupportRatings();
  const { notes: djNotes, myNote: myDjNote } = useDjNotes(id ?? '');

  // Validate param
  if (!isValidEventId(id)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>INVALID SET ID</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.heroIndex}>SET</Text>
            <View style={styles.genreRow}>
              {event.genres.map((g) => (
                <Text key={g} style={styles.genre} numberOfLines={1}>
                  {g}
                </Text>
              ))}
            </View>
          </View>

          <Text style={styles.djName} numberOfLines={2}>{event.djName}</Text>
          {event.supportingActs && event.supportingActs.length > 0 && (
            <Text style={styles.supporting} numberOfLines={1}>
              + {event.supportingActs.join(', ')}
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoBlock}>
          <InfoRow label="VENUE" value={event.venueName} />
          <InfoRow label="CITY" value={getCityName(event.city)} />
          <Pressable
            style={({ pressed }) => [styles.djProfileRow, pressed && styles.pressed]}
            onPress={() => router.push(`/dj/${encodeURIComponent(event.djName)}`)}
            accessibilityRole="link"
            accessibilityLabel={`Profil DJ: ${event.djName}`}
          >
            <Text style={styles.djProfileLabel}>DJ PROFIL</Text>
            <Text style={styles.djProfileArrow}>→</Text>
          </Pressable>
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
            <Text style={styles.descText} numberOfLines={6}>{event.description}</Text>
          </View>
        )}

        {/* Support acts section */}
        {event.supportingActs && event.supportingActs.length > 0 && (
          <View style={styles.supportBlock}>
            <Text style={styles.supportHeader}>// SUPPORT ACTS</Text>
            <Text style={styles.supportHint}>
              Oceń support niezależnie od głównego setu
            </Text>
            {event.supportingActs.map((act) => {
              const supportRated = hasSupportRated(event.id, act);
              const supportRating = supportRated
                ? getSupportRating(event.id, act)
                : undefined;
              return (
                <View key={act} style={styles.supportRow}>
                  <View style={styles.supportInfo}>
                    <Text style={styles.supportBadge}>SUPPORT</Text>
                    <Text style={styles.supportName} numberOfLines={1}>{act}</Text>
                    {supportRated && supportRating && (
                      <Text style={styles.supportMyScore}>
                        Twoja ocena: {supportRating.overall}/5
                      </Text>
                    )}
                  </View>
                  {supportRated ? (
                    <View style={styles.supportRatedBadge}>
                      <Text style={styles.supportRatedText}>✓ RATED</Text>
                    </View>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.supportRateBtn,
                        pressed && styles.pressed,
                      ]}
                      onPress={() =>
                        router.push(
                          `/rate-support/${event.id}?act=${encodeURIComponent(act)}`
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Oceń support: ${act}`}
                    >
                      <Text style={styles.supportRateBtnText}>OCEŃ SUPPORT</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
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
                {myRating.wasPresent ? '· BYŁEM/BYŁAM' : '· ONLINE'}
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

        {/* DJ Notes — only visible when there are notes */}
        {djNotes.length > 0 && (
          <View style={styles.djNotesBlock}>
            <Text style={styles.djNotesTitle}>// DJ NOTATKI</Text>
            {djNotes.map((note) => {
              const isOwn = user?.id === note.user_id;
              return (
                <View key={note.id} style={[styles.djNote, isOwn && styles.djNoteOwn]}>
                  <View style={styles.djNoteTop}>
                    <Text style={styles.djNoteAuthor}>{note.author_name}</Text>
                    {isOwn && (
                      <Pressable
                        onPress={() => router.push(`/dj-note/${event.id}`)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.djNoteEditText}>EDYTUJ</Text>
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.djNoteContent}>{note.content}</Text>
                  <Text style={styles.djNoteDate}>
                    {new Date(note.updated_at).toLocaleDateString('pl-PL', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Subtle DJ note CTA — only for logged-in users without a note */}
        {user && !myDjNote && (
          <Pressable
            style={({ pressed }) => [styles.djNoteAddLink, pressed && styles.pressed]}
            onPress={() => router.push(`/dj-note/${event.id}`)}
          >
            <Text style={styles.djNoteAddLinkText}>
              Jesteś DJ-em tego setu? Zostaw notatkę →
            </Text>
          </Pressable>
        )}

        {/* Rating data */}
        <View style={styles.ratingsHeader}>
          <Text style={styles.ratingsTitle}>COMMUNITY RATINGS</Text>
          <Text style={styles.ratingsCount}>
            {event.ratingData.count} ocen
          </Text>
        </View>

        <RatingDisplay data={event.ratingData} />

      </ScrollView>

      {/* Pinned CTA — always visible */}
      <View style={styles.stickyBottom}>
        {rated ? (
          <View style={styles.ratedBox}>
            <Text style={styles.ratedText}>✓ OCENIŁEŚ/AŚ TEN SET</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaPressed]}
            onPress={() => user ? router.push(`/rate/${event.id}`) : router.push('/login')}
            accessibilityRole="button"
            accessibilityLabel="Oceń ten set"
          >
            <Text style={styles.ctaBtnText}>OCEŃ TEN SET</Text>
            <Text style={styles.ctaKana}>評価する</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.md },
  pressed: { opacity: 0.7 },

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
  genreRow: { flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' },
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
    lineHeight: 46,
  },
  supporting: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
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
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weights.medium,
    flex: 1,
    textAlign: 'right',
    lineHeight: 18,
  },

  // DJ profile row
  djProfileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  djProfileLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  djProfileArrow: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textSecondary,
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

  // Support acts
  supportBlock: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingTop: theme.spacing.md,
  },
  supportHeader: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  supportHint: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
    minHeight: 56,
  },
  supportInfo: { flex: 1, minWidth: 0 },
  supportBadge: {
    fontSize: 10,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  supportName: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    lineHeight: 20,
  },
  supportMyScore: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  supportRateBtn: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexShrink: 0,
    minHeight: 44,
    justifyContent: 'center',
  },
  supportRateBtnText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.text,
  },
  supportRatedBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.accentLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexShrink: 0,
  },
  supportRatedText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
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
    overflow: 'hidden',
  },

  // DJ Notes
  djNotesBlock: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  djNotesTitle: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  djNote: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  djNoteOwn: {
    backgroundColor: theme.colors.accentLight,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.text,
  },
  djNoteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  djNoteAuthor: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.text,
  },
  djNoteEditText: {
    fontSize: 10,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textSecondary,
  },
  djNoteContent: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  djNoteDate: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  djNoteAddLink: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  djNoteAddLinkText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
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
    gap: theme.spacing.md,
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

  // Pinned CTA
  stickyBottom: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  ctaBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 56,
    justifyContent: 'center',
  },
  ctaPressed: { opacity: 0.7 },
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
