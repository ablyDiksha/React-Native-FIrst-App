import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

export default App;
// const App = () => {
//   return (
//     <View style={styles.screen}>
      
//       {/* Main Container */}
//       <View style={styles.card}>

//         {/* Column */}
//         <View style={styles.column}>

//           {/* Image */}
//           <Image
//             source={{
//               uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmHLL5tl5c90Pn39WgqW7fZCk5u3qWFN79fM6anfS1e4U_5wsr1M9lo1E&s',
//             }}
//             style={styles.profileImage}
//           />

//           {/* Text below image */}
//           <Text style={styles.name}>John Doe</Text>

//           <Text style={styles.description}>
//             React Native Developer
//           </Text>

//           {/* Row */}
//           <View style={[styles.row, { marginBottom: 20 }]}>
//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>Follow</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>Message</Text>
//             </TouchableOpacity>
//           </View>

//         </View>
//           <Button
            
//             onPress={() => {
//               console.log('You tapped the button!');
//             }}
//             title="Press Me"
//             color="orange"
//           />
//       </View>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },

//   // Main container
//   card: {
//     width: 300,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: 'orange',
//     borderRadius: 20,
//     backgroundColor: 'white',
//   },

//   // Column formation
//   column: {
//     alignItems: 'center',
//   },

//   // Circular image
//   profileImage: {
//     width: 135,
//     height: 135,
//     borderRadius: 0,
//     borderWidth: 0,
//   },

//   name: {
//     marginTop: 15,
//     fontSize: 22,
//     fontWeight: 'bold',
//   },

//   description: {
//     marginTop: 5,
//     fontSize: 14,
//     color: 'gray',
//   },

//   // Row formation
//   row: {
//     flexDirection: 'row',
//     marginTop: 20,
//     gap: 10,
//   },

//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     backgroundColor: 'orange',
//   },

//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default App;