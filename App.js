import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, createContext } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import supabase from './lib/supabase-client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SessionContext = createContext(null)

//Register function
async function insertData(user, pass) {
  try {
    const {error} = await supabase
      .from('Users')
      .insert({ Name: user, Password: pass})
    if (error) {
      throw new error
    }
  }
  catch (error) {
    Alert.alert(error.message)
  }
}

//Login function
async function handleLogin(user, pass, nav) {
  try {
    
    const {data, error} = await supabase
      .from('Users')
      .select('*')
      .eq('Name', user)
      .eq('Password', pass)

    if (error) {
      throw new error;

    }

    if (data.length > 0) {
      // Van találat
      Alert.alert('Juppe')
      nav.navigate('Game')
    } else {
      // Nincs találat
      Alert.alert('Nincs ilyen felhasználó. Kérlek regisztrálj először');
    }
  } catch (error) {
    Alert.alert('Error checking user:', error.message);
  }
}

const Stack = createNativeStackNavigator()

//views
function HomeScreen({navigation}) {
  const [user, SetUser] = useState("Name")

  const [pass, setPass] = useState("Password")

  const [session, setSession] = useState(null)
  return (
    <SessionContext.Provider value={session}>
      <View style={styles.container}>
        <Text style={[{color: '#fff'}]}>Szevasz!</Text>
        <TextInput style={styles.textInput} onChangeText={(value) => SetUser(value)}></TextInput>
        <TextInput style={styles.textInput} onChangeText={(value) => setPass(value)}></TextInput>
        <TouchableOpacity style={styles.button} onPress={() => insertData(user, pass)}>   
          <Text>
            {"Sign up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleLogin(user, pass, navigation)}>
          <Text>
            {"Sign in"}
          </Text>
        </TouchableOpacity>
        
        <StatusBar style="auto" />
      </View>
    </SessionContext.Provider>
  );
}

function GameScreen({navigation}) {
  
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
}



//default app
export default function App() {
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSession(null)
        } else if (session) {
          setSession(session)
        }
      })
 
    return () => {
      subscription.unsubscribe()
    }
  }, [])
 
 
   return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName="Home">
         <Stack.Screen name="Home" 
                       component={HomeScreen}
                       options={{headerShown: false }} />
         <Stack.Screen name="Game" 
                       component={GameScreen} 
                       options={{headerShown: false }} />
       </Stack.Navigator>
     </NavigationContainer> 
   );
};





//styles
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#12b0b0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin:16,
    padding: 20,
    width:'95%',
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",

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
  },
  textInput: {
    height: 50,
    width: '85%',
    backgroundColor: 'white',
    margin: 20,
  }
});
