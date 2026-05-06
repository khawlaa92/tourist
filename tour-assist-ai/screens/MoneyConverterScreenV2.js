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
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const CURRENCIES = [
  { code: 'TND', label: 'Dinar tunisien', symbol: 'DT', flag: '🇹🇳' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR', flag: '🇪🇺' },
  { code: 'USD', label: 'Dollar US', symbol: 'USD', flag: '🇺🇸' },
  { code: 'GBP', label: 'Livre sterling', symbol: 'GBP', flag: '🇬🇧' },
  { code: 'CAD', label: 'Dollar canadien', symbol: 'CAD', flag: '🇨🇦' },
  { code: 'CHF', label: 'Franc suisse', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'SAR', label: 'Riyal saoudien', symbol: 'SAR', flag: '🇸🇦' },
  { code: 'AED', label: 'Dirham emirati', symbol: 'AED', flag: '🇦🇪' },
  { code: 'TRY', label: 'Livre turque', symbol: 'TRY', flag: '🇹🇷' },
  { code: 'MAD', label: 'Dirham marocain', symbol: 'MAD', flag: '🇲🇦' },
  { code: 'DZD', label: 'Dinar algerien', symbol: 'DZD', flag: '🇩🇿' },
  { code: 'EGP', label: 'Livre egyptienne', symbol: 'EGP', flag: '🇪🇬' },
  { code: 'JPY', label: 'Yen japonais', symbol: 'JPY', flag: '🇯🇵' },
  { code: 'CNY', label: 'Yuan chinois', symbol: 'CNY', flag: '🇨🇳' },
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

  const targetAmount = convertedValues.find(
    (currency) => currency.code === targetCurrency
  )?.value;
  const surfaceColor = isDarkMode ? '#191919' : '#FFFFFF';
  const mutedSurface = isDarkMode ? '#222222' : '#F7F7F7';

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

  const handleSwapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
    setIsSourcePickerOpen(false);
    setIsTargetPickerOpen(false);
  };

  const renderPicker = ({
    isOpen,
    onToggle,
    currentCurrency,
    searchQuery,
    onChangeSearch,
    filteredCurrencies,
    onSelect,
  }) => (
    <>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.85}
        style={[
          styles.selectTrigger,
          {
            backgroundColor: isDarkMode ? '#202020' : '#FAFAFA',
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.triggerMeta}>
          <Text style={[styles.triggerLabel, { color: theme.text }]}>
            {currentCurrency ? `${currentCurrency.flag} ${currentCurrency.label}` : 'Choisir une devise'}
          </Text>
          <Text style={[styles.triggerCode, { color: theme.textSecondary }]}>
            {currentCurrency?.code} - {currentCurrency?.symbol}
          </Text>
        </View>
        <Text style={[styles.triggerArrow, { color: theme.primary }]}>
          {isOpen ? '^' : 'v'}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.pickerPanel,
            {
              backgroundColor: isDarkMode ? '#202020' : '#FFFFFF',
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDarkMode ? '#151515' : '#F7F7F7',
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>
              Search
            </Text>
            <TextInput
              value={searchQuery}
              onChangeText={onChangeSearch}
              placeholder="Rechercher une devise"
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          {!searchQuery.trim() && (
            <View style={styles.listSection}>
              <Text style={[styles.listHeading, { color: theme.text }]}>
                Utilisees recemment
              </Text>
              {recentCurrencies.map((currency) => {
                const isActive = currency.code === currentCurrency?.code;

                return (
                  <TouchableOpacity
                    key={`recent-${currency.code}`}
                    onPress={() => onSelect(currency.code)}
                    style={[
                      styles.listItem,
                      isActive && {
                        backgroundColor: isDarkMode ? '#2C2123' : theme.lightRed,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.listItemText, { color: theme.text }]}>
                      {currency.flag} {currency.label}
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
              {filteredCurrencies.map((currency) => {
                const isActive = currency.code === currentCurrency?.code;

                return (
                  <TouchableOpacity
                    key={currency.code}
                    onPress={() => onSelect(currency.code)}
                    style={[
                      styles.listItem,
                      isActive && {
                        backgroundColor: isDarkMode ? '#2C2123' : theme.lightRed,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.listItemText, { color: theme.text }]}>
                      {currency.flag} {currency.label}
                    </Text>
                    <Text style={[styles.listItemCode, { color: theme.textSecondary }]}>
                      {currency.code}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {filteredCurrencies.length === 0 && (
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
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Transformation d'argent" onPressBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDarkMode ? '#211416' : '#FFF5F6',
              borderColor: isDarkMode ? '#3A2327' : '#F3D7DC',
            },
          ]}
        >
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Money</Text>
          </View>
          <Text style={[styles.mainTitle, { color: theme.text }]}>
            Convertisseur de devises
          </Text>
          <Text style={[styles.mainSubtitle, { color: theme.textSecondary }]}>
            Une interface plus simple pour convertir rapidement votre argent.
          </Text>
        </View>

        <View
          style={[
            styles.mainCard,
            {
              backgroundColor: surfaceColor,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>
            Parametres
          </Text>

          <View style={styles.block}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              De
            </Text>
            {renderPicker({
              isOpen: isSourcePickerOpen,
              onToggle: () => {
                setIsSourcePickerOpen((current) => !current);
                setIsTargetPickerOpen(false);
              },
              currentCurrency: activeCurrency,
              searchQuery: sourceSearchQuery,
              onChangeSearch: setSourceSearchQuery,
              filteredCurrencies: filteredSourceCurrencies,
              onSelect: handleSelectSourceCurrency,
            })}
          </View>

          <TouchableOpacity
            onPress={handleSwapCurrencies}
            activeOpacity={0.85}
            style={[
              styles.swapButton,
              {
                backgroundColor: mutedSurface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.swapText, { color: theme.primary }]}>Swap</Text>
          </TouchableOpacity>

          <View style={styles.block}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Vers
            </Text>
            {renderPicker({
              isOpen: isTargetPickerOpen,
              onToggle: () => {
                setIsTargetPickerOpen((current) => !current);
                setIsSourcePickerOpen(false);
              },
              currentCurrency: selectedTargetCurrency,
              searchQuery: targetSearchQuery,
              onChangeSearch: setTargetSearchQuery,
              filteredCurrencies: filteredTargetCurrencies,
              onSelect: handleSelectTargetCurrency,
            })}
          </View>

          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: mutedSurface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Montant
            </Text>
            <CustomInput
              label={null}
              placeholder="Ex: 100"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9.,]/g, ''))}
              keyboardType="decimal-pad"
              helperText={`Montant en ${activeCurrency?.code || baseCurrency}`}
            />
          </View>

          <View
            style={[
              styles.resultCard,
              {
                backgroundColor: isDarkMode ? '#231719' : '#FFF7F8',
                borderColor: theme.primary,
              },
            ]}
          >
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              Resultat
            </Text>
            <Text style={[styles.resultValue, { color: theme.primary }]}>
              {formatAmount(targetAmount)} {selectedTargetCurrency?.symbol}
            </Text>
            <Text style={[styles.resultMeta, { color: theme.textSecondary }]}>
              {activeCurrency?.flag} {activeCurrency?.code} vers {selectedTargetCurrency?.flag} {selectedTargetCurrency?.code}
            </Text>
          </View>
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
    borderWidth: 1,
    borderRadius: borderRadius.xxl,
    padding: spacings.xl,
    marginBottom: spacings.xl,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C41E3A',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs,
    marginBottom: spacings.md,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  mainCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
    ...shadows.sm,
  },
  mainTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  mainSubtitle: {
    fontSize: fontSizes.md,
    lineHeight: 22,
    marginBottom: spacings.lg,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacings.sm,
  },
  block: {
    marginBottom: spacings.md,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacings.sm,
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
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  pickerPanel: {
    marginTop: spacings.md,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
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
    minHeight: 50,
  },
  searchIcon: {
    fontSize: fontSizes.xs,
    marginRight: spacings.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    marginTop: spacings.xs,
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
    marginBottom: spacings.xs,
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
  swapButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.sm,
    marginBottom: spacings.md,
  },
  swapText: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  amountCard: {
    marginTop: spacings.xs,
    marginBottom: spacings.md,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
  },
  resultCard: {
    borderWidth: 1.5,
    borderRadius: borderRadius.xl,
    padding: spacings.xl,
  },
  resultLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacings.sm,
  },
  resultValue: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  resultMeta: {
    fontSize: fontSizes.sm,
  },
});
