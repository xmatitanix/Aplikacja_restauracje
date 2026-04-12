import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  label: string;
  sublabel?: string;
  decoration?: string;
}

export function SectionHeader({ label, sublabel, decoration }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.label}>{label}</Text>
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
      {decoration && (
        <Text style={styles.decoration}>{decoration}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  left: {},
  label: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  sublabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  decoration: {
    fontSize: theme.font.sizes.xl,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.tight,
  },
});
