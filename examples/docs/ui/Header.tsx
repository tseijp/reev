import React from 'react'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Header() {
        const { siteConfig } = useDocusaurusContext()
        return (
                <Head>
                        <title>
                                {siteConfig.title} {siteConfig.titleDelimiter}{' '}
                                {siteConfig.tagline}
                        </title>
                        <style>
                                @import
                                url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                        </style>
                </Head>
        )
}
