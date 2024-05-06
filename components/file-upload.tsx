"use client";

import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  Upload,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
// import { Progress } from "./ui/progress";
// import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { useAxios } from "./providers/AxiosProvider";
import { Button } from "./ui/button";
import { DocumentUploadSchema } from "./Settings/DocumentUploadForm";

interface FileUploadProgress {
  progress: number;
  File: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const ImageColor = {
  bgColor: "bg-red-400",
  fillColor: "fill-red-400",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

export default function ImageUpload({ Label,
  maxFiles = 1,
  uploadUrl,
  handleClose,
  acceptFileTypes = { 'image/jpeg': ['.jpeg', '.png', '.jpg'] },
  handleFileChange,
  fieldName,
}: {
  Label?: string,
  maxFiles?: number,
  uploadUrl: string,
  handleClose?: () => void,
  acceptFileTypes?: { [key: string]: string[] },
  handleFileChange?: ({ fieldName, file }: { fieldName: keyof DocumentUploadSchema, file: File }) => void
  fieldName?: keyof DocumentUploadSchema
}) {

  const { axiosIWAuth4Upload } = useAxios();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);

  const { toast } = useToast();

  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    };
  };


  const onUploadProgress = (
    progressEvent: AxiosProgressEvent,
    file: File,
    cancelSource: CancelTokenSource
  ) => {
    const progress = Math.round(
      (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
    );

    if (progress === 100) {
      setUploadedFiles((prevUploadedFiles) => {
        return [...prevUploadedFiles, file];
      });

      setFilesToUpload((prevUploadProgress) => {
        return prevUploadProgress.filter((item) => item.File !== file);
      });

      return;
    }

    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.map((item) => {
        if (item.File.name === file.name) {
          return {
            ...item,
            progress,
            source: cancelSource,
          };
        } else {
          return item;
        }
      });
    });
  };

  const uploadImageToDB = async (
    formData: FormData,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
    cancelSource: CancelTokenSource
  ) => {
    return await axiosIWAuth4Upload.put(
      uploadUrl,
      formData,
      {
        onUploadProgress,
        cancelToken: cancelSource.token,
      }
    );
  };

  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.File !== file);
    });

    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((item) => item !== file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const FileErrorObj = {
      'file-invalid-type': 'Invalid file type',
      'file-too-large': 'File is too large',
      'file-too-small': 'File is too small',
    }


    fileRejections.forEach((fileRejection) => {
      toast({
        variant: "destructive",
        title: `${fileRejection.file.name}: ${FileErrorObj[fileRejection.errors[0].code as keyof typeof FileErrorObj]}`,
      });
      return;
    })


    setFilesToUpload((prevUploadProgress) => {
      return [
        // ...prevUploadProgress,
        ...acceptedFiles.map((file) => {
          return {
            progress: 0,
            File: file,
            source: null,
          };
        }),
      ];
    });

    if (fieldName && handleFileChange) {
      handleFileChange({ fieldName, file: acceptedFiles[0] });
    }


  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const cancelSource = axios.CancelToken.source();

    try {
      await uploadImageToDB(formData, (progressEvent) => {
        onUploadProgress(progressEvent, file, cancelSource);
      }, cancelSource);
      if (handleClose) handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file",
      });

      setFilesToUpload((prevUploadProgress) => {
        return prevUploadProgress.filter((item) => item.File !== file);
      });
    }

  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFiles,
    maxSize: 1000 * 1000,
    onDrop,
    accept: acceptFileTypes
  });

  return (
    <div>
      {Label && <p className="text-sm text-gray-600">{Label}</p>}
      <div className="relative">
        <label
          {...getRootProps()}
          className="relative h-36 overflow-hidden flex flex-col items-center justify-center w-full py-6 border-2 border-red-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
        >
          <div className=" text-center">
            <div className="border p-2 rounded-md max-w-min mx-auto">
              {filesToUpload.length > 0 ? getFileIconAndColor(filesToUpload[0].File).icon : <UploadCloud size={20} />}
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold"> {filesToUpload.length > 0 ? filesToUpload[0].File.name : "Drag files"} </span>
            </p>
            {filesToUpload.length === 0 && <p className="text-xs text-gray-500 px-1 space-x-1">
              <span>Click to upload files &#40;files should be under 1 MB &#41;</span>
              <span>
                {
                  Object.values(acceptFileTypes).map((fileType) => fileType.join(', ')).join(', ')
                }
              </span>
            </p>}
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          type="file"
          className="hidden"
        />

        {filesToUpload.length > 0 && <button
          onClick={() => {
            if (filesToUpload[0].source)
              filesToUpload[0].source.cancel("Upload cancelled");
            removeFile(filesToUpload[0].File);
          }}
          className="bg-red-500 text-white transition-all cursor-pointer p-1 absolute -top-2 -right-2 rounded-full"
        >
          <X size={14} />
        </button>}
      </div>

      {
        !handleFileChange && <Button
          disabled={filesToUpload.length > 0 ? false : true}
          onClick={() => handleUpload(filesToUpload[0].File)}
          variant={"webPageBtn"}
          size={"sm"}
          className="space-x-2 flex items-center ml-auto mt-2">
          <span>Upload </span><Upload size={20} />
        </Button>
      }

      {/* Below code is commented becoz not need as now */}
      {/* {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress, i) => {
                return (
                  <div
                    key={i}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white">
                        {getFileIconAndColor(fileUploadProgress.File).icon}
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.File.name.slice(0, 25)}
                          </p>
                          <span className="text-xs">
                            {fileUploadProgress.progress}%
                          </span>
                        </div>
                        <Progress
                          value={fileUploadProgress.progress}
                          className={
                            getFileIconAndColor(fileUploadProgress.File).color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
                        removeFile(fileUploadProgress.File);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
      {uploadedFiles.length > 0 && (
        <div>
          <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
            Uploaded Files
          </p>
          <div className="space-y-2 pr-3">
            {uploadedFiles.map((file, i) => {
              return (
                <div
                  key={file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    <div className="text-white">
                      {getFileIconAndColor(file).icon}
                    </div>
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground ">
                          {file.name.slice(0, 25)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="bg-red-500 text-white transition-all items-center justify-center px-2 hidden group-hover:flex"
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )} */}
    </div>
  );
}