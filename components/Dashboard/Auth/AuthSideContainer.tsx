import React from "react";
import Image from "next/image";

function AuthSideContainer({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex justify-center items-center" >
      <Image src={"/assets/loginTemp.png"} width={350} height={350}  className="absolute z-2 bottom-32" alt="Logo" />
      <Image src={"/assets/loginlogo.png"} width={300} height={300} alt="Logo" className="absolute z-2 top-24"/>
      <Image src="/assets/loginbg.png" width={1000} height={1000} alt="Image" className="rounded-md object-cover" />
    </div>
  );
}

export default AuthSideContainer;
