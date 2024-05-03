'use client'
import React from 'react'
import { useAdminProvider } from '@/components/providers/AdminProvider';
import { UsersListingTable } from './users-listing-table';
import { AdminUsersListingCols } from './users-listing-cols';


const UsersList = () => {
  const { users } = useAdminProvider();

  return (
    <>
      <UsersListingTable columns={AdminUsersListingCols} data={users} />
    </>
  )
}

export default UsersList