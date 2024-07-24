import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const fetchQuestData = async () => {
	const questsCollection = collection(db, 'Quests')
	const questsSnapshot = await getDocs(questsCollection)

	const quests = await Promise.all(
		questsSnapshot.docs.map(async questDoc => {
			const questData = questDoc.data()

			return {
				id: questData.Id,
				location: questData.Location,
				timestamp: questData.Timestamp,
			}
		})
	)

	return quests
}
