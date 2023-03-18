import React from 'react'
import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import Canvas from "./Canvas"
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const Header = () => {
        const { siteConfig } = useDocusaurusContext();
        return (
          <Head>
            <title>
              {siteConfig.title} {siteConfig.titleDelimiter} {siteConfig.tagline}
            </title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            </style>
          </Head>
        )
}

export default function Home() {
        return (
          <Layout noFooter>
            <Header />
            <Canvas />
          </Layout>
        );
}