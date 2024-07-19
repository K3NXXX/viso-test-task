import { LatLngExpression } from 'leaflet'

export interface MarkerData {
	position: LatLngExpression
	id: number
	timestamp?: { seconds: number; nanoseconds: number }
}

export interface Quest {
	id: number
	location: {
		latitude: number
		longitude: number
	}
	timestamp?: {
		seconds: number
		nanoseconds: number
	}
}
