import { useState } from 'react'
import PlayerList from './PlayerList'
import GameSettings from './GameSettings'

export default function LobbyTabs({ players = [], isConnected = false }) {
  const [activeTab, setActiveTab] = useState('participants')

  return (
    <div id="lobby-tabs" className="bg-arena-panel border border-arena-border rounded-xl overflow-hidden">
      <div className="flex border-b border-arena-border px-4">
        <button 
          onClick={() => setActiveTab('participants')}
          className={`py-3 px-4 font-mono text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'participants' ? 'tab-active' : 'text-arena-muted hover:text-white'}`}
        >
          <i className="fa-solid fa-users mr-2"></i>Participants
          <span className="ml-1 bg-arena-green/10 text-arena-green text-xs font-mono px-2 py-0.5 rounded-full">{players.length}/12</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 font-mono text-sm font-semibold transition-colors cursor-pointer ${activeTab === 'settings' ? 'tab-active' : 'text-arena-muted hover:text-white'}`}
        >
          <i className="fa-solid fa-sliders mr-2"></i>Game Settings
        </button>
      </div>

      {activeTab === 'participants' && <PlayerList players={players} />}
      {activeTab === 'settings' && <GameSettings />}
    </div>
  )
}
