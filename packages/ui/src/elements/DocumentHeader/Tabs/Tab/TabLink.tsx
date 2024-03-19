'use client'
import type { SanitizedConfig } from 'payload/types'

import LinkImport from 'next/link.js'
import { useParams, usePathname } from 'next/navigation.js'
import React from 'react'

const Link = (LinkImport.default || LinkImport) as unknown as typeof LinkImport.default

export const DocumentTabLink: React.FC<{
  adminRoute: SanitizedConfig['routes']['admin']
  baseClass: string
  children?: React.ReactNode
  href: string
  isActive?: boolean
  isCollection?: boolean
  newTab?: boolean
}> = ({
  adminRoute,
  baseClass,
  children,
  href: hrefFromProps,
  isActive: isActiveFromProps,
  newTab,
}) => {
  const pathname = usePathname()
  const params = useParams()
  const [entityType, entitySlug, segmentThree, segmentFour, ...rest] = params.segments || []
  const isCollection = entityType === 'collections'
  let docPath = `${adminRoute}/${isCollection ? 'collections' : 'globals'}/${entitySlug}`
  if (isCollection && segmentThree) {
    // doc ID
    docPath += `/${segmentThree}`
  }

  const href = `${docPath}${hrefFromProps}`

  const isActive =
    (href === docPath && pathname === docPath) ||
    (href !== docPath && pathname.startsWith(href)) ||
    isActiveFromProps

  return (
    <li className={[baseClass, isActive && `${baseClass}--active`].filter(Boolean).join(' ')}>
      <Link
        className={`${baseClass}__link`}
        href={!isActive || href !== pathname ? href : ''}
        {...(newTab && { rel: 'noopener noreferrer', target: '_blank' })}
        tabIndex={isActive ? -1 : 0}
      >
        {children}
      </Link>
    </li>
  )
}