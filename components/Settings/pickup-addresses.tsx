'use client'
import React from 'react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { ChevronLeft, ChevronRight, Circle, CircleCheck, Download, Plus, SearchIcon, SquarePen } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
// import { useModal } from '@/hooks/use-model-store';
import { useSellerProvider } from '../providers/SellerProvider';
import { PickupAddressTable } from './pickup-address-table';
import { PickupAddressCol } from './pickup-address-col';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-model-store';
import { Download, Plus } from 'lucide-react';

// const ActiveButton = () => {
//   return (
//     <div className='text-[#0A7900] bg-[#0a790045]  w-1/2 rounded-md text-center'>Active</div>
//   )
// }
// const InactiveButton = () => {
//   return (
//     <div className='text-[#be0c34] bg-[#7900003a] w-1/2 rounded-md text-center'>Inactive</div>
//   )
// }

// // const AddressDetails = () => {
// //   const { onOpen } = useModal();
// //   const { sellerFacilities } = useSellerProvider();
// //   console.log(sellerFacilities);

// //   return (
// //     <Table className='w-full'>
// //       <TableBody>
// //         {
// //           sellerFacilities.map((item) => {
// //             return <TableRow key={item.hub_id} className='grid grid-cols-3'>
// //               <TableCell>{item.name}</TableCell>
// //               <TableCell><button onClick={() => onOpen("editPickupLocation", {hubId: item.hub_id})}><SquarePen className='text-[#747474] size-4'/></button></TableCell>
// //               {/* <TableCell>{item.active ? <ActiveButton /> : <InactiveButton />}</TableCell> */}
// //               <TableCell>Location: {item.pincode}</TableCell>
// //               {/* <TableCell>
// //                 <div className="flex items-center">
// //                   <CircleCheck className='text-[#be0c34] mr-2' />
// //                   <div className='flex align-center'>
// //                     <label className="Label pr-4" htmlFor="primary-address" >
// //                       Primary Address
// //                     </label>
// //                   </div>
// //                 </div>
// //               </TableCell> */}
// //             </TableRow>
// //           })
// //         }
// //       </TableBody>
// //     </Table>
// //   )
// // }


// const PickupAddresses = () => {
//   const [page, setPage] = React.useState(1)
//   const totalPages = 5
//   const { onOpen } = useModal();
//   const { sellerFacilities } = useSellerProvider();
//   console.log(sellerFacilities);

//   function incrementPage() {
//     setPage(prevPage => Math.min(prevPage + 1, totalPages));
//   }
//   function decrementPage() {
//     setPage(prevPage => Math.max(prevPage - 1, 1));
//   }
//   return (
//     <div>
//       <div className='flex justify-between mb-10 mt-4'>
//         <div className='flex'>
//           <Select>
//             <SelectTrigger className='w-[156px]'>
//               <SelectValue
//                 placeholder="Phone Number"
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={'phone'}>Phone Number</SelectItem>
//               <SelectItem value={'location'}>Location</SelectItem>
//               <SelectItem value={'city'}>City</SelectItem>
//               <SelectItem value={'state'}>State</SelectItem>
//               <SelectItem value={'pincode'}>Pincode</SelectItem>
//             </SelectContent>
//           </Select>
//           <div className='flex border border-gray-300 rounded-md'>
//             <SearchIcon className='mt-3 mx-2' size={15} />
//             <input type='text' placeholder='Search by Location name, City, State, Pincode' className='w-[480px] rounded-md focus-visible:ring-0 ' />
//           </div>
//         </div>
//         <div className='flex gap-x-6'>
//           <Button variant={'themeGrayBtn'} size={'icon'}><Download size={18} /></Button>
//           <Button onClick={() => onOpen("addPickupLocation")} variant={'themeButton'} className='rounded-full'><Plus size={15} /> Add Pickup Address</Button>
//         </div>
//       </div>
//       {/* <AddressDetails /> */}
//       <Table className='w-full'>
//       <TableBody>
//         {
//           sellerFacilities.map((item) => {
//             return <TableRow key={item.hub_id} className='grid grid-cols-3'>
//               <TableCell>{item.name}</TableCell>
//               <TableCell><button onClick={() => onOpen("editPickupLocation", {hub: item})}><SquarePen className='text-[#747474] size-4'/></button></TableCell>
//               {/* <TableCell>{item.active ? <ActiveButton /> : <InactiveButton />}</TableCell
//               > */}
//               <TableCell>Location: {item.pincode}</TableCell>
//               {/* <TableCell>
//                 <div className="flex items-center">
//                   <CircleCheck className='text-[#be0c34] mr-2' />
//                   <div className='flex align-center'>
//                     <label className="Label pr-4" htmlFor="primary-address" >
//                       Primary Address
//                     </label>
//                   </div>
//                 </div>
//               </TableCell> */}
//             </TableRow>
//           })
//         }
//       </TableBody>
//     </Table>

//       <div className='flex mt-8'>
//         <div className='flex align-center w-1/2'>
//           <p className='grid place-content-center'>Show </p>
//           <Select>
//             <SelectTrigger className='w-[70px] mx-4'>
//               <SelectValue
//                 placeholder="15"
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={'15'}>15</SelectItem>
//               <SelectItem value={'20'}>20</SelectItem>
//               <SelectItem value={'25'}>25</SelectItem>
//             </SelectContent>
//           </Select>
//           <p className='grid place-content-center'> items per page</p>
//         </div>

//         <div className='flex gap-x-4 justify-center h-full -ml-36'>
//           <Button variant={'themeIconBtn'} size={'icon'} onClick={decrementPage}><ChevronLeft size={28} /></Button>
//           <p className='grid place-content-center'>{page} of {totalPages} pages</p>
//           <Button variant={'themeIconBtn'} size={'icon'} onClick={incrementPage}><ChevronRight size={28} /></Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PickupAddresses

const PickupAddresses = () => {
  const { sellerFacilities } = useSellerProvider();

  return (
    <>
      <PickupAddressTable columns={PickupAddressCol} data={sellerFacilities} />
    </>
  )
}

export default PickupAddresses