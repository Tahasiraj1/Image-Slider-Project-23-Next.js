"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, ChevronRight, ChevronLeft } from "lucide-react";

interface ImageData {
    id: string;
    urls: {
        regular: string;
    };
    alt_description: string;
    description: string;
    user: {
        name: string;
    };
}

export default function ImageSlider() {
    const [images, setImages] = useState<ImageData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isplaying, setIsPlaying] = useState<boolean>(true);
    const interval = 10000;

    const fetchImages = async (): Promise<void> => {
        try {
            const response = await fetch(
                `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
            );
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const nextImage = useCallback((): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((): void => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (isplaying) {
            const id = setInterval(nextImage, interval);
            return () => clearInterval(id);
        }
    }, [isplaying, nextImage]);

    const togglePlayPause = (): void => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    };

    return(
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-8"
        style={{
            backgroundImage: `url('/imageslider1.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}
        >
            <div className=" w-full max-w-2xl mx-auto">
                <h1 className="text-3xl text-white font-bold text-center mb-4">
                    Image Slider
                </h1>
                <p className="text-center text-gray-300 mb-8">
                    A simple dynamic image slider/carousel with Unsplash.
                </p>
                <Carousel className="rounded-lg overflow-hidden relative">
                    <CarouselContent>
                        {Array.isArray(images) && images.map((image, index) => (
                            <CarouselItem
                            key={image.id}
                            className={index === currentIndex ? "block" : "hidden"}
                            >
                                <Image
                                src={image.urls.regular}
                                alt={image.alt_description}
                                width={800}
                                height={400}
                                className="w-full h-auto object-cover rounded-t-3xl animate-in slide-in-from-right-full slide-out-to-left-full transition-transform transform duration-500"
                                />
                                <div className="p-2 bg-white/75 text-center mb-16 rounded-b-3xl">
                                    <h2 className="text-lg font-bold">
                                        {image.user.name}
                                    </h2>
                                    <p className="text-sm">
                                        {image.description || image.alt_description} 
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-between items-center gap-2">
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="bg-gray-400 hover:bg-gray-300 p-2 rounded-full shadow-md transition-all active:scale-90 tranform duration-200"
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="bg-gray-400 hover:bg-gray-300 p-2 rounded-full shadow-md transition-all active:scale-90 tranform duration-200"
                        >
                            {isplaying ? (
                                <PauseIcon className="w-6 h-6 text-gray-800" />
                            ) : (
                                <PlayIcon className="w-6 h-6 text-gray-800" />
                            )}
                            <span className="sr-only">{isplaying ? "Pause" : "Play"}</span>
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="bg-gray-400 hover:bg-gray-300 p-2 rounded-full shadow-md transition-all active:scale-90 tranform duration-200"
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </Carousel>
            </div>
        </div>
    );
}