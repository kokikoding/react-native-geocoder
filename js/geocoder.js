import { NativeModules } from 'react-native';
import GoogleApi from './googleApi.js';
import CountryCodes from '../countryCodes.json';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  geocodePosition(position) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    return RNGeocoder.geocodePosition(position).then(res => {
      if (
        res &&
        res.length > 0 &&
        CountryCodes.filter(c => c.name === res[0].country).length > 0
      ) {
        return res;
      } else {
        return GoogleApi.geocodePosition(this.apiKey, position);
      }
    }).catch(err => {throw err});
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodeAddress(this.apiKey, address);
    });
  },
}
