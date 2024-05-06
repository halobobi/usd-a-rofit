import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const App = () => {
  const [coins, setCoins] = useState(0);
  const [machineCount, setMachineCount] = useState(0);

  const handleClick = () => {
    setCoins(coins + 1);
  };

  const removeCoins = () => {
    setCoins(0);
  };

  const removeMachineCount = () => {
    setMachineCount(0);
  };

  const buyMachine = () => {
    if (coins >= 10) {
      setCoins(coins - 10);
      setMachineCount(machineCount + 1)
    }
  };

  useEffect(() => {
    let interval;
    if (machineCount>=1) {
      interval = setInterval(() => {
        setCoins(prevCoins => prevCoins + 1*machineCount);
      }, 2000);
    }
    return () => clearInterval(interval);
  },[machineCount]);

  return (
    <View style={styles.container}>
      <Text style={[styles.coin_display,styles.text_center]}>Coins: {coins}</Text>
      {machineCount>=1 ? (<Text style={[styles.text_center]}>Machine(s) generating {machineCount} coin every 2 seconds</Text>):(<Text style={[styles.text_center]}>You don't have any machines. Earn 10 coins to buy one!</Text>)}
      <View style={styles.inner_container}>
      <TouchableOpacity style={[styles.button,styles.button_enabled]} onPress={handleClick}>
        <Text style={[styles.text_button,styles.text_center]}>Click to Earn Coins</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.button_disabled, coins>=10 && (styles.button_enabled)]} onPress={buyMachine}>
        <Text style={[styles.text_button,styles.text_center]}>Buy Machine for 10 Coins</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button_error} onPress={removeCoins}>
        <Text>Remove coins</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button_error} onPress={removeMachineCount}>
        <Text>Remove machines</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
    flex: 1,
    justifyContent: 'center',
    paddingTop:40,
  },
  inner_container: {
    margin:5,
    backgroundColor:'#12b0b0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:15
  },
  button: {
    margin:10,
    padding: 20,
    width:'95%',
    borderRadius:15
  },
  button_error: {
    backgroundColor: 'pink',
    padding: 10,
    marginVertical: 10,
  },
  button_enabled: {
    backgroundColor: '#ff914d'
  },
  button_disabled: {
    backgroundColor: 'lightgray'
  },
  coin_display:{
    padding:20,
    fontSize:25
  },
  text_button:{
    fontSize:20,
  },
  text_center:{
    textAlign:'center'
  }
});

export default App;
