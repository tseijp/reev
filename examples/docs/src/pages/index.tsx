import * as React from 'react'
import Layout from '@theme/Layout'
import Canvas from '../../ui/Canvas'
import Header from '../../ui/Header'
import "./styles.css"

const Home = () => {
        return (
                <Layout noFooter>
                        <Header />
                        <Canvas />
                </Layout>
        )
}

export default Home
