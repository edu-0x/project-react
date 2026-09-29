import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, onValue, set, remove } from 'firebase/database';
import { auth, database } from '../config/firebase';
 
export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
 
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setIsLoadingUser(false);
      return;
    }
 
    const userRef = ref(database, `users/${uid}`);
 
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val() || {};
 
        setName(data.name || '');
        setEmail(data.email || auth.currentUser?.email || '');
        setAddress(data.address || '');
        setIsLoadingUser(false);
      },
      (error) => {
        alert(error.message);
        setIsLoadingUser(false);
      }
    );
 
    return () => unsubscribe();
  }, []);
 
  const saveUserData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('Usuário não autenticado.');
      return;
    }
 
    setIsSaving(true);
 
    try {
      await set(ref(database, `users/${uid}`), {
        name,
        email: email || auth.currentUser?.email || '',
        address,
        updatedAt: new Date().toISOString(),
      });
      alert('Dados salvos com sucesso!');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };
 
  const deleteUserData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('Usuário não autenticado.');
      return;
    }
 
    try {
      await remove(ref(database, `users/${uid}`));
      setName('');
      setEmail(auth.currentUser?.email || '');
      setAddress('');
      alert('Dados removidos com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };
 
  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch(error => alert(error.message));
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do usuário</Text>
      <Text style={styles.text}>Olá, {auth.currentUser?.email}</Text>
 
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
      />
 
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
 
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Endereço"
      />
 
      <TouchableOpacity style={styles.button} onPress={saveUserData} disabled={isLoadingUser || isSaving}>
        <Text style={styles.buttonText}>{isSaving ? 'Salvando...' : 'Salvar dados'}</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={deleteUserData}>
        <Text style={styles.buttonText}>Excluir dados</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={[styles.button, styles.buttonLogout]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  text: { fontSize: 18, marginBottom: 20 },
  input: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0782F9',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDanger: { backgroundColor: '#d9534f' },
  buttonLogout: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});