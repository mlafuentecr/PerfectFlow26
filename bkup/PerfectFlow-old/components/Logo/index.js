import React from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';

const Logo = ({size = 'large'}) => {
  const logoImageSmall = require('../../assets/images/p-logo.png');
  const logoImage = require('../../assets/images/perfectFlow-x3.png');
  return (
    <View
      style={size === 'small' ? styles.logoSmallWrap : styles.logoLargeWrap}>
      <TouchableOpacity>
        <Image
          style={
            size === 'small' ? styles.logoSmallStyled : styles.logoLargetyled
          }
          source={size === 'small' ? logoImageSmall : logoImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoSmallWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '20%',
    marginTop: '10%',
    marginBottom: '5%',
  },
  logoLargeWrap: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    height: '30%',
  },
  logoLargetyled: {
    marginTop: 80,
    marginBottom: 50,
    height: 180,
    maxWidth: 219,
  },
  logoSmallStyled: {},
});

export {Logo};
