import assert from 'assert'

import { NetworkId } from '@xrengine/common/src/interfaces/NetworkId'
import { PeerID } from '@xrengine/common/src/interfaces/PeerID'
import { UserId } from '@xrengine/common/src/interfaces/UserId'
import { applyIncomingActions, clearOutgoingActions, getState } from '@xrengine/hyperflux'

import { createMockNetwork } from '../../../tests/util/createMockNetwork'
import { Engine } from '../../ecs/classes/Engine'
import { addComponent } from '../../ecs/functions/ComponentFunctions'
import { createEntity } from '../../ecs/functions/EntityFunctions'
import { createEngine } from '../../initializeEngine'
import { NetworkObjectComponent } from '../components/NetworkObjectComponent'
import { WorldState } from '../interfaces/WorldState'
import { NetworkPeerFunctions } from './NetworkPeerFunctions'

describe('NetworkPeerFunctions', () => {
  beforeEach(() => {
    createEngine()
    createMockNetwork()
  })

  describe('addPeers', () => {
    it('should add peer', () => {
      const world = Engine.instance.currentWorld
      const userId = 'user id' as UserId & PeerID
      Engine.instance.userId = 'another user id' as UserId & PeerID
      const userName = 'user name'
      const userIndex = 1
      const network = world.worldNetwork

      NetworkPeerFunctions.createPeer(network, userId, userIndex, userId, userIndex, userName, world)

      const worldState = getState(WorldState)

      assert(network.peers.get(userId))
      assert.equal(network.peers.get(userId)?.userId, userId)
      assert.equal(network.peers.get(userId)?.userIndex, userIndex)
      assert.equal(worldState.userNames[userId]?.value, userName)
      assert.equal(network.userIndexToUserID.get(userIndex), userId)
      assert.equal(network.userIDToUserIndex.get(userId), userIndex)
    })

    it('should udpate peer if it already exists', () => {
      const world = Engine.instance.currentWorld
      const userId = 'user id' as UserId & PeerID
      Engine.instance.userId = 'another user id' as UserId & PeerID
      const userName = 'user name'
      const userName2 = 'user name 2'
      const userIndex = 1
      const userIndex2 = 2
      const network = world.worldNetwork

      const worldState = getState(WorldState)

      NetworkPeerFunctions.createPeer(network, userId, userIndex, userId, userIndex, userName, world)
      assert.equal(network.peers.get(userId)?.userId, userId)
      assert.equal(network.peers.get(userId)?.userIndex, userIndex)
      assert.equal(worldState.userNames[userId].value, userName)

      NetworkPeerFunctions.createPeer(network, userId, userIndex2, userId, userIndex2, userName2, world)
      assert.equal(network.peers.get(userId)?.userId, userId)
      assert.equal(network.peers.get(userId)?.userIndex, userIndex2)
      assert.equal(worldState.userNames[userId].value, userName2)
    })
  })

  describe('removePeer', () => {
    it('should remove peer', () => {
      const world = Engine.instance.currentWorld
      const userId = 'user id' as UserId & PeerID
      Engine.instance.userId = 'another user id' as UserId & PeerID
      const userName = 'user name'
      const userIndex = 1
      const network = world.worldNetwork

      NetworkPeerFunctions.createPeer(network, userId, userIndex, userId, userIndex, userName, world)
      NetworkPeerFunctions.destroyPeer(network, userId, world)

      assert(!network.peers.get(userId))

      // indexes shouldn't be removed (no reason for these to ever change in a network)
      assert.equal(network.userIndexToUserID.get(userIndex), userId)
      assert.equal(userIndex, network.userIDToUserIndex.get(userId))
    })

    it('should remove peer and owned network objects', () => {
      const world = Engine.instance.currentWorld
      const userId = 'user id' as UserId & PeerID
      Engine.instance.userId = 'another user id' as UserId & PeerID
      const userName = 'user name'
      const userIndex = 1
      const network = world.worldNetwork

      NetworkPeerFunctions.createPeer(network, userId, userIndex, userId, userIndex, userName, world)
      const networkId = 2 as NetworkId

      const entity = createEntity()
      addComponent(entity, NetworkObjectComponent, {
        ownerId: userId,
        authorityUserId: userId,
        networkId
      })

      // process remove actions and execute entity removal
      Engine.instance.store.defaultDispatchDelay = 0
      NetworkPeerFunctions.destroyPeer(network, userId, world)

      clearOutgoingActions(network.topic)
      applyIncomingActions()
      world.execute(0)

      assert(!network.peers.get(userId))
      assert.equal(network.userIndexToUserID.get(1), userId)
      assert.equal(network.userIDToUserIndex.get(userId), 1)

      assert(!world.getNetworkObject(userId, networkId))
    })
  })
})
