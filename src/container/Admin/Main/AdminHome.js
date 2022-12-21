import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavbarAdmin } from '../../../components/layout'
import Header2 from '../../../components/layout/header2/Header2'

const AdminHome = () => {
    return (<>
        <Header2 />
        <NavbarAdmin />
        <Outlet />
    </>
    )
}

export default AdminHome