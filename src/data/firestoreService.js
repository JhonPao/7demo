import { dbFirestore } from '../firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';

function fromFirestore(snapshot) {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getClients() {
  const snapshot = await getDocs(collection(dbFirestore, 'clients'));
  return fromFirestore(snapshot);
}

export async function getMemberships() {
  const snapshot = await getDocs(collection(dbFirestore, 'memberships'));
  return fromFirestore(snapshot);
}

export async function getProducts() {
  const snapshot = await getDocs(collection(dbFirestore, 'products'));
  return fromFirestore(snapshot);
}

export async function getSales() {
  const snapshot = await getDocs(collection(dbFirestore, 'sales'));
  return fromFirestore(snapshot);
}

export async function getSaleItems() {
  const snapshot = await getDocs(collection(dbFirestore, 'saleItems'));
  return fromFirestore(snapshot);
}

export async function getExpenses() {
  const snapshot = await getDocs(collection(dbFirestore, 'expenses'));
  return fromFirestore(snapshot);
}

export async function getLeads() {
  const snapshot = await getDocs(collection(dbFirestore, 'leads'));
  return fromFirestore(snapshot);
}

export async function getAllData() {
  const [clients, memberships, products, sales, saleItems, expenses, leads] = await Promise.all([
    getClients(), getMemberships(), getProducts(), getSales(), getSaleItems(), getExpenses(), getLeads(),
  ]);
  return { clients, memberships, products, sales, saleItems, expenses, leads };
}

export function subscribeAllData(callback) {
  const collections = ['clients', 'memberships', 'products', 'sales', 'saleItems', 'expenses', 'leads'];
  const unsubscribes = collections.map(name =>
    onSnapshot(collection(dbFirestore, name), () => {
      getAllData().then(callback);
    })
  );
  return () => unsubscribes.forEach(u => u());
}
