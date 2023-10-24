import { DataApi, StoreSyncOptions } from 'signals-store';
import { FirebaseOptions, FirebaseApp, initializeApp } from '@firebase/app';
import { getAuth, Auth } from '@firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from '@firebase/firestore';
import { SetDocQueue } from './queue';

export class FirebaseApiWithQueue<T> implements DataApi<T> {
  private app!: FirebaseApp;
  public auth!: Auth;
  public firestore!: Firestore;

  private setDocQueue = new SetDocQueue(1000);

  constructor(
    public syncOptions: StoreSyncOptions,
    public firebaseOptions: FirebaseOptions,
    public initialState: T
  ) {
    this.app = initializeApp(this.firebaseOptions);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  getUserId = () => {
    if (!this.auth) {
      console.error('cannot store state if firebase auth is not configured.');
    }
    return this.auth?.currentUser?.uid || '';
  };

  getState = async () => {
    const stateRef = this.getStateRef();
    const doc = await getDoc(stateRef);
    if (!doc.exists()) {
      return this.initialState;
    } else {
      const state = doc.data() as T;
      return state;
    }
  };

  setState = async (document: T) => {
    const stateRef = this.getStateRef();
    this.setDocQueue.enqueue(stateRef, document);
  };

  storeAction = async (action: unknown) => {
    const collectionName =
      this.syncOptions?.actions?.collectionName || 'actions';
    const actionRef = doc(this.firestore, `${collectionName}/${dateId()}`);
    this.setDocQueue.enqueue(actionRef, action);
  };

  getStateRef = () => {
    const collectionName = this.syncOptions?.state?.collectionName || 'state';
    const userId = this.getUserId();
    const stateDoc = doc(this.firestore, `${collectionName}/${userId}`);
    return stateDoc;
  };
}

export const dateId = () => {
  const dt = new Date();
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, '0');
  const day = dt.getDate().toString().padStart(2, '0');
  const hour = dt.getHours().toString().padStart(2, '0');
  const minutes = dt.getMinutes().toString().padStart(2, '0');
  const seconds = dt.getSeconds().toString().padStart(2, '0');
  const milliseconds = dt.getMilliseconds().toString().padStart(3, '0');
  return `${year}${month}${day}${hour}${minutes}${seconds}${milliseconds}`;
};
