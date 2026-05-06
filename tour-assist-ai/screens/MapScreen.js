import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { LocationCard } from '../src/components/LocationCard';
import { spacings, fontSizes } from '../constants/theme';

const EXAMPLE_LOCATIONS = [
  {
    id: 1,
    title: 'Djerba Island',
    description:
      'Famous for its white-washed buildings, beautiful beaches, and rich Jewish heritage.',
    latitude: 33.8869,
    longitude: 10.9375,
    distance: '500 km from Tunis',
  },
  {
    id: 2,
    title: 'Sidi Bou Said',
    description:
      'Charming coastal town known for its blue and white architecture and stunning views.',
    latitude: 36.8665,
    longitude: 10.3618,
    distance: '20 km from Tunis',
  },
  {
    id: 3,
    title: 'Sahara Desert',
    description:
      'Experience the golden dunes, camel trekking, and traditional desert camps.',
    latitude: 33.7731,
    longitude: 8.7898,
    distance: '450 km from Tunis',
  },
  {
    id: 4,
    title: 'Carthage Ruins',
    description:
      'Ancient Roman ruins with breathtaking views of the Mediterranean Sea.',
    latitude: 36.8623,
    longitude: 10.3263,
    distance: '16 km from Tunis',
  },
  {
    id: 5,
    title: 'Medina of Tunis',
    description:
      'Traditional market with intricate alleyways, artisan stalls, and local culture.',
    latitude: 36.7969,
    longitude: 10.1653,
    distance: 'City Center',
  },
];

const TUNISIA_CENTER = {
  latitude: 35.5007,
  longitude: 10.2565,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

export const MapScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <Header
        title="Explore Places"
        onPressBack={() => navigation.goBack()}
      />

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={TUNISIA_CENTER}
          showsMyLocationButton
          showsZoomControls
        >
          {EXAMPLE_LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.title}
              description={location.description}
              onPress={() => setSelectedLocation(location)}
            >
              <View style={[styles.customMarker, {backgroundColor: theme.primary}]}>
                <Text style={styles.markerText}>📍</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Locations List */}
      <View
        style={[
          styles.listContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <Text
          style={[
            styles.listTitle,
            {
              color: theme.text,
              fontSize: fontSizes.lg,
            },
          ]}
        >
          Featured Destinations
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsScroll}
        >
          {EXAMPLE_LOCATIONS.map((location) => (
            <View key={location.id} style={styles.locationCardWrapper}>
              <LocationCard
                title={location.title}
                description={location.description}
                distance={location.distance}
                onPress={() => setSelectedLocation(location)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Selected Location Details */}
      {selectedLocation && (
        <View
          style={[
            styles.detailsContainer,
            {
              backgroundColor: theme.secondary,
              borderTopColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.detailsTitle,
              {
                color: theme.text,
                fontSize: fontSizes.lg,
              },
            ]}
          >
            📍 {selectedLocation.title}
          </Text>
          <Text
            style={[
              styles.detailsDescription,
              {
                color: theme.textSecondary,
                fontSize: fontSizes.md,
              },
            ]}
          >
            {selectedLocation.description}
          </Text>
          <Text
            style={[
              styles.detailsDistance,
              {
                color: theme.primary,
                fontSize: fontSizes.sm,
              },
            ]}
          >
            {selectedLocation.distance}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: '40%',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
  },
  listContainer: {
    paddingVertical: spacings.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listTitle: {
    fontWeight: 'bold',
    marginHorizontal: spacings.lg,
    marginBottom: spacings.md,
  },
  locationsScroll: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.md,
  },
  locationCardWrapper: {
    marginRight: spacings.lg,
    width: 280,
  },
  detailsContainer: {
    padding: spacings.lg,
    borderTopWidth: 1,
    maxHeight: '25%',
  },
  detailsTitle: {
    fontWeight: 'bold',
    marginBottom: spacings.sm,
  },
  detailsDescription: {
    lineHeight: 22,
    marginBottom: spacings.md,
  },
  detailsDistance: {
    fontWeight: '600',
  },
});
