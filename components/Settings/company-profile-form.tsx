'use client'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormMessage } from '@/components/ui/form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { useHubProvider } from '../providers/HubProvider';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useSellerProvider } from '../providers/SellerProvider';
import ImageUpload from '../file-upload';

export const CompanyProfileSchema = z.object({
  companyId: z.string().optional(),
  companyName: z.string().min(1, "Company Name is required"),
  companyEmail: z.string().email("Invalid email address"),
  website: z.string().optional(),
  logo: z.string().optional(),
})

export const CompanyProfileForm = () => {

  const { seller, getSeller } = useSellerProvider();
  const { updateCompanyProfile } = useHubProvider();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CompanyProfileSchema),
    defaultValues: {
      companyId: '',
      companyName: '',
      companyEmail: '',
      website: '',
      logo: '',
    }
  });

  useEffect(() => {
    if (seller?.companyProfile) {
      form.setValue('companyId', seller.companyProfile?.companyId || '');
      form.setValue('companyName', seller.companyProfile?.companyName || '');
      form.setValue('companyEmail', seller.companyProfile?.companyEmail || '');
      form.setValue('website', seller.companyProfile?.website || '');
    }

  }, [seller, form]);

  const onSubmit = async (values: z.infer<typeof CompanyProfileSchema>) => {
    try {
      updateCompanyProfile(values);
      getSeller();

      router.push('/settings');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5 ">
          <div className='grid grid-cols-2 gap-y-6 gap-x-20 py-5'>
            <FormField
              control={form.control}
              name={'companyId'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Company ID <span className='text-red-600'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-300/50  dark:bg-zinc-700 dark:text-white focus-visible:ring-1 text-black focus-visible:ring-offset-1 border-2 shadow-sm"
                      readOnly={true}
                      disabled={true}
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={'companyName'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Company Name <span className='text-red-600'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={'website'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={'companyEmail'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Email <span className='text-red-600'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 dark:text-white focus-visible:ring-0 text-black focus-visible:ring-offset-0 shadow-sm"
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={'logo'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Website / Company Logo
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      uploadUrl={'/seller'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          </div>
          <div className='flex'>
            <Button variant={'themeButton'} type='submit' className='pr-0 mt-6'>
              Save
              <div className='bg-red-800 h-10 w-10 grid place-content-center rounded-r-md ml-4' ><Save /></div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
