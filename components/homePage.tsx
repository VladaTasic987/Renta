import { Assets } from '@react-navigation/elements';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomePage () {
  return (
    <View style={styles.container}>
      
      <Text>This is Home Page</Text>

      <MapView
      style={styles.map}
      initialRegion={{
        latitude: 43.0025,
        longitude: 21.9466,
        latitudeDelta: 0.05,   // manji broj = veći zoom
        longitudeDelta: 0.05,
  }}
>
  <Marker 
  coordinate={{latitude: 42.9983, longitude: 21.9458 }}
  title="Apartman"
  description='Vladimir'
  />
</MapView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '95%',
    width: '100%',
  }
})