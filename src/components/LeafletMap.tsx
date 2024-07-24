import React, { useEffect, useState } from 'react'
import { Icon, LatLngExpression } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet'
import { fetchQuestData } from '../utils/fetchQuestData'
import type { MarkerData, Quest } from '../types/types'
import 'leaflet/dist/leaflet.css'
import '../index.css'

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/7976/7976202.png',
  iconSize: [38, 38],
})

const LeafletMap: React.FC = () => {
  const [nextId, setNextId] = useState(1)
  const [markers, setMarkers] = useState<MarkerData[]>([])

  const viewport = {
    center: [51.505, -0.09] as [number, number],
    zoom: 13,
  }

  useEffect(() => {
    const loadQuestData = async () => {
      try {
        const questData: Quest[] = await fetchQuestData()
        const loadedMarkers: MarkerData[] = questData.map((quest: Quest) => ({
          position: [quest.location.latitude, quest.location.longitude] as LatLngExpression,
          id: quest.id,
          timestamp: quest.timestamp,
        }))

        setMarkers(loadedMarkers)
        setNextId(loadedMarkers.length + 1)
      } catch (error) {
        console.error('Error fetching quest data:', error)
      }
    }

    const loadMarkersFromLocalStorage = () => {
      const savedMarkers = localStorage.getItem('markers')
      if (savedMarkers) {
        const parsedMarkers: MarkerData[] = JSON.parse(savedMarkers)
        setMarkers(parsedMarkers)
        const highestId = Math.max(0, ...parsedMarkers.map(marker => marker.id))
        setNextId(highestId + 1)
      } else {
        loadQuestData()
      }
    }

    loadMarkersFromLocalStorage()
  }, [])

  const MapEvents = () => {
    useMapEvents({
      click(event) {
        const newMarker: MarkerData = {
          position: event.latlng,
          id: nextId,
        }
        const updatedMarkers = [...markers, newMarker]
        setMarkers(updatedMarkers)
        localStorage.setItem('markers', JSON.stringify(updatedMarkers))
        setNextId(nextId + 1)
      },
    })
    return null
  }


  const handleMarkerDrag = (id: number) => (event: any) => {
    const newPosition = event.target.getLatLng()
    const updatedMarkers = markers.map(marker =>
      marker.id === id ? { ...marker, position: newPosition } : marker
    )
    setMarkers(updatedMarkers)
    localStorage.setItem('markers', JSON.stringify(updatedMarkers))
  }

  const handleDeleteMarker = (id: number) => (event: React.MouseEvent) => {
    event.stopPropagation()
    const updatedMarkers = markers.filter(marker => marker.id !== id)
    setMarkers(updatedMarkers)
    localStorage.setItem('markers', JSON.stringify(updatedMarkers))
  }

  const handleClearMarkers = () => {
    setMarkers([])
    localStorage.removeItem('markers')
    setNextId(1)
  }

  return (
    <div>
      <MapContainer {...viewport} scrollWheelZoom={true}>
        <button onClick={handleClearMarkers} className='clearAllMarkersBtn'>
          Clear All Markers
        </button>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MarkerClusterGroup>
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={customIcon}
              draggable
              eventHandlers={{
                dragend: handleMarkerDrag(marker.id),
              }}
            >
              <Popup>
                <div>
                  <p>Marker № {marker.id}</p>
                  {marker.timestamp && (
                    <p>
                      Timestamp:
                      {new Date(marker.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  )}
                  <button
                    className='clearMarker'
                    onClick={handleDeleteMarker(marker.id)}
                  >
                    Clear marker
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <MapEvents />
      </MapContainer>
    </div>
  )
}

export default LeafletMap
