"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useKycProvider } from '../providers/KycProvider';
import { useToast } from "@/components/ui/use-toast";
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PhotoSchema = {
    photoUrl: string;
}

const PhotoIdentification = () => {
    const { onHandleBack, onHandleNext, setFormData } = useKycProvider();
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [photoURL, setPhotoURL] = useState('');
    const [cameraOn, setCameraOn] = useState<boolean>(false);
    const { toast } = useToast();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        handleStartCamera();
        return () => {
            handleStopCamera();
        };
    }, []);

    const handleStartCamera = async () => {
        if (photoURL) {
            setPhotoURL('');
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 1280,
                    height: 720,
                }
            });
            setCameraOn(true);
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            return toast({
                variant: "destructive",
                title: "Camera Access Required",
                description: "Please grant access to the camera to continue.",
            })
        }
    };

    const handleTakePhoto = async () => {
        if (!mediaStream) return;

        const video = videoRef.current;
        if (!video) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const { videoWidth, videoHeight } = video;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        const newPhotoURL = canvas.toDataURL('image/jpeg');
        
        setPhotoURL(newPhotoURL);
        handleStopCamera();
    };

    const handleStopCamera = async () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

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
            handleStopCamera();
            setFormData((prev: any) => ({ ...prev, ...values }));
            onHandleNext();
        } catch (error) {
            console.error(`Error: [PhotoIdentification] ${error}`);
        }
    };

    return (
        <Card className='p-10'>
            <CardTitle>Photo Identification</CardTitle>
            <div className='grid place-content-center m-4'>
                <canvas ref={canvasRef} className='border-2 border-black w-full h-full hidden' />
                {!photoURL && <div className='border-2 border-dashed border-[#be0c34] rounded-lg w-full h-96'>
                  <video ref={videoRef} autoPlay={true} className={cn('min-w-full p-2 hidden', cameraOn && "h-96 block")}></video>
                    {!cameraOn && <>
                        <div className='flex justify-center'>
                            <Camera size={50} color='#be0c34' />
                        </div>
                        <p>Please look at the camera and then Capture Selfie</p>
                    </>}
                </div>}
                {
                    photoURL && <Image src={photoURL} alt='photo' width={640} height={360} className='rounded-lg' />

                }
                <div className='flex justify-center mt-6'>
                    {!mediaStream && (
                        <Button variant={'themeButton'} className='w-fit' onClick={handleStartCamera}>
                            Start Camera
                        </Button>
                    )}
                </div>
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
