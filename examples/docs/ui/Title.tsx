import React from 'react'

export interface TitleProps {
        children: React.ReactNode
}

export default function Title(props: TitleProps) {
        const { children } = props
        return (
                <h2
                        style={{
                                fontSize: '2rem',
                                textAlign: 'center',
                                color: '#123185',
                        }}
                >
                        {children}
                </h2>
        )
}
