"use server"
import prisma from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const saveVideoToDB = async (data: any) => {
  const user = await currentUser();

  try {
    const userName = user?.firstName;
    const userEmail = user?.emailAddresses[0].emailAddress;
    const newVideo = {
      ...data,
      userEmail,
      userName,
    };

    await prisma.video.create({
      data: newVideo,
    });

    return {
        success: true,
        message: "Video added successfully"
    }
  } catch (error) {
    console.log(error)
    return {
        success: false,
        message: "Failed to add video in DB"
    }
  }
};

export const getVideoByUserEmail = async () => {
    try {
        const user = await currentUser()
        const videos = await prisma.video.findMany({where:{
            userEmail: user?.emailAddresses[0].emailAddress,
        }})
        return {
            success: true,
            data: videos
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch video"
        }
    }
}
