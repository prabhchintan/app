'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { useTranslation } from 'react-i18next'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import LoadingCell from '../loading-cell'
import { type FollowButtonState, useFollowButton } from './use-follow-button'

const theme: Record<
  FollowButtonState,
  { bg: string; text: string; border: string; imageSrc?: string }
> = {
  Follow: {
    bg: 'bg-kournikova-300',
    text: 'text-zinc-800',
    border: 'border-0 '
  },
  'Pending Following': {
    bg: 'bg-white',
    text: 'text-gray-900',
    border:
      'border-2 border-gray-200 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-2 after:-right-2 after:bg-green-400'
  },
  Following: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-2 border-gray-200'
  },
  Unfollow: {
    bg: 'bg-deletion',
    text: 'text-gray-900',
    border:
      'border-0 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-1.5 after:-right-1.5 after:bg-green-400'
  },
  Subscribe: {
    bg: 'bg-kournikova-300',
    text: 'text-zinc-800',
    border: 'border-0 '
  },
  Subscribed: {
    bg: 'bg-addition',
    text: 'text-zinc-800',
    border: 'border-2 border-gray-200'
  },
  Unsubscribe: {
    bg: 'bg-deletion',
    text: 'text-gray-900',
    border:
      'border-0 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-1.5 after:-right-1.5 after:bg-green-400'
  },
  Block: {
    bg: 'bg-deletion',
    text: 'text-zinc-800',
    border: 'border-0 '
  },
  'Pending Block': {
    bg: 'bg-white',
    text: 'text-red-500',
    border:
      'border-2 border-red-500 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-2 after:-right-2 after:bg-green-400',
    imageSrc: '/assets/mainnet-red.svg'
  },
  Blocked: {
    bg: 'bg-white',
    text: 'text-red-500',
    border: 'border-2 border-red-500',
    imageSrc: '/assets/mainnet-red.svg'
  },
  Unblock: {
    bg: 'bg-deletion',
    text: 'text-zinc-800',
    border:
      'border-0 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-1.5 after:-right-1.5 after:bg-green-400'
  },
  Mute: {
    bg: 'bg-kournikova-300',
    text: 'text-red-500',
    border: 'border-0 '
  },
  'Pending Mute': {
    bg: 'bg-white',
    text: 'text-red-500',
    border:
      'border-2 border-red-500 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-2 after:-right-2 after:bg-green-400',
    imageSrc: '/assets/mainnet-red.svg'
  },
  Muted: {
    bg: 'bg-white',
    text: 'text-red-500',
    border: 'border-2 border-red-500',
    imageSrc: '/assets/mainnet-red.svg'
  },
  Unmute: {
    bg: 'bg-deletion',
    text: 'text-zinc-800',
    border:
      'border-0 after:absolute after:h-4 after:w-4 after:rounded-full after:-top-1.5 after:-right-1.5 after:bg-green-400'
  }
}

interface FollowButtonProps {
  address: Address
  className?: string
  isBlockedBy?: boolean
}

const FollowButton: React.FC<FollowButtonProps> = ({
  address,
  className = '',
  isBlockedBy,
  ...props
}) => {
  const { address: userAddress } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { t } = useTranslation('common', { keyPrefix: 'follow btn' })
  const { buttonText, buttonState, handleAction, isLoading } = useFollowButton({
    address,
    isBlockedBy
  })

  // if (address?.toLowerCase() === userAddress?.toLowerCase()) return null

  return isLoading ? (
    <div className={`rounded-xl ${isBlockedBy ? 'w-[114px]' : 'w-[107px]'} h-[37px]`}>
      <LoadingCell className='h-full w-full rounded-lg' />
    </div>
  ) : (
    <button
      className={clsx([
        theme[buttonState].bg,
        theme[buttonState].text,
        theme[buttonState].border,
        'rounded-xl relative text-sm flex items-center gap-1.5 justify-center font-bold',
        'h-[37px] px-2 py-1.5', // Fixed width for consistent layout
        className,
        isBlockedBy ? 'w-[114px]' : 'w-[107px]'
      ])}
      onClick={() => {
        if (!userAddress && openConnectModal) {
          openConnectModal()
          return
        }

        handleAction()
      }}
      {...props}
    >
      <Image
        alt='mainnet logo'
        src={theme[buttonState].imageSrc || '/assets/mainnet-black.svg'}
        className='text-red-500'
        width={16}
        height={16}
      />
      {t(buttonText)}
    </button>
  )
}

export default FollowButton
