import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { getCityName, formatDate } from '../data/events';
import { DJEvent } from '../types';

interface Props {
  event: DJEvent;
  onPress: () => void;
  variant?: 'default' | 'featured' | 'compact';
  index?: number;
}

export function EventCard({ event, onPress, variant = 'default', index = 0 }: Props) {
  const num = String(index + 1).padStart(3, '0');
  const topTag = getTopTag(event);

  if (variant === 'featured') {
    return (
      <Pressable
        style={({ pressed }) => [styles.featured, pressed && styles.pressed]}
        onPress={onPress}
      >
        <View style={styles.featuredHeader}>
          <Text style={styles.indexLabel}>{num}</Text>
          <Text style={styles.featuredBadge}>FEATURED</Text>
        </View>

        <Text style={styles.featuredDJ}>{event.djName}</Text>
        {event.supportingActs && event.supportingActs.length > 0 && (
          <Text style={styles.supporting}>
            + {event.supportingActs.join(', ')}
          </Text>
        )}

        <View style={styles.separator} />

        <View style={styles.meta}>
          <Text style={styles.metaLabel}>VENUE</Text>
          <Text style={styles.metaValue}>{event.venueName}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaLabel}>CITY</Text>
          <Text style={styles.metaValue}>{getCityName(event.city)}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaLabel}>DATE</Text>
          <Text style={styles.metaValue}>
            {formatDate(event.date)} — {event.startTime}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              {event.ratingData.avgOverall.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>AVG</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{event.ratingData.count}</Text>
            <Text style={styles.statLabel}>RATINGS</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{event.ratingData.wouldReturnPct}%</Text>
            <Text style={styles.statLabel}>RETURN</Text>
          </View>
        </View>

        {topTag && (
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{topTag}</Text>
            </View>
          </View>
        )}

        <View style={styles.genreRow}>
          {event.genres.map((g) => (
            <Text key={g} style={styles.genre}>
              {g}
            </Text>
          ))}
        </View>
      </Pressable>
    );
  }

  if (variant === 'compact') {
    return (
      <Pressable
        style={({ pressed }) => [styles.compact, pressed && styles.pressed]}
        onPress={onPress}
      >
        <Text style={styles.compactIndex}>{num}</Text>
        <View style={styles.compactBody}>
          <Text style={styles.compactDJ}>{event.djName}</Text>
          <Text style={styles.compactVenue}>
            {event.venueName} · {getCityName(event.city)}
          </Text>
        </View>
        <View style={styles.compactRight}>
          <Text style={styles.compactScore}>
            {event.ratingData.avgOverall.toFixed(1)}
          </Text>
          <Text style={styles.compactLabel}>/ 5</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.indexLabel}>{num}</Text>
        <View style={styles.genreRow}>
          {event.genres.slice(0, 2).map((g) => (
            <Text key={g} style={styles.genre}>
              {g}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.djName}>{event.djName}</Text>
      {event.supportingActs && event.supportingActs.length > 0 && (
        <Text style={styles.supporting}>+ {event.supportingActs.join(', ')}</Text>
      )}

      <View style={styles.separator} />

      <View style={styles.cardFooter}>
        <Text style={styles.venue}>
          {event.venueName} · {getCityName(event.city)}
        </Text>
        <View style={styles.scoreBox}>
          <Text style={styles.score}>{event.ratingData.avgOverall.toFixed(1)}</Text>
          <Text style={styles.scoreCount}>{event.ratingData.count} ocen</Text>
        </View>
      </View>
    </Pressable>
  );
}

function getTopTag(event: DJEvent): string | null {
  const entries = Object.entries(event.ratingData.tagCounts);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },

  // Featured
  featured: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featuredBadge: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.surface,
    backgroundColor: theme.colors.text,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  featuredDJ: {
    fontSize: theme.font.sizes.xxxl,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.tight,
    color: theme.colors.text,
    lineHeight: 38,
  },

  // Default card
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  djName: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    letterSpacing: theme.font.letterSpacing.tight,
  },
  venue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  scoreBox: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  scoreCount: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },

  // Compact
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  compactIndex: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
    marginRight: theme.spacing.md,
    fontVariant: ['tabular-nums'],
    width: 28,
  },
  compactBody: { flex: 1 },
  compactDJ: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.text,
  },
  compactVenue: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  compactScore: {
    fontSize: theme.font.sizes.lg,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  compactLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
  },

  // Shared
  indexLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontVariant: ['tabular-nums'],
  },
  supporting: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  metaLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontWeight: theme.font.weights.semibold,
  },
  metaValue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statNum: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontWeight: theme.font.weights.semibold,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  tag: {
    backgroundColor: theme.colors.accentLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textSecondary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  genre: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wide,
  },
});
