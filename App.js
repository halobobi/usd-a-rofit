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
      <Text>Coins: {coins}</Text>
      <TouchableOpacity style={styles.button_error} onPress={removeCoins}>
        <Text>Remove coins</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button_error} onPress={removeMachineCount}>
        <Text>Remove machines</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text>Click to Earn Coins</Text>
      </TouchableOpacity>
      {coins >= 10 && (
        <TouchableOpacity style={styles.button} onPress={buyMachine}>
          <Text>Buy Machine for 10 Coins</Text>
        </TouchableOpacity>
      )}
      {coins < 10 && (
        <TouchableOpacity style={styles.button_disabled}>
          <Text>Buy Machine for 10 Coins</Text>
        </TouchableOpacity>
      )}
      {machineCount>=1 && <Text>Machine(s) generating {machineCount} coin every 2 seconds</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginVertical: 10,
  },
  button_error: {
    backgroundColor: 'pink',
    padding: 10,
    marginVertical: 10,
  },
  button_disabled: {
    backgroundColor: 'lightgray',
    padding: 10,
    marginVertical: 10,
  },
});

export default App;
