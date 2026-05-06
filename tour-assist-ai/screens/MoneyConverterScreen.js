import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { CustomInput } from '../src/components/CustomInput';
import { spacings, fontSizes, borderRadius } from '../constants/theme';

const CURRENCIES = [
  { code: 'TND', label: 'Dinar tunisien', symbol: 'DT' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR' },
  { code: 'USD', label: 'Dollar US', symbol: 'USD' },
  { code: 'GBP', label: 'Livre sterling', symbol: 'GBP' },
  { code: 'CAD', label: 'Dollar canadien', symbol: 'CAD' },
  { code: 'CHF', label: 'Franc suisse', symbol: 'CHF' },
  { code: 'SAR', label: 'Riyal saoudien', symbol: 'SAR' },
  { code: 'AED', label: 'Dirham emirati', symbol: 'AED' },
  { code: 'TRY', label: 'Livre turque', symbol: 'TRY' },
  { code: 'MAD', label: 'Dirham marocain', symbol: 'MAD' },
  { code: 'DZD', label: 'Dinar algerien', symbol: 'DZD' },
  { code: 'EGP', label: 'Livre egyptienne', symbol: 'EGP' },
  { code: 'JPY', label: 'Yen japonais', symbol: 'JPY' },
  { code: 'CNY', label: 'Yuan chinois', symbol: 'CNY' },
];

const BASE_RATES = {
  TND: 1,
  EUR: 3.4,
  USD: 3.1,
  GBP: 3.95,
  CAD: 2.25,
  CHF: 3.55,
  SAR: 0.83,
  AED: 0.84,
  TRY: 0.08,
  MAD: 0.31,
  DZD: 0.023,
  EGP: 0.063,
  JPY: 0.021,
  CNY: 0.43,
};

const RECENT_CODES = ['TND', 'EUR', 'USD', 'GBP'];

const formatAmount = (value) => {
  if (!Number.isFinite(value)) return '--';
  return value.toFixed(2);
};

export const MoneyConverterScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [baseCurrency, setBaseCurrency] = useState('TND');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [sourceSearchQuery, setSourceSearchQuery] = useState('');
  const [targetSearchQuery, setTargetSearchQuery] = useState('');
  const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
  const [isTargetPickerOpen, setIsTargetPickerOpen] = useState(false);

  const parsedAmount = Number.parseFloat(amount.replace(',', '.'));

  const activeCurrency = CURRENCIES.find((currency) => currency.code === baseCurrency);
  const selectedTargetCurrency = CURRENCIES.find((currency) => currency.code === targetCurrency);

  const recentCurrencies = useMemo(
    () => CURRENCIES.filter((currency) => RECENT_CODES.includes(currency.code)),
    []
  );

  const filterCurrencies = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return CURRENCIES;
    }

    return CURRENCIES.filter((currency) => (
      currency.code.toLowerCase().includes(normalizedQuery)
      || currency.label.toLowerCase().includes(normalizedQuery)
      || currency.symbol.toLowerCase().includes(normalizedQuery)
    ));
  };

  const filteredSourceCurrencies = useMemo(
    () => filterCurrencies(sourceSearchQuery),
    [sourceSearchQuery]
  );

  const filteredTargetCurrencies = useMemo(
    () => filterCurrencies(targetSearchQuery),
    [targetSearchQuery]
  );

  const convertedValues = useMemo(() => {
    if (!Number.isFinite(parsedAmount)) {
      return CURRENCIES.map((currency) => ({
        ...currency,
        value: null,
      }));
    }

    const amountInTnd = parsedAmount * BASE_RATES[baseCurrency];

    return CURRENCIES.map((currency) => ({
      ...currency,
      value: amountInTnd / BASE_RATES[currency.code],
    }));
  }, [baseCurrency, parsedAmount]);

  const handleSelectSourceCurrency = (currencyCode) => {
    setBaseCurrency(currencyCode);
    setIsSourcePickerOpen(false);
    setSourceSearchQuery('');
  };

  const handleSelectTargetCurrency = (currencyCode) => {
    setTargetCurrency(currencyCode);
    setIsTargetPickerOpen(false);
    setTargetSearchQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Transformation d'argent" onPressBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.heroTitle}>Convertisseur de devises</Text>
          <Text style={styles.heroText}>
            Ecrivez un montant et regardez sa valeur en dinar tunisien, euro
            et dollar.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choisir la devise de depart
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsSourcePickerOpen((current) => !current);
              setIsTargetPickerOpen(false);
            }}
            activeOpacity={0.85}
            style={[
              styles.selectTrigger,
              {
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.triggerMeta}>
              <Text style={[styles.triggerLabel, { color: theme.text }]}>
                {activeCurrency?.label || 'Choisir une devise'}
              </Text>
              <Text style={[styles.triggerCode, { color: theme.textSecondary }]}>
                {activeCurrency?.code} · {activeCurrency?.symbol}
              </Text>
            </View>
            <Text style={[styles.triggerArrow, { color: theme.textSecondary }]}>
              {isSourcePickerOpen ? '▴' : '▾'}
            </Text>
          </TouchableOpacity>

          {isSourcePickerOpen && (
            <View
              style={[
                styles.pickerPanel,
                {
                  backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDarkMode ? '#161616' : '#F8F8F8',
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>
                  🔎
                </Text>
                <TextInput
                  value={sourceSearchQuery}
                  onChangeText={setSourceSearchQuery}
                  placeholder="Rechercher une devise"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.searchInput, { color: theme.text }]}
                />
              </View>

              {!sourceSearchQuery.trim() && (
                <View style={styles.listSection}>
                  <Text style={[styles.listHeading, { color: theme.text }]}>
                    Utilisees recemment
                  </Text>
                  {recentCurrencies.map((currency) => {
                    const isActive = currency.code === baseCurrency;

                    return (
                      <TouchableOpacity
                        key={`recent-${currency.code}`}
                        onPress={() => handleSelectSourceCurrency(currency.code)}
                        style={[
                          styles.listItem,
                          isActive && { backgroundColor: isDarkMode ? '#2A2A2A' : '#ECECEC' },
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.listItemText, { color: theme.text }]}>
                          {currency.label}
                        </Text>
                        <Text style={[styles.listItemCode, { color: theme.textSecondary }]}>
                          {currency.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={styles.listSection}>
                <Text style={[styles.listHeading, { color: theme.text }]}>
                  Toutes les devises
                </Text>

                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  style={styles.resultsScroll}
                >
                  {filteredSourceCurrencies.map((currency) => {
                    const isActive = currency.code === baseCurrency;

                    return (
                      <TouchableOpacity
                        key={currency.code}
                        onPress={() => handleSelectSourceCurrency(currency.code)}
                        style={[
                          styles.listItem,
                          isActive && { backgroundColor: isDarkMode ? '#3A3A3A' : '#DCDCDC' },
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.listItemText, { color: theme.text }]}>
                          {currency.label}
                        </Text>
                        <Text style={[styles.listItemCode, { color: theme.textSecondary }]}>
                          {currency.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {filteredSourceCurrencies.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                        Aucune devise trouvee.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choisir la devise du resultat
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsTargetPickerOpen((current) => !current);
              setIsSourcePickerOpen(false);
            }}
            activeOpacity={0.85}
            style={[
              styles.selectTrigger,
              {
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.triggerMeta}>
              <Text style={[styles.triggerLabel, { color: theme.text }]}>
                {selectedTargetCurrency?.label || 'Choisir une devise'}
              </Text>
              <Text style={[styles.triggerCode, { color: theme.textSecondary }]}>
                {selectedTargetCurrency?.code} · {selectedTargetCurrency?.symbol}
              </Text>
            </View>
            <Text style={[styles.triggerArrow, { color: theme.textSecondary }]}>
              {isTargetPickerOpen ? '▴' : '▾'}
            </Text>
          </TouchableOpacity>

          {isTargetPickerOpen && (
            <View
              style={[
                styles.pickerPanel,
                {
                  backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDarkMode ? '#161616' : '#F8F8F8',
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>
                  🔎
                </Text>
                <TextInput
                  value={targetSearchQuery}
                  onChangeText={setTargetSearchQuery}
                  placeholder="Rechercher une devise"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.searchInput, { color: theme.text }]}
                />
              </View>

              {!targetSearchQuery.trim() && (
                <View style={styles.listSection}>
                  <Text style={[styles.listHeading, { color: theme.text }]}>
                    Utilisees recemment
                  </Text>
                  {recentCurrencies.map((currency) => {
                    const isActive = currency.code === targetCurrency;

                    return (
                      <TouchableOpacity
                        key={`target-recent-${currency.code}`}
                        onPress={() => handleSelectTargetCurrency(currency.code)}
                        style={[
                          styles.listItem,
                          isActive && { backgroundColor: isDarkMode ? '#2A2A2A' : '#ECECEC' },
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.listItemText, { color: theme.text }]}>
                          {currency.label}
                        </Text>
                        <Text style={[styles.listItemCode, { color: theme.textSecondary }]}>
                          {currency.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={styles.listSection}>
                <Text style={[styles.listHeading, { color: theme.text }]}>
                  Toutes les devises
                </Text>

                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  style={styles.resultsScroll}
                >
                  {filteredTargetCurrencies.map((currency) => {
                    const isActive = currency.code === targetCurrency;

                    return (
                      <TouchableOpacity
                        key={`target-${currency.code}`}
                        onPress={() => handleSelectTargetCurrency(currency.code)}
                        style={[
                          styles.listItem,
                          isActive && { backgroundColor: isDarkMode ? '#3A3A3A' : '#DCDCDC' },
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.listItemText, { color: theme.text }]}>
                          {currency.label}
                        </Text>
                        <Text style={[styles.listItemCode, { color: theme.textSecondary }]}>
                          {currency.code}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {filteredTargetCurrencies.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                        Aucune devise trouvee.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <CustomInput
            label={`Montant en ${activeCurrency?.label || baseCurrency}`}
            placeholder="Ex: 100"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.,]/g, ''))}
            keyboardType="decimal-pad"
            helperText="Saisissez un montant dans la devise choisie."
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Resultat
          </Text>

          <View
            style={[
              styles.primaryResultCard,
              {
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                borderColor: theme.primary,
              },
            ]}
          >
            <Text style={[styles.primaryResultLabel, { color: theme.textSecondary }]}>
              {activeCurrency?.code} vers {selectedTargetCurrency?.code}
            </Text>
            <Text style={[styles.primaryResultValue, { color: theme.primary }]}>
              {formatAmount(convertedValues.find((currency) => currency.code === targetCurrency)?.value)} {selectedTargetCurrency?.symbol}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF8E8',
              borderColor: '#F0C040',
            },
          ]}
        >
          <Text style={styles.infoTitle}>Taux utilises</Text>
          <Text style={styles.infoText}>
            Les taux affiches sont indicatifs pour aider le voyageur. Vous
            pouvez maintenant convertir le dinar tunisien avec plusieurs
            devises internationales en une seule page.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacings.lg,
    paddingBottom: spacings.xl * 5,
  },
  heroCard: {
    borderRadius: borderRadius.xl,
    padding: spacings.xl,
    marginBottom: spacings.xl,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  heroText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacings.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacings.md,
  },
  selectTrigger: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerMeta: {
    flex: 1,
    paddingRight: spacings.md,
  },
  triggerLabel: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  triggerCode: {
    fontSize: fontSizes.sm,
  },
  triggerArrow: {
    fontSize: 18,
  },
  pickerPanel: {
    marginTop: spacings.md,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacings.md,
    maxHeight: 420,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacings.md,
    marginBottom: spacings.md,
  },
  searchIcon: {
    fontSize: fontSizes.md,
    marginRight: spacings.sm,
  },
  searchInput: {
    flex: 1,
    minHeight: 48,
    fontSize: fontSizes.md,
  },
  listSection: {
    marginTop: spacings.sm,
  },
  listHeading: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  resultsScroll: {
    maxHeight: 220,
  },
  listItem: {
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemText: {
    flex: 1,
    fontSize: fontSizes.md,
  },
  listItemCode: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    marginLeft: spacings.md,
  },
  emptyState: {
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: fontSizes.sm,
  },
  primaryResultCard: {
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
    marginBottom: spacings.md,
  },
  primaryResultLabel: {
    fontSize: fontSizes.sm,
    marginBottom: spacings.sm,
    fontWeight: '600',
  },
  primaryResultValue: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
  },
  infoTitle: {
    color: '#9A6700',
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  infoText: {
    color: '#856404',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
});
