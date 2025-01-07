import React, { ReactNode } from 'react'
import DashBoardWrapper from './DashBoardWrapper'
// type Props = {}

const layout = ({ children }: { children: ReactNode }) => {
	return <DashBoardWrapper>{children}</DashBoardWrapper>
}

export default layout
