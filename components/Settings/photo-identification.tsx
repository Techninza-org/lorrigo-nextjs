'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useKycProvider } from '../providers/KycProvider';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-model-store';
import { useToast } from "@/components/ui/use-toast";
import { Camera } from 'lucide-react';

type PhotoSchema = {
    photoUrl: string;
}

const PhotoIdentification = () => {
    const router = useRouter();
    const { onClose } = useModal();
    const { onHandleBack, onHandleNext, formData, setFormData } = useKycProvider();
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [photoURL, setPhotoURL] = useState('')
    const [cameraOn, setCameraOn] = useState<boolean>(false);
    const { toast } = useToast();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleStartCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            setCameraOn(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const handleTakePhoto = async () => {
        if (!mediaStream) return;

        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
            video.play();
        };

        video.onplay = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const newPhotoURL = canvas.toDataURL('image/jpeg');
            setPhotoURL(newPhotoURL); 
            console.log('photo: ', newPhotoURL);
            
            handleStopCamera();
        };
    };

    const handleStopCamera = async () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    useEffect(() => {
        if (formData?.photoUrl) {
            setPhotoURL(formData.photoUrl) 
        }
    }, [formData]);

    const handleSubmit = async (values: PhotoSchema) => {
        try {
            if (!values.photoUrl) {
                toast({
                    variant: "destructive",
                    title: "Photo Required",
                    description: "Please take a photo",
                })
                return;
            }
            setFormData((prev: any) => ({ ...prev, ...values }));
            onHandleNext();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card className='p-10'>
            <CardTitle>Photo Identification</CardTitle>
            <div className='grid place-content-center m-4'>
                <canvas ref={canvasRef} className='border-2 border-black w-full h-full hidden' />
                {!photoURL && <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-[640px] h-[480px] grid place-content-center bg-[#F7F7F7]'>
                    <div className='flex justify-center'><Camera size={50} color='#be0c34' /></div>
                    {cameraOn && <p>Please look at the camera and then Capture Selfie</p>}
                </div>}
                {/* {photoURL && <img src={photoURL} alt="Captured" />} */}
                <div className='flex justify-center mt-6'>{!mediaStream && <Button variant={'themeButton'} className='w-fit' onClick={handleStartCamera}>Start Camera</Button>}</div>
                <div className='flex justify-center'>{mediaStream && <Button variant={'themeButton'} className='w-fit' onClick={handleTakePhoto}>Capture Selfie</Button>}</div>
            </div>
            <div className='flex justify-between'>
                <Button type="button" variant={'themeButton'} onClick={onHandleBack} >Back</Button>
                <Button type="submit" variant={'themeButton'} disabled={photoURL ? false : true} onClick={() => handleSubmit({ photoUrl: photoURL })} >Next</Button>
            </div>
        </Card>
    );
};

export default PhotoIdentification;
