import React from 'react'

export interface TitleProps {
        isDark: boolean;
        children: React.ReactNode
}

export default function Title(props: TitleProps) {
        const { isDark, children } = props
        return (
                <h2
                        style={{
                                fontSize: 'calc(min(4.5vw, 2.5rem))', // vw is for sp, rem is for pc
                                textAlign: 'center',
                                color: isDark ? '#123185' : '#843332',
                        }}
                >
                        {children}
                </h2>
        )
}
