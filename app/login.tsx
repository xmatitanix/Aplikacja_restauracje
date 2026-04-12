import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { theme } from '../constants/theme';

type Mode = 'login' | 'register';

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Nieprawidłowy email lub hasło.';
  if (msg.includes('Email not confirmed')) return 'Potwierdź adres email przed logowaniem.';
  if (msg.includes('User already registered')) return 'Ten email jest już zarejestrowany.';
  if (msg.includes('Password should be')) return 'Hasło musi mieć minimum 6 znaków.';
  if (msg.includes('Unable to validate')) return 'Nieprawidłowy email lub hasło.';
  return 'Coś poszło nie tak — spróbuj ponownie.';
}

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const canSubmit = email.includes('@') && password.length >= 6 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      setLoading(false);
      if (err) {
        setError(translateError(err.message));
      } else {
        router.replace('/(tabs)');
      }
    } else {
      const { error: err } = await signUp(email, password);
      if (err) {
        setError(translateError(err.message));
        setLoading(false);
      } else {
        setRegistered(true);
        setLoading(false);
      }
    }
  }

  function switchMode() {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError(null);
  }

  if (registered) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successBox}>
          <Text style={styles.successKana}>確認</Text>
          <Text style={styles.successTitle}>SPRAWDŹ EMAIL</Text>
          <Text style={styles.successSub}>
            Wysłaliśmy link potwierdzający na{'\n'}
            <Text style={styles.successEmail}>{email}</Text>
            {'\n\n'}Kliknij go, a potem wróć i zaloguj się.
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => { setRegistered(false); setMode('login'); }}
          >
            <Text style={styles.btnText}>ZALOGUJ SIĘ</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.kana}>認証</Text>
            <Text style={styles.title}>
              {mode === 'login' ? 'ZALOGUJ SIĘ' : 'NOWE KONTO'}
            </Text>
            <Text style={styles.sub}>
              {mode === 'login'
                ? 'Twoje oceny są synchronizowane między urządzeniami.'
                : 'Jeden account = jedna ocena na set. Uczciwie.'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="twoj@email.com"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>HASŁO</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="min. 6 znaków"
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                !canSubmit && styles.btnDisabled,
                pressed && styles.btnPressed,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={[styles.btnText, !canSubmit && styles.btnTextDisabled]}>
                {loading
                  ? '...'
                  : mode === 'login'
                  ? 'ZALOGUJ SIĘ'
                  : 'UTWÓRZ KONTO'}
              </Text>
            </Pressable>

            <Pressable style={styles.switchBtn} onPress={switchMode}>
              <Text style={styles.switchText}>
                {mode === 'login'
                  ? 'Nie masz konta? → Zarejestruj się'
                  : 'Masz już konto? → Zaloguj się'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              // Nie wysyłamy spamu. Email służy wyłącznie do logowania.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxxl },

  header: {
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.borderStrong,
    marginBottom: theme.spacing.lg,
  },
  kana: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
    lineHeight: 36,
    marginBottom: theme.spacing.sm,
  },
  sub: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  form: { gap: theme.spacing.md },

  field: { gap: theme.spacing.xs },
  fieldLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    minHeight: 48,
  },

  errorBox: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: '#E53E3E',
    padding: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.font.sizes.sm,
    color: '#E53E3E',
    lineHeight: 20,
  },

  btn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  btnDisabled: { backgroundColor: theme.colors.border },
  btnPressed: { opacity: 0.8 },
  btnText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  btnTextDisabled: { color: theme.colors.textTertiary },

  switchBtn: { alignItems: 'center', paddingVertical: theme.spacing.md },
  switchText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },

  note: {
    marginTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  noteText: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Success state
  successBox: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  successKana: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.text,
  },
  successSub: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 26,
  },
  successEmail: {
    color: theme.colors.text,
    fontWeight: theme.font.weights.bold,
  },
});
