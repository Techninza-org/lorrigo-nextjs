import { B2COrderType } from '@/types/types';
import React from 'react';
import { formatDate } from "date-fns";
import { format, toZonedTime } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CANCELED } from './order-action-button';

interface OrderTrackTimelineProps {
    order: B2COrderType;
}

export const OrderTrackTimeline: React.FC<OrderTrackTimelineProps> = ({ order }) => {

    return (
        <Tabs defaultValue="Activity_log" className="w-[400px]">
            {/* <TabsList className="grid w-full grid-cols-2"> */}
            <TabsList className="w-full">
                <TabsTrigger value="Activity_log" className='w-full'>Activity Log</TabsTrigger>
                {/* <TabsTrigger value="tracking_info">Tracking Info</TabsTrigger> */}
            </TabsList>
            <TabsContent value="Activity_log">

                <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
                    {order?.orderStages?.map((stage, index) => {
                        const isLastItem = index === (order?.orderStages?.length ?? 0) - 1;
                        const shouldAnimate = isLastItem && order.bucket !== CANCELED;

                        return (
                            <div key={stage.stage} className="flex md:contents">
                                <div className="col-start-1 col-end-4 mr-10 md:mx-auto relative">
                                    <div className="h-full w-6 flex items-center justify-center">
                                        <div className={cn("h-full w-1 bg-slate-300 pointer-events-none", stage.stage === -1 ? "bg-red-400" : "")}></div>
                                    </div>
                                    <div className={cn("w-6 h-6 absolute top-1/2 -mt-3 rounded-full ring-offset-2 ring-2 shadow bg-slate-400 text-center", shouldAnimate ? "animate-bounce bg-slate-500" : "", stage.stage === -1 ? "bg-red-300" : "")}>
                                    </div>
                                </div>
                                <div className={cn("bg-slate-100 text-black col-start-4 col-end-12 p-4 rounded-xl my-4 shadow-md w-full", stage.stage === -1 ? "bg-red-100" : "")}>
                                    <h3 className="font-medium mb-1">{stage.action}</h3>
                                    <ul className='list-disc pl-6'>
                                        {stage?.activity && <li className='text-gray-700 text-sm'>{stage?.activity}</li>}
                                        {stage?.location && <li className='text-gray-700 text-sm'> {stage?.location}</li>}
                                    </ul>
                                    <div className="text-xs leading-tight w-full mt-2 text-right">
                                        {/* {formatDate(`${stage?.stageDateTime}`, 'dd-MM-yyyy | HH:mm a')} */}
                                        {format(toZonedTime(stage?.stageDateTime, 'UTC'), 'dd-MM-yyyy | hh:mm a')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </TabsContent>
            {/* <TabsContent value="tracking_info">

            </TabsContent> */}
        </Tabs>

    );
};
