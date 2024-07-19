import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'

export const fetchQuestData = async () => {
  const questsCollection = collection(db, 'Quests');
  const questsSnapshot = await getDocs(questsCollection);

  const quests = await Promise.all(questsSnapshot.docs.map(async (questDoc) => {
    const questData = questDoc.data();
    const location = questData.Location || null;
    console.log("data",questData)

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
   
      return null;
    }

    return {
      id: questData.Id,
      location: location,
      timestamp: questData.Timestamp
    };
  }));


  return quests.filter(quest => quest !== null);
}
