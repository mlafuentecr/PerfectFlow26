import {Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';

interface NavigationProps {
  navigation: any;
}

const MenuProfile = ({navigation}: NavigationProps) => {
  const [menuShow, setmenuShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setmenuShow(false);
    }, 3000);
  }, []);

  return (
    <View style={menuShow ? styles.menuWrapOpen : styles.menuWrapClose}>
      <TouchableOpacity onPress={() => setmenuShow(!menuShow)}>
        <Image
          style={styles.profile}
          source={require('../../assets/images/icon-person.png')}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profile}
        onPress={() => navigation.navigate('Help')}>
        <Image
          source={require('../../assets/images/icon-headset.png')}
          resizeMode="contain"
        />
        <Text style={styles.text}>Help?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Learn')}
        style={styles.profile}>
        <Image
          source={require('../../assets/images/icon-lightbulb.png')}
          resizeMode="contain"
        />
        <Text style={styles.text}>Learn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuWrapOpen: {
    position: 'absolute',
    display: 'flex',
    top: 20,
    right: 30,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#ffffff37',
    backgroundColor: '#3e3e53d2',
    width: '20%',
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    zIndex: 99,
    elevation: 8,
    shadowColor: '#2b2b2b',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  menuWrapClose: {
    position: 'absolute',
    display: 'flex',
    top: 20,
    right: 30,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    width: '20%',
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    height: 75,
    zIndex: 99,
    elevation: 8,
    shadowColor: '#2b2b2b0',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  profile: {
    marginTop: 5,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  help: {
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#f0ebeb',
    textTransform: 'capitalize',
  },
});

export default MenuProfile;
