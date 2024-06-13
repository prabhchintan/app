import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClickAway } from '@uidotdev/usehooks'

import { BLOCKED_MUTED_TABS } from '#/lib/constants'
import useBlockedMuted from './hooks/use-blocked-muted'
import type { BlockedMutedTabType } from '#/types/common'
import { UserProfilePageTable } from '../profile-page-table'
import type { ProfileDetailsResponse } from '#/api/requests'

interface BlockedMutedProps {
  profile: ProfileDetailsResponse
  isManager?: boolean
  onClose: () => void
}

const BlockedMuted: React.FC<BlockedMutedProps> = ({ profile, isManager, onClose }) => {
  const [activeTab, setActiveTab] = useState<BlockedMutedTabType>('Blocked/Muted')

  const {
    followers,
    following,
    followersIsLoading,
    followingIsLoading,
    fetchMoreFollowers,
    fetchMoreFollowing,
    isFetchingMoreFollowers,
    isFetchingMoreFollowing
  } = useBlockedMuted(profile.address)
  const { t } = useTranslation('profile')

  const blockedMutedRef = useClickAway<HTMLDivElement>(() => {
    onClose()
  })

  const mobileActiveEl = {
    'Blocked/Muted': (
      <UserProfilePageTable
        isLoading={followingIsLoading}
        following={following}
        followers={followers}
        isFetchingMore={isFetchingMoreFollowing}
        fetchMore={() => fetchMoreFollowing()}
        canEditTags={isManager}
        showTagsByDefault={true}
        isShowingBlocked={true}
        title='following'
        displayedTitle='Blocked/Muted'
        customClass='border-t-0 rounded-t-none'
      />
    ),
    'Blocked/Muted by': (
      <UserProfilePageTable
        isLoading={followersIsLoading}
        following={following}
        followers={followers}
        isFetchingMore={isFetchingMoreFollowers}
        fetchMore={() => fetchMoreFollowers()}
        showTagsByDefault={true}
        isShowingBlocked={true}
        title='followers'
        displayedTitle='Blocked/Muted By'
        customClass='border-t-0 rounded-t-none'
      />
    )
  }[activeTab]

  return (
    <div className='fixed z-50 top-0 flex overflow-scroll justify-center left-0 w-full h-full bg-black/50'>
      <div
        ref={blockedMutedRef}
        className='gap-8 flex h-fit w-full rounded-xl mt-32 md:mt-40 mb-24 px-4 lg:mt-48 '
      >
        <div className='bg-white/80 h-fit rounded-2xl hidden xl:block'>
          <UserProfilePageTable
            isLoading={followingIsLoading}
            following={following}
            followers={followers}
            isFetchingMore={isFetchingMoreFollowing}
            fetchMore={() => fetchMoreFollowing()}
            canEditTags={isManager}
            showTagsByDefault={true}
            isShowingBlocked={true}
            title='following'
            displayedTitle='Blocked/Muted'
            customClass='hidden xl:flex'
          />
        </div>
        <div className='bg-white/80 h-fit rounded-2xl hidden xl:block'>
          <UserProfilePageTable
            isLoading={followersIsLoading}
            following={following}
            followers={followers}
            isFetchingMore={isFetchingMoreFollowers}
            fetchMore={() => fetchMoreFollowers()}
            showTagsByDefault={true}
            isShowingBlocked={true}
            title='followers'
            displayedTitle='Blocked/Muted By'
            customClass='hidden xl:flex'
          />
        </div>
        <div className='w-full mt-12 relative bg-white/80 h-fit rounded-2xl xl:hidden'>
          <div className='w-full absolute -top-12 left-0 '>
            {BLOCKED_MUTED_TABS.map(option => (
              <button
                key={option}
                onClick={() => setActiveTab(option)}
                className={`w-1/2 capitalize  text-lg py-2 font-semibold glass-card border-2 border-gray-200 rounded-t-lg ${
                  activeTab === option ? 'bg-white/60' : 'bg-white/20 hover:bg-white/40'
                }`}
              >
                {t(option)}
              </button>
            ))}
          </div>
          {mobileActiveEl}
        </div>
      </div>
    </div>
  )
}

export default BlockedMuted
