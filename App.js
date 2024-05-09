import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, createContext } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import supabase from './lib/supabase-client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SessionContext = createContext(null)

//Register function
async function insertData(user, pass,nav) {
  try {
    const {error} = await supabase
      .from('Users')
      .insert({ Name: user, Password: pass, Coin:0, Machine:0})
    if (error) {
      throw new error
    }
  }
  catch (error) {
    Alert.alert(error.message,"A felhasználónév már foglalt, kérlek adj meg egy másikat.")
  }
  finally{
    await handleLogin(user, pass, nav)
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

    global.coin=0
    global.machine=0

    global.user=user
    global.pass=pass

    if (data.length > 0) {
      // Van találat
      global.coin=data[0].Coin
      global.machine=data[0].Machine

      nav.navigate('Game')
    } else {
      // Nincs találat
      Alert.alert('Nincs ilyen felhasználó! Kérlek regisztrálj először.');
    }
  } catch (error) {
    Alert.alert('A mejelentkezés során egy hiba lépett fel:', error.message);
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
      <Text style={[{color: '#fff'}, {fontSize: 40, textAlign:'center',marginBottom:30}]}>Szevasz!</Text>
        <Text style={[{color: '#fff'}, {fontSize: 24, textAlign:'center',marginBottom:20}]}>Üdvözlünk az <Text style={[{fontWeight:'bold'}]}>Üsd a Röfit</Text> gyakprojektünkön!</Text>
        <TextInput style={[styles.textInput, styles.text_center]} placeholder='username' onChangeText={(value) => SetUser(value)}></TextInput>
        <TextInput style={[styles.textInput, styles.text_center]} placeholder='password' secureTextEntry={true} onChangeText={(value) => setPass(value)}></TextInput>
        <TouchableOpacity style={[styles.text_button, styles.button, styles.button_enabled, styles.sign]} onPress={() => insertData(user, pass,navigation)}>   
          <Text>
            {"Sign up"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.text_button, styles.button, styles.button_enabled, styles.sign]} onPress={() => handleLogin(user, pass, navigation)}>
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
  
  const [coins, setCoins] = useState(global.coin);
  
  const [machineCount, setMachineCount] = useState(global.machine);

  const handleClick = async () => {
    setCoins(coins + 1);

    try {
      const {error} = await supabase
        .from('Users')
        .update({Coin:coins+1})
        .eq('Name',global.user)
      if (error) {
        throw new error
      }
    }
    catch (error) {
      Alert.alert(error.message,"Hiba az adatok mentése során.")
    }
  };

  const removeCoins = async () => {
    setCoins(0);

    try {
      const {error} = await supabase
        .from('Users')
        .update({Coin:0})
        .eq('Name',global.user)
      if (error) {
        throw new error
      }
    }
    catch (error) {
      Alert.alert(error.message,"Hiba az adatok mentése során.")
    }
  };

  const removeMachineCount = async () => {
    setMachineCount(0);

    try {
      const {error} = await supabase
        .from('Users')
        .update({Machine:0})
        .eq('Name',global.user)
      if (error) {
        throw new error
      }
    }
    catch (error) {
      Alert.alert(error.message,"Hiba az adatok mentése során.")
    }
  };

  const buyMachine = async () => {
    if (coins >= 10) {
      setCoins(coins - 10);
      setMachineCount(machineCount + 1)
      
      try {
        const {error} = await supabase
          .from('Users')
          .update({Coin:coins, Machine:machineCount+1})
          .eq('Name',global.user)
        if (error) {
          throw new error
        }
      }
      catch (error) {
        Alert.alert(error.message,"Hiba az adatok mentése során.")
      }
    }
  };

  useEffect(() => {
    let interval;
    if (machineCount>=1) {
      interval = setInterval(async () => {
        setCoins(prevCoins => prevCoins + 1*machineCount);

        try {
          const {error} = await supabase
            .from('Users')
            .update({Coin:coins+machineCount})
            .eq('Name',global.user)
          if (error) {
            throw new error
          }
        }
        catch (error) {
          Alert.alert(error.message,"Hiba az adatok mentése során.")
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  },[coins, machineCount]);

  return (
    <View style={styles.container}>
      <Text style={[styles.coin_display,styles.text_center]}>BITcoinok: {coins}</Text>
      {machineCount>=1 ? (<Text style={[styles.text_center,{fontSize:18}]}>A kalapácsok {machineCount} BITcoint generálnak / 2mp</Text>):(<Text style={[styles.text_center,{fontSize:20}]}>Nincsen egy kalapácsod se!</Text>)}
      <View style={styles.inner_container}>
      <TouchableOpacity style={[styles.button,styles.button_enabled, styles.pigbutton]} onPress={handleClick}>
        <Image
        style = {styles.pig}
        source={require('./pig.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.button_disabled, coins>=10 && (styles.button_enabled)]} onPress={buyMachine}>
        <Text style={[styles.text_button,styles.text_center]}>Kalapács : 10 BITcoin       </Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button,styles.button_error]} onPress={removeCoins}>
        <Text>BITcoinok törlése</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button,styles.button_error]} onPress={removeMachineCount}>
        <Text>Kalapácsok törlése</Text>
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
    width:'60%',
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
    fontSize: 16,
    borderRadius: 10,
  },
  pig: {
    width: '100%',
    height: '120%',
    
  },
  pigbutton: {
    marginBottom:80,
    width: '90%',
    height: '50%',
    backgroundColor: 'none'
  },
  sign: {
    padding: 15,
    width: "70%"
  }
});
